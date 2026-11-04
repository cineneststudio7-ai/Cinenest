import React, { useState } from 'react';
import { Sparkles, Film, ShieldCheck, Download, Search, BookOpen, Layers, Heart, Compass, Star, Users, GraduationCap, Gift } from 'lucide-react';

export type TabKey =
  | 'discovery'
  | 'episode'
  | 'preschool'
  | 'stickers'
  | 'characters'
  | 'universe'
  | 'bible'
  | 'generators'
  | 'encrypted-vault'
  | 'batch-export';

interface HeaderProps {
  currentEpisodeId: number;
  onSelectEpisode: (id: number) => void;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onOpenSearch: () => void;
  onExportCurrent: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentEpisodeId,
  onSelectEpisode,
  activeTab,
  setActiveTab,
  onOpenSearch,
  onExportCurrent,
  favoriteCount
}) => {
  const [jumpInput, setJumpInput] = useState<string>('');

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 105) {
      onSelectEpisode(val);
      setJumpInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 shadow-2xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('discovery')}>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="text-xl sm:text-2xl" role="img" aria-label="Puchu and Puku">🍵</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 absolute -top-0.5 -right-0.5 fill-rose-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-serif flex items-center gap-1">
                  <span>Puchu</span>
                  <span className="text-emerald-700 font-sans">&</span>
                  <span className="text-amber-800">Puku</span>
                </h1>
                <span className="text-xs text-stone-500 hidden sm:inline">·</span>
                <span className="text-xs font-semibold text-emerald-800 hidden sm:inline">
                  105 Ep Series
                </span>
                <span className="text-xs text-stone-500 hidden md:inline">·</span>
                <span className="text-xs text-amber-900 hidden md:inline">
                  720p 3D CGI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-600 truncate max-w-[200px] sm:max-w-xs">
                Cinematic Character Discovery & 330s Series Studio
              </p>
            </div>
          </div>

          {/* Center Episode Selector & Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Counter Quick Link */}
            <button
              onClick={() => setActiveTab('encrypted-vault')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 text-xs font-medium border border-amber-200 shadow-2xs transition"
              title="View Encrypted Favorites & Vault"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="hidden sm:inline">Favorites</span>
              <span className="font-bold text-stone-900">({favoriteCount})</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 text-xs sm:text-sm font-medium border border-amber-300/80 shadow-2xs hover:shadow-xs transition"
              aria-label="Search all 105 episodes"
            >
              <Search className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 rounded-md text-stone-500 border border-stone-200">⌘K</kbd>
            </button>

            {/* Quick Episode Jump */}
            <form onSubmit={handleJump} className="flex items-center gap-1.5">
              <label htmlFor="ep-jump-input" className="sr-only">Jump to episode 1 to 105</label>
              <input
                id="ep-jump-input"
                type="number"
                min="1"
                max="105"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                placeholder={`Ep ${currentEpisodeId}`}
                className="w-16 sm:w-20 px-2 py-1.5 text-xs sm:text-sm font-medium bg-white/90 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition"
                title="Go to episode"
              >
                Go
              </button>
            </form>

            {/* Quick Export current */}
            <button
              onClick={onExportCurrent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
              title="Export Current Episode as Text File"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export .txt</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation - Clean Segmented Editorial Rhythm */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'discovery'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discovery</span>
          </button>

          <button
            onClick={() => setActiveTab('episode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'episode'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Episode {currentEpisodeId} Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('preschool')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'preschool'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>Pre-K Academy</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'stickers'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-rose-500" />
            <span>Coworker Stickers</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'characters'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Characters & Lore</span>
          </button>

          <button
            onClick={() => setActiveTab('universe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'universe'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Courtyard Universe</span>
          </button>

          <button
            onClick={() => setActiveTab('bible')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'bible'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>105 Series Bible</span>
          </button>

          <button
            onClick={() => setActiveTab('generators')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'generators'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5x Reference Generators</span>
          </button>

          <button
            onClick={() => setActiveTab('encrypted-vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'encrypted-vault'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Vault & Favorites</span>
          </button>

          <button
            onClick={() => setActiveTab('batch-export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === 'batch-export'
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:bg-amber-200/50 hover:text-stone-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Batch Export</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
