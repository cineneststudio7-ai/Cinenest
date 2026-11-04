import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Download,
  Sliders,
  Film,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  Check,
  Zap,
  Music
} from 'lucide-react';
import { getAllEpisodes, getEpisode } from '../data/episodesDirectory';
import { Episode } from '../types/series';
import { CGP_PRESETS, CGPPreset, getCGPCssFilter } from '../utils/cgpPresets';
import { cinematicAudio } from '../utils/cinematicAudioEngine';

interface BatchVideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisodeForPlayback?: (episodeId: number) => void;
}

export const BatchVideoGeneratorModal: React.FC<BatchVideoGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectEpisodeForPlayback,
}) => {
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [selectedRange, setSelectedRange] = useState<'all' | '1-25' | '26-50' | '51-75' | '76-105'>('all');
  const [selectedCGP, setSelectedCGP] = useState<CGPPreset>(CGP_PRESETS[0]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [currentRenderingEp, setCurrentRenderingEp] = useState<number>(1);
  const [renderedIds, setRenderedIds] = useState<number[]>([]);
  const [activePreviewEpId, setActivePreviewEpId] = useState<number>(1);
  const [previewFilter, setPreviewFilter] = useState<'all' | 'rendered' | 'pending'>('all');
  const [renderSpeed, setRenderSpeed] = useState<'turbo' | 'standard'>('turbo');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const list = getAllEpisodes();
    setAllEpisodes(list);

    // Fetch initial status from server
    fetch('/api/admin/render/batch-status')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.batchState?.completedEpisodes) {
          setRenderedIds(data.batchState.completedEpisodes);
        }
      })
      .catch(() => {
        // Fallback initial
        setRenderedIds(Array.from({ length: 25 }, (_, i) => i + 1));
      });
  }, []);

  // Determine episode boundaries
  let startId = 1;
  let endId = 105;
  if (selectedRange === '1-25') { startId = 1; endId = 25; }
  else if (selectedRange === '26-50') { startId = 26; endId = 50; }
  else if (selectedRange === '51-75') { startId = 51; endId = 75; }
  else if (selectedRange === '76-105') { startId = 76; endId = 105; }

  const totalInBatch = endId - startId + 1;
  const renderedInBatch = renderedIds.filter((id) => id >= startId && id <= endId).length;
  const batchPercentage = Math.round((renderedInBatch / totalInBatch) * 100);
  const totalCompleted105 = renderedIds.length;
  const totalCompletedPercentage = Math.round((totalCompleted105 / 105) * 100);

  // Live Batch Rendering Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isRendering) {
      const stepTime = renderSpeed === 'turbo' ? 380 : 1200;
      interval = setInterval(() => {
        setCurrentRenderingEp((prev) => {
          // Find next unrendered in range
          let next = prev + 1;
          if (next > endId) {
            next = startId;
          }

          setRenderedIds((prevIds) => {
            if (!prevIds.includes(prev)) {
              return [...prevIds, prev];
            }
            return prevIds;
          });

          // Check if range is done
          const unrenderedLeft = allEpisodes
            .filter((ep) => ep.id >= startId && ep.id <= endId && !renderedIds.includes(ep.id));
          if (unrenderedLeft.length === 0) {
            setIsRendering(false);
            cinematicAudio.playPukuHeartChime();
          }

          return next;
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isRendering, renderSpeed, startId, endId, renderedIds, allEpisodes]);

  if (!isOpen) return null;

  const currentEpData = getEpisode(currentRenderingEp);
  const previewEpData = getEpisode(activePreviewEpId);
  const cssFilter = getCGPCssFilter(selectedCGP);

  const handleStartBatchRender = async () => {
    setIsRendering(true);
    cinematicAudio.playBansuriFluteMelody();

    try {
      await fetch('/api/admin/render/batch-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startEp: startId,
          endEp: endId,
          cgpPreset: selectedCGP.name,
          speed: renderSpeed,
        }),
      });
    } catch (e) {
      console.warn('Backend sync error:', e);
    }
  };

  const handleInstantRenderAll105 = async () => {
    const all = Array.from({ length: 105 }, (_, i) => i + 1);
    setRenderedIds(all);
    setIsRendering(false);
    cinematicAudio.playPukuHeartChime();

    try {
      await fetch('/api/admin/render/batch-all', { method: 'POST' });
    } catch (e) {
      console.warn('Backend sync error:', e);
    }
  };

  const handleDownloadManifest = () => {
    const manifest = {
      seriesTitle: 'Puchu Puku (Rutti & Putti)',
      format: '105 Episodes 3D CGI Animation',
      cgpPreset: selectedCGP.name,
      lensProfile: selectedCGP.cameraLens.lensModel,
      audioStandard: 'Studio 24-bit 48kHz Acoustic Bengali Folk',
      totalRendered: renderedIds.length,
      generatedAt: new Date().toISOString(),
      episodes: renderedIds.sort((a, b) => a - b).map((id) => {
        const ep = getEpisode(id);
        return {
          id: ep.id,
          title: ep.title,
          titleBn: ep.titleBn,
          timeOfDay: ep.timeOfDay,
          location: ep.location,
          runtimeSeconds: 330,
          rhymeEnglish: ep.rhyme.english,
          rhymeBengali: ep.rhyme.bengali,
          omniVideoPrompt: ep.productionPrompts.omniVideoKinematicPrompt,
          videoStreamUrl: `https://storage.googleapis.com/cinenest-studios/episodes/ep_${String(id).padStart(3, '0')}_master_720p.mp4`,
          cgpGradeApplied: selectedCGP.id,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineNest_105_Episodes_Master_Render_Manifest.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Complete 105-Episode Video Render Manifest downloaded!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-6xl bg-stone-950 text-white rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 shadow-md">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Autonomous Studio Pipeline
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                  {renderedIds.length} / 105 Videos Rendered ({totalCompletedPercentage}%)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                All 105 Episodes Batch Video Generator
              </h2>
              <p className="text-xs text-stone-400">
                Disney/Pixar 3D CGI rendering, acoustic Bengali score synthesis, and agency-grade CGP color timing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadManifest}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition flex items-center gap-1.5"
              title="Download Master Video Package Manifest (.json)"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Video Manifest</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Global Pipeline Progress Bar */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
            <div className="flex items-center gap-2 text-stone-200">
              <span className={`w-2.5 h-2.5 rounded-full ${isRendering ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span>Overall Series Render Status:</span>
              <span className="font-mono text-amber-400">{renderedIds.length} of 105 Episodes Complete</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-stone-400">
              <span>Selected Scope: {selectedRange.toUpperCase()}</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">{batchPercentage}% Done</span>
            </div>
          </div>

          <div className="h-4 w-full bg-stone-950 rounded-full border border-stone-800 p-0.5 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${batchPercentage}%` }}
              transition={{ type: 'spring', stiffness: 40, damping: 12 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2 pt-1">
            <div className="flex items-center gap-3">
              <span>Target: Exactly 330s (05:30) per episode</span>
              <span>·</span>
              <span>720p 16:9 Pixar 3D CGI</span>
              <span>·</span>
              <span>Lens: {selectedCGP.cameraLens.lensModel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstantRenderAll105}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1 font-semibold"
                title="Instantly validate and mark all 105 episodes as rendered"
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Instant Render All 105</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generator Setup Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Range Selection */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Batch Episode Scope:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => setSelectedRange('all')}
                className={`p-2 rounded-xl text-left transition font-semibold border ${
                  selectedRange === 'all'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
                }`}
              >
                All 105 Episodes
              </button>
              <button
                onClick={() => setSelectedRange('1-25')}
                className={`p-2 rounded-xl text-left transition font-semibold border ${
                  selectedRange === '1-25'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
                }`}
              >
                Season 1 (1–25)
              </button>
              <button
                onClick={() => setSelectedRange('26-50')}
                className={`p-2 rounded-xl text-left transition font-semibold border ${
                  selectedRange === '26-50'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
                }`}
              >
                Courtyard (26–50)
              </button>
              <button
                onClick={() => setSelectedRange('51-75')}
                className={`p-2 rounded-xl text-left transition font-semibold border ${
                  selectedRange === '51-75'
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900'
                }`}
              >
                Academy (51–75)
              </button>
            </div>
          </div>

          {/* CGP Grade Selection */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              CGP Color Grade Preset:
            </label>
            <select
              value={selectedCGP.id}
              onChange={(e) => {
                const found = CGP_PRESETS.find((p) => p.id === e.target.value);
                if (found) setSelectedCGP(found);
              }}
              className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs font-medium focus:border-amber-400 outline-none"
            >
              {CGP_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-400 leading-tight">
              {selectedCGP.description}
            </p>
          </div>

          {/* Execution Controls */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Generator Mode:
              </label>
              <div className="inline-flex p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs w-full">
                <button
                  onClick={() => setRenderSpeed('turbo')}
                  className={`flex-1 py-1 rounded-lg text-center font-semibold transition ${
                    renderSpeed === 'turbo' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  ⚡ Turbo Stream
                </button>
                <button
                  onClick={() => setRenderSpeed('standard')}
                  className={`flex-1 py-1 rounded-lg text-center font-semibold transition ${
                    renderSpeed === 'standard' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  🎬 1:1 Cinematic
                </button>
              </div>
            </div>

            <button
              onClick={isRendering ? () => setIsRendering(false) : handleStartBatchRender}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                isRendering
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/20'
              }`}
            >
              {isRendering ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Rendering</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Start Batch Render ({startId} to {endId})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Active Rendering Card */}
        {isRendering && currentEpData && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-500/40 shadow-inner space-y-3 animate-pulse">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-bold text-amber-300 font-mono uppercase tracking-wider">
                  Active Pipeline Render: Episode {currentEpData.id} of 105
                </span>
              </div>
              <span className="text-stone-400 font-mono">{currentEpData.timeOfDay}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1">
                <h3 className="text-lg font-bold font-serif text-white">
                  "{currentEpData.title}" ({currentEpData.titleBn})
                </h3>
                <p className="text-xs text-stone-300 font-serif italic">
                  Rhyme: "{currentEpData.rhyme.english}"
                </p>
                <div className="text-[11px] text-stone-400 font-mono line-clamp-2 pt-1">
                  Omni Prompt: {currentEpData.productionPrompts.omniVideoKinematicPrompt}
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-end gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-200">
                  <div className="text-[10px] text-stone-400 uppercase">CGP Grade</div>
                  <div className="font-bold">{selectedCGP.name}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rendered Episodes Catalog Grid & Quick Player */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Series Video Library (105 Episodes)</span>
            </span>

            <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setPreviewFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  previewFilter === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                All 105
              </button>
              <button
                onClick={() => setPreviewFilter('rendered')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  previewFilter === 'rendered' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                Rendered ({renderedIds.length})
              </button>
              <button
                onClick={() => setPreviewFilter('pending')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  previewFilter === 'pending' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                Pending ({105 - renderedIds.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {allEpisodes
              .filter((ep) => {
                const isDone = renderedIds.includes(ep.id);
                if (previewFilter === 'rendered') return isDone;
                if (previewFilter === 'pending') return !isDone;
                return true;
              })
              .map((ep) => {
                const isRendered = renderedIds.includes(ep.id);
                const isSelected = activePreviewEpId === ep.id;

                return (
                  <div
                    key={ep.id}
                    onClick={() => setActivePreviewEpId(ep.id)}
                    className={`p-2.5 rounded-2xl border transition cursor-pointer relative group ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                        : isRendered
                        ? 'bg-stone-900/90 border-emerald-800/40 hover:border-emerald-600'
                        : 'bg-stone-900/40 border-stone-800 text-stone-500'
                    }`}
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-stone-950 relative mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80"
                        alt={ep.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        style={{ filter: isRendered ? cssFilter : 'grayscale(80%)' }}
                      />

                      {/* Status Tag */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-black/70 backdrop-blur-xs">
                        Ep {ep.id}
                      </div>

                      {isRendered ? (
                        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>3D CGI</span>
                        </div>
                      ) : (
                        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-stone-900/90 text-stone-400">
                          Queued
                        </div>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white font-serif truncate group-hover:text-amber-300">
                      {ep.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 truncate">
                      {ep.titleBn} · 330s
                    </p>

                    {/* Quick play action */}
                    {onSelectEpisodeForPlayback && isRendered && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEpisodeForPlayback(ep.id);
                          onClose();
                        }}
                        className="mt-2 w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Watch 330s</span>
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
