import React, { useState, useEffect } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Episode } from '../types/series';
import { searchEpisodes } from '../data/episodesDirectory';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisode: (id: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEpisode,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle or open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = searchEpisodes(query).slice(0, 12);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-amber-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            placeholder="Type episode number (1-105), title, topic, or Bengali keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium focus:outline-none placeholder:text-stone-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-stone-100">
          {results.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              No episodes matching "{query}". Try "butterfly", "rain", "spoon", "42", or "মৌমাছি".
            </div>
          ) : (
            results.map((ep) => (
              <div
                key={ep.id}
                onClick={() => {
                  onSelectEpisode(ep.id);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-emerald-50/70 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                      EP {ep.id}
                    </span>
                    <span className="font-bold text-sm text-stone-900 font-serif group-hover:text-emerald-900">
                      {ep.title}
                    </span>
                    <span className="text-xs text-emerald-700 font-serif font-medium">
                      ({ep.titleBn})
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {ep.problem}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-stone-400 group-hover:text-emerald-700">
                  <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">{ep.timeOfDay}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex justify-between">
          <span>Search across all 105 episodes</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
