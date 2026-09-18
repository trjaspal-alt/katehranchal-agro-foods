import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'footer';
  showWordmark?: boolean;
  wordmarkClassName?: string;
  isLightHeader?: boolean;
  variant?: 'light' | 'dark'; // 'dark' = dark text on light bg (default), 'light' = white/gold on dark bg
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = false,
  wordmarkClassName = '',
  isLightHeader = false,
  variant = 'dark',
}) => {
  // Height-based sizing for the official portrait logo (1052 × 1408).
  const sizeMap = {
    sm: 'h-9 sm:h-10 w-auto',
    md: 'h-11 sm:h-14 w-auto',
    lg: 'h-16 sm:h-20 w-auto',
    xl: 'h-24 sm:h-32 w-auto',
    footer: 'h-20 sm:h-24 w-auto',
  };

  const isLightMode = variant === 'light' || isLightHeader;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      <img
        src="./assets/katehranchal-agro-foods-logo.png"
        alt="Katehranchal Agro Foods logo"
        className={`${sizeMap[size]} object-contain shrink-0 transition-transform duration-200`}
        width={size === 'xl' ? 96 : size === 'footer' ? 72 : size === 'lg' ? 60 : size === 'md' ? 42 : 30}
        height={size === 'xl' ? 128 : size === 'footer' ? 96 : size === 'lg' ? 80 : size === 'md' ? 56 : 40}
        loading="eager"
      />
      {showWordmark && (
        <div className={`flex flex-col justify-center min-w-0 ${wordmarkClassName}`}>
          {/* Primary Dominant Brand Name in Fraunces SemiBold */}
          <span
            className={`font-serif font-semibold leading-[0.96] tracking-[0.035em] uppercase transition-colors whitespace-nowrap ${
              size === 'sm' ? 'text-[13px] sm:text-[15px]' : size === 'footer' ? 'text-[25px] sm:text-[30px]' : size === 'lg' ? 'text-xl sm:text-[26px]' : size === 'xl' ? 'text-2xl sm:text-3xl' : 'text-[15px] sm:text-xl'
            } ${isLightMode ? 'text-[#FBF9F4]' : 'text-[#124328]'}`}
          >
            Katehranchal
          </span>
          {/* Subordinate Category Line with refined tracking */}
          <span
            className={`font-sans font-bold tracking-[0.22em] uppercase mt-1.5 whitespace-nowrap ${
              size === 'sm' ? 'text-[8px] sm:text-[9px]' : size === 'footer' ? 'text-[11px] sm:text-xs' : size === 'lg' ? 'text-[11px] sm:text-[13px]' : size === 'xl' ? 'text-xs sm:text-sm' : 'text-[9px] sm:text-[11px]'
            } text-[#E0980B]`}
          >
            Agro Foods
          </span>
        </div>
      )}
    </div>
  );
};
