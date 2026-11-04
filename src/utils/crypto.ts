import { EncryptedVaultItem, StorageEncryptionPayload, CoworkerStickerOrder } from '../types/series';

const DEFAULT_SALT = 'puchu-puku-vault-v1-salt';
const STORAGE_KEY = 'puchu_puku_encrypted_vault';
const PASSPHRASE_KEY = 'puchu_puku_vault_pass_hash';

/**
 * Derives a 256-bit AES-GCM CryptoKey from a passphrase using PBKDF2 (100,000 iterations).
 */
export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string using AES-GCM.
 * Returns { cipherText (base64), iv (base64), salt (base64), version: 1 }
 */
export async function encryptData(plainText: string, passphrase = 'default-director-key'): Promise<StorageEncryptionPayload> {
  const enc = new TextEncoder();
  const rawBytes = enc.encode(plainText);

  // 16-byte random salt and 12-byte random IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    rawBytes
  );

  return {
    version: 1,
    cipherText: uint8ArrayToBase64(new Uint8Array(encryptedBuffer)),
    iv: uint8ArrayToBase64(iv),
    salt: uint8ArrayToBase64(salt),
  };
}

/**
 * Decrypts a StorageEncryptionPayload back into a string.
 */
export async function decryptData(payload: StorageEncryptionPayload, passphrase = 'default-director-key'): Promise<string> {
  const salt = base64ToUint8Array(payload.salt);
  const iv = base64ToUint8Array(payload.iv);
  const cipherBytes = base64ToUint8Array(payload.cipherText);

  const key = await deriveKey(passphrase, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    cipherBytes as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

// Byte conversion helpers
export function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  const len = arr.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Saves vault items to localStorage strictly in encrypted format.
 */
export async function saveEncryptedVault(items: EncryptedVaultItem[], passphrase = 'default-director-key'): Promise<void> {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const jsonStr = JSON.stringify(items);
  const encryptedPayload = await encryptData(jsonStr, passphrase);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(encryptedPayload));
}

/**
 * Loads and decrypts vault items from localStorage.
 */
export async function loadEncryptedVault(passphrase = 'default-director-key'): Promise<EncryptedVaultItem[]> {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  const rawStored = window.localStorage.getItem(STORAGE_KEY);
  if (!rawStored) return [];

  try {
    const payload: StorageEncryptionPayload = JSON.parse(rawStored);
    if (!payload.cipherText || !payload.iv) return [];
    const decryptedJson = await decryptData(payload, passphrase);
    return JSON.parse(decryptedJson);
  } catch (err) {
    console.error('Failed to decrypt vault or invalid passphrase:', err);
    throw new Error('Decryption failed. Please verify your vault passphrase.');
  }
}

/**
 * Retrieves the raw encrypted string stored in localStorage (for visual verification that no plaintext exists).
 */
export function getRawEncryptedBlob(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Gets a decrypted note for a specific episode from the encrypted local storage.
 */
export async function getEpisodeNote(episodeId: number, passphrase = 'default-director-key'): Promise<string> {
  const items = await loadEncryptedVault(passphrase);
  const found = items.find((item) => item.episodeId === episodeId && item.category === 'note');
  return found ? found.content : '';
}

/**
 * Saves or updates a personal note for an episode into the encrypted local storage.
 */
export async function saveEpisodeNote(
  episodeId: number,
  content: string,
  episodeTitle = 'Episode Note',
  passphrase = 'default-director-key'
): Promise<void> {
  const items = await loadEncryptedVault(passphrase);
  const existingIndex = items.findIndex((item) => item.episodeId === episodeId && item.category === 'note');

  if (existingIndex >= 0) {
    if (!content.trim()) {
      items.splice(existingIndex, 1);
    } else {
      items[existingIndex] = {
        ...items[existingIndex],
        content: content.trim(),
        title: `Ep ${episodeId} Note: ${episodeTitle}`,
        updatedAt: Date.now(),
      };
    }
  } else if (content.trim()) {
    items.unshift({
      id: `ep-note-${episodeId}-${Date.now()}`,
      title: `Ep ${episodeId} Note: ${episodeTitle}`,
      category: 'note',
      episodeId,
      content: content.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  await saveEncryptedVault(items, passphrase);
}

/**
 * Returns list of episode IDs saved as favorites in the encrypted database.
 */
export async function getFavoriteEpisodes(passphrase = 'default-director-key'): Promise<number[]> {
  const items = await loadEncryptedVault(passphrase);
  return items
    .filter((item) => item.category === 'bookmark' && item.episodeId !== undefined)
    .map((item) => item.episodeId as number);
}

/**
 * Toggles an episode in the user's encrypted favorites.
 * Returns true if now favorited, false if removed.
 */
export async function toggleFavoriteEpisode(
  episodeId: number,
  episodeTitle: string,
  passphrase = 'default-director-key'
): Promise<boolean> {
  const items = await loadEncryptedVault(passphrase);
  const existingIdx = items.findIndex((item) => item.category === 'bookmark' && item.episodeId === episodeId);

  if (existingIdx >= 0) {
    items.splice(existingIdx, 1);
    await saveEncryptedVault(items, passphrase);
    return false;
  } else {
    items.unshift({
      id: `fav-${episodeId}-${Date.now()}`,
      title: `Episode ${episodeId}: ${episodeTitle}`,
      category: 'bookmark',
      episodeId,
      content: `Favorited Episode ${episodeId}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await saveEncryptedVault(items, passphrase);
    return true;
  }
}

/**
 * Saves a coworker sticker gift / order encrypted into the local vault.
 */
export async function saveStickerOrder(
  order: Omit<CoworkerStickerOrder, 'id' | 'timestamp'>,
  passphrase = 'default-director-key'
): Promise<CoworkerStickerOrder> {
  const items = await loadEncryptedVault(passphrase);
  const newOrder: CoworkerStickerOrder = {
    ...order,
    id: `sticker-gift-${Date.now()}`,
    timestamp: Date.now(),
  };

  items.unshift({
    id: newOrder.id,
    title: `Coworker Sticker Gift: ${newOrder.recipientName} (${newOrder.stickerName})`,
    category: 'sticker_order',
    content: JSON.stringify(newOrder),
    createdAt: newOrder.timestamp,
    updatedAt: newOrder.timestamp,
  });

  await saveEncryptedVault(items, passphrase);
  return newOrder;
}

/**
 * Loads all decrypted coworker sticker orders from the encrypted vault.
 */
export async function getStickerOrders(passphrase = 'default-director-key'): Promise<CoworkerStickerOrder[]> {
  const items = await loadEncryptedVault(passphrase);
  return items
    .filter((item) => item.category === 'sticker_order')
    .map((item) => {
      try {
        return JSON.parse(item.content) as CoworkerStickerOrder;
      } catch {
        return null;
      }
    })
    .filter((item): item is CoworkerStickerOrder => item !== null);
}

/**
 * Deletes a sticker order from the encrypted vault.
 */
export async function deleteStickerOrder(orderId: string, passphrase = 'default-director-key'): Promise<void> {
  const items = await loadEncryptedVault(passphrase);
  const updated = items.filter((item) => item.id !== orderId);
  await saveEncryptedVault(updated, passphrase);
}

