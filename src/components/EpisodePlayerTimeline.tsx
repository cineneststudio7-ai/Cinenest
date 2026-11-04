import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Heart, Volume2, Sparkles, Clock, Sun, MapPin, CheckCircle2, Check, Circle, Sliders, Music, Video } from 'lucide-react';
import { Episode } from '../types/series';
import { formatTimecode, TOTAL_EPISODE_SECONDS } from '../utils/episodeCalculator';
import { CGPVideoEditSuite } from './CGPVideoEditSuite';
import { cinematicAudio } from '../utils/cinematicAudioEngine';
import {
  getWatchedEpisodes,
  toggleEpisodeWatched,
  setEpisodeWatched,
  WATCHED_CHANGED_EVENT,
  WatchedChangeEventDetail,
} from '../utils/watchedStorage';

interface EpisodePlayerTimelineProps {
  episode: Episode;
  currentSecond: number;
  setCurrentSecond: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const EpisodePlayerTimeline: React.FC<EpisodePlayerTimelineProps> = ({
  episode,
  currentSecond,
  setCurrentSecond,
  isPlaying,
  setIsPlaying,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isWatched, setIsWatched] = useState<boolean>(() => getWatchedEpisodes().includes(episode.id));
  const [isCGPOpen, setIsCGPOpen] = useState<boolean>(false);
  const prevSecRef = useRef<number>(0);

  // Sync watched state
  useEffect(() => {
    setIsWatched(getWatchedEpisodes().includes(episode.id));

    const handleWatchedChange = (e: Event) => {
      const customEvent = e as CustomEvent<WatchedChangeEventDetail>;
      if (customEvent.detail && Array.isArray(customEvent.detail.watchedIds)) {
        setIsWatched(customEvent.detail.watchedIds.includes(episode.id));
      } else {
        setIsWatched(getWatchedEpisodes().includes(episode.id));
      }
    };

    window.addEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
    return () => window.removeEventListener(WATCHED_CHANGED_EVENT, handleWatchedChange);
  }, [episode.id]);

  // Playback timer loop & auto-mark watched on completion
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSecond((prev) => {
          if (prev >= TOTAL_EPISODE_SECONDS) {
            setIsPlaying(false);
            setEpisodeWatched(episode.id, true);
            return TOTAL_EPISODE_SECONDS;
          }
          return Math.min(TOTAL_EPISODE_SECONDS, prev + 1);
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, setCurrentSecond, setIsPlaying, episode.id]);

  // Determine active segment based on exact 330 seconds
  const isOpening = currentSecond >= 0 && currentSecond < 20;
  const isAdventure = currentSecond >= 20 && currentSecond < 260;
  const isLesson = currentSecond >= 260 && currentSecond < 300;
  const isClosing = currentSecond >= 300 && currentSecond <= 330;

  // Active section data
  let activeSectionTitle = 'Part 1: Courtyard Opening';
  let activeSectionDuration = '20s (00:00 - 00:20)';
  let activeAction = episode.timecodes.opening.visualAction;
  let activeDialogueEn = episode.timecodes.opening.audioDialogueEn;
  let activeDialogueBn = episode.timecodes.opening.audioDialogueBn;

  if (isAdventure) {
    activeSectionTitle = 'Part 2: Adventure & Bilingual Rhyme';
    activeSectionDuration = '240s (00:20 - 04:20)';
    activeAction = episode.timecodes.adventure.visualAction;
    activeDialogueEn = episode.timecodes.adventure.audioDialogueEn;
    activeDialogueBn = episode.timecodes.adventure.audioDialogueBn;
  } else if (isLesson) {
    activeSectionTitle = 'Part 3: Lesson Recap & Puku Heart Glow';
    activeSectionDuration = '40s (04:20 - 05:00)';
    activeAction = `${episode.timecodes.lesson.visualAction} - ${episode.pukuGlowLesson.pukuVisualAction}`;
    activeDialogueEn = episode.pukuGlowLesson.lessonEn;
    activeDialogueBn = episode.pukuGlowLesson.lessonBn;
  } else if (isClosing) {
    activeSectionTitle = 'Part 4: Warm Farewell & Cliffhanger';
    activeSectionDuration = '30s (05:00 - 05:30)';
    activeAction = episode.timecodes.closing.visualAction;
    activeDialogueEn = `Cliffhanger: "${episode.closingCliffhanger}"`;
    activeDialogueBn = episode.timecodes.closing.audioDialogueBn;
  }

  const progressPercent = (currentSecond / TOTAL_EPISODE_SECONDS) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-sm tracking-wide">330s CINEMATIC TIMELINE PLAYER</span>
          </div>
          <span className="text-amber-200/80 text-xs hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs text-amber-100">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Target: Exactly 05:30 (330s)</span>
          </div>
        </div>

        {/* Right Info Badges & Watched Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => toggleEpisodeWatched(episode.id)}
            className={`px-3 py-1 rounded-full font-bold text-xs transition flex items-center gap-1.5 shadow-xs ${
              isWatched
                ? 'bg-emerald-500 hover:bg-emerald-600 text-stone-950 ring-2 ring-emerald-300'
                : 'bg-stone-800/90 hover:bg-emerald-700 text-stone-200 hover:text-white border border-stone-600'
            }`}
            title={isWatched ? 'Mark episode as unwatched' : 'Mark episode as watched'}
          >
            {isWatched ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 fill-stone-950 text-emerald-400" />
                <span>Watched</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-stone-400" />
                <span>Mark Watched</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsCGPOpen(true)}
            className="px-2.5 py-1 rounded-full bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 text-xs font-semibold transition flex items-center gap-1 shadow-xs"
            title="Open CGP Post-Production Color Grading & Anamorphic Lens Console"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-300" />
            <span>CGP Grading</span>
          </button>

          <button
            onClick={() => cinematicAudio.playBansuriFluteMelody()}
            className="px-2.5 py-1 rounded-full bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 text-xs font-semibold transition flex items-center gap-1 shadow-xs"
            title="Play acoustic Bengali Bansuri flute melody for this episode"
          >
            <Music className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Acoustic Score</span>
          </button>

          <span className="px-2.5 py-0.5 rounded-full bg-amber-600/50 text-amber-100 border border-amber-500/40">
            {episode.timeOfDay}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/50 text-emerald-100 border border-emerald-500/40 hidden sm:inline">
            720p 3D CGI
          </span>
        </div>
      </div>

      {/* Main Interactive Timeline Visualizer */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Active Cue Card Display */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLesson
            ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
            : isAdventure
            ? 'bg-emerald-50/60 border-emerald-300'
            : isOpening
            ? 'bg-amber-50/60 border-amber-300'
            : 'bg-violet-50/60 border-violet-300'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                isLesson ? 'bg-rose-500 text-white' :
                isAdventure ? 'bg-emerald-600 text-white' :
                isOpening ? 'bg-amber-600 text-white' : 'bg-violet-600 text-white'
              }`}>
                {activeSectionTitle}
              </span>
              <span className="text-xs text-stone-600 font-mono font-medium">{activeSectionDuration}</span>
            </div>

            {/* Puku Glow indicator */}
            {isLesson ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold animate-pulse border border-rose-300">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Puku's Heart is Glowing!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                <span>Puku companion smiling</span>
              </div>
            )}
          </div>

          <p className="text-sm text-stone-800 leading-relaxed font-medium mb-2">
            {activeAction}
          </p>

          <div className="pt-2 border-t border-stone-200/60 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="bg-white/80 p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-900 block mb-0.5">Dialogue (EN):</span>
              <span className="text-stone-700 italic">{activeDialogueEn.replace(/^"+|"+$/g, '')}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-emerald-800 block mb-0.5">Dialogue (Bengali):</span>
              <span className="text-stone-700 font-serif">{activeDialogueBn.replace(/^"+|"+$/g, '')}</span>
            </div>
          </div>
        </div>

        {/* 4 Segment Blocks Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 px-1">
            <span>00:00</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-amber-800">Opening (20s)</span>
              <span className="text-emerald-700">Adventure (240s)</span>
              <span className="text-rose-700">Lesson (40s)</span>
              <span className="text-violet-700">Closing (30s)</span>
            </div>
            <span>05:30 (330s)</span>
          </div>

          {/* Segment Visual Track */}
          <div className="relative h-6 bg-stone-100 rounded-lg overflow-hidden flex border border-stone-300">
            {/* Opening 20s (20/330 = 6.06%) */}
            <div
              onClick={() => setCurrentSecond(0)}
              style={{ width: `${(20 / 330) * 100}%` }}
              className={`h-full border-r border-white/60 cursor-pointer transition ${
                isOpening ? 'bg-amber-500 shadow-inner' : 'bg-amber-300 hover:bg-amber-400'
              }`}
              title="Opening: 0s - 20s (20s)"
            />
            {/* Adventure 240s (240/330 = 72.72%) */}
            <div
              onClick={() => setCurrentSecond(20)}
              style={{ width: `${(240 / 330) * 100}%` }}
              className={`h-full border-r border-white/60 cursor-pointer transition ${
                isAdventure ? 'bg-emerald-600 shadow-inner' : 'bg-emerald-300 hover:bg-emerald-400'
              }`}
              title="Adventure & Rhyme: 20s - 260s (240s)"
            />
            {/* Lesson 40s (40/330 = 12.12%) */}
            <div
              onClick={() => setCurrentSecond(260)}
              style={{ width: `${(40 / 330) * 100}%` }}
              className={`h-full border-r border-white/60 cursor-pointer transition ${
                isLesson ? 'bg-rose-500 shadow-inner' : 'bg-rose-300 hover:bg-rose-400'
              }`}
              title="Lesson Recap & Puku Glow: 260s - 300s (40s)"
            />
            {/* Closing 30s (30/330 = 9.09%) */}
            <div
              onClick={() => setCurrentSecond(300)}
              style={{ width: `${(30 / 330) * 100}%` }}
              className={`h-full cursor-pointer transition ${
                isClosing ? 'bg-violet-600 shadow-inner' : 'bg-violet-300 hover:bg-violet-400'
              }`}
              title="Closing & Cliffhanger: 300s - 330s (30s)"
            />

            {/* Scrubber Playhead Thumb */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-stone-900 pointer-events-none transition-all duration-75 shadow-md flex items-center justify-center"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-3 h-3 bg-stone-900 rounded-full -top-1 absolute shadow-sm" />
            </div>
          </div>

          {/* Slider input for granular scrubbing */}
          <input
            type="range"
            min="0"
            max={TOTAL_EPISODE_SECONDS}
            value={currentSecond}
            onChange={(e) => setCurrentSecond(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            aria-label="Episode timeline scrubber"
          />
        </div>

        {/* Playback Controls & Section Jumpers */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Left Play / Pause / Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Play 330s Preview'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentSecond(0);
              }}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              title="Reset to 00:00"
              aria-label="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed toggle */}
            <div className="flex items-center rounded-lg bg-stone-100 p-0.5 text-xs font-semibold">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-md transition ${
                    playbackSpeed === speed ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Time Counter */}
          <div className="font-mono text-base font-bold text-stone-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span className="text-emerald-800">{formatTimecode(currentSecond)}</span>
            <span className="text-stone-400 mx-1">/</span>
            <span>{formatTimecode(TOTAL_EPISODE_SECONDS)}</span>
            <span className="text-stone-400 text-xs ml-1.5 font-sans">({currentSecond}s / 330s)</span>
          </div>

          {/* Direct Section Jump Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentSecond(0)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                isOpening ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              Opening (0s)
            </button>
            <button
              onClick={() => setCurrentSecond(20)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                isAdventure ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              Adventure (20s)
            </button>
            <button
              onClick={() => setCurrentSecond(260)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                isLesson ? 'bg-rose-100 border-rose-400 text-rose-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-rose-50'
              }`}
            >
              Lesson Glow (260s)
            </button>
            <button
              onClick={() => setCurrentSecond(300)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                isClosing ? 'bg-violet-100 border-violet-400 text-violet-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              Closing (300s)
            </button>
          </div>
        </div>
      </div>

      {/* CGP Video Color Grading Modal */}
      {isCGPOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-5xl">
            <CGPVideoEditSuite
              episode={episode}
              onClose={() => setIsCGPOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
