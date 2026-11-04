import React from 'react';

interface CineNestLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const CineNestLogo: React.FC<CineNestLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Blue Bird Mascot Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center drop-shadow-md`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform -rotate-3 hover:rotate-6 transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bird Body - Vibrant sky cyan/blue */}
          <path
            d="M82 48C82 68 64 85 45 85C30 85 18 75 14 62C10 50 15 36 26 28C38 19 60 20 72 32C78 37 82 42 82 48Z"
            fill="url(#birdGrad)"
          />
          {/* Belly - White/cream soft glow */}
          <ellipse cx="46" cy="62" rx="22" ry="17" fill="#F8FAFC" opacity="0.95" />
          {/* Tail feathers */}
          <path
            d="M16 62C8 66 3 56 4 48C5 40 14 42 18 48Z"
            fill="#0284C7"
          />
          {/* Left Wing - cute flapper */}
          <path
            d="M34 54C28 48 30 36 40 40C48 43 46 56 38 58C36 58 35 56 34 54Z"
            fill="#0EA5E9"
          />
          {/* Big Cartoon Eye (Left) */}
          <circle cx="58" cy="40" r="10.5" fill="#FFFFFF" />
          <circle cx="61" cy="40" r="5.5" fill="#0369A1" />
          <circle cx="62" cy="38" r="2.2" fill="#FFFFFF" />

          {/* Eye (Right / Three-quarter view) */}
          <circle cx="73" cy="38" r="8.5" fill="#FFFFFF" />
          <circle cx="75" cy="38" r="4.5" fill="#0369A1" />
          <circle cx="76" cy="36.5" r="1.8" fill="#FFFFFF" />

          {/* Yellow Beak */}
          <path
            d="M74 44L93 48L74 54C75 51 75 47 74 44Z"
            fill="url(#beakGrad)"
            stroke="#D97706"
            strokeWidth="1.2"
          />

          {/* Rosy Cheek */}
          <ellipse cx="56" cy="52" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.6" />

          {/* Feather Tuft on top */}
          <path
            d="M52 24C55 16 64 15 65 20C65 23 58 25 52 24Z"
            fill="#38BDF8"
          />

          <defs>
            <linearGradient id="birdGrad" x1="14" y1="20" x2="82" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="beakGrad" x1="74" y1="44" x2="93" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-brand font-bold tracking-tight ${titleSizes[size]} flex items-baseline drop-shadow-sm`}>
          <span className="text-white">Cine</span>
          <span className="text-[#FF7A60]">N</span>
          <span className="text-[#2DD4BF]">e</span>
          <span className="text-[#FB923C]">s</span>
          <span className="text-[#FBBF24]">t</span>
        </div>
        {showSubtitle && (
          <span className={`font-semibold tracking-[0.22em] uppercase text-white/90 ${subSizes[size]} -mt-0.5`}>
            Studio
          </span>
        )}
      </div>
    </div>
  );
};
