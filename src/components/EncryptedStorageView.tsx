import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Key, Plus, Trash2, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Star, ArrowRight } from 'lucide-react';
import { EncryptedVaultItem } from '../types/series';
import { saveEncryptedVault, loadEncryptedVault, getRawEncryptedBlob } from '../utils/crypto';

interface EncryptedStorageViewProps {
  onSelectEpisode?: (id: number) => void;
}

export const EncryptedStorageView: React.FC<EncryptedStorageViewProps> = ({ onSelectEpisode }) => {
  const [items, setItems] = useState<EncryptedVaultItem[]>([]);
  const [passphrase, setPassphrase] = useState<string>('director-studio-key-2026');
  const [rawBlob, setRawBlob] = useState<string | null>(null);
  const [showRawBlob, setShowRawBlob] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'note' | 'draft' | 'bookmark'>('note');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [activeVaultFilter, setActiveVaultFilter] = useState<'all' | 'notes' | 'bookmarks'>('all');

  // Load vault on mount
  useEffect(() => {
    refreshVault();
  }, [passphrase]);

  const refreshVault = async () => {
    try {
      const loaded = await loadEncryptedVault(passphrase);
      setItems(loaded);
      setRawBlob(getRawEncryptedBlob());
      setIsUnlocked(true);
    } catch (err: any) {
      console.warn('Vault locked or incorrect key:', err);
      setIsUnlocked(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: EncryptedVaultItem = {
      id: `vault-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [newItem, ...items];
    await saveEncryptedVault(updated, passphrase);
    setItems(updated);
    setRawBlob(getRawEncryptedBlob());
    setNewTitle('');
    setNewContent('');
    setStatusMessage('Saved encrypted item to LocalStorage via AES-GCM 256-bit!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDeleteItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    await saveEncryptedVault(updated, passphrase);
    setItems(updated);
    setRawBlob(getRawEncryptedBlob());
  };

  return (
    <div className="space-y-6">
      {/* Top Security Banner */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif">
                Encrypted Production Vault
              </h2>
              <p className="text-xs text-stone-600">
                AES-GCM 256-bit encryption with PBKDF2 (100,000 iterations) directly securing all local storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Plaintext Storage Active</span>
            </span>
          </div>
        </div>

        {/* Passphrase key bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            <Key className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-semibold text-stone-700">Encryption Key:</span>
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="bg-transparent border-b border-stone-300 px-1 py-0.5 text-stone-900 font-mono text-xs focus:outline-none focus:border-emerald-600 w-44"
              placeholder="Vault Passphrase"
            />
          </div>

          <button
            onClick={() => setShowRawBlob(!showRawBlob)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition"
          >
            {showRawBlob ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showRawBlob ? 'Hide Raw Ciphertext' : 'Inspect Raw LocalStorage Ciphertext'}</span>
          </button>
        </div>

        {/* Raw Ciphertext Blob Inspector */}
        {showRawBlob && (
          <div className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-[11px] space-y-2 border border-stone-700">
            <div className="flex items-center justify-between text-stone-400">
              <span>RAW VALUE STORED IN BROWSER LOCALSTORAGE (`puchu_puku_encrypted_vault`):</span>
              <span className="text-emerald-400 font-bold">100% ENCRYPTED CIPHERTEXT</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap max-h-40 p-2 bg-stone-950 rounded-lg text-emerald-300">
              {rawBlob || 'No vault payload in localStorage yet.'}
            </pre>
          </div>
        )}

        {statusMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Add Item + Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add New Sensitive Note */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <Plus className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900 font-serif">
              Add Secure Production Note / Draft
            </h3>
          </div>

          <form onSubmit={handleAddItem} className="space-y-3 text-xs">
            <div>
              <label htmlFor="note-title-input" className="font-bold text-stone-900 block mb-1">Title / Scene Target:</label>
              <input
                id="note-title-input"
                type="text"
                placeholder="e.g. Ep 12 Lighting Nuance or Director Secret Draft"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="category-select" className="font-bold text-stone-900 block mb-1">Category:</label>
              <select
                id="category-select"
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="note">Director Production Note</option>
                <option value="draft">Custom Episode Script Draft</option>
                <option value="bookmark">Bookmark / Continuity Hook</option>
              </select>
            </div>

            <div>
              <label htmlFor="content-textarea" className="font-bold text-stone-900 block mb-1">Confidential Content:</label>
              <textarea
                id="content-textarea"
                rows={4}
                placeholder="Write confidential script details, voice actor directions, or private annotations..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 font-sans"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Encrypt & Save to LocalStorage</span>
            </button>
          </form>
        </div>

        {/* Right: Decrypted Items List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
              <span>Your Encrypted Items ({items.length})</span>
              <span className="text-xs font-sans text-stone-500 font-normal">
                (Decrypted live in browser memory)
              </span>
            </h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveVaultFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${activeVaultFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveVaultFilter('notes')}
                className={`px-2.5 py-1 rounded-md transition ${activeVaultFilter === 'notes' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Notes & Drafts
              </button>
              <button
                onClick={() => setActiveVaultFilter('bookmarks')}
                className={`px-2.5 py-1 rounded-md transition ${activeVaultFilter === 'bookmarks' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Favorites ★
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs space-y-2">
              <Lock className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-medium">No encrypted items yet.</p>
              <p className="text-stone-400 max-w-sm mx-auto">
                Any notes, custom scripts, or favorited episodes will be securely encrypted via AES-GCM before writing to local storage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items
                .filter((item) => {
                  if (activeVaultFilter === 'notes') return item.category === 'note' || item.category === 'draft';
                  if (activeVaultFilter === 'bookmarks') return item.category === 'bookmark';
                  return true;
                })
                .map((item) => (
                  <div key={item.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.category === 'bookmark' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.category === 'bookmark' ? '★ Favorite' : item.category}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900">{item.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.episodeId && onSelectEpisode && (
                          <button
                            onClick={() => onSelectEpisode(item.episodeId!)}
                            className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            <span>Open Ep {item.episodeId}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded-md text-stone-400 hover:text-rose-600 transition"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      {item.content}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
