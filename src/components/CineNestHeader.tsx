import React, { useState } from 'react';
import { CineNestLogo } from './CineNestLogo';
import { Menu, X, Sparkles, Film, GraduationCap, ChevronDown, Wand2, Shield, HardDrive } from 'lucide-react';

export type CineNestPage =
  | 'home'
  | 'features'
  | 'series'
  | 'schools'
  | 'pricing'
  | 'about'
  | 'studio'
  | 'creator'
  | 'characters'
  | 'stickers'
  | 'vault'
  | 'admin';

interface CineNestHeaderProps {
  currentPage: CineNestPage;
  onNavigate: (page: CineNestPage) => void;
  onOpenLogin: () => void;
  onOpenCreator: () => void;
  onOpenDrive?: () => void;
  activeEpisodeId: number;
}

export const CineNestHeader: React.FC<CineNestHeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenLogin,
  onOpenCreator,
  onOpenDrive,
  activeEpisodeId,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const navItems: { label: string; page: CineNestPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Features', page: 'features' },
    { label: 'Our Series', page: 'series' },
    { label: 'For Schools', page: 'schools' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'About', page: 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071620]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            className="cursor-pointer transition-transform active:scale-95"
            onClick={() => onNavigate('home')}
          >
            <CineNestLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#FCD34D]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#FCD34D] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Quick access to studio tools */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full border transition ${
                  ['studio', 'characters', 'stickers', 'vault'].includes(currentPage)
                    ? 'border-cyan-400/60 bg-cyan-950/40 text-cyan-300'
                    : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                <span>Studio Suite</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b1f2c] border border-cyan-500/30 p-2 shadow-2xl backdrop-blur-xl text-xs space-y-1 z-50"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      onNavigate('studio');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:bg-cyan-500/20 hover:text-cyan-200 transition"
                  >
                    <Film className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Episode {activeEpisodeId} Studio</div>
                      <div className="text-[10px] text-white/50">330s scrubber & script</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('characters');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:bg-cyan-500/20 hover:text-cyan-200 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">Character Lock & Dossiers</div>
                      <div className="text-[10px] text-white/50">Rutti, Putti, Robo-C, Neel</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('stickers');
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:bg-cyan-500/20 hover:text-cyan-200 transition"
                  >
                    <span className="text-sm">🎁</span>
                    <div>
                      <div className="font-semibold">Coworker Sticker Shop</div>
                      <div className="text-[10px] text-white/50">Personalized gifts & cards</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenDrive) onOpenDrive();
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-white/90 hover:bg-cyan-500/20 hover:text-cyan-200 transition"
                  >
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Google Drive Sync</div>
                      <div className="text-[10px] text-white/50">Backup 105 episodes & scripts</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                currentPage === 'admin'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                  : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/30'
              }`}
              title="Super Admin Control Center (Priority 3 & Runway 3D Studio)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Super Admin</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full ml-0.5">
                P3 • 3D Studio
              </span>
            </button>
            <button
              onClick={onOpenLogin}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded-full transition duration-200"
            >
              Login
            </button>
            <button
              onClick={onOpenCreator}
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00AEEF] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0EA5E9] rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 transform active:scale-95 transition"
            >
              <Wand2 className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenCreator}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#00AEEF] to-[#0284C7] rounded-full shadow-sm"
            >
              Create
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1c27] border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                currentPage === item.page
                  ? 'bg-cyan-500/20 text-[#FCD34D]'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('studio');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-xl bg-white/5 text-white/90 text-xs font-medium"
            >
              🎬 Episode Studio
            </button>
            <button
              onClick={() => {
                onNavigate('characters');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-xl bg-white/5 text-white/90 text-xs font-medium"
            >
              ✨ Character Lock
            </button>
            <button
              onClick={() => {
                onNavigate('schools');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-xl bg-white/5 text-white/90 text-xs font-medium"
            >
              🎓 Pre-K Academy
            </button>
            <button
              onClick={() => {
                onNavigate('stickers');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-xl bg-white/5 text-white/90 text-xs font-medium"
            >
              🎁 Sticker Shop
            </button>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold text-white/90 border border-white/30 rounded-full text-center"
            >
              Login
            </button>
            <button
              onClick={() => {
                onOpenCreator();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#00AEEF] to-[#0284C7] rounded-full text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
