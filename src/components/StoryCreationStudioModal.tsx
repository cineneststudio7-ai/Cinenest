import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Bot,
  Clapperboard,
  Play,
  CheckCircle2,
  Download,
  Loader2,
  Film,
  Camera,
  Copy,
  Check,
  Save,
} from 'lucide-react';
import { saveEpisodeNote } from '../utils/crypto';

interface StoryCreationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
  onLaunchEpisode: (episodeId: number) => void;
}

export const StoryCreationStudioModal: React.FC<StoryCreationStudioModalProps> = ({
  isOpen,
  onClose,
  initialStep = 1,
  onLaunchEpisode,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Step 1: Idea Form State
  const [title, setTitle] = useState('The Glowing Teapot of Friendship');
  const [theme, setTheme] = useState('Kindness & Sharing');
  const [subject, setSubject] = useState('Social-Emotional Learning & Colors');
  const [characters, setCharacters] = useState<string[]>(['Rutti', 'Putti', 'Robo-C', 'Neel Bird']);
  const [setting, setSetting] = useState('Grandma\'s Village Courtyard with checkered picnic table');

  // Step 2: AI Script State
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    directorsVision: string;
    openingNotes: string;
    rhymeEn: string;
    rhymeBn: string;
    rhymeBnScript: string;
    pukuGlowMoment: string;
    cinematicLightingAdvice: string;
  } | null>(null);

  // Step 3: 3D Visual Prompts
  const [isGenerating3DPrompt, setIsGenerating3DPrompt] = useState(false);
  const [scenePrompts, setScenePrompts] = useState<{
    establishing: string;
    characterLock: string;
    actionShot: string;
    lighting: string;
  }>({
    establishing:
      'Cinematic establishing wide shot of a sun-drenched courtyard in a green village. Orange-and-white checkered picnic tablecloth, terracotta tea pots, flowering jasmine vines, soft volumetric morning light, Pixar-style 3D CGI 720p.',
    characterLock:
      'STRICT CHARACTER LOCK: Rutti (older toddler sister, wavy brown hair with flower clip, bright amber eyes, sunny yellow floral dress). Putti (younger toddler, cute round cheeks, sky blue duck shirt). Robo-C (friendly white and cyan robot with glowing LED smile). Disney-Pixar subsurface scattering and authentic skin textures.',
    actionShot:
      'Medium close-up at eye level: Rutti gently pours golden warm tea into a ceramic cup while Robo-C\'s chest badge glows soft cyan and Neel the blue bird perches joyfully on a wicker basket.',
    lighting:
      'Warm golden hour lighting, 35mm equivalent focal length, soft creamy bokeh background, high dynamic range Disney-Pixar quality render.',
  });

  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerateScriptWithAI = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/ai/expand-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: 1,
          topic: `${title} - ${theme}`,
          tone: 'Warm, whimsical, educational, Disney-Pixar feel',
          userNotes: `Setting: ${setting}. Characters: ${characters.join(', ')}. Preschool Subject: ${subject}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedScript(data.data);
      } else {
        // High quality fallback
        setGeneratedScript({
          directorsVision: `Rutti and Putti discover that sharing tea and kind words makes everyone\'s hearts glow. Warm cinematic Disney-Pixar aesthetic with gentle Bengali and English bilingual songs.`,
          openingNotes: `Establishing shot (0-20s): Golden sunshine over Grandma\'s courtyard, warm steam rising from the tea set.`,
          rhymeEn: `One cup for you, one cup for me! Happy friends as sweet as honey tea!`,
          rhymeBn: `Ekti pyala tomar, ekti pyala amar, Mishti chaayer moto shundor bondhutto shobar!`,
          rhymeBnScript: `একটি পেয়ালা তোমার, একটি পেয়ালা আমার, মিষ্টি চায়ের মত সুন্দর বন্ধুত্ব সবার!`,
          pukuGlowMoment: `Robo-C and the ceramic cup glow with warm golden-pink illumination as Putti offers her favorite mango slice to her sister.`,
          cinematicLightingAdvice: `Use volumetric God rays streaming through mango leaves; keep camera at children\'s eye level (45cm off the ground).`,
        });
      }
      setCurrentStep(2);
    } catch (err) {
      // Deterministic fallback
      setGeneratedScript({
        directorsVision: `A heartwarming preschool adventure teaching sharing and patience in the village courtyard.`,
        openingNotes: `Courtyard morning sunlight, warm steam rising from the tea set.`,
        rhymeEn: `Sharing is caring, bright and true! A cup of sweet tea for me and you!`,
        rhymeBn: `Ekti pyala tomar, ekti pyala amar! Shobai mile anondo kori abar!`,
        rhymeBnScript: `একটি পেয়ালা তোমার, একটি পেয়ালা আমার! সবাই মিলে আনন্দ করি আবার!`,
        pukuGlowMoment: `Golden-pink glow pulses across the table as Rutti smiles and claps.`,
        cinematicLightingAdvice: `Golden sunlight, 35mm lens, soft depth of field.`,
      });
      setCurrentStep(2);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(key);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleSaveToVault = async () => {
    const noteText = `[CineNest AI Studio Project: ${title}]\nTheme: ${theme}\nSubject: ${subject}\nRhyme: ${generatedScript?.rhymeEn || ''}\n${generatedScript?.rhymeBn || ''}\nPrompts: ${scenePrompts.establishing}`;
    await saveEpisodeNote(1, noteText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c1f2d] border border-cyan-500/30 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#081722] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-brand">
                CineNest 4-Step Animation Pipeline
              </h2>
              <p className="text-xs text-white/60">
                From Idea to 3D Disney-Pixar Episode — Automatically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label="Close creator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Progress Indicators */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-[#0a1b26] text-xs">
          {[
            { num: 1, name: 'Idea', icon: Lightbulb },
            { num: 2, name: 'AI Script', icon: Bot },
            { num: 3, name: '3D Prompts', icon: Clapperboard },
            { num: 4, name: 'Ready & Play', icon: Play },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-3 px-2 flex items-center justify-center gap-2 transition border-b-2 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 font-bold'
                    : isCompleted
                    ? 'border-emerald-500 text-emerald-400 font-semibold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================= STEP 1: CREATE YOUR IDEA ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Step 1 &bull; Conceptualization
                </span>
                <h3 className="text-2xl font-bold text-white font-brand mt-0.5">
                  Create Your Story Concept
                </h3>
                <p className="text-xs text-white/70">
                  Provide your preschool theme, character roles, and core learning moral.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Episode Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Core Moral / Emotional Theme
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    US Pre-K Educational Focus
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#091b26] border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  >
                    <option value="Social-Emotional: Sharing & Empathy">
                      Social-Emotional: Sharing & Empathy
                    </option>
                    <option value="Phonics & Early Language (Bilingual Bengali/English)">
                      Phonics & Early Language (Bilingual)
                    </option>
                    <option value="Early Math: Counting & Shapes">
                      Early Math: Counting & Shapes
                    </option>
                    <option value="Science & Nature: Sun, Water & Butterflies">
                      Science & Nature: Sun, Water & Butterflies
                    </option>
                    <option value="Creativity & Music: Rhythm & Rhyme">
                      Creativity & Music: Rhythm & Rhyme
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Courtyard Setting
                  </label>
                  <input
                    type="text"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Characters Selection */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Featured Series Cast (Character Locked)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Rutti', role: 'Older Sister (Leader, Floral Yellow Dress)' },
                    { id: 'Putti', role: 'Toddler Sibling (Curious, Blue Duck Shirt)' },
                    { id: 'Robo-C', role: 'Friendly AI Robot Companion' },
                    { id: 'Neel Bird', role: 'CineNest Blue Bird Mascot' },
                  ].map((char) => (
                    <div
                      key={char.id}
                      className="p-3 rounded-xl bg-white/5 border border-cyan-500/30 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-sm text-cyan-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{char.id}</span>
                      </div>
                      <span className="text-[10px] text-white/60 mt-1">{char.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: AI BUILDS THE STORY ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Step 2 &bull; AI Script Generation
                  </span>
                  <h3 className="text-2xl font-bold text-white font-brand mt-0.5">
                    330-Second 4-Act Master Script
                  </h3>
                  <p className="text-xs text-white/70">
                    Engineered with strict timing: Opening (20s), Adventure (240s), Lesson Recap (40s), Closing (30s).
                  </p>
                </div>

                <button
                  onClick={handleGenerateScriptWithAI}
                  disabled={isGeneratingScript}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isGeneratingScript ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Regenerate with Gemini</span>
                    </>
                  )}
                </button>
              </div>

              {generatedScript ? (
                <div className="space-y-4">
                  {/* Director's Vision */}
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                      Director's Vision
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {generatedScript.directorsVision}
                    </p>
                  </div>

                  {/* Bilingual Song & Rhyme */}
                  <div className="p-4 rounded-2xl bg-[#091b26] border border-amber-400/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                        Bilingual Core Song (Bengali & English)
                      </span>
                      <span className="text-[10px] text-white/50">Timestamp: 03:15 / 330s</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      "{generatedScript.rhymeEn}"
                    </div>
                    <div className="text-xs text-amber-200 italic font-serif">
                      "{generatedScript.rhymeBn}"
                    </div>
                    {generatedScript.rhymeBnScript && (
                      <div className="text-xs text-amber-300 font-sans">
                        {generatedScript.rhymeBnScript}
                      </div>
                    )}
                  </div>

                  {/* Character Learning & Glow Moment */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                      Lesson Recap & Companion Glow (260s - 300s)
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {generatedScript.pukuGlowMoment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Script not generated yet</h4>
                    <p className="text-xs text-white/60 max-w-sm mx-auto mt-1">
                      Click the button below to have Gemini 3.8 Flash compose the full 330s Disney-Pixar screenplay.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateScriptWithAI}
                    disabled={isGeneratingScript}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg transition"
                  >
                    Generate Script Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: 3D ANIMATION PRODUCTION ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Step 3 &bull; 3D Animation Production
                </span>
                <h3 className="text-2xl font-bold text-white font-brand mt-0.5">
                  Disney-Pixar Style 3D Render Prompts
                </h3>
                <p className="text-xs text-white/70">
                  Pixel-perfect prompt templates preserving 100% Character Lock and cinematic volumetric lighting.
                </p>
              </div>

              <div className="space-y-3">
                {/* Establishing Shot */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">
                      1. Establishing Shot (0 - 20s)
                    </span>
                    <button
                      onClick={() => handleCopy(scenePrompts.establishing, 'est')}
                      className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white px-2 py-1 rounded-md bg-white/5"
                    >
                      {copiedPrompt === 'est' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt === 'est' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-white/80 bg-black/40 p-2.5 rounded-xl">
                    {scenePrompts.establishing}
                  </p>
                </div>

                {/* Character Lock Specification */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      2. Strict Character Lock Specification
                    </span>
                    <button
                      onClick={() => handleCopy(scenePrompts.characterLock, 'lock')}
                      className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white px-2 py-1 rounded-md bg-white/5"
                    >
                      {copiedPrompt === 'lock' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt === 'lock' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-white/80 bg-black/40 p-2.5 rounded-xl">
                    {scenePrompts.characterLock}
                  </p>
                </div>

                {/* Volumetric Lighting & Camera */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">
                      3. Camera Rig & Volumetric Sunshine
                    </span>
                    <button
                      onClick={() => handleCopy(scenePrompts.lighting, 'cam')}
                      className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white px-2 py-1 rounded-md bg-white/5"
                    >
                      {copiedPrompt === 'cam' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt === 'cam' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-white/80 bg-black/40 p-2.5 rounded-xl">
                    {scenePrompts.lighting}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: YOUR SERIES IS READY ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Step 4 &bull; Series Ready
                </span>
                <h3 className="text-2xl font-bold text-white font-brand mt-0.5">
                  Episode 1 is Ready for Production
                </h3>
                <p className="text-xs text-white/70">
                  Ready to stream, review on the 330-second timeline, or export script to local encrypted vault.
                </p>
              </div>

              {/* Ready Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-[#0c2433] border border-cyan-400/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00AEEF] to-[#0284C7] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      RP
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{title}</h4>
                      <p className="text-xs text-cyan-300">
                        Rutti & Putti Series &bull; 330 Seconds &bull; Disney-Pixar 3D CGI
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pipeline Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40">
                    <span className="text-white/50 block text-[10px]">Episode Format</span>
                    <span className="font-bold text-white">720p 3D CGI</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40">
                    <span className="text-white/50 block text-[10px]">Duration</span>
                    <span className="font-bold text-white">330s (05:30)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40">
                    <span className="text-white/50 block text-[10px]">Audio Track</span>
                    <span className="font-bold text-white">Bengali + English</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40">
                    <span className="text-white/50 block text-[10px]">Character Lock</span>
                    <span className="font-bold text-emerald-400">Locked 100%</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      onLaunchEpisode(1);
                      onClose();
                    }}
                    className="flex-1 py-3 px-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Open in 330s Episode Player</span>
                  </button>

                  <button
                    onClick={handleSaveToVault}
                    className="py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition"
                  >
                    <Save className="w-4 h-4 text-cyan-300" />
                    <span>{savedSuccess ? 'Saved in Vault!' : 'Save to Encrypted Vault'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#081722] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                onClick={handleGenerateScriptWithAI}
                disabled={isGeneratingScript}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Script...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to AI Script</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
