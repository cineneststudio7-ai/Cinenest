import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  Users,
  Globe,
  Heart,
  Shield,
  Film,
  Zap,
  HelpCircle,
  Mail,
  User,
} from 'lucide-react';
import { CineNestLogo } from './CineNestLogo';

// ==========================================
// 1. FEATURES MODAL
// ==========================================
interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreator: () => void;
}

export const FeaturesModal: React.FC<FeaturesModalProps> = ({
  isOpen,
  onClose,
  onOpenCreator,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#091b26] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="text-xl font-bold font-brand text-white">
                CineNest Studio Features & Architecture
              </h3>
              <p className="text-xs text-cyan-300">
                Autonomous 3D cartoon series engine for children worldwide
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <span>⭐</span>
              <span>AI Generated Storylines</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Gemini 3.8 Flash automated screenwriter enforces exact 330-second pacing: 20s opening recap, 240s core adventure, 40s lesson recap, and 30s cliffhanger.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
              <span>📦</span>
              <span>3D Disney-Pixar Animation</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Volumetric lighting, subsurface skin scattering, warm courtyard atmosphere, and 35mm cinematic camera rigs calibrated for children's perspective.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
              <span>🔒</span>
              <span>100% Strict Character Lock</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Rutti (floral yellow dress, brown wavy pigtails), Putti (blue duck shirt), and Robo-C (white/cyan LED companion) are locked across all 100+ episodes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <span>🛡️</span>
              <span>Safe, Educational & Fun</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Strict COPPA / US preschool educational standards compliance, bilingual Bengali and English vocabulary, and zero-ad kid-friendly environments.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white/70 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenCreator();
            }}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Start Creating Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. FOR SCHOOLS MODAL / VIEW
// ==========================================
interface SchoolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAcademyTab: () => void;
}

export const SchoolsModal: React.FC<SchoolsModalProps> = ({
  isOpen,
  onClose,
  onOpenAcademyTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#0a1c27] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-cyan-400" />
            <div>
              <h3 className="text-xl font-bold font-brand text-white">
                CineNest for Schools & Pre-K Classrooms
              </h3>
              <p className="text-xs text-cyan-300">
                Aligned with US National Pre-K Standards & Global Early Childhood Learning
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-sm text-white/80 leading-relaxed">
            Rutti & Putti provides an immersive 3D audiovisual curriculum designed for preschool through kindergarten children. Every 330-second episode teaches one core concept through story, bilingual song, and reflection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-bold text-cyan-300 text-sm mb-1">Social-Emotional</div>
              <p className="text-white/60 text-[11px]">
                Empathy, sharing, conflict resolution, patience, and recognizing emotions.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-bold text-amber-300 text-sm mb-1">Bilingual Phonics</div>
              <p className="text-white/60 text-[11px]">
                Rich vocabulary building, bilingual nursery rhymes in Bengali & English.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div className="font-bold text-emerald-300 text-sm mb-1">STEM & Curiosity</div>
              <p className="text-white/60 text-[11px]">
                Counting courtyard flowers, understanding sunshine and rain, plant life cycles.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-white/10">
          <div className="text-xs text-white/60">
            Used by over 450 preschools and home educators.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white/70 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAcademyTab();
              }}
              className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Open Pre-K Academy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. PRICING MODAL
// ==========================================
interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#091b26] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-2xl font-bold font-brand text-white">
              CineNest Studio Production Plans
            </h3>
            <p className="text-xs text-cyan-300 mt-0.5">
              Create, direct, and broadcast Pixar-quality children's animation
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-full transition ${
                billingPeriod === 'monthly' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-white/70'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                billingPeriod === 'yearly' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-white/70'
              }`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Plan 1 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-white/70 font-bold text-sm">Free Explorer</div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                $0 <span className="text-xs font-normal text-white/50">/ forever</span>
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                Browse 100+ episodes, read full scripts, preview 330s timeline scrubber.
              </p>
              <ul className="mt-4 space-y-2 text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full access to 105 episodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Encrypted local favorites & notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Clean text script export</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan('Explorer');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition text-center"
            >
              Current Plan
            </button>
          </div>

          {/* Plan 2: Creator Studio (Featured) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e2c3d] to-[#0a1e2b] border-2 border-cyan-400 flex flex-col justify-between space-y-4 shadow-xl relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] uppercase tracking-wide">
              Most Popular
            </span>
            <div>
              <div className="text-cyan-300 font-bold text-sm">Creator Studio</div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                {billingPeriod === 'monthly' ? '$29' : '$24'}{' '}
                <span className="text-xs font-normal text-white/50">/ month</span>
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                Create custom 3D episodes with Gemini 3.8 Flash and generate 3D Pixar visual prompts.
              </p>
              <ul className="mt-4 space-y-2 text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Autonomous AI scriptwriting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Pixar 3D prompt generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>4-View Character Lock sheets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Coworker Sticker Studio license</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan('Creator Studio');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 shadow-md transition text-center"
            >
              Get Creator Studio
            </button>
          </div>

          {/* Plan 3: Classroom / School */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-white/70 font-bold text-sm">Pre-K Classroom</div>
              <div className="mt-2 text-2xl font-extrabold text-white">
                {billingPeriod === 'monthly' ? '$99' : '$79'}{' '}
                <span className="text-xs font-normal text-white/50">/ month</span>
              </div>
              <p className="text-[11px] text-white/60 mt-2">
                For preschools, daycares, and kindergartens. Includes teacher worksheets & lesson guides.
              </p>
              <ul className="mt-4 space-y-2 text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Classroom multi-seat access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>US Pre-K curriculum lesson plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Printable coloring & phonics sheets</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan('Classroom');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition text-center"
            >
              Contact Education Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ABOUT MODAL
// ==========================================
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#091b26] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <CineNestLogo size="md" />
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed">
          <h4 className="text-lg font-bold font-brand text-amber-400">
            "Small minds. Big dreams. 💛"
          </h4>
          <p>
            CineNest Studio was founded on a simple conviction: <strong>every child in every corner of the world deserves stories of wonder, empathy, and joy</strong>.
          </p>
          <p>
            Originating from the sunlit village courtyards of Bangladesh and designed to Disney-Pixar quality standards, our series <strong>Rutti & Putti</strong> brings together sisters, laughter, and an AI robot companion who discovers the warmth of human kindness.
          </p>
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
            <span className="text-cyan-300 font-bold block mb-1">Our Autonomous 3D Vision</span>
            <p className="text-xs text-white/70">
              We empower creators and educators to produce full-length 3D animation series at a fraction of traditional studio costs, without compromising on storytelling heart or educational integrity.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. LOGIN MODAL
// ==========================================
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, role: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleTestLogin = (name: string, role: string) => {
    onLoginSuccess(name, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#091b26] border border-cyan-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <CineNestLogo size="sm" />
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold font-brand text-white">Creator Sign In</h3>
          <p className="text-xs text-white/60 mt-0.5">
            Access your 3D animation projects and preschool vault
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTestLogin(email.split('@')[0] || 'Studio Director', 'Director');
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block text-white/80 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@cinenest.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition mt-2"
          >
            Sign In to CineNest
          </button>
        </form>

        {/* Instant Demo Roles */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <span className="text-[10px] text-white/50 uppercase tracking-wider block">
            Select Your Role or Sign In:
          </span>
          <button
            onClick={() => handleTestLogin('Super Admin (Owner)', 'SUPER_ADMIN')}
            className="w-full p-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-left border border-amber-400/30 transition flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                <span>cinenest.studio7@gmail.com</span>
                <span className="text-[9px] bg-amber-400/20 px-1.5 py-0.2 rounded font-black text-amber-200 uppercase">Super Admin</span>
              </div>
              <div className="text-[10px] text-white/60">Primary Owner Authority & Full Production Center</div>
            </div>
            <span className="text-amber-400 font-bold text-xs">&rarr;</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleTestLogin('Sarah Rahman', 'Lead Showrunner')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/10 transition"
            >
              <div className="font-bold text-cyan-300">Sarah Rahman</div>
              <div className="text-[9px] text-white/50">Lead Showrunner</div>
            </button>
            <button
              onClick={() => handleTestLogin('Anis Ahmed', 'Pre-K Educator')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left border border-white/10 transition"
            >
              <div className="font-bold text-amber-300">Anis Ahmed</div>
              <div className="text-[9px] text-white/50">Pre-K Educator</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
