import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Sparkles,
  Camera,
  Film,
  Download,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Check,
  Eye,
  Tv,
  Smartphone,
  Square,
  Layers,
  Music,
  Share2
} from 'lucide-react';
import {
  CGP_PRESETS,
  CGPPreset,
  getCGPCssFilter,
  generateDaVinciResolveCubeLUT,
  generateAgencyEDL
} from '../utils/cgpPresets';
import { cinematicAudio } from '../utils/cinematicAudioEngine';
import { Episode } from '../types/series';

interface CGPVideoEditSuiteProps {
  episode: Episode;
  onClose?: () => void;
}

export const CGPVideoEditSuite: React.FC<CGPVideoEditSuiteProps> = ({
  episode,
  onClose,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<CGPPreset>(CGP_PRESETS[0]);
  const [customWarmth, setCustomWarmth] = useState<number>(0);
  const [customExposure, setCustomExposure] = useState<number>(0);
  const [customGrain, setCustomGrain] = useState<number>(selectedPreset.colorGrade.filmGrain);
  const [customBloom, setCustomBloom] = useState<number>(selectedPreset.colorGrade.bloomGlow);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [activeKeyframe, setActiveKeyframe] = useState<'opening' | 'adventure' | 'lesson' | 'closing'>('adventure');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  const activeCssFilter = getCGPCssFilter(selectedPreset, customWarmth, customExposure);

  const keyframeImage =
    activeKeyframe === 'opening'
      ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80'
      : activeKeyframe === 'adventure'
      ? 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
      : activeKeyframe === 'lesson'
      ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80';

  const handleSelectPreset = (preset: CGPPreset) => {
    setSelectedPreset(preset);
    setCustomWarmth(0);
    setCustomExposure(0);
    setCustomGrain(preset.colorGrade.filmGrain);
    setCustomBloom(preset.colorGrade.bloomGlow);
    cinematicAudio.playPukuHeartChime();
  };

  const handleDownloadLUT = () => {
    const lutContent = generateDaVinciResolveCubeLUT(selectedPreset);
    const blob = new Blob([lutContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineNest_CGP_${selectedPreset.id}_DaVinci_Resolve.cube`;
    link.click();
    URL.revokeObjectURL(url);

    setExportedStatus('LUT (.cube) downloaded successfully!');
    setTimeout(() => setExportedStatus(null), 3500);
  };

  const handleDownloadEDL = () => {
    const edlContent = generateAgencyEDL(episode.id, episode.title, selectedPreset);
    const blob = new Blob([edlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineNest_Ep${String(episode.id).padStart(3, '0')}_Agency_Grade.edl`;
    link.click();
    URL.revokeObjectURL(url);

    setExportedStatus('Agency EDL script downloaded!');
    setTimeout(() => setExportedStatus(null), 3500);
  };

  const handlePlayBansuriPreview = () => {
    cinematicAudio.playBansuriFluteMelody();
    setIsAudioPlaying(true);
    setTimeout(() => setIsAudioPlaying(false), 3000);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    cinematicAudio.setMuted(newMuted);
  };

  return (
    <div className="bg-stone-950 text-white rounded-3xl border border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 shadow-md">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Post-Production Agency Suite
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                Disney/Pixar 3D Standard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              CGP Studio & Color Grading Console
            </h2>
            <p className="text-xs text-stone-400">
              Episode {episode.id}: "{episode.title}" · 35mm Anamorphic Color Timing & Audio Mastering
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadLUT}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            title="Export 3D LUT in .cube format for DaVinci Resolve & Premiere Pro"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .CUBE LUT</span>
          </button>
          <button
            onClick={handleDownloadEDL}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition flex items-center gap-1.5"
            title="Download Edit Decision List for NLE editors"
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export EDL</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {exportedStatus && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportedStatus}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Realtime Video Monitor (8 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-semibold text-stone-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Camera Monitor ({selectedPreset.cameraLens.lensModel})</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-300">{selectedPreset.cameraLens.apertureFStop}</span>
              <span>·</span>
              <span className="font-mono">{selectedPreset.cameraLens.bokehStyle}</span>
            </div>
          </div>

          {/* Aspect Ratio Sandbox Frame */}
          <div className="relative bg-stone-900 rounded-2xl border border-stone-800 p-2 overflow-hidden flex items-center justify-center min-h-[320px]">
            <div
              className={`relative overflow-hidden rounded-xl transition-all duration-300 shadow-2xl ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-video'
                  : aspectRatio === '9:16'
                  ? 'w-[220px] aspect-[9/16]'
                  : 'w-[280px] aspect-square'
              }`}
            >
              {/* Background Rendered Frame with live CGP CSS filter */}
              <img
                src={keyframeImage}
                alt={episode.title}
                className="w-full h-full object-cover transition-all duration-300"
                style={{ filter: activeCssFilter }}
              />

              {/* Film Grain Simulation Overlay */}
              {customGrain > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${customGrain / 180}) 1px, transparent 1px)`,
                    backgroundSize: '4px 4px',
                  }}
                />
              )}

              {/* Anamorphic Flare / Bloom simulation */}
              {customBloom > 20 && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent"
                  style={{ transform: 'skewX(-15deg)' }}
                />
              )}

              {/* Puku Glow indicator badge */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-amber-300 font-mono flex items-center gap-1.5 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Grade: {selectedPreset.name}</span>
              </div>

              {/* Resolution Tag */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-stone-300 font-mono border border-stone-700">
                {aspectRatio === '16:9' ? '1280x720 16:9' : aspectRatio === '9:16' ? '720x1280 9:16' : '1080x1080 1:1'}
              </div>
            </div>
          </div>

          {/* Keyframe Selector & Aspect Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 mr-1 text-[11px]">Keyframe:</span>
              {(['opening', 'adventure', 'lesson', 'closing'] as const).map((kf) => (
                <button
                  key={kf}
                  onClick={() => setActiveKeyframe(kf)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition text-xs font-semibold ${
                    activeKeyframe === kf
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {kf}
                </button>
              ))}
            </div>

            {/* Aspect Switcher */}
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  aspectRatio === '16:9' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'
                }`}
                title="16:9 Standard Cinema / YouTube Broadcast"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>16:9</span>
              </button>
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  aspectRatio === '9:16' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'
                }`}
                title="9:16 Vertical Video / YouTube Shorts / TikTok"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16</span>
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  aspectRatio === '1:1' ? 'bg-stone-800 text-amber-300 font-bold' : 'text-stone-400'
                }`}
                title="1:1 Square Feed"
              >
                <Square className="w-3.5 h-3.5" />
                <span>1:1</span>
              </button>
            </div>
          </div>

          {/* Audio Mastering & Folk Instrument Preview Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Studio Audio Mastering Profile</div>
                <div className="text-[11px] text-stone-400">{selectedPreset.audioMasterProfile.eqCurve}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayBansuriPreview}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition flex items-center gap-1"
                title="Synthesize authentic Bengali Bansuri bamboo flute phrase"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isAudioPlaying ? 'Playing Flute...' : 'Flute Preview'}</span>
              </button>

              <button
                onClick={() => cinematicAudio.playEktaraStrum()}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                title="Acoustic Dotara / Ektara string pluck"
              >
                Ektara
              </button>

              <button
                onClick={() => cinematicAudio.playPukuHeartChime()}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition"
                title="Puku Teapot Heart Glow Chime"
              >
                Puku Chime
              </button>

              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: CGP Presets & Fine Tuning Controls (4 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
              <span>Cinematography & LUT Presets</span>
              <span className="text-[10px] text-amber-400 font-mono">105-Episode Certified</span>
            </label>

            <div className="space-y-2">
              {CGP_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-serif">{preset.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-stone-800 text-stone-400 font-mono">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{preset.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Sliders */}
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Post-Production Fine Tuning
              </span>
              <button
                onClick={() => {
                  setCustomWarmth(0);
                  setCustomExposure(0);
                  setCustomGrain(selectedPreset.colorGrade.filmGrain);
                  setCustomBloom(selectedPreset.colorGrade.bloomGlow);
                }}
                className="text-[11px] text-stone-400 hover:text-white transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sliders</span>
              </button>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Color Warmth (Amber / Cool)</span>
                <span className="font-mono text-amber-300">{customWarmth > 0 ? `+${customWarmth}` : customWarmth}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={customWarmth}
                onChange={(e) => setCustomWarmth(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Exposure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Exposure (EV Compensation)</span>
                <span className="font-mono text-amber-300">{customExposure.toFixed(2)} EV</span>
              </div>
              <input
                type="range"
                min="-0.5"
                max="0.5"
                step="0.05"
                value={customExposure}
                onChange={(e) => setCustomExposure(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Film Grain Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Film Grain & Halation</span>
                <span className="font-mono text-amber-300">{customGrain}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={customGrain}
                onChange={(e) => setCustomGrain(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Anamorphic Bloom Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400">Anamorphic Bloom Glow</span>
                <span className="font-mono text-amber-300">{customBloom}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={customBloom}
                onChange={(e) => setCustomBloom(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
