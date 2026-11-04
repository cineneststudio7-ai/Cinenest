import React, { useState, useEffect } from 'react';
import { Volume2, Copy, Check, Download, Heart, Sparkles, Music, Video, Camera, ArrowLeft, ArrowRight, Sun, RefreshCw, ShieldCheck, Lock, Save, Trash2, Edit3 } from 'lucide-react';
import { Episode } from '../types/series';
import { exportEpisodeToPlainText } from '../utils/episodeCalculator';
import { getEpisodeNote, saveEpisodeNote } from '../utils/crypto';

interface ScriptViewerProps {
  episode: Episode;
  onNextEpisode: () => void;
  onPrevEpisode: () => void;
  onExport: () => void;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({
  episode,
  onNextEpisode,
  onPrevEpisode,
  onExport
}) => {
  const [copiedPromptKey, setCopiedPromptKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [personalNote, setPersonalNote] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  // Load personal encrypted note whenever episode changes
  useEffect(() => {
    let isMounted = true;
    getEpisodeNote(episode.id).then((note) => {
      if (isMounted) {
        setPersonalNote(note);
        setNoteStatus(null);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [episode.id]);

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      await saveEpisodeNote(episode.id, personalNote, episode.title);
      setNoteStatus(personalNote.trim() ? 'Saved & Encrypted (AES-GCM 256-Bit) in LocalStorage' : 'Note cleared from encrypted storage');
      setTimeout(() => setNoteStatus(null), 3500);
    } catch (err) {
      setNoteStatus('Failed to save note');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleClearNote = async () => {
    setPersonalNote('');
    setIsSavingNote(true);
    try {
      await saveEpisodeNote(episode.id, '', episode.title);
      setNoteStatus('Note cleared from encrypted storage');
      setTimeout(() => setNoteStatus(null), 3000);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptKey(key);
    setTimeout(() => setCopiedPromptKey(null), 2000);
  };

  // Text-To-Speech reader using Web Speech API
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.15; // Gentle friendly children's storybook pitch
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Episode Header Card */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl p-6 border border-amber-200/90 shadow-xs relative overflow-hidden">
        {/* Subtle checkered accent border on right */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-[radial-gradient(#d97706_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-800 text-white font-mono font-bold text-sm shadow-xs">
              EPISODE {episode.id} OF 105
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
              {episode.timeOfDay}
            </span>
            <span className="px-3 py-1 rounded-xl bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold">
              330 Seconds Total
            </span>
          </div>

          {/* Previous / Next Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevEpisode}
              disabled={episode.id <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 text-xs font-semibold transition"
              aria-label="Previous episode"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ep {episode.id > 1 ? episode.id - 1 : 1}</span>
            </button>
            <button
              onClick={onNextEpisode}
              disabled={episode.id >= 105}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 text-xs font-semibold transition"
              aria-label="Next episode"
            >
              <span>Ep {episode.id < 105 ? episode.id + 1 : 105}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Bengali Script */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif tracking-tight">
            {episode.title}
          </h2>
          <p className="text-xl sm:text-2xl font-serif text-emerald-800 font-medium mt-0.5">
            {episode.titleBn}
          </p>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
            <span>Setting:</span>
            <span className="font-semibold text-stone-700">{episode.location}</span>
          </p>
        </div>

        {/* MANDATORY CONTINUITY BANNER */}
        <div className="p-3.5 rounded-xl bg-amber-100/70 border border-amber-300/80 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>Series Continuity Anchor (Recap of Previous Episode)</span>
          </div>
          <p className="text-sm text-stone-800 italic font-medium leading-relaxed">
            "{episode.prevEpisodeRecap}"
          </p>
        </div>

        {/* Problem and Learning Moment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-stone-200">
            <span className="font-bold text-stone-900 uppercase tracking-wider block mb-1">
              Courtyard Problem to Solve:
            </span>
            <p className="text-stone-700 leading-relaxed font-medium">
              {episode.problem}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-emerald-200">
            <span className="font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Learning Discovery:
            </span>
            <p className="text-stone-700 leading-relaxed font-medium">
              {episode.learningMoment}
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL PRODUCTION NOTES (ENCRYPTED IN LOCAL DATABASE) */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-300/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 font-serif">
                Episode {episode.id} Personal Production Notes
              </h3>
              <p className="text-[11px] text-stone-500">
                Encrypted with AES-GCM 256-bit before storing in browser local storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Database Active</span>
          </div>
        </div>

        {/* Text Input Field */}
        <div className="space-y-2">
          <label htmlFor="episode-personal-note-input" className="sr-only">
            Personal Production Notes for Episode {episode.id}
          </label>
          <textarea
            id="episode-personal-note-input"
            rows={3}
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder={`Add your private director notes, voice cues, or lighting tweaks for Episode ${episode.id}...`}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-sans leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingNote ? 'Encrypting & Saving...' : 'Save Encrypted Note'}</span>
              </button>

              {personalNote && (
                <button
                  type="button"
                  onClick={handleClearNote}
                  disabled={isSavingNote}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold transition"
                  title="Clear note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Status message */}
            {noteStatus && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{noteStatus}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 SCENES BREAKDOWN (EXACTLY 330 SECONDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
            <span>Complete 330s Episode Script</span>
            <span className="text-xs font-sans font-normal text-stone-500">
              (4-Part Pixar CGI Structure)
            </span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(`${episode.title}. ${episode.timecodes.opening.audioDialogueEn}. ${episode.rhyme.english}. ${episode.pukuGlowLesson.lessonEn}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold transition"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-rose-500 animate-pulse' : 'text-stone-600'}`} />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Script'}</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .txt</span>
            </button>
          </div>
        </div>

        {/* Scene 1: Opening (20s) */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                Part 1: Opening
              </span>
              <span className="text-xs font-mono font-bold text-stone-600">00:00 - 00:20 (20 Seconds)</span>
            </div>
            <span className="text-xs text-stone-500 italic">Theme: Establishing Shot</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="font-semibold text-stone-800 block mb-1">Camera & Shot:</span>
              <span className="text-stone-600">{episode.timecodes.opening.cameraShot}</span>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="font-semibold text-stone-800 block mb-1">Lighting & Lens:</span>
              <span className="text-stone-600">{episode.timecodes.opening.lightingAndLens}</span>
            </div>
          </div>

          <div className="text-xs text-stone-800 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900 block mb-1">Visual Action:</span>
            <p className="leading-relaxed font-medium">{episode.timecodes.opening.visualAction}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5 text-xs">
            <div>
              <span className="font-semibold text-stone-900">Dialogue (EN): </span>
              <span className="text-stone-700 italic">{episode.timecodes.opening.audioDialogueEn}</span>
            </div>
            <div>
              <span className="font-semibold text-emerald-800">Dialogue (Bengali): </span>
              <span className="text-stone-800 font-serif font-medium">{episode.timecodes.opening.audioDialogueBnScript}</span>
              <span className="text-stone-500 ml-2 font-mono text-[11px]">({episode.timecodes.opening.audioDialogueBn})</span>
            </div>
          </div>
        </div>

        {/* Scene 2: Adventure & Rhyme (240s) */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                Part 2: Adventure & Rhyme
              </span>
              <span className="text-xs font-mono font-bold text-stone-600">00:20 - 04:20 (240 Seconds)</span>
            </div>
            <span className="text-xs text-emerald-800 font-semibold">Core Discovery Beat</span>
          </div>

          <div className="text-xs text-stone-800 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/60">
            <span className="font-bold text-emerald-900 block mb-1">Visual Action:</span>
            <p className="leading-relaxed font-medium">{episode.timecodes.adventure.visualAction}</p>
          </div>

          {/* Bilingual Rhyme & Sing-Along Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
                <Music className="w-4 h-4 text-emerald-700" />
                <span>Featured Bilingual Song: "{episode.rhyme.title}"</span>
              </div>
              <button
                onClick={() => handleSpeak(`${episode.rhyme.english}. ${episode.rhyme.bengali}`)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Rhyme</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">Bengali Song (বাংলা ও রোমানাইজড):</span>
                <p className="text-stone-900 font-serif text-sm font-semibold mb-1">{episode.rhyme.bengaliScript}</p>
                <p className="text-stone-600 font-mono text-[11px] italic">{episode.rhyme.bengali}</p>
              </div>

              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <span className="text-[11px] font-bold text-stone-900 uppercase block mb-1">English Lyrics & Sing-Along:</span>
                <p className="text-stone-800 font-medium text-xs leading-relaxed italic">{episode.rhyme.english}</p>
                <p className="text-stone-500 text-[10px] mt-1">Tempo: {episode.rhyme.melodyNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scene 3: Lesson Recap & Puku Glow (40s) */}
        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold text-xs flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Part 3: Lesson Recap & Puku Glow</span>
              </span>
              <span className="text-xs font-mono font-bold text-stone-600">04:20 - 05:00 (40 Seconds)</span>
            </div>
            <span className="text-xs text-rose-800 font-semibold">{episode.pukuGlowLesson.glowColor}</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-2">
            <div className="font-medium text-stone-800">
              <span className="font-bold text-rose-950 block mb-0.5">Puku Glowing Heart Visual Action:</span>
              <p>{episode.pukuGlowLesson.pukuVisualAction}</p>
            </div>

            <div className="pt-2 border-t border-rose-200/80 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-bold text-stone-900 block mb-0.5">Puchu Moral Lesson (English):</span>
                <p className="text-stone-800 italic">"{episode.pukuGlowLesson.lessonEn.replace(/^"+|"+$/g, '')}"</p>
              </div>
              <div>
                <span className="font-bold text-emerald-900 block mb-0.5">Puchu Moral Lesson (বাংলা):</span>
                <p className="text-stone-800 font-serif font-medium">"{episode.pukuGlowLesson.lessonBnScript.replace(/^"+|"+$/g, '')}"</p>
                <p className="text-stone-500 text-[11px] font-mono italic">({episode.pukuGlowLesson.lessonBn.replace(/^"+|"+$/g, '')})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scene 4: Closing & Cliffhanger (30s) */}
        <div className="p-5 rounded-2xl bg-white border border-violet-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-900 font-bold text-xs">
                Part 4: Closing & Cliffhanger
              </span>
              <span className="text-xs font-mono font-bold text-stone-600">05:00 - 05:30 (30 Seconds)</span>
            </div>
            <span className="text-xs text-violet-800 font-semibold">Lead-In to Ep {episode.id === 105 ? 1 : episode.id + 1}</span>
          </div>

          <div className="text-xs text-stone-800 bg-violet-50/50 p-3 rounded-xl border border-violet-200/60">
            <span className="font-bold text-violet-950 block mb-1">Visual Action & Farewell:</span>
            <p className="leading-relaxed font-medium">{episode.timecodes.closing.visualAction}</p>
          </div>

          <div className="p-3 bg-violet-100/60 rounded-xl border border-violet-300 text-xs">
            <span className="font-bold text-violet-900 block mb-0.5">Next Episode Cliffhanger:</span>
            <p className="text-stone-800 italic font-semibold">"{episode.closingCliffhanger}"</p>
          </div>
        </div>
      </div>

      {/* PIXAR 3D CGI PRODUCTION PROMPTS */}
      <div className="p-6 rounded-2xl bg-stone-900 text-white space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-base text-stone-100 font-serif">
              Character-Locked 720p 3D CGI Pixar Prompts
            </h4>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Identity & Proportions Strictly Locked
          </span>
        </div>

        {/* Prompt List */}
        <div className="grid grid-cols-1 gap-3 text-xs">
          {/* 1. Establishing */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
                1. Courtyard Establishing Shot Prompt
              </span>
              <button
                onClick={() => handleCopy(episode.productionPrompts.establishingShot, 'establishing')}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white transition"
              >
                {copiedPromptKey === 'establishing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptKey === 'establishing' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-stone-300 font-mono text-[11px] leading-relaxed">
              {episode.productionPrompts.establishingShot}
            </p>
          </div>

          {/* 2. Adventure Keyframe */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px]">
                2. Adventure Keyframe Prompt
              </span>
              <button
                onClick={() => handleCopy(episode.productionPrompts.adventureKeyframe, 'adventure')}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white transition"
              >
                {copiedPromptKey === 'adventure' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptKey === 'adventure' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-stone-300 font-mono text-[11px] leading-relaxed">
              {episode.productionPrompts.adventureKeyframe}
            </p>
          </div>

          {/* 3. Puku Glow Lesson Keyframe */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-300 uppercase tracking-wider text-[11px]">
                3. Puku Glow & Lesson Keyframe Prompt
              </span>
              <button
                onClick={() => handleCopy(episode.productionPrompts.pukuGlowLessonKeyframe, 'glow')}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white transition"
              >
                {copiedPromptKey === 'glow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptKey === 'glow' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-stone-300 font-mono text-[11px] leading-relaxed">
              {episode.productionPrompts.pukuGlowLessonKeyframe}
            </p>
          </div>

          {/* 4. Omni 1.1 Flash Kinematic Motion Prompt */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-violet-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>4. Omni 1.1 Flash Video Kinematic Prompt (&lt; 30 Words)</span>
              </span>
              <button
                onClick={() => handleCopy(episode.productionPrompts.omniVideoKinematicPrompt, 'omni')}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white transition"
              >
                {copiedPromptKey === 'omni' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptKey === 'omni' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-stone-200 font-mono text-[12px] font-semibold leading-relaxed">
              "{episode.productionPrompts.omniVideoKinematicPrompt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
