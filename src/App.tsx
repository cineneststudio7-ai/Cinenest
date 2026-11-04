import React, { useState, useEffect } from 'react';
import { CineNestHeader, CineNestPage } from './components/CineNestHeader';
import { CineNestHomeView } from './components/CineNestHomeView';
import {
  FeaturesModal,
  SchoolsModal,
  PricingModal,
  AboutModal,
  LoginModal,
} from './components/CineNestModals';
import { StoryCreationStudioModal } from './components/StoryCreationStudioModal';
import { CinematicDiscoveryView } from './components/CinematicDiscoveryView';
import { CharacterProfilesView } from './components/CharacterProfilesView';
import { CourtyardUniverseView } from './components/CourtyardUniverseView';
import { EpisodePlayerTimeline } from './components/EpisodePlayerTimeline';
import { ScriptViewer } from './components/ScriptViewer';
import { CharacterLockView } from './components/CharacterLockView';
import { ReferenceGeneratorsView } from './components/ReferenceGeneratorsView';
import { EncryptedStorageView } from './components/EncryptedStorageView';
import { SeriesBibleView } from './components/SeriesBibleView';
import { BatchExportModal } from './components/BatchExportModal';
import { SearchModal } from './components/SearchModal';
import { PreschoolAcademyView } from './components/PreschoolAcademyView';
import { CoworkerStickerShopView } from './components/CoworkerStickerShopView';
import { PuchuPukuChatbot } from './components/PuchuPukuChatbot';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { getEpisode } from './data/episodesDirectory';
import { exportEpisodeToPlainText } from './utils/episodeCalculator';
import { getFavoriteEpisodes, toggleFavoriteEpisode, getEpisodeNote } from './utils/crypto';
import { Film, Sparkles, BookOpen, Search, Download, Star, Shield, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CineNestPage>('home');
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number>(1);
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [favoriteEpisodeIds, setFavoriteEpisodeIds] = useState<number[]>([]);
  const [selectedCharacterProfile, setSelectedCharacterProfile] = useState<
    'rutti' | 'putti' | 'roboc' | 'puchu' | 'puku'
  >('rutti');

  // Modals state
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [creatorInitialStep, setCreatorInitialStep] = useState(1);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isSchoolsOpen, setIsSchoolsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBatchExportOpen, setIsBatchExportOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // User profile
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  const episode = getEpisode(currentEpisodeId);

  const [adminInitialTab, setAdminInitialTab] = useState<
    'overview' | 'pipeline' | 'runway' | 'socialcuts' | 'publishing' | 'comments' | 'roles' | 'launch'
  >('runway');

  // Load encrypted favorites and parse URL parameters on mount
  useEffect(() => {
    getFavoriteEpisodes().then(setFavoriteEpisodeIds);

    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      const priority = params.get('priority');
      const tab = params.get('tab') as any;
      const ep = params.get('ep');

      if (page === 'admin' || priority === '3') {
        setCurrentPage('admin');
        if (tab) setAdminInitialTab(tab);
      }
      if (ep) {
        const epNum = Number(ep);
        if (epNum >= 1 && epNum <= 105) setCurrentEpisodeId(epNum);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleSelectEpisode = (id: number) => {
    setCurrentEpisodeId(id);
    setCurrentSecond(0);
    setIsPlaying(false);
    setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (id: number, title: string) => {
    await toggleFavoriteEpisode(id, title);
    const updated = await getFavoriteEpisodes();
    setFavoriteEpisodeIds(updated);
  };

  const handleOpenCharacterProfile = (charId: 'puchu' | 'puku') => {
    setSelectedCharacterProfile(charId);
    setCurrentPage('characters');
  };

  const handleExportCurrent = async () => {
    const note = await getEpisodeNote(episode.id);
    const text = exportEpisodeToPlainText(episode, note);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineNest_Rutti_Putti_Episode_${episode.id.toString().padStart(3, '0')}_Script.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenStep = (stepNumber: number) => {
    setCreatorInitialStep(stepNumber);
    setIsCreatorOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071620] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 100% Faithful CineNest Navigation Header */}
      <CineNestHeader
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'features') {
            setIsFeaturesOpen(true);
          } else if (page === 'pricing') {
            setIsPricingOpen(true);
          } else if (page === 'about') {
            setIsAboutOpen(true);
          } else if (page === 'schools') {
            setCurrentPage('schools');
          } else {
            setCurrentPage(page);
          }
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenCreator={() => {
          setCreatorInitialStep(1);
          setIsCreatorOpen(true);
        }}
        onOpenDrive={() => setIsDriveModalOpen(true)}
        activeEpisodeId={currentEpisodeId}
      />

      {/* Phase 1 Technical Audit: Priority 3 Quick-Launch Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-cyan-950/70 border-b border-amber-500/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
              Priority 3
            </span>
            <span className="font-semibold text-white">
              Super Admin &amp; Runway 3D CGI Studio (Episode 3: The Sweet Mango Branch)
            </span>
            <span className="hidden sm:inline text-white/50">• Owner: cinenest.studio7@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAdminInitialTab('runway');
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-sm flex items-center gap-1"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Launch 3D Studio (Tab 3)</span>
            </button>

            <button
              onClick={() => {
                setAdminInitialTab('roles');
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Roles &amp; Firestore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* VIEW 1: 100% CLONE HOMEPAGE (Default) */}
        {currentPage === 'home' && (
          <CineNestHomeView
            onStartStory={() => {
              setCreatorInitialStep(1);
              setIsCreatorOpen(true);
            }}
            onExploreSeries={() => {
              setCurrentPage('series');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStep={handleOpenStep}
            onOpenSchools={() => setCurrentPage('schools')}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {/* VIEW 2: OUR SERIES (Disney-Pixar Character Discovery & 100+ Episodes) */}
        {currentPage === 'series' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Back to Home & Sub-bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CineNest Homepage</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Search 100+ Episodes</span>
                  </button>
                  <button
                    onClick={() => setIsBatchExportOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Batch Export</span>
                  </button>
                </div>
              </div>

              <CinematicDiscoveryView
                onSelectEpisode={handleSelectEpisode}
                favoriteEpisodeIds={favoriteEpisodeIds}
                onToggleFavorite={handleToggleFavorite}
                onOpenCharacterProfile={handleOpenCharacterProfile}
                onOpenUniverse={() => setCurrentPage('series')}
                onOpenPreschool={() => setCurrentPage('schools')}
                onOpenStickers={() => setCurrentPage('stickers')}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: EPISODE 330s STUDIO & SCRIPT VIEWER */}
        {currentPage === 'studio' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    onClick={() => setCurrentPage('series')}
                    className="text-xs font-semibold text-cyan-700 hover:underline"
                  >
                    All Episodes
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCurrent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Episode {currentEpisodeId} .txt</span>
                  </button>
                </div>
              </div>

              <EpisodePlayerTimeline
                episode={episode}
                currentSecond={currentSecond}
                setCurrentSecond={setCurrentSecond}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />

              <ScriptViewer
                episode={episode}
                onNextEpisode={() => handleSelectEpisode(Math.min(105, currentEpisodeId + 1))}
                onPrevEpisode={() => handleSelectEpisode(Math.max(1, currentEpisodeId - 1))}
                onExport={handleExportCurrent}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: US STANDARD PRE-K ACADEMY */}
        {currentPage === 'schools' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-200">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CineNest Homepage</span>
                </button>
                <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  US Pre-K Aligned Curriculum
                </span>
              </div>
              <PreschoolAcademyView />
            </div>
          </div>
        )}

        {/* VIEW 5: CHARACTER DOSSIERS & 4-VIEW REFERENCE SHEETS */}
        {currentPage === 'characters' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-200">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CineNest Homepage</span>
                </button>
                <button
                  onClick={() => setCurrentPage('studio')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition"
                >
                  <span>Open Episode Studio</span>
                </button>
              </div>

              <CharacterProfilesView
                onSelectEpisode={handleSelectEpisode}
                initialCharacter={selectedCharacterProfile}
              />

              <div className="pt-4">
                <CharacterLockView />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: COWORKER STICKER SHOP */}
        {currentPage === 'stickers' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-200">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CineNest Homepage</span>
                </button>
              </div>
              <CoworkerStickerShopView />
            </div>
          </div>
        )}

        {/* VIEW 7: ENCRYPTED VAULT */}
        {currentPage === 'vault' && (
          <div className="bg-amber-50/40 text-stone-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-200">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CineNest Homepage</span>
                </button>
              </div>
              <EncryptedStorageView onSelectEpisode={handleSelectEpisode} />
            </div>
          </div>
        )}

        {/* VIEW 8: SUPER ADMIN & HOLLYWOOD PIPELINE */}
        {currentPage === 'admin' && (
          <div className="bg-slate-950 text-white min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <SuperAdminDashboard
                onBackToApp={() => setCurrentPage('home')}
                onOpenEpisodeStudio={(epId) => handleSelectEpisode(epId)}
                adminEmail="cinenest.studio7@gmail.com"
                initialTab={adminInitialTab}
              />
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODALS & WORKFLOW OVERLAYS */}
      {/* ======================================================== */}

      {/* 4-Step Story Creation Studio */}
      <StoryCreationStudioModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        initialStep={creatorInitialStep}
        onLaunchEpisode={handleSelectEpisode}
      />

      {/* Features Modal */}
      <FeaturesModal
        isOpen={isFeaturesOpen}
        onClose={() => setIsFeaturesOpen(false)}
        onOpenCreator={() => {
          setIsFeaturesOpen(false);
          setIsCreatorOpen(true);
        }}
      />

      {/* Schools Modal */}
      <SchoolsModal
        isOpen={isSchoolsOpen}
        onClose={() => setIsSchoolsOpen(false)}
        onOpenAcademyTab={() => setCurrentPage('schools')}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={(plan) => {
          setIsPricingOpen(false);
          setCreatorInitialStep(1);
          setIsCreatorOpen(true);
        }}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(name, role) => {
          setCurrentUser({ name, role });
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEpisode={handleSelectEpisode}
      />

      {/* Batch Export Modal */}
      {isBatchExportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 text-stone-900 shadow-2xl">
            <button
              onClick={() => setIsBatchExportOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
            >
              &times;
            </button>
            <BatchExportModal />
          </div>
        </div>
      )}

      {/* Google Drive Synchronization Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        initialEpisodeId={currentEpisodeId}
      />

      {/* Floating AI Preschool & Coworker Companion */}
      <PuchuPukuChatbot />
    </div>
  );
}
