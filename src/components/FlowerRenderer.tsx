import React from 'react';
import { FlowerMoodType, GrowthStage } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';

interface FlowerRendererProps {
  flowerType: FlowerMoodType | null;
  stage: GrowthStage;
  progressPercent?: number;
  waterLevel?: number;
  className?: string;
  isFocusing?: boolean;
}

export const FlowerRenderer: React.FC<FlowerRendererProps> = ({
  flowerType,
  stage,
  progressPercent = 0,
  waterLevel = 100,
  className = 'w-32 h-32',
  isFocusing = false,
}) => {
  if (!flowerType) {
    // Empty Plot with fertile soil
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Soil mound */}
          <ellipse cx="50" cy="78" rx="38" ry="14" fill="#8D5B4C" opacity="0.6" />
          <ellipse cx="50" cy="76" rx="34" ry="11" fill="#6B4226" />
          <ellipse cx="50" cy="74" rx="28" ry="8" fill="#54331B" />
          {/* Gentle shovel / plus icon placeholder */}
          <circle cx="50" cy="68" r="8" fill="#A8D5BA" opacity="0.4" />
          <path d="M50 64 L50 72 M46 68 L54 68" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  const flowerInfo = FLOWER_MOODS[flowerType];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Radiant Aura background for radiant stage */}
      {stage === 'radiant' && (
        <div className="absolute inset-0 rounded-full bg-radial from-amber-300/30 via-pink-300/20 to-transparent animate-pulse-soft blur-sm pointer-events-none" />
      )}

      {/* SVG Flower Art */}
      <svg
        viewBox="0 0 120 120"
        className={`w-full h-full drop-shadow-md transition-transform duration-500 ${
          isFocusing ? 'animate-sway' : ''
        }`}
      >
        <defs>
          <radialGradient id={`glow-${flowerType}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={flowerInfo.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#74C69D" />
            <stop offset="100%" stopColor="#2D6A4F" />
          </linearGradient>
        </defs>

        {/* Soil Base */}
        <ellipse cx="60" cy="100" rx="42" ry="14" fill="#58311E" opacity="0.75" />
        <ellipse cx="60" cy="98" rx="36" ry="10" fill="#7F4F24" />
        <ellipse cx="60" cy="96" rx="28" ry="7" fill="#936639" opacity="0.9" />

        {/* Water / Dew droplet shimmer on soil */}
        {waterLevel > 40 && (
          <circle cx="44" cy="95" r="2.2" fill="#67E8F9" opacity="0.8" />
        )}
        {waterLevel > 70 && (
          <circle cx="76" cy="96" r="1.8" fill="#67E8F9" opacity="0.8" />
        )}

        {/* STAGE 1: SEED */}
        {stage === 'seed' && (
          <g className="transition-all duration-700">
            {/* Small crack in soil */}
            <path d="M52 95 Q60 93 68 95" stroke="#3D2314" strokeWidth="2" strokeLinecap="round" />
            {/* Seed shell */}
            <ellipse cx="60" cy="93" rx="7" ry="5" fill="#B45309" transform="rotate(-15 60 93)" />
            <path d="M57 91 Q60 88 63 93" stroke="#D97706" strokeWidth="1.5" fill="none" />
            {/* Tiny green sprout tip emerging */}
            <path
              d="M60 90 Q62 84 64 82 Q65 85 62 89"
              fill="#52B788"
              className="animate-pulse-soft"
            />
          </g>
        )}

        {/* STAGE 2: SPROUT */}
        {stage === 'sprout' && (
          <g className="transition-all duration-700">
            {/* Stem */}
            <path
              d="M60 96 Q59 84 60 72"
              stroke="url(#stem-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Leaf */}
            <path
              d="M60 82 C50 80 44 86 42 78 C48 76 56 78 60 82"
              fill="#52B788"
              stroke="#2D6A4F"
              strokeWidth="1"
            />
            {/* Right Leaf */}
            <path
              d="M60 76 C70 74 76 80 78 72 C72 70 64 72 60 76"
              fill="#74C69D"
              stroke="#2D6A4F"
              strokeWidth="1"
            />
            {/* Tiny tender crown */}
            <circle cx="60" cy="70" r="3.5" fill="#A7F3D0" />
          </g>
        )}

        {/* STAGE 3: BUD */}
        {stage === 'bud' && (
          <g className="transition-all duration-700">
            {/* Stem */}
            <path
              d="M60 96 Q58 75 60 56"
              stroke="url(#stem-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lower Leaves */}
            <path
              d="M59 80 C46 76 38 84 35 74 C44 71 54 74 59 80"
              fill="#40916C"
              stroke="#1B4332"
              strokeWidth="1"
            />
            <path
              d="M60 70 C74 66 82 74 84 64 C76 61 66 64 60 70"
              fill="#52B788"
              stroke="#1B4332"
              strokeWidth="1"
            />
            {/* Sepals enclosing bud */}
            <ellipse cx="60" cy="54" rx="8" ry="12" fill={flowerInfo.color} opacity="0.9" />
            <path d="M53 58 Q60 48 60 62" stroke="#2D6A4F" strokeWidth="2.5" fill="#40916C" />
            <path d="M67 58 Q60 48 60 62" stroke="#2D6A4F" strokeWidth="2.5" fill="#52B788" />
            {/* Peek of petal color on top */}
            <circle cx="60" cy="46" r="4.5" fill={flowerInfo.color} />
          </g>
        )}

        {/* STAGE 4 & 5: BLOOM / RADIANT */}
        {(stage === 'bloom' || stage === 'radiant') && (
          <g className="transition-all duration-700">
            {/* Tall Stem */}
            <path
              d="M60 96 Q58 68 60 46"
              stroke="url(#stem-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lush Side Leaves */}
            <path
              d="M59 78 C42 74 34 82 30 70 C42 66 53 71 59 78"
              fill="#40916C"
              stroke="#1B4332"
              strokeWidth="1"
            />
            <path
              d="M60 66 C78 61 86 69 90 57 C80 54 68 58 60 66"
              fill="#52B788"
              stroke="#1B4332"
              strokeWidth="1"
            />

            {/* FLOWER SPECIES SPECIFIC PETALS */}
            {flowerType === 'sunflower' && (
              <g id="sunflower-head">
                {/* Golden Ray Petals (12 radiating petals) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="60"
                    cy="44"
                    rx="6"
                    ry="17"
                    fill="#FBBF24"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    transform={`rotate(${deg} 60 44)`}
                  />
                ))}
                {/* Center Seed Disk */}
                <circle cx="60" cy="44" r="11" fill="#78350F" />
                <circle cx="60" cy="44" r="9" fill="#92400E" />
                <circle cx="60" cy="44" r="6" fill="#451A03" />
                {/* Spiral texture dots */}
                <circle cx="58" cy="42" r="1.2" fill="#F59E0B" opacity="0.7" />
                <circle cx="62" cy="45" r="1.2" fill="#F59E0B" opacity="0.7" />
              </g>
            )}

            {flowerType === 'tulip' && (
              <g id="tulip-head">
                {/* Back Petals */}
                <path
                  d="M60 48 C46 36 48 18 60 30 C72 18 74 36 60 48 Z"
                  fill="#F472B6"
                  stroke="#DB2777"
                  strokeWidth="1"
                />
                {/* Left Outer Cup Petal */}
                <path
                  d="M60 48 C42 45 38 24 49 20 C54 26 57 38 60 48 Z"
                  fill="#EC4899"
                  stroke="#BE185D"
                  strokeWidth="1"
                />
                {/* Right Outer Cup Petal */}
                <path
                  d="M60 48 C78 45 82 24 71 20 C66 26 63 38 60 48 Z"
                  fill="#DB2777"
                  stroke="#9D174D"
                  strokeWidth="1"
                />
                {/* Center Petal Crest */}
                <path
                  d="M60 48 C55 36 55 24 60 21 C65 24 65 36 60 48 Z"
                  fill="#F9A8D4"
                />
              </g>
            )}

            {flowerType === 'rose' && (
              <g id="rose-head">
                {/* Outer Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="60"
                    cy="44"
                    rx="11"
                    ry="15"
                    fill="#E11D48"
                    stroke="#BE123C"
                    strokeWidth="0.8"
                    transform={`rotate(${deg} 60 44)`}
                  />
                ))}
                {/* Inner Petals */}
                {[30, 90, 150, 210, 270, 330].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="60"
                    cy="44"
                    rx="8"
                    ry="11"
                    fill="#F43F5E"
                    transform={`rotate(${deg} 60 44)`}
                  />
                ))}
                {/* Swirling Center */}
                <circle cx="60" cy="44" r="6" fill="#9F1239" />
                <path
                  d="M58 42 C61 40 63 45 61 46 C59 47 57 44 60 44"
                  stroke="#FDA4AF"
                  strokeWidth="1.2"
                  fill="none"
                />
              </g>
            )}

            {flowerType === 'lavender' && (
              <g id="lavender-head">
                {/* Tiered flower florets along stem */}
                {[
                  { cy: 22, rx: 6, ry: 4 },
                  { cy: 28, rx: 8, ry: 5 },
                  { cy: 34, rx: 9, ry: 5.5 },
                  { cy: 40, rx: 10, ry: 6 },
                  { cy: 46, rx: 9, ry: 5.5 },
                ].map((tier, idx) => (
                  <g key={idx}>
                    <ellipse
                      cx="56"
                      cy={tier.cy}
                      rx={tier.rx * 0.7}
                      ry={tier.ry * 0.7}
                      fill="#A78BFA"
                      transform={`rotate(-20 56 ${tier.cy})`}
                    />
                    <ellipse
                      cx="64"
                      cy={tier.cy}
                      rx={tier.rx * 0.7}
                      ry={tier.ry * 0.7}
                      fill="#8B5CF6"
                      transform={`rotate(20 64 ${tier.cy})`}
                    />
                    <circle cx="60" cy={tier.cy - 1} r={tier.rx * 0.4} fill="#C4B5FD" />
                  </g>
                ))}
                {/* Top spire tip */}
                <circle cx="60" cy="18" r="3.5" fill="#DDD6FE" />
              </g>
            )}

            {flowerType === 'daisy' && (
              <g id="daisy-head">
                {/* White Rounded Petals */}
                {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="60"
                    cy="44"
                    rx="5"
                    ry="16"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="0.8"
                    transform={`rotate(${deg} 60 44)`}
                  />
                ))}
                {/* Warm Golden Center */}
                <circle cx="60" cy="44" r="9" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                <circle cx="60" cy="44" r="6" fill="#FBBF24" />
                <circle cx="58" cy="42" r="1.5" fill="#FEF3C7" />
              </g>
            )}

            {flowerType === 'lotus' && (
              <g id="lotus-head">
                {/* Wide serene layered petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="60"
                    cy="44"
                    rx="8"
                    ry="16"
                    fill="#67E8F9"
                    stroke="#0891B2"
                    strokeWidth="0.8"
                    opacity="0.9"
                    transform={`rotate(${deg} 60 44)`}
                  />
                ))}
                <circle cx="60" cy="44" r="7" fill="#FDE047" />
                <circle cx="60" cy="44" r="4" fill="#FEF08A" />
              </g>
            )}

            {flowerType === 'sakura' && (
              <g id="sakura-head">
                {[0, 72, 144, 216, 288].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 60 44)`}>
                    <path
                      d="M60 44 C53 30 52 18 57 16 C60 20 60 20 63 16 C68 18 67 30 60 44 Z"
                      fill="#F472B6"
                      stroke="#DB2777"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                <circle cx="60" cy="44" r="6" fill="#BE185D" />
                <circle cx="60" cy="44" r="3.5" fill="#FDF2F8" />
              </g>
            )}

            {/* RADIANT STAGE EXTRA: Sparkling Particles & Floating Butterfly */}
            {stage === 'radiant' && (
              <g className="animate-pulse-soft">
                {/* Sparkles */}
                <circle cx="36" cy="30" r="1.8" fill="#FDE047" />
                <circle cx="84" cy="28" r="2.2" fill="#FDE047" />
                <circle cx="60" cy="12" r="2.0" fill="#FEF08A" />
                <circle cx="30" cy="55" r="1.5" fill="#67E8F9" />
                <circle cx="90" cy="52" r="1.5" fill="#F472B6" />

                {/* Little fluttering butterfly */}
                <g transform="translate(82, 22) scale(0.65)" className="animate-flutter">
                  <ellipse cx="-4" cy="-4" rx="6" ry="8" fill="#38BDF8" transform="rotate(-30)" />
                  <ellipse cx="4" cy="-4" rx="6" ry="8" fill="#38BDF8" transform="rotate(30)" />
                  <ellipse cx="-3" cy="4" rx="4" ry="5" fill="#818CF8" />
                  <ellipse cx="3" cy="4" rx="4" ry="5" fill="#818CF8" />
                  <ellipse cx="0" cy="0" rx="1.5" ry="7" fill="#1E293B" />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Mini Progress Dew Drop Badge */}
      {stage !== 'radiant' && progressPercent > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 shadow-sm border border-stone-200 dark:border-stone-700 flex items-center justify-between text-[10px] text-stone-600 dark:text-stone-300">
          <span>💧 {waterLevel}%</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{progressPercent}%</span>
        </div>
      )}
    </div>
  );
};
