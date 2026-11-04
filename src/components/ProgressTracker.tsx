import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  CheckCheck,
  ChevronRight,
  Flame,
  Medal,
  Tv,
  Eye,
  EyeOff,
  Filter,
  Video,
  Sliders,
  Volume2
} from 'lucide-react';
import { getAllEpisodes } from '../data/episodesDirectory';
import { Episode } from '../types/series';
import {
  getWatchedEpisodes,
  markMultipleEpisodesWatched,
  clearAllWatchedEpisodes,
  WATCHED_CHANGED_EVENT,
  WatchedChangeEventDetail
} from '../utils/watchedStorage';
import { cinematicAudio } from '../utils/cinematicAudioEngine';

export type WatchedFilterMode = 'all' | 'watched' | 'unwatched';

interface ProgressTrackerProps {
  onSelectEpisode?: (episodeId: number) => void;
  activeFilter?: WatchedFilterMode;
  onFilterChange?: (filter: WatchedFilterMode) => void;
  onOpenBatchVideoGenerator?: () => void;
  onOpenCGPStudio?: () => void;
  className?: string;
}

interface Milestone {
  required: number;
  title: string;
  badge: string;
  description: string;
  reward: string;
}

const MILESTONES: Milestone[] = [
  {
    required: 1,
    title: 'First Clapperboard',
    badge: '🎬',
    description: 'Watched your first CineNest episode',
    reward: 'Courtyard Welcome Pass',
  },
  {
    required: 10,
    title: 'Tea Garden Wanderer',
    badge: '☕',
    description: 'Completed 10 episodes in the village',
    reward: 'Puku Golden Glow Steam Badge',
  },
  {
    required: 25,
    title: 'Rhyme Weaver',
    badge: '🎵',
    description: 'Learned 25 bilingual courtyard melodies',
    reward: 'Bengali Folklorist Ribbon',
  },
  {
    required: 50,
    title: 'Village Chronicler',
    badge: '📜',
    description: 'Halfway through the complete 105 catalog',
    reward: 'Grandma’s Storied Terrace Key',
  },
  {
    required: 105,
    title: 'Master Showrunner',
    badge: '🏆',
    description: 'Watched all 105 episodes in CineNest',
    reward: 'Executive Producer Star of Bengal',
  },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  onSelectEpisode,
  activeFilter = 'all',
  onFilterChange,
  onOpenBatchVideoGenerator,
  onOpenCGPStudio,
  className = '',
}) => {
  const [watchedIds, setWatchedIds] = useState<number[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [showBatchConfirm, setShowBatchConfirm] = useState<'markAll' | 'clear' | null>(null);
  const [displayedPercent, setDisplayedPercent] = useState<number>(0);
  const [celebrationMilestone, setCelebrationMilestone] = useState<Milestone | null>(null);
  const previousWatchedCountRef = useRef<number>(0);

  // Retrieve total episodes dynamically from data/episodesDirectory
  useEffect(() => {
    const list = getAllEpisodes();
    setAllEpisodes(list);
  }, []);

  // Sync watched episodes from localStorage & listen for real-time changes
  useEffect(() => {
    const initial = getWatchedEpisodes();
    setWatchedIds(initial);
    previousWatchedCountRef.current = initial.length;

    const handleWatchedChange = (e: Event) => {
      const customEvent = e as CustomEvent<WatchedChangeEventDetail>;
      let newIds: number[] = [];
      if (customEvent.detail && Array.isArray(customEvent.detail.watchedIds)) {
        newIds = customEvent.detail.watchedIds;
      } else {
        newIds = getWatchedEpisodes();
      }
      setWatchedIds(newIds);

      // Check if a new milestone was crossed
      const prevCount = previousWatchedCountRef.current;
      const newCount = newIds.length;
      if (newCount > prevCount) {
        const newlyUnlocked = MILESTONES.find(
          (m) => newCount >= m.required && prevCount < m.required
        );
        if (newlyUnlocked) {
          setCelebrationMilestone(newlyUnlocked);
          cinematicAudio.playPukuHeartChime();
        }
      }
      previousWatchedCountRef.current = newCount;
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'cinenest_watched_episodes') {
        const ids = getWatchedEpisodes();
        setWatchedIds(ids);
        previousWatchedCountRef.current = ids.length;
      }
    };

    window.addEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const totalEpisodes = allEpisodes.length || 105;
  const watchedCount = watchedIds.length;
  const targetPercent = totalEpisodes > 0 ? Math.min(100, Math.round((watchedCount / totalEpisodes) * 100)) : 0;
  const unwatchedCount = Math.max(0, totalEpisodes - watchedCount);

  // Smooth number count-up animation for percentage readout
  useEffect(() => {
    let current = displayedPercent;
    const diff = targetPercent - current;
    if (diff === 0) return;

    const step = diff > 0 ? 1 : -1;
    const intervalTime = Math.max(10, Math.floor(600 / (Math.abs(diff) || 1)));

    const timer = setInterval(() => {
      current += step;
      setDisplayedPercent(current);
      if (current === targetPercent) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [targetPercent]);

  // Approximate minutes watched (each episode is exactly 330 seconds / 5.5 min)
  const totalMinutesWatched = Math.round((watchedCount * 330) / 60);
  const hours = Math.floor(totalMinutesWatched / 60);
  const minutes = totalMinutesWatched % 60;

  // Find next recommended unwatched episode
  const nextUnwatchedEpisode = useMemo(() => {
    if (!allEpisodes.length) return null;
    return allEpisodes.find((ep) => !watchedIds.includes(ep.id)) || null;
  }, [allEpisodes, watchedIds]);

  // Determine current user rank / level
  const currentRank = useMemo(() => {
    if (watchedCount >= 105) return { level: 5, title: 'Master Showrunner', badge: '🏆', nextNeeded: 0 };
    if (watchedCount >= 50) return { level: 4, title: 'Village Chronicler', badge: '📜', nextNeeded: 105 - watchedCount };
    if (watchedCount >= 25) return { level: 3, title: 'Rhyme Weaver', badge: '🎵', nextNeeded: 50 - watchedCount };
    if (watchedCount >= 10) return { level: 2, title: 'Tea Garden Wanderer', badge: '☕', nextNeeded: 25 - watchedCount };
    if (watchedCount >= 1) return { level: 1, title: 'Courtyard Explorer', badge: '👧', nextNeeded: 10 - watchedCount };
    return { level: 0, title: 'New Visitor', badge: '🌱', nextNeeded: 1 };
  }, [watchedCount]);

  const handleMarkAllWatched = () => {
    const allIds = allEpisodes.map((ep) => ep.id);
    markMultipleEpisodesWatched(allIds);
    setShowBatchConfirm(null);
    cinematicAudio.playPukuHeartChime();
  };

  const handleClearWatched = () => {
    clearAllWatchedEpisodes();
    setShowBatchConfirm(null);
  };

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950/70 border border-emerald-900/50 p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden backdrop-blur-md ${className}`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Milestone Celebration Banner Modal */}
      <AnimatePresence>
        {celebrationMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-600/30 to-amber-500/25 border border-amber-400/50 shadow-lg relative flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                {celebrationMilestone.badge}
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Milestone Unlocked!</span>
                </div>
                <h4 className="text-base font-bold text-white font-serif">
                  {celebrationMilestone.title} ({celebrationMilestone.required} Episodes Complete)
                </h4>
                <p className="text-xs text-amber-100/90">
                  {celebrationMilestone.reward}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCelebrationMilestone(null)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition shrink-0 shadow-md"
            >
              Claim Honor ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-13 h-13 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0"
          >
            {currentRank.badge}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Gamified Series Discovery
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                Level {currentRank.level}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentRank.title}</span>
              <span className="text-xs font-normal text-stone-400 font-sans">
                ({watchedCount} of {totalEpisodes} episodes watched)
              </span>
            </h3>
          </div>
        </div>

        {/* Action Controls & Batch modal trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenBatchVideoGenerator && (
            <button
              onClick={onOpenBatchVideoGenerator}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
              title="Generate Pixar-grade 3D CGI videos for all 105 episodes"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Batch Generate All Videos</span>
            </button>
          )}

          {onOpenCGPStudio && (
            <button
              onClick={onOpenCGPStudio}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-cyan-300 text-xs font-semibold border border-cyan-800/40 transition flex items-center gap-1.5"
              title="Open Cinematography, Color Grading & Post-production Suite"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>CGP Grading</span>
            </button>
          )}

          {showBatchConfirm ? (
            <div className="flex items-center gap-1.5 p-1 bg-stone-900/90 rounded-xl border border-stone-700 text-xs">
              <span className="px-2 text-stone-300">
                {showBatchConfirm === 'markAll' ? 'Mark all 105 watched?' : 'Reset all progress?'}
              </span>
              <button
                onClick={showBatchConfirm === 'markAll' ? handleMarkAllWatched : handleClearWatched}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBatchConfirm(null)}
                className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowBatchConfirm('markAll')}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium border border-stone-700 transition flex items-center gap-1"
                title="Mark all 105 episodes as watched"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mark All</span>
              </button>
              {watchedCount > 0 && (
                <button
                  onClick={() => setShowBatchConfirm('clear')}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-rose-900/40 text-stone-400 hover:text-rose-300 text-xs font-medium border border-stone-700 transition flex items-center gap-1"
                  title="Reset watched history"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Framer Motion Progress Bar Stage */}
      <div className="relative z-10 space-y-2.5 mb-6">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <span className="text-stone-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>105-Episode Library Completion Track</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs font-mono">
              {watchedCount} / {totalEpisodes}
            </span>
            <span className="text-emerald-300 font-mono text-lg font-bold px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 shadow-inner">
              {displayedPercent}%
            </span>
          </div>
        </div>

        {/* Outer Rail */}
        <div className="h-5 sm:h-6 w-full bg-stone-900/90 rounded-full border border-stone-700/80 p-0.5 overflow-hidden shadow-inner relative">
          {/* Framer Motion Spring Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${targetPercent}%` }}
            transition={{
              type: 'spring',
              stiffness: 45,
              damping: 14,
              mass: 0.9,
            }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 relative shadow-[0_0_20px_rgba(52,211,153,0.6)]"
          >
            {/* Animated Shimmer Light Strip */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

            {/* Glowing Pulse Head at the tip of progress */}
            {targetPercent > 2 && (
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8],
                  boxShadow: [
                    '0 0 8px rgba(251, 191, 36, 0.8)',
                    '0 0 16px rgba(251, 191, 36, 1)',
                    '0 0 8px rgba(251, 191, 36, 0.8)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-amber-300 z-10"
              />
            )}
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-stone-400 pt-1 font-sans">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-stone-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-white font-mono">{watchedCount}</strong> Watched
            </span>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1 text-stone-300">
              <Tv className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-white font-mono">{unwatchedCount}</strong> Remaining
            </span>
            {totalMinutesWatched > 0 && (
              <>
                <span className="text-stone-600 hidden sm:inline">·</span>
                <span className="items-center gap-1 text-stone-300 hidden sm:flex">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m watched</span>
                </span>
              </>
            )}
          </div>

          <div>
            {currentRank.nextNeeded > 0 ? (
              <span className="text-amber-300 text-[11px] font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentRank.nextNeeded} more episodes to rank up!</span>
              </span>
            ) : (
              <span className="text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>All 105 Episodes Completed! You are a CineNest Master!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Next Up Recommendation Banner & Filter Controls */}
      <div className="relative z-10 pt-4 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Next Unwatched Quick-Play Action */}
        <div className="md:col-span-7">
          {nextUnwatchedEpisode ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-600/60 transition group">
              <div className="min-w-0 pr-3">
                <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-emerald-400" />
                  <span>Continue Next Episode</span>
                </div>
                <h4 className="text-sm font-bold text-white font-serif truncate group-hover:text-amber-300 transition">
                  Ep {nextUnwatchedEpisode.id}: {nextUnwatchedEpisode.title}
                </h4>
                <p className="text-[11px] text-stone-400 truncate">
                  {nextUnwatchedEpisode.titleBn} · {nextUnwatchedEpisode.location}
                </p>
              </div>

              <button
                onClick={() => onSelectEpisode && onSelectEpisode(nextUnwatchedEpisode.id)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1"
              >
                <span>Play</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Incredible dedication! You have finished every episode in the 105-episode archive.</span>
            </div>
          )}
        </div>

        {/* Right: Watched Filter Segmented Tabs */}
        <div className="md:col-span-5 flex justify-start md:justify-end">
          {onFilterChange && (
            <div className="inline-flex p-1 bg-stone-900/90 rounded-2xl border border-stone-800 text-xs">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1 ${
                  activeFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>All ({totalEpisodes})</span>
              </button>
              <button
                onClick={() => onFilterChange('unwatched')}
                className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1 ${
                  activeFilter === 'unwatched'
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <EyeOff className="w-3 h-3" />
                <span>Unwatched ({unwatchedCount})</span>
              </button>
              <button
                onClick={() => onFilterChange('watched')}
                className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1 ${
                  activeFilter === 'watched'
                    ? 'bg-teal-700 text-white shadow-xs font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Watched ({watchedCount})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gamified Milestone Badges Row */}
      <div className="relative z-10 mt-5 pt-4 border-t border-stone-800/60">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-stone-300 flex items-center gap-1.5">
            <Medal className="w-3.5 h-3.5 text-amber-400" />
            <span>Storyteller Milestones</span>
          </span>
          <span className="text-[11px] text-stone-400">
            {MILESTONES.filter((m) => watchedCount >= m.required).length} of {MILESTONES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MILESTONES.map((m) => {
            const isUnlocked = watchedCount >= m.required;
            return (
              <motion.div
                key={m.required}
                whileHover={{ scale: 1.03 }}
                className={`p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  isUnlocked
                    ? 'bg-emerald-950/50 border-emerald-700/60 text-white shadow-xs'
                    : 'bg-stone-900/40 border-stone-800/80 text-stone-500 opacity-60'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    cinematicAudio.playPukuHeartChime();
                  }
                }}
                title={`${m.title}: ${m.description} (${m.reward})`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{m.badge}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {m.required} Ep{m.required > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="font-bold font-serif text-[11px] truncate text-stone-200">
                  {m.title}
                </div>
                <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                  {isUnlocked ? '✓ Unlocked' : `${m.required - watchedCount} more`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
