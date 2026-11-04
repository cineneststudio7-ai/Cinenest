import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Heart,
  Star,
  Sparkles,
  Volume2,
  ArrowRight,
  Sun,
  Compass,
  Shield,
  Music,
  Clock,
  GraduationCap,
  Gift,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Search,
  Filter,
  Check,
  Video,
  Sliders
} from 'lucide-react';
import { Episode } from '../types/series';
import { PUCHU_PROFILE, PUKU_PROFILE, UNIVERSE_LOCATIONS } from '../data/universeData';
import { getEpisode, getAllEpisodes } from '../data/episodesDirectory';
import { ProgressTracker, WatchedFilterMode } from './ProgressTracker';
import { BatchVideoGeneratorModal } from './BatchVideoGeneratorModal';
import { CGPVideoEditSuite } from './CGPVideoEditSuite';
import { cinematicAudio } from '../utils/cinematicAudioEngine';
import {
  getWatchedEpisodes,
  toggleEpisodeWatched,
  WATCHED_CHANGED_EVENT,
  WatchedChangeEventDetail
} from '../utils/watchedStorage';

interface CinematicDiscoveryViewProps {
  onSelectEpisode: (id: number) => void;
  favoriteEpisodeIds: number[];
  onToggleFavorite: (id: number, title: string) => void;
  onOpenCharacterProfile: (charId: 'puchu' | 'puku') => void;
  onOpenUniverse: () => void;
  onOpenPreschool?: () => void;
  onOpenStickers?: () => void;
}

export const CinematicDiscoveryView: React.FC<CinematicDiscoveryViewProps> = ({
  onSelectEpisode,
  favoriteEpisodeIds,
  onToggleFavorite,
  onOpenCharacterProfile,
  onOpenUniverse,
  onOpenPreschool,
  onOpenStickers,
}) => {
  const [activeHeroCharacter, setActiveHeroCharacter] = useState<'puchu' | 'puku'>('puchu');
  const [pukuGlowPreset, setPukuGlowPreset] = useState<'gold' | 'rose' | 'emerald' | 'amber'>('gold');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [watchedEpisodeIds, setWatchedEpisodeIds] = useState<number[]>([]);
  const [watchedFilter, setWatchedFilter] = useState<WatchedFilterMode>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [librarySelectedTag, setLibrarySelectedTag] = useState<string>('All');
  const [libraryDisplayLimit, setLibraryDisplayLimit] = useState<number>(12);
  const [isBatchVideoModalOpen, setIsBatchVideoModalOpen] = useState<boolean>(false);
  const [isCGPStudioOpen, setIsCGPStudioOpen] = useState<boolean>(false);
  const [selectedEpisodeForCGP, setSelectedEpisodeForCGP] = useState<Episode>(() => getEpisode(1));

  const heroCharacter = activeHeroCharacter === 'puchu' ? PUCHU_PROFILE : PUKU_PROFILE;

  // Initialize and synchronize watched episodes from localStorage & events
  useEffect(() => {
    setWatchedEpisodeIds(getWatchedEpisodes());

    const handleWatchedChange = (e: Event) => {
      const customEvent = e as CustomEvent<WatchedChangeEventDetail>;
      if (customEvent.detail && Array.isArray(customEvent.detail.watchedIds)) {
        setWatchedEpisodeIds(customEvent.detail.watchedIds);
      } else {
        setWatchedEpisodeIds(getWatchedEpisodes());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'cinenest_watched_episodes') {
        setWatchedEpisodeIds(getWatchedEpisodes());
      }
    };

    window.addEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleToggleWatched = (e: React.MouseEvent, episodeId: number) => {
    e.stopPropagation();
    toggleEpisodeWatched(episodeId);
  };

  // Curated spotlight collections
  const morningEpisodeIds = [1, 2, 5, 10];
  const songEpisodeIds = [1, 3, 4, 7];
  const twilightEpisodeIds = [8, 9, 20, 42];

  const morningEpisodes = morningEpisodeIds.map((id) => getEpisode(id));
  const songEpisodes = songEpisodeIds.map((id) => getEpisode(id));
  const twilightEpisodes = twilightEpisodeIds.map((id) => getEpisode(id));

  // Audio soundbite player using Web Speech API
  const handlePlaySoundbite = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = activeHeroCharacter === 'puchu' ? 1.2 : 1.05;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Glow color mapping for Puku simulator
  const glowStyles = {
    gold: 'from-amber-400/40 via-yellow-300/30 to-transparent shadow-[0_0_50px_rgba(251,191,36,0.35)]',
    rose: 'from-rose-400/40 via-pink-300/30 to-transparent shadow-[0_0_50px_rgba(244,63,94,0.35)]',
    emerald: 'from-emerald-400/40 via-teal-300/30 to-transparent shadow-[0_0_50px_rgba(52,211,153,0.35)]',
    amber: 'from-orange-400/40 via-amber-300/30 to-transparent shadow-[0_0_50px_rgba(251,146,60,0.35)]',
  };

  // Filter helper based on current watchedFilter
  const filterByWatchedState = (episodes: Episode[]) => {
    if (watchedFilter === 'watched') {
      return episodes.filter((ep) => watchedEpisodeIds.includes(ep.id));
    }
    if (watchedFilter === 'unwatched') {
      return episodes.filter((ep) => !watchedEpisodeIds.includes(ep.id));
    }
    return episodes;
  };

  const filteredMorning = filterByWatchedState(morningEpisodes);
  const filteredSongs = filterByWatchedState(songEpisodes);
  const filteredTwilight = filterByWatchedState(twilightEpisodes);

  // All 105 episodes library filtered by search, tag, and watched state
  const all105Episodes = useMemo(() => {
    return getAllEpisodes();
  }, []);

  const allFilteredEpisodes = useMemo(() => {
    let result = all105Episodes;

    // Filter by watched state
    if (watchedFilter === 'watched') {
      result = result.filter((ep) => watchedEpisodeIds.includes(ep.id));
    } else if (watchedFilter === 'unwatched') {
      result = result.filter((ep) => !watchedEpisodeIds.includes(ep.id));
    }

    // Filter by tag
    if (librarySelectedTag !== 'All') {
      result = result.filter((ep) => ep.tags.includes(librarySelectedTag) || ep.timeOfDay.includes(librarySelectedTag));
    }

    // Filter by search query
    if (librarySearchQuery.trim()) {
      const q = librarySearchQuery.toLowerCase().trim();
      result = result.filter(
        (ep) =>
          ep.id.toString() === q ||
          ep.title.toLowerCase().includes(q) ||
          ep.titleBn.toLowerCase().includes(q) ||
          ep.problem.toLowerCase().includes(q) ||
          ep.learningMoment.toLowerCase().includes(q) ||
          ep.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [all105Episodes, watchedFilter, watchedEpisodeIds, librarySelectedTag, librarySearchQuery]);

  const libraryTags = ['All', 'Courtyard', 'Colors', 'Garden', 'Kindness', 'Bengali Words', 'Nature', 'Sharing', 'Problem Solving'];

  return (
    <div className="space-y-10">
      {/* 1. CINEMATIC HERO DISCOVERY STAGE */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-950 text-white border border-stone-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-amber-950/40 pointer-events-none z-10" />

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[520px]">
          {/* Left Column: Character Narrative & Interactive Controls */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs tracking-wider text-amber-300 font-medium mb-3">
                <span className="uppercase font-semibold">Cinematic Character Discovery</span>
                <span className="text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
                <span className="text-stone-300">Bangladeshi Village Courtyard</span>
                <span className="text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
                <span className="text-emerald-400">720p 3D CGI</span>
              </div>

              {/* Character Selector Segmented Switcher */}
              <div className="inline-flex p-1 bg-stone-900/90 rounded-2xl border border-stone-700/80 mb-5">
                <button
                  onClick={() => setActiveHeroCharacter('puchu')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                    activeHeroCharacter === 'puchu'
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>👧 Puchu</span>
                  <span className="text-[11px] opacity-75 font-serif">(পুচু)</span>
                </button>
                <button
                  onClick={() => setActiveHeroCharacter('puku')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                    activeHeroCharacter === 'puku'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>☕ Puku</span>
                  <span className="text-[11px] opacity-75 font-serif">(পুকু)</span>
                </button>
              </div>

              {/* Character Title & Tagline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white mb-2">
                {heroCharacter.name}
                <span className="text-2xl sm:text-3xl font-normal text-amber-300 ml-3 font-serif">
                  {heroCharacter.nameBn}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-amber-200/90 font-medium italic mb-3">
                "{heroCharacter.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                {heroCharacter.bio}
              </p>

              {/* Character Attributes Badge Row */}
              <div className="flex flex-wrap gap-2 mt-4">
                {activeHeroCharacter === 'puchu' ? (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs">
                      👗 Red Kurti &amp; Yellow Salwar
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs">
                      🎀 Two Curly Pigtails (Lock #1)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs">
                      ✨ Age: 4-5 Years
                    </span>
                  </>
                ) : (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-900/60 border border-amber-700/60 text-amber-200 text-xs">
                      ☕ Earthen Clay Chai Mug (Bhar)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-900/60 border border-amber-700/60 text-amber-200 text-xs">
                      💡 Emotion Heart-Glow (Lock #2)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-900/60 border border-amber-700/60 text-amber-200 text-xs">
                      ☁️ Scent of Cardamom &amp; Ginger Steam
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Interactive Area */}
            <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handlePlaySoundbite(
                      activeHeroCharacter === 'puchu'
                        ? 'Hello friends! I am Puchu. Come sit with me and Puku in the sunny courtyard!'
                        : 'Puff puff! I am Puku, Puchu’s magical tea mug companion. My heart glows when kindness shines!'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Speaking Voice...' : `Hear ${heroCharacter.name}'s Voice`}</span>
                </button>

                <button
                  onClick={() => onOpenCharacterProfile(activeHeroCharacter)}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
                >
                  Character Bible
                </button>
              </div>

              {activeHeroCharacter === 'puku' && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Heart Glow:</span>
                  {(['gold', 'rose', 'emerald', 'amber'] as const).map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setPukuGlowPreset(clr)}
                      className={`w-4 h-4 rounded-full border ${
                        pukuGlowPreset === clr ? 'scale-125 border-white shadow-sm' : 'border-stone-600 opacity-60'
                      } ${
                        clr === 'gold'
                          ? 'bg-amber-400'
                          : clr === 'rose'
                          ? 'bg-rose-400'
                          : clr === 'emerald'
                          ? 'bg-emerald-400'
                          : 'bg-orange-400'
                      } transition`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Character Visual Display */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex items-center justify-center relative">
            <div className={`relative rounded-2xl overflow-hidden border border-stone-700/80 bg-gradient-to-br ${
              activeHeroCharacter === 'puku' ? glowStyles[pukuGlowPreset] : 'from-emerald-950/40 to-stone-950'
            } p-2 transition-all duration-500`}>
              <img
                src="/public/assets/aistudio/WhatsApp_Image_2026-10-30_at_5.18.47_AM_416333e4.jpeg"
                alt="Puchu and Puku 3D Animation Reference"
                className="w-full h-auto object-cover rounded-xl shadow-2xl"
              />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-stone-200">
                    {activeHeroCharacter === 'puchu' ? 'Puchu (Curly Pigtails Lock)' : 'Puku (Glowing Mug Lock)'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenCharacterProfile(activeHeroCharacter)}
                  className="text-[11px] text-amber-300 hover:underline font-medium"
                >
                  Inspect Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRESS TRACKER & GAMIFIED COMPLETION BAR (USER REQUESTED FEATURE) */}
      <section>
        <ProgressTracker
          onSelectEpisode={onSelectEpisode}
          activeFilter={watchedFilter}
          onFilterChange={setWatchedFilter}
          onOpenBatchVideoGenerator={() => setIsBatchVideoModalOpen(true)}
          onOpenCGPStudio={() => {
            setSelectedEpisodeForCGP(getEpisode(1));
            setIsCGPStudioOpen(true);
          }}
        />
      </section>

      {/* 3. PREMIER MEMBER BENEFITS: PRE-K ACADEMY & COWORKER STICKERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: US Standard Pre-K Early Learning Academy */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-7 text-white border border-emerald-700/50 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-[11px] uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-stone-950" />
                <span>Premier Member Pre-K App</span>
              </span>
              <span className="text-[11px] text-emerald-300 font-medium">Head Start &amp; CCSS</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Puchu &amp; Puku Pre-School Academy
            </h3>

            <p className="text-xs text-stone-200 leading-relaxed">
              Curriculum aligned with US Early Childhood Education Standards. Counting tea cups, rhyming words, sensory observation, and Puku's glowing emotional thermometer.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between relative z-10">
            <span className="text-xs text-emerald-200 font-mono">Bilingual EN/BN Phonics</span>
            <button
              onClick={onOpenPreschool}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Launch Pre-K Academy</span>
            </button>
          </div>
        </div>

        {/* Card 2: Coworker Stickers & Appreciation Studio */}
        <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-rose-950 rounded-3xl p-6 sm:p-7 text-white border border-amber-700/50 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                <span>Coworker Kindness Studio</span>
              </span>
              <span className="text-[11px] text-amber-300 font-medium">Digital Cards &amp; Decals</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Buy &amp; Gift Stickers for Coworkers
            </h3>

            <p className="text-xs text-stone-200 leading-relaxed">
              Celebrate colleagues with character stickers! Morning tea breaks, teamwork high-fives, and banana-leaf focus mode. Preview on laptop lids, mugs, and download printable decal SVGs.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between relative z-10">
            <span className="text-xs text-amber-200 font-mono">Encrypted Private Gifts</span>
            <button
              onClick={onOpenStickers}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-amber-200" />
              <span>Browse Coworker Stickers</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. QUICK DISCOVERY CATEGORIES & UNIVERSE MAP ENTRY */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              Grandma's Courtyard Universe
            </h3>
            <p className="text-xs text-stone-500">
              The living Bangladeshi village setting that expands into 8 signature storytelling zones
            </p>
          </div>

          <button
            onClick={onOpenUniverse}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
          >
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Open Interactive World Map</span>
          </button>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNIVERSE_LOCATIONS.slice(0, 3).map((loc) => (
            <div
              key={loc.id}
              onClick={onOpenUniverse}
              className="p-5 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="text-[11px] font-semibold text-emerald-800">{loc.bestTimeOfDay}</span>
                <span className="text-[11px]">{loc.growthOrigin}</span>
              </div>
              <h4 className="font-bold text-base text-stone-900 font-serif group-hover:text-emerald-800 transition">
                {loc.name}
              </h4>
              <p className="text-xs font-serif text-emerald-700 font-semibold mb-2">
                {loc.nameBn}
              </p>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {loc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CURATED EPISODE DISCOVERY REELS (WITH VISUAL WATCHED INDICATORS & TOGGLES) */}
      {/* Reel 1: Morning Courtyard Discovery */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <span>Sunny Morning Courtyard Adventures</span>
            </h3>
            <p className="text-xs text-stone-500">Fresh dawn tea parties, garden butterflies, and morning discoveries</p>
          </div>
          <span className="text-xs font-semibold text-stone-500 font-mono">330s Each</span>
        </div>

        {filteredMorning.length === 0 ? (
          <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center text-xs text-stone-600">
            No morning episodes match the current "<strong>{watchedFilter}</strong>" filter.
            <button
              onClick={() => setWatchedFilter('all')}
              className="ml-2 text-emerald-700 font-semibold underline"
            >
              Show all episodes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMorning.map((ep) => {
              const isFav = favoriteEpisodeIds.includes(ep.id);
              const isWatched = watchedEpisodeIds.includes(ep.id);

              return (
                <div
                  key={ep.id}
                  onClick={() => onSelectEpisode(ep.id)}
                  className={`rounded-2xl p-4 transition cursor-pointer flex flex-col justify-between group relative border ${
                    isWatched
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Card Top: Episode #, Watched Indicator Badge, Favorite Star */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-emerald-800">
                        EPISODE {ep.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Visual Watched Indicator Badge */}
                        {isWatched ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                            title="Marked as Watched"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Watched</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-500 border border-stone-200"
                            title="Unwatched episode"
                          >
                            <Circle className="w-2.5 h-2.5 text-stone-400" />
                            <span>Unwatched</span>
                          </span>
                        )}

                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(ep.id, ep.title);
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-amber-500 transition"
                          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 font-serif group-hover:text-emerald-800 transition mb-0.5">
                      {ep.title}
                    </h4>
                    <p className="text-xs font-serif text-emerald-700 font-semibold mb-2">
                      {ep.titleBn}
                    </p>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                      {ep.problem}
                    </p>
                  </div>

                  {/* Card Bottom: Duration & Watched Toggle Action */}
                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-stone-500">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>05:30</span>
                    </span>

                    {/* Toggle Watched Button */}
                    <button
                      onClick={(e) => handleToggleWatched(e, ep.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                        isWatched
                          ? 'bg-stone-200/80 hover:bg-rose-100 text-stone-700 hover:text-rose-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                      title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
                    >
                      {isWatched ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Mark Unwatched</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Watched</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reel 2: Bilingual Song & Rhyme Specials */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
              <Music className="w-5 h-5 text-emerald-700" />
              <span>Bilingual Rhymes & Courtyard Melodies</span>
            </h3>
            <p className="text-xs text-stone-500">Sing-along musical moments blending Bengali folk meters and English rhymes</p>
          </div>
        </div>

        {filteredSongs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center text-xs text-stone-600">
            No rhyme episodes match the current "<strong>{watchedFilter}</strong>" filter.
            <button
              onClick={() => setWatchedFilter('all')}
              className="ml-2 text-emerald-700 font-semibold underline"
            >
              Show all episodes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSongs.map((ep) => {
              const isFav = favoriteEpisodeIds.includes(ep.id);
              const isWatched = watchedEpisodeIds.includes(ep.id);

              return (
                <div
                  key={ep.id}
                  onClick={() => onSelectEpisode(ep.id)}
                  className={`rounded-2xl p-4 transition cursor-pointer flex flex-col justify-between group relative border ${
                    isWatched
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-emerald-800">
                        EPISODE {ep.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isWatched ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                            title="Marked as Watched"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Watched</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-500 border border-stone-200"
                          >
                            <Circle className="w-2.5 h-2.5 text-stone-400" />
                            <span>Unwatched</span>
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(ep.id, ep.title);
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-amber-500 transition"
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-stone-900 font-serif group-hover:text-emerald-800 transition mb-0.5">
                      {ep.title}
                    </h4>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs mb-3 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 block truncate">
                        🎵 {ep.rhyme.title}
                      </span>
                      <p className="text-stone-700 text-[11px] italic line-clamp-2">
                        "{ep.rhyme.english}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">{ep.timeOfDay}</span>
                    <button
                      onClick={(e) => handleToggleWatched(e, ep.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                        isWatched
                          ? 'bg-stone-200/80 hover:bg-rose-100 text-stone-700 hover:text-rose-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      {isWatched ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Watched</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Watched</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. COMPLETE 105 EPISODES BROWSER (FULL CATALOGUE WITH SEARCH & WATCHED STATE) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Complete Collection
              </span>
              <span className="text-xs text-stone-500 font-mono">105 Episodes Total</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mt-1">
              Explore All 105 Episodes
            </h3>
            <p className="text-xs text-stone-500">
              Filter by topic, search by keywords, and track your progress across all 105 preschool story adventures.
            </p>
          </div>

          {/* Search bar inside Catalog */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={librarySearchQuery}
              onChange={(e) => setLibrarySearchQuery(e.target.value)}
              placeholder="Search by title, theme, or lesson..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {libraryTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setLibrarySelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                librarySelectedTag === tag
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Episode Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allFilteredEpisodes.slice(0, libraryDisplayLimit).map((ep) => {
            const isFav = favoriteEpisodeIds.includes(ep.id);
            const isWatched = watchedEpisodeIds.includes(ep.id);

            return (
              <div
                key={ep.id}
                onClick={() => onSelectEpisode(ep.id)}
                className={`rounded-2xl p-4 transition cursor-pointer flex flex-col justify-between group border relative ${
                  isWatched
                    ? 'bg-emerald-50/30 border-emerald-300 shadow-2xs'
                    : 'bg-stone-50/50 hover:bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-emerald-800">
                      EPISODE {ep.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isWatched ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                          title="Watched"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Watched</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-500 border border-stone-200"
                        >
                          <Circle className="w-2.5 h-2.5 text-stone-400" />
                          <span>Unwatched</span>
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(ep.id, ep.title);
                        }}
                        className="p-1 rounded-lg text-stone-400 hover:text-amber-500 transition"
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-stone-900 font-serif group-hover:text-emerald-800 transition line-clamp-1">
                    {ep.title}
                  </h4>
                  <p className="text-xs font-serif text-emerald-700 font-semibold mb-1">
                    {ep.titleBn}
                  </p>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
                    {ep.problem}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 text-[10px] truncate max-w-[90px]">{ep.tags[0] || ep.timeOfDay}</span>
                  <button
                    onClick={(e) => handleToggleWatched(e, ep.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                      isWatched
                        ? 'bg-stone-200/80 hover:bg-rose-100 text-stone-700 hover:text-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    {isWatched ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Watched</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Watched</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {allFilteredEpisodes.length > libraryDisplayLimit && (
          <div className="text-center pt-2">
            <button
              onClick={() => setLibraryDisplayLimit((prev) => prev + 24)}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
            >
              Show More Episodes ({libraryDisplayLimit} of {allFilteredEpisodes.length} shown)
            </button>
          </div>
        )}
      </section>

      {/* 5. ALL 105 EPISODES BATCH VIDEO GENERATOR MODAL */}
      <BatchVideoGeneratorModal
        isOpen={isBatchVideoModalOpen}
        onClose={() => setIsBatchVideoModalOpen(false)}
        onSelectEpisodeForPlayback={(id) => {
          onSelectEpisode(id);
          setIsBatchVideoModalOpen(false);
        }}
      />

      {/* 6. CGP COLOR GRADING & POST-PRODUCTION SUITE MODAL */}
      {isCGPStudioOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-5xl">
            <CGPVideoEditSuite
              episode={selectedEpisodeForCGP}
              onClose={() => setIsCGPStudioOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
