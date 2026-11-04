import React, { useState } from 'react';
import { Layers, Copy, Check, Video, Camera, Sparkles, Sliders, Image, Box, RefreshCw } from 'lucide-react';
import {
  generateFullBodyCharacterSheetPrompt,
  generateMediumShotGridPrompt,
  generatePropReferenceSheetPrompt,
  generateCharacterScenePrompt,
  generateOmniVideoMotionPrompt,
  PUCHU_MASTER_ANALYSIS,
  PUKU_MASTER_ANALYSIS
} from '../utils/referencePrompts';

export const ReferenceGeneratorsView: React.FC = () => {
  const [activeGen, setActiveGen] = useState<'full-body' | 'medium-grid' | 'prop' | 'scene' | 'video-motion'>('full-body');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Scene generator options
  const [sceneAction, setSceneAction] = useState<string>('happily pouring tea into Puku from her shiny silver teapot');
  const [sceneEnv, setSceneEnv] = useState<string>('a sunlit garden courtyard in a rural Bangladeshi village');
  const [sceneInteraction, setSceneInteraction] = useState<string>('both small hands carefully balancing the teapot, eyes wide with delight');
  const [sceneEnvDetails, setSceneEnvDetails] = useState<string>('terracotta pots filled with golden marigolds, rustic wicker picnic basket, orange checkered tablecloth');

  // Video generator options
  const [camMove, setCamMove] = useState<string>('Slow Dolly-in');
  const [charAction, setCharAction] = useState<string>('Puchu blinks with curiosity, smiling as Puku rocks gently');
  const [envPhysics, setEnvPhysics] = useState<string>('Soft steam rising from mug, leaves swaying in breeze');

  // Prop generator options
  const [propDesc, setPropDesc] = useState<string>(PUKU_MASTER_ANALYSIS.objectDescription);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate prompts
  const fullBodyPrompt = generateFullBodyCharacterSheetPrompt();
  const mediumGridPrompt = generateMediumShotGridPrompt();
  const propPrompt = generatePropReferenceSheetPrompt(propDesc);
  const scenePrompt = generateCharacterScenePrompt({
    action: sceneAction,
    environment: sceneEnv,
    interaction: sceneInteraction,
    envDetails: sceneEnvDetails
  });
  const videoPrompt = generateOmniVideoMotionPrompt({
    cameraMovement: camMove,
    characterAction: charAction,
    environmentPhysics: envPhysics
  });

  return (
    <div className="space-y-6">
      {/* Title & Instructions Header */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              5x Production Reference Sheet & Video Generators
            </h2>
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-semibold border border-amber-300">
            Pixar 3D CGI & Omni 1.1 Flash Standards
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Official generators calibrated directly to the attached master reference image. Generates standard 4-view sheets, 4-panel grids, prop reference sheets, scene compositions, and cinematic Omni 1.1 Flash video kinematic prompts.
        </p>

        {/* 5 Tabs */}
        <div className="flex space-x-2 pt-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveGen('full-body')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeGen === 'full-body'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            1. Full-Body Sheet (4-View)
          </button>
          <button
            onClick={() => setActiveGen('medium-grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeGen === 'medium-grid'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            2. Medium-Shot Grid (4-Panel)
          </button>
          <button
            onClick={() => setActiveGen('prop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeGen === 'prop'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            3. Prop & Object Sheet (2-View)
          </button>
          <button
            onClick={() => setActiveGen('scene')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeGen === 'scene'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            4. Character Scene Generator
          </button>
          <button
            onClick={() => setActiveGen('video-motion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeGen === 'video-motion'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            5. Omni Video Motion (Kinematic)
          </button>
        </div>
      </div>

      {/* Generator Active Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls & Info */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900">
              {activeGen === 'full-body' && 'Instruction: Full-Body Character Sheet'}
              {activeGen === 'medium-grid' && 'Instruction: Medium-Shot Character Grid'}
              {activeGen === 'prop' && 'Instruction: Prop & Object Reference Sheet'}
              {activeGen === 'scene' && 'Instruction: Character Scene Generator'}
              {activeGen === 'video-motion' && 'Instruction: Scene to Video Motion Generator'}
            </h3>
          </div>

          {/* Reference Anchor reminder */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <img
              src="/public/assets/aistudio/WhatsApp_Image_2026-10-30_at_5.18.47_AM_416333e4.jpeg"
              alt="Reference Thumbnail"
              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-amber-300"
            />
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">Anchor Reference Active</span>
              <span className="text-stone-600">Preserving Puchu & Puku identity and materials</span>
            </div>
          </div>

          {/* Dynamic Configuration based on generator type */}
          {activeGen === 'full-body' && (
            <div className="space-y-3 text-xs text-stone-700">
              <p className="leading-relaxed">
                Generates a 4-view horizontal sheet on a plain neutral gray background: front, strict left profile (90°), back, and 3/4 view (45°).
              </p>
              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200">
                <div><strong>Pose:</strong> Natural A-pose, relaxed arms, open fingers</div>
                <div><strong>Hands:</strong> Completely empty, free of handheld items</div>
                <div><strong>Framing:</strong> Full body and footwear visible at uniform scale</div>
              </div>
            </div>
          )}

          {activeGen === 'medium-grid' && (
            <div className="space-y-3 text-xs text-stone-700">
              <p className="leading-relaxed">
                Generates a 4-panel medium-shot sheet laid out on a 16:9 canvas with 2x2 layout:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                <li>Top-Left: Front view</li>
                <li>Top-Right: Strict left profile (90°)</li>
                <li>Bottom-Left: 3/4 view (45°)</li>
                <li>Bottom-Right: Rear back-of-head view</li>
              </ul>
              <div className="p-2.5 bg-stone-50 rounded-lg text-[11px] text-stone-500">
                No typography, black dividers, panel borders, or frame lines.
              </div>
            </div>
          )}

          {activeGen === 'prop' && (
            <div className="space-y-3 text-xs">
              <label htmlFor="prop-desc-input" className="font-bold text-stone-900 block">Prop / Object Description:</label>
              <textarea
                id="prop-desc-input"
                rows={4}
                value={propDesc}
                onChange={(e) => setPropDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 font-sans"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setPropDesc(PUKU_MASTER_ANALYSIS.objectDescription)}
                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold"
                >
                  Reset to Puku Ceramic Mug
                </button>
                <button
                  onClick={() => setPropDesc("Antique brass tea kettle with etched floral motifs and curving pouring spout")}
                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold"
                >
                  Brass Tea Kettle
                </button>
              </div>
            </div>
          )}

          {activeGen === 'scene' && (
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="scene-action-input" className="font-bold text-stone-900 block mb-1">Character Action:</label>
                <input
                  id="scene-action-input"
                  type="text"
                  value={sceneAction}
                  onChange={(e) => setSceneAction(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label htmlFor="scene-env-input" className="font-bold text-stone-900 block mb-1">Environment / Setting:</label>
                <input
                  id="scene-env-input"
                  type="text"
                  value={sceneEnv}
                  onChange={(e) => setSceneEnv(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label htmlFor="scene-details-input" className="font-bold text-stone-900 block mb-1">Environmental Details:</label>
                <input
                  id="scene-details-input"
                  type="text"
                  value={sceneEnvDetails}
                  onChange={(e) => setSceneEnvDetails(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>
            </div>
          )}

          {activeGen === 'video-motion' && (
            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="cam-move-select" className="font-bold text-stone-900 block mb-1">Camera Movement:</label>
                <select
                  id="cam-move-select"
                  value={camMove}
                  onChange={(e) => setCamMove(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs bg-white"
                >
                  <option value="Slow Dolly-in">Slow Dolly-in</option>
                  <option value="Tracking shot">Tracking shot</option>
                  <option value="Low angle tilt">Low angle tilt</option>
                  <option value="Static locked-off">Static locked-off</option>
                  <option value="Smooth pan">Smooth pan</option>
                </select>
              </div>

              <div>
                <label htmlFor="char-action-input" className="font-bold text-stone-900 block mb-1">Subtle Micro-Action:</label>
                <input
                  id="char-action-input"
                  type="text"
                  value={charAction}
                  onChange={(e) => setCharAction(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label htmlFor="env-physics-input" className="font-bold text-stone-900 block mb-1">Environment Physics:</label>
                <input
                  id="env-physics-input"
                  type="text"
                  value={envPhysics}
                  onChange={(e) => setEnvPhysics(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                Rule: Kept strictly under 30 words for Omni 1.1 Flash kinematic fidelity.
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Exact Formatted Production Prompt */}
        <div className="lg:col-span-7 bg-stone-900 text-white p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-stone-100 font-serif">
                Exact Production Prompt (Ready to Execute)
              </h4>
            </div>

            {/* Copy button */}
            <button
              onClick={() => {
                let targetText = '';
                if (activeGen === 'full-body') targetText = fullBodyPrompt;
                else if (activeGen === 'medium-grid') targetText = mediumGridPrompt;
                else if (activeGen === 'prop') targetText = propPrompt;
                else if (activeGen === 'scene') targetText = scenePrompt;
                else if (activeGen === 'video-motion') targetText = videoPrompt;
                handleCopy(targetText, activeGen);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition"
            >
              {copiedKey === activeGen ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeGen ? 'Copied Prompt' : 'Copy Prompt'}</span>
            </button>
          </div>

          {/* Prompt Box */}
          <div className="p-4 rounded-xl bg-stone-950 font-mono text-xs leading-relaxed text-stone-200 border border-stone-800 max-h-[460px] overflow-y-auto whitespace-pre-wrap select-all">
            {activeGen === 'full-body' && fullBodyPrompt}
            {activeGen === 'medium-grid' && mediumGridPrompt}
            {activeGen === 'prop' && propPrompt}
            {activeGen === 'scene' && scenePrompt}
            {activeGen === 'video-motion' && videoPrompt}
          </div>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-800">
            <span>Aspect Ratio: {activeGen === 'medium-grid' || activeGen === 'video-motion' ? '16:9' : 'Variable'}</span>
            <span>Identity Preservation: Strict Character Lock Active</span>
            <span>Style: 720p 3D CGI Pixar Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};
