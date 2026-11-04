import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptData, decryptData, deriveKey } from './crypto';

test('crypto derives key and encrypts/decrypts plaintext cleanly', async () => {
  const sampleNote = 'Puchu learned to share her sweet mango with Puku! Puku glowed golden pink.';
  const passphrase = 'super-secret-director-passphrase-2026';

  const encrypted = await encryptData(sampleNote, passphrase);

  assert.ok(encrypted.cipherText.length > 0, 'Ciphertext should not be empty');
  assert.ok(encrypted.iv.length > 0, 'IV should not be empty');
  assert.ok(encrypted.salt.length > 0, 'Salt should not be empty');
  assert.notEqual(encrypted.cipherText, sampleNote, 'Ciphertext must never match plaintext');

  const decrypted = await decryptData(encrypted, passphrase);
  assert.equal(decrypted, sampleNote, 'Decrypted text must match original plaintext');
});

test('crypto fails cleanly with wrong passphrase', async () => {
  const sampleNote = 'Confidential Episode 42 Script Notes';
  const encrypted = await encryptData(sampleNote, 'correct-password');

  await assert.rejects(async () => {
    await decryptData(encrypted, 'wrong-password');
  });
});

test('saveEpisodeNote and getEpisodeNote securely persist and retrieve notes in encrypted storage', async () => {
  // Mock localStorage for test environment
  const mockStorage: Record<string, string> = {};
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    }
  };

  const { saveEpisodeNote, getEpisodeNote, getRawEncryptedBlob } = await import('./crypto');

  await saveEpisodeNote(1, 'Director Note: Make butterfly wing flaps 24fps Pixar physics', 'The Dancing Butterfly');
  
  // Verify raw storage does not contain plaintext
  const raw = getRawEncryptedBlob();
  assert.ok(raw !== null, 'Storage should contain a payload');
  assert.equal(raw.includes('Director Note: Make butterfly wing flaps'), false, 'Raw storage MUST NEVER contain plaintext');
  assert.ok(raw.includes('cipherText'), 'Raw storage must contain encrypted cipherText');

  // Verify retrieval
  const retrieved = await getEpisodeNote(1);
  assert.equal(retrieved, 'Director Note: Make butterfly wing flaps 24fps Pixar physics');

  // Verify non-existent episode note returns empty string
  const ep2Note = await getEpisodeNote(2);
  assert.equal(ep2Note, '');
});

test('toggleFavoriteEpisode and getFavoriteEpisodes securely persist favorites encrypted in storage', async () => {
  const { toggleFavoriteEpisode, getFavoriteEpisodes, getRawEncryptedBlob } = await import('./crypto');

  // Toggle favorite for Episode 1
  const isFav = await toggleFavoriteEpisode(1, 'The Dancing Butterfly');
  assert.equal(isFav, true, 'Episode 1 should now be favorited');

  const favs = await getFavoriteEpisodes();
  assert.ok(favs.includes(1), 'Favorites list must include Episode 1');

  // Check storage is strictly encrypted
  const raw = getRawEncryptedBlob();
  assert.equal(raw?.includes('The Dancing Butterfly'), false, 'Favorites title must not be plaintext in storage');

  // Toggle again to unfavorite
  const isFavAfter = await toggleFavoriteEpisode(1, 'The Dancing Butterfly');
  assert.equal(isFavAfter, false, 'Episode 1 should now be unfavorited');
  const favsAfter = await getFavoriteEpisodes();
  assert.equal(favsAfter.includes(1), false, 'Favorites list should no longer include Episode 1');
});

test('saveStickerOrder and getStickerOrders persist coworker sticker gifts strictly encrypted', async () => {
  const { saveStickerOrder, getStickerOrders, deleteStickerOrder, getRawEncryptedBlob } = await import('./crypto');

  const order = await saveStickerOrder({
    stickerId: 'sticker-kindness-cup',
    stickerName: 'Cup of Kindness',
    category: 'Tea Break',
    recipientName: 'Sarah Jenkins',
    senderName: 'Rafiq from Dev Team',
    customMessage: 'Sending you warmth and gratitude today!',
    characterPose: 'puchu_puku_tea',
    mockupFormat: 'laptop',
  });

  assert.ok(order.id.startsWith('sticker-gift-'), 'Order ID should be properly generated');

  // Verify raw storage does not contain coworker's name in plaintext
  const raw = getRawEncryptedBlob();
  assert.ok(raw !== null, 'Storage should contain a payload');
  assert.equal(raw.includes('Sarah Jenkins'), false, 'Coworker name must NOT appear in plaintext storage');
  assert.equal(raw.includes('Rafiq from Dev Team'), false, 'Sender name must NOT appear in plaintext storage');

  // Retrieve decrypted orders
  const orders = await getStickerOrders();
  assert.ok(orders.length >= 1, 'Should retrieve at least 1 order');
  const found = orders.find((o) => o.id === order.id);
  assert.ok(found, 'Should find newly created order');
  assert.equal(found?.recipientName, 'Sarah Jenkins');
  assert.equal(found?.stickerName, 'Cup of Kindness');

  // Test deletion
  await deleteStickerOrder(order.id);
  const remaining = await getStickerOrders();
  assert.equal(remaining.find((o) => o.id === order.id), undefined, 'Order should be removed after deletion');
});

