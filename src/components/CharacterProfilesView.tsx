import React, { useState } from 'react';
import { ShieldCheck, Heart, Volume2, Sparkles, Check, ArrowRight, Star } from 'lucide-react';
import {
  PUCHU_PROFILE,
  PUKU_PROFILE,
  RUTTI_PROFILE,
  PUTTI_PROFILE,
  ROBOC_PROFILE,
} from '../data/universeData';
import { CharacterProfile } from '../types/series';

interface CharacterProfilesViewProps {
  onSelectEpisode: (id: number) => void;
  initialCharacter?: 'rutti' | 'putti' | 'roboc' | 'puchu' | 'puku';
}

export const CharacterProfilesView: React.FC<CharacterProfilesViewProps> = ({
  onSelectEpisode,
  initialCharacter = 'rutti',
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(initialCharacter);
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);

  const characterMap: Record<string, { profile: CharacterProfile; imageSrc: string; color: string }> = {
    rutti: {
      profile: RUTTI_PROFILE,
      imageSrc: '/assets/aistudio/CineNest__Where_Imagination_Becomes_Animation__1__f03395a0.png',
      color: 'bg-amber-500 hover:bg-amber-600',
    },
    putti: {
      profile: PUTTI_PROFILE,
      imageSrc: '/assets/aistudio/CineNest__Where_Imagination_Becomes_Animation__1__f03395a0.png',
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    roboc: {
      profile: ROBOC_PROFILE,
      imageSrc: '/assets/aistudio/CineNest__Where_Imagination_Becomes_Animation__1__f03395a0.png',
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
    puchu: {
      profile: PUCHU_PROFILE,
      imageSrc: '/assets/aistudio/WhatsApp_Image_2026-10-30_at_5.18.47_AM_416333e4.jpeg',
      color: 'bg-emerald-700 hover:bg-emerald-800',
    },
    puku: {
      profile: PUKU_PROFILE,
      imageSrc: '/assets/aistudio/WhatsApp_Image_2026-10-30_at_5.18.47_AM_416333e4.jpeg',
      color: 'bg-amber-600 hover:bg-amber-700',
    },
  };

  const activeData = characterMap[selectedCharId] || characterMap.rutti;
  const char = activeData.profile;

  const handleSpeak = (text: string, title: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = selectedCharId === 'putti' ? 1.3 : selectedCharId === 'rutti' ? 1.15 : 1.0;
      setPlayingTitle(title);
      utterance.onend = () => setPlayingTitle(null);
      utterance.onerror = () => setPlayingTitle(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Dossier Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wider">
              CineNest Studio Production
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs font-semibold text-slate-600">Strict Character Lock</span>
          </div>
          <h2 className="text-2xl font-bold font-brand text-slate-900 mt-1">
            Character Dossiers & Production Reference
          </h2>
          <p className="text-xs text-slate-500">
            Official 3D CGI identities, Disney-Pixar style rules, and zero-deviation facial references
          </p>
        </div>

        {/* Character Switcher */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {[
            { id: 'rutti', label: '🌻 Rutti', tag: 'Big Sister' },
            { id: 'putti', label: '🐥 Putti', tag: 'Toddler' },
            { id: 'roboc', label: '🤖 Robo-C', tag: 'AI Friend' },
            { id: 'puchu', label: '👧 Puchu', tag: 'Courtyard' },
            { id: 'puku', label: '☕ Puku', tag: 'Ceramic Mug' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCharId(item.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedCharId === item.id
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-cyan-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-60">({item.tag})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Asset & Core Identity */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner max-h-[380px] flex items-center justify-center">
            <img
              src={activeData.imageSrc}
              alt={`${char.name} Production Reference`}
              className="w-full h-full object-cover object-top"
              style={{
                objectPosition:
                  selectedCharId === 'rutti' || selectedCharId === 'putti' || selectedCharId === 'roboc'
                    ? '70% 20%'
                    : 'center 40%',
              }}
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-[11px] font-mono font-semibold text-cyan-300 border border-slate-700">
              3D CGI Lock: 100%
            </div>
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-xs border border-white/10 text-white text-xs flex justify-between items-center">
              <div>
                <span className="font-bold block">{char.name}</span>
                <span className="text-[10px] text-cyan-300">{char.role}</span>
              </div>
              <span className="font-serif text-sm text-amber-300">{char.nameBn}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold font-brand text-slate-900 flex items-center justify-between">
              <span>{char.name}</span>
              <span className="text-sm font-normal text-slate-500">"{char.nameBn}"</span>
            </h3>
            <p className="text-xs font-semibold text-cyan-700 italic">
              "{char.tagline}"
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {char.bio}
            </p>
          </div>

          {/* Personality Traits */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
              Character Traits & Core Identity
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {char.personalityTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-cyan-50 text-cyan-900 text-xs font-medium border border-cyan-100"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Signature Item */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
            <span className="font-bold block text-amber-950 mb-0.5">Signature Prop / Accent:</span>
            {char.signatureItem}
          </div>
        </div>

        {/* Right Column: Strict Character Lock Rules & Soundbites */}
        <div className="lg:col-span-7 space-y-6">
          {/* Character Lock Specification */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-brand text-slate-900">
                  Strict Character Lock Rules
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ZERO DEVIATION MANDATORY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              To preserve authentic series continuity across 100+ episodes, the following physical, chromatic, and stylistic properties must remain 100% identical in every frame rendered.
            </p>

            <div className="space-y-2.5 pt-1">
              {char.lockedTraits.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{t.label}</span>
                    <span className="text-xs text-slate-600 leading-snug">{t.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Direction & Soundbites */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-cyan-600" />
              <h3 className="text-lg font-bold font-brand text-slate-900">
                Voice Direction & Bilingual Soundbites
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-xs text-cyan-900 leading-relaxed">
              <span className="font-bold">Director's Vocal Cue: </span>
              {char.voiceNotes}
            </div>

            <div className="space-y-3 pt-1">
              {char.soundbites.map((bite, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-cyan-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{bite.title}</span>
                    <button
                      onClick={() => handleSpeak(bite.speechText, bite.title)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                        playingTitle === bite.title
                          ? 'bg-cyan-600 text-white animate-pulse'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-cyan-50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingTitle === bite.title ? 'Playing Voice...' : 'Listen Cue'}</span>
                    </button>
                  </div>

                  <div className="text-xs font-medium text-slate-800">
                    "{bite.en}"
                  </div>
                  <div className="text-xs font-serif text-slate-500">
                    "{bite.bn}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Episodes Quick Jump */}
          <div className="bg-gradient-to-r from-slate-900 to-[#0e2736] rounded-3xl p-6 text-white space-y-3">
            <h4 className="text-sm font-bold font-brand flex items-center gap-2 text-white">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Recommended Featured Episodes for {char.name}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {char.featuredEpisodeIds.map((epId) => (
                <button
                  key={epId}
                  onClick={() => onSelectEpisode(epId)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Episode {epId}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
