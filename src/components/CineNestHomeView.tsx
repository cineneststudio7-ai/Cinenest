import React, { useState } from 'react';
import { CineNestLogo } from './CineNestLogo';
import {
  Sparkles,
  Box,
  Play,
  Smile,
  ArrowRight,
  Lightbulb,
  Bot,
  Clapperboard,
  Tv,
  GraduationCap,
  Users,
  Globe,
  Heart,
  Volume2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CineNestHomeViewProps {
  onStartStory: () => void;
  onExploreSeries: () => void;
  onOpenStep: (stepNumber: number) => void;
  onOpenSchools: () => void;
  onOpenPricing: () => void;
  onOpenLogin: () => void;
}

export const CineNestHomeView: React.FC<CineNestHomeViewProps> = ({
  onStartStory,
  onExploreSeries,
  onOpenStep,
  onOpenSchools,
  onOpenPricing,
  onOpenLogin,
}) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  const referenceImageSrc = '/assets/aistudio/CineNest__Where_Imagination_Becomes_Animation__1__f03395a0.png';

  const steps = [
    {
      num: 1,
      title: 'Create Your Idea',
      desc: 'Share your story idea, theme or character concept.',
      icon: (
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-amber-500 shadow-inner">
          <Lightbulb className="w-7 h-7 fill-amber-400 text-amber-500" />
        </div>
      ),
    },
    {
      num: 2,
      title: 'AI Builds the Story',
      desc: 'Our AI creates a full script, characters and episodes.',
      icon: (
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-cyan-500 shadow-inner">
          <Bot className="w-7 h-7 text-cyan-600" />
        </div>
      ),
    },
    {
      num: 3,
      title: '3D Animation Production',
      desc: 'Generate stunning 3D visuals in Disney-Pixar style.',
      icon: (
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-indigo-500 shadow-inner">
          <Clapperboard className="w-7 h-7 text-indigo-600" />
        </div>
      ),
    },
    {
      num: 4,
      title: 'Your Series is Ready',
      desc: 'Get full episodes, ready to watch, share and publish.',
      icon: (
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
          <Play className="w-6 h-6 fill-white" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full text-slate-900 bg-white">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Disney-Pixar Meadow, Characters & Dream */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1f2e] via-[#103042] to-[#1a445a] text-white">
        {/* Ambient background lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.25),transparent_50%)] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Overline Tag */}
              <div className="inline-flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold tracking-widest text-white uppercase drop-shadow-sm">
                  AI <span className="text-[#38BDF8]">POWERED 3D</span> STORYTELLING
                </span>
              </div>

              {/* Main Headline (Exact Typography from Image) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] font-brand">
                <span className="block text-white drop-shadow-md">Where Imagination</span>
                <span className="block">
                  <span className="text-[#FDE047] drop-shadow-md">Becomes </span>
                  <span className="text-[#38BDF8] drop-shadow-md">Animation</span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-xl">
                CineNest Studio is an autonomous 3D cartoon series maker for kids. We turn great ideas into magical stories — with AI, creativity and heart.
              </p>

              {/* 4 Feature Badges in 2x2 Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white/95">
                  <span className="text-[#FBBF24] text-lg">⭐</span>
                  <span>AI Generated Storylines</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white/95">
                  <span className="text-[#F59E0B] text-lg">📦</span>
                  <span>3D Animation (Disney-Pixar Style)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white/95">
                  <span className="text-[#EF4444] text-lg">▶️</span>
                  <span>Full Series & Episodes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white/95">
                  <span className="text-[#FBBF24] text-lg">😊</span>
                  <span>Safe, Educational & Fun</span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartStory}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#00AEEF] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0EA5E9] shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/50 transform active:scale-95 transition-all"
                >
                  <span>Start Your Story</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExploreSeries}
                  className="px-6 py-4 rounded-full text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-sm"
                >
                  Watch Rutti & Putti
                </button>
              </div>
            </div>

            {/* Right Visual Column (Reference Art with Rutti, Putti, Robot & Mascot) */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group aspect-[16/11]">
                <div
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${referenceImageSrc}")`,
                    backgroundSize: '215% auto',
                    backgroundPosition: '98% 13%',
                    backgroundRepeat: 'no-repeat',
                  }}
                  role="img"
                  aria-label="Rutti, Putti, Blue Robot and Mascot in Disney-Pixar meadow with fairytale castle"
                />

                {/* Floating Pill Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#091e2b]/85 backdrop-blur-md border border-cyan-400/30 flex items-center justify-between text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center font-bold text-white text-base shadow-sm">
                      RP
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-wide">Rutti & Putti</div>
                      <div className="text-[11px] text-cyan-300">Sisters, Friends, Forever · 100+ Episodes</div>
                    </div>
                  </div>
                  <button
                    onClick={onExploreSeries}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. HOW IT WORKS: 4 Sequential Steps & Multi-device Preview */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#00AEEF]">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-1 font-brand">
              From Idea to Episode — Automatically
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              CineNest Studio uses advanced AI to create complete 3D cartoon series with characters, stories, voice and animation — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* 4 Connected Step Cards (Left) */}
            <div className="lg:col-span-6 space-y-4">
              {steps.map((s) => (
                <div
                  key={s.num}
                  onClick={() => {
                    setActiveStepTab(s.num);
                    onOpenStep(s.num);
                  }}
                  className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    activeStepTab === s.num
                      ? 'bg-white border-cyan-500 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {s.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 text-cyan-600 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={onStartStory}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>Launch 4-Step Creation Pipeline</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Multi-Device Display Showcase (Right) */}
            <div className="lg:col-span-6 relative">
              {/* TV Screen Container */}
              <div className="relative mx-auto rounded-3xl bg-slate-900 p-3 sm:p-4 shadow-2xl border-4 border-slate-800">
                {/* TV Display Area */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center group">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("${referenceImageSrc}")`,
                      backgroundSize: '200% auto',
                      backgroundPosition: '97% 62%',
                      backgroundRepeat: 'no-repeat',
                    }}
                    role="img"
                    aria-label="Rutti & Putti TV series banner"
                  />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                    className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition"
                    aria-label="Play series episode preview"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition duration-300">
                      <Play className="w-8 h-8 fill-slate-900 ml-1 text-slate-900" />
                    </div>
                  </button>

                  {/* TV Corner Badges */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>3D 720p CGI</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs drop-shadow-md">
                    <span className="font-bold">Episode 1: Sisters, Friends, Forever</span>
                    <span className="font-mono text-[11px] text-white/80">05:30 / 330s</span>
                  </div>
                </div>

                {/* TV Stand / Foot */}
                <div className="w-32 h-2.5 bg-slate-700 rounded-b-xl mx-auto mt-2" />
                <div className="w-48 h-1.5 bg-slate-600 rounded-full mx-auto" />

                {/* Floating Tablet Preview (bottom right) */}
                <div className="absolute -bottom-6 -right-3 sm:-right-6 w-36 sm:w-48 rounded-xl bg-slate-900 p-1.5 shadow-2xl border-2 border-slate-700 hidden sm:block transform hover:-translate-y-1 transition duration-300">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 relative">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url("${referenceImageSrc}")`,
                        backgroundSize: '260% auto',
                        backgroundPosition: '92% 63%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Mobile Preview (far right) */}
                <div className="absolute -bottom-8 -right-8 w-20 sm:w-28 rounded-xl bg-slate-900 p-1 shadow-2xl border border-slate-700 hidden md:block transform hover:-translate-y-1 transition duration-300">
                  <div className="aspect-[9/16] rounded-lg overflow-hidden bg-slate-950 relative">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url("${referenceImageSrc}")`,
                        backgroundSize: '340% auto',
                        backgroundPosition: '98% 64%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CORE MISSION & 4 DARK PILLARS: Create • Educate • Inspire */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-[#091b26] to-[#06141c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Mission Column */}
            <div className="lg:col-span-5 space-y-4">
              <CineNestLogo size="lg" />

              <div className="text-amber-400 font-brand font-bold text-sm sm:text-base tracking-wide">
                Create &bull; Educate &bull; Inspire
              </div>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
                CineNest Studio is more than a platform. It's a future where every child has a story, and every story can come to life.
              </p>

              <div className="pt-2">
                <button
                  onClick={onStartStory}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00AEEF] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0EA5E9] shadow-lg shadow-cyan-500/30 transition transform active:scale-95"
                >
                  <span>Join CineNest Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right 4 Dark Pillar Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pillar 1: Educational */}
              <div className="p-5 rounded-2xl bg-[#0e2736]/90 border border-white/10 hover:border-cyan-400/40 transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-800/40">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Educational</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Builds language, creativity and critical thinking skills.
                </p>
              </div>

              {/* Pillar 2: Family Friendly */}
              <div className="p-5 rounded-2xl bg-[#0e2736]/90 border border-white/10 hover:border-cyan-400/40 transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-800/40">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Family Friendly</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Safe, positive and age-appropriate content.
                </p>
              </div>

              {/* Pillar 3: Global Vision */}
              <div className="p-5 rounded-2xl bg-[#0e2736]/90 border border-white/10 hover:border-cyan-400/40 transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-800/40">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Global Vision</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  From Bangladesh to the world — for every child.
                </p>
              </div>

              {/* Pillar 4: Made with Love */}
              <div className="p-5 rounded-2xl bg-[#0e2736]/90 border border-white/10 hover:border-rose-400/40 transition duration-300">
                <div className="w-10 h-10 rounded-xl bg-rose-950 flex items-center justify-center text-rose-400 mb-3 border border-rose-800/40">
                  <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                </div>
                <h4 className="text-base font-bold text-white">Made with Love</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Because every child deserves a story that matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. BOTTOM STATS & HANDWRITTEN SIGNOFF */}
      {/* ======================================================== */}
      <footer className="bg-[#051119] text-white border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div>
              <CineNestLogo size="md" />
            </div>

            {/* 3 Stats */}
            <div className="flex items-center gap-6 sm:gap-10 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-brand">100+</div>
                <div className="text-[11px] text-white/60 tracking-wide uppercase">Episodes Planned</div>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-brand">3D</div>
                <div className="text-[11px] text-white/60 tracking-wide uppercase">Disney-Pixar Style</div>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-brand">1</div>
                <div className="text-[11px] text-white/60 tracking-wide uppercase">Big Dream</div>
              </div>
            </div>

            {/* Handwritten Signature Script */}
            <div className="text-center md:text-right">
              <span className="font-script text-2xl sm:text-3xl text-[#FDE047] font-bold tracking-wide">
                Small minds. Big dreams. 💛
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-white/40 gap-2">
            <div>
              &copy; {new Date().getFullYear()} CineNest Studio Inc. Autonomous 3D Cartoon Series Maker.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onOpenSchools} className="hover:text-white transition">Schools & Educators</button>
              <button onClick={onOpenPricing} className="hover:text-white transition">Pricing</button>
              <button onClick={onOpenLogin} className="hover:text-white transition">Creator Portal</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
