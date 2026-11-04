import React, { useState } from 'react';
import { Download, CheckCircle2, FileText, Sparkles, Clock, Film } from 'lucide-react';
import { getAllEpisodes, getEpisode } from '../data/episodesDirectory';
import { exportEpisodeToPlainText, TOTAL_EPISODE_SECONDS } from '../utils/episodeCalculator';

export const BatchExportModal: React.FC = () => {
  const [startEp, setStartEp] = useState<number>(1);
  const [endEp, setEndEp] = useState<number>(105);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  const totalEpisodesCount = Math.max(1, endEp - startEp + 1);
  const totalSeconds = totalEpisodesCount * TOTAL_EPISODE_SECONDS;
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const handleBatchDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      let combinedText = `======================================================================
PUCHU PUKU 3D CGI ANIMATION SERIES - MASTER PRODUCTION PACKAGE
EPISODES ${startEp} THROUGH ${endEp} (TOTAL ${totalEpisodesCount} EPISODES)
FORMAT: 720p 16:9 3D CGI | PIXAR-GRADE ARTISTIC DIRECTION
TOTAL RUNTIME: ${totalSeconds} SECONDS (~${totalHours} HOURS)
EACH EPISODE EXACTLY 330 SECONDS (05:30)
======================================================================

SERIES BIBLE MASTER CHARACTERS:
- PUCHU: Toddler baby girl, curly brown pigtails, emerald green satin ribbons, rosy chubby cheeks, delicate freckles across nose bridge, large warm brown eyes, light mint green dress with white Peter Pan collar.
- PUKU: Smiling round white ceramic mug companion with expressive black eyes, white curved handle, and internal glowing heart that illuminates in warm golden-pink when learning.
- COURTYARD SIGNATURE: Sunny garden courtyard in a rural Bangladeshi village, checkered picnic tablecloth, terracotta pots with marigold and jasmine, wicker basket.

======================================================================\n\n`;

      for (let i = startEp; i <= endEp; i++) {
        const ep = getEpisode(i);
        combinedText += exportEpisodeToPlainText(ep);
        combinedText += '\n\n' + '='.repeat(70) + '\n\n';
      }

      const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Puchu_Puku_Episodes_${startEp}_to_${endEp}_Master_Bible.txt`;
      link.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 4000);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              Batch Production Export (1 to 105 Episodes)
            </h2>
            <p className="text-xs text-stone-600">
              Export clean text files for animators, storyboard artists, and voiceover actors
            </p>
          </div>
        </div>

        {/* Quick Range Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
            Quick Preset Selection:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setStartEp(1);
                setEndEp(105);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                startEp === 1 && endEp === 105
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              All 105 Episodes (Complete Series)
            </button>
            <button
              onClick={() => {
                setStartEp(1);
                setEndEp(10);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                startEp === 1 && endEp === 10
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Episodes 1 - 10 (Curated Launch)
            </button>
            <button
              onClick={() => {
                setStartEp(1);
                setEndEp(25);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                startEp === 1 && endEp === 25
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Episodes 1 - 25 (Season 1)
            </button>
          </div>
        </div>

        {/* Granular Range Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label htmlFor="start-ep-input" className="font-bold text-stone-800 block mb-1">Start Episode (1-105):</label>
            <input
              id="start-ep-input"
              type="number"
              min="1"
              max="105"
              value={startEp}
              onChange={(e) => setStartEp(Math.max(1, Math.min(105, parseInt(e.target.value, 10) || 1)))}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-center"
            />
          </div>
          <div>
            <label htmlFor="end-ep-input" className="font-bold text-stone-800 block mb-1">End Episode (1-105):</label>
            <input
              id="end-ep-input"
              type="number"
              min={startEp}
              max="105"
              value={endEp}
              onChange={(e) => setEndEp(Math.max(startEp, Math.min(105, parseInt(e.target.value, 10) || startEp)))}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-center"
            />
          </div>
        </div>

        {/* Export Stats Summary Card */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="text-stone-500 block">Total Episodes:</span>
              <span className="font-bold text-stone-900 text-sm">{totalEpisodesCount} Episodes</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <div>
              <span className="text-stone-500 block">Total Animation Time:</span>
              <span className="font-bold text-stone-900 text-sm">{totalHours} Hours ({totalSeconds}s)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <div>
              <span className="text-stone-500 block">Structure & Prompts:</span>
              <span className="font-bold text-stone-900 text-sm">330s / Episode Locked</span>
            </div>
          </div>
        </div>

        {/* Download Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handleBatchDownload}
            disabled={isExporting}
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting
                ? 'Compiling Production Package...'
                : `Download Episodes ${startEp} - ${endEp} Production Text File`}
            </span>
          </button>
        </div>

        {exportComplete && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Master text file downloaded successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
