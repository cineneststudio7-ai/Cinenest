import React, { useState } from 'react';
import { BookOpen, Search, Filter, Play, Download, Clock, Sun, Sparkles, Heart, Star } from 'lucide-react';
import { Episode } from '../types/series';
import { getAllEpisodes, searchEpisodes } from '../data/episodesDirectory';
import { exportEpisodeToPlainText } from '../utils/episodeCalculator';

interface SeriesBibleViewProps {
  onSelectEpisode: (id: number) => void;
  favoriteEpisodeIds?: number[];
  onToggleFavorite?: (id: number, title: string) => void;
}

export const SeriesBibleView: React.FC<SeriesBibleViewProps> = ({
  onSelectEpisode,
  favoriteEpisodeIds = [],
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const TAGS = [
    'All',
    'Favorites ★',
    'Nature',
    'Animals',
    'Colors',
    'Problem Solving',
    'Bengali Words',
    'Weather',
    'Patience',
    'Music',
    'Culture',
    'Kindness'
  ];

  let filteredEpisodes = searchEpisodes(searchQuery, selectedTag === 'Favorites ★' ? 'All' : selectedTag);
  if (selectedTag === 'Favorites ★' || showFavoritesOnly) {
    filteredEpisodes = filteredEpisodes.filter((ep) => favoriteEpisodeIds.includes(ep.id));
  }

  const handleDownloadSingle = (e: React.MouseEvent, ep: Episode) => {
    e.stopPropagation();
    const content = exportEpisodeToPlainText(ep);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Puchu_Puku_Episode_${ep.id.toString().padStart(3, '0')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Search & Tag Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Complete 105 Episodes Series Bible
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Showing {filteredEpisodes.length} of 105 Episodes
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 105 episodes by English / Bengali title, rhyme, moral lesson, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-stone-500 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tags:</span>
          </span>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                selectedTag === tag
                  ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEpisodes.map((ep) => (
          <div
            key={ep.id}
            onClick={() => onSelectEpisode(ep.id)}
            className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    EP {ep.id}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-[11px] text-stone-500 font-medium">330s (05:30)</span>
                </div>

                {onToggleFavorite && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(ep.id, ep.title);
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-amber-500 transition"
                    title={favoriteEpisodeIds.includes(ep.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${favoriteEpisodeIds.includes(ep.id) ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                )}
              </div>

              {/* Title & Bengali */}
              <h3 className="font-bold text-stone-900 text-base font-serif group-hover:text-emerald-800 transition">
                {ep.title}
              </h3>
              <p className="text-emerald-700 font-serif text-sm font-semibold mb-2">
                {ep.titleBn}
              </p>

              {/* Problem snippet */}
              <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                {ep.problem}
              </p>

              {/* Rhyme Snippet */}
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs mb-3 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-900 uppercase">
                  <span>🎵 Song:</span>
                  <span className="truncate">{ep.rhyme.title}</span>
                </div>
                <p className="text-stone-700 text-[11px] italic line-clamp-1">
                  "{ep.rhyme.english}"
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-medium text-stone-500">
                {ep.timeOfDay}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleDownloadSingle(e, ep)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                  title="Export .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                  <span>Open Studio</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
