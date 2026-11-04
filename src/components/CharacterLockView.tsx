import React, { useState } from 'react';
import { ShieldCheck, Lock, Copy, Check, Sparkles, Heart, Info, Eye, Layers } from 'lucide-react';
import { PUCHU_MASTER_ANALYSIS, PUKU_MASTER_ANALYSIS } from '../utils/referencePrompts';

export const CharacterLockView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const masterLockPrompt = `[STRICT CHARACTER LOCK - PUCHU & PUKU SERIES]
- PUCHU: Toddler baby girl, curly brown pigtails, emerald green satin hair ribbons, rosy chubby cheeks, delicate freckles across the small nose bridge, large expressive warm brown eyes with bright specular Pixar reflections, light mint green A-line dress with rounded Peter Pan white cotton collar, chibi-stylized proportions. Face, hair, and clothing must remain 100% identical in every shot and across all 105 episodes.
- PUKU: Smiling round white glazed ceramic mug companion, animated oval black eyes, curved cheerful mouth, smooth white ceramic handle on right side, internal glowing heart emblem that pulses warm golden-pink when learning.
- SETTING: Sunny garden courtyard in a rural Bangladeshi village, rustic wooden table draped with orange-and-white checkered picnic tablecloth, woven wicker basket, terracotta pots with yellow marigolds and white jasmine blossoms. Pixar 3D CGI aesthetic, warm cinematic lighting, soft depth of field.`;

  return (
    <div className="space-y-6">
      {/* Top Directive Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Master Character Lock & Reference Anchor
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold border border-emerald-400/40">
            MANDATORY: IMMUTABLE ACROSS ALL 105 EPISODES
          </span>
        </div>
        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Puchu's face, eye shape and colour, nose, freckles, hair style and colour, ribbons, outfit, and body proportions must stay identical in every episode, from the first frame to the last. Puku's round ceramic mug shape, smiling mouth, and glowing heart never change. Never redesign, age, or restyle either character.
        </p>
      </div>

      {/* Definitive Reference Image & Live Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Uploaded Reference Image Anchor */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm text-stone-900">
                Visual Identity Anchor (Official Asset)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              720p 3D CGI
            </span>
          </div>

          {/* Embedded Image */}
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-inner">
            <img
              src="/public/assets/aistudio/WhatsApp_Image_2026-10-30_at_5.18.47_AM_416333e4.jpeg"
              alt="Puchu and Puku Master Character Reference"
              className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-300"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white p-2 rounded-lg text-[11px] flex items-center justify-between">
              <span>Puchu pouring tea for Puku</span>
              <span className="text-amber-300 font-mono">Reference Anchor #01</span>
            </div>
          </div>

          {/* Key Locked Traits Checklist */}
          <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Face:</strong> Toddler chubby rosy cheeks, cute freckles across nose bridge</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Hair:</strong> Curly brown pigtails with emerald green satin ribbons</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Eyes:</strong> Large expressive warm chocolate brown Pixar eyes</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Wardrobe:</strong> Light mint green dress with white Peter Pan collar</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Puku:</strong> Round white ceramic mug, smiling face, glowing heart</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Tablecloth:</strong> Signature orange-and-white checkered pattern</span>
            </div>
          </div>
        </div>

        {/* Right Column: Character Lock Specs & Copy-Ready Prompt */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Puchu Specification */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                <span className="text-xl">👧</span>
                <span>Puchu Specifications (Baby Girl)</span>
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold">
                Identity Locked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Eyes & Expressions:</span>
                <p className="text-stone-700">{PUCHU_MASTER_ANALYSIS.eyeColor}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Hair & Ribbons:</span>
                <p className="text-stone-700">{PUCHU_MASTER_ANALYSIS.hairStyleAndColor}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Outfit & Footwear:</span>
                <p className="text-stone-700">{PUCHU_MASTER_ANALYSIS.fullOutfitAndFootwear}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Proportions & Nose:</span>
                <p className="text-stone-700">{PUCHU_MASTER_ANALYSIS.proportionsAndFeatures}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Puku Specification */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
                <span className="text-xl">☕</span>
                <span>Puku Specifications (Ceramic Mug Companion)</span>
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-xs font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>Glowing Heart</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1.5">
              <p className="text-stone-800 leading-relaxed font-medium">
                {PUKU_MASTER_ANALYSIS.objectDescription}
              </p>
              <div className="flex items-center gap-2 text-stone-600 pt-1">
                <span className="font-semibold text-rose-950">Materials:</span>
                <span>{PUKU_MASTER_ANALYSIS.materialsAndColors}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Master Production Prompt Fragment */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Master Production Lock Prompt (Use in every AI generator)</span>
              </div>
              <button
                onClick={() => handleCopy(masterLockPrompt, 'master-lock')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition"
              >
                {copiedKey === 'master-lock' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'master-lock' ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
              </button>
            </div>

            <p className="font-mono text-xs text-stone-300 leading-relaxed bg-stone-800 p-3 rounded-xl border border-stone-700">
              {masterLockPrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
