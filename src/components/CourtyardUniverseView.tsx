import React, { useState } from 'react';
import { Compass, Sun, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { UNIVERSE_LOCATIONS } from '../data/universeData';
import { UniverseLocation } from '../types/series';

interface CourtyardUniverseViewProps {
  onSelectEpisode: (id: number) => void;
}

export const CourtyardUniverseView: React.FC<CourtyardUniverseViewProps> = ({ onSelectEpisode }) => {
  const [activeLocationId, setActiveLocationId] = useState<string>(UNIVERSE_LOCATIONS[0].id);

  const activeLoc = UNIVERSE_LOCATIONS.find((l) => l.id === activeLocationId) || UNIVERSE_LOCATIONS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Living World Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
          The Courtyard Universe & Storytelling Zones
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Every episode in the 105-episode series takes place at the signature checkered picnic table or at a magical location that organically grows out of Grandma's sunny courtyard in rural Bengal.
        </p>
      </div>

      {/* Main Interactive Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Locations List / Nodes */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block px-1">
            Courtyard Story Zones ({UNIVERSE_LOCATIONS.length}):
          </span>

          {UNIVERSE_LOCATIONS.map((loc) => {
            const isActive = loc.id === activeLocationId;
            return (
              <div
                key={loc.id}
                onClick={() => setActiveLocationId(loc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-white hover:bg-amber-50/80 border-amber-200/80 text-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
                    <h3 className="font-bold text-sm font-serif">
                      {loc.name}
                    </h3>
                  </div>
                  <p className={`text-xs font-serif ${isActive ? 'text-emerald-100' : 'text-emerald-700'} mt-0.5`}>
                    {loc.nameBn}
                  </p>
                </div>

                <div className="text-right text-[11px] opacity-80">
                  <span>{loc.bestTimeOfDay}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Zone Spotlight */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Lighting Atmosphere: {activeLoc.bestTimeOfDay}</span>
              </span>
              <span className="font-mono text-[11px]">Growth: {activeLoc.growthOrigin}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-1">
              {activeLoc.name}
            </h3>
            <p className="text-lg font-serif text-emerald-800 font-medium">
              {activeLoc.nameBn}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p className="font-medium text-stone-800">
              {activeLoc.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">Signature Visual Anchor:</span>
              <span className="text-stone-700">{activeLoc.signatureElement}</span>
            </div>
          </div>

          {/* Featured Episodes occurring in this zone */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
              Featured Episodes in This Location:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeLoc.featuredEpisodeIds.map((epId) => (
                <button
                  key={epId}
                  onClick={() => onSelectEpisode(epId)}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-stone-800 font-semibold transition flex items-center justify-between group"
                >
                  <span>Episode {epId}</span>
                  <span className="text-emerald-700 group-hover:translate-x-0.5 transition flex items-center gap-1">
                    <span>Open Script</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
