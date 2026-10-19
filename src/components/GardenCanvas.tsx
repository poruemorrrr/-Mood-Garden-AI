import React, { useState } from 'react';
import { GardenPlot, FlowerMoodType } from '../types/garden';
import { FLOWER_MOODS, GARDEN_ANIMALS } from '../data/flowerConstants';
import { FlowerRenderer } from './FlowerRenderer';
import { Droplet, Sun, Sparkles, Heart, Sprout, Plus, Play, Info, Zap } from 'lucide-react';
import { soundSynth } from '../services/soundSynthesizer';

interface GardenCanvasProps {
  plots: GardenPlot[];
  waterDrops: number;
  sunlightPoints: number;
  rewardPoints: number;
  unlockedAnimals: string[];
  onSelectPlot: (plot: GardenPlot) => void;
  onPlantNew: (plotIndex: number) => void;
  onWaterPlot: (plotId: string) => void;
  onStartFocusOnFlower: (flowerType: FlowerMoodType, plotId: string) => void;
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  plots,
  waterDrops,
  sunlightPoints,
  rewardPoints,
  unlockedAnimals,
  onSelectPlot,
  onPlantNew,
  onWaterPlot,
  onStartFocusOnFlower,
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [animalTalkBubble, setAnimalTalkBubble] = useState<string | null>(null);

  const activePlot = plots.find((p) => p.id === selectedPlotId);

  const handleWater = (plotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playWaterSplash();
    onWaterPlot(plotId);
  };

  const handleAnimalClick = (animal: typeof GARDEN_ANIMALS[0]) => {
    soundSynth.playSuccessFanfare();
    setAnimalTalkBubble(`${animal.emoji} ${animal.nameTh}: "${animal.description}"`);
    setTimeout(() => {
      setAnimalTalkBubble(null);
    }, 4500);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-b from-sky-100 via-emerald-50/70 to-emerald-100/90 dark:from-stone-900 dark:via-stone-900/95 dark:to-emerald-950/40 shadow-xl p-4 sm:p-6 md:p-8">
      {/* Background Decor: Gentle Clouds & Distant Hills */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none opacity-40">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full fill-emerald-200/50 dark:fill-emerald-900/20">
          <path d="M0,160 Q250,90 500,150 T1000,130 L1000,200 L0,200 Z" />
        </svg>
      </div>

      {/* Garden Top Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/70 dark:border-stone-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
              สวนดอกไม้ของฉัน 🌿
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              ทุกการโฟกัสหล่อเลี้ยงให้สวนเติบโต
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Dopamine Reward Points Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/70 dark:to-yellow-950/70 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-extrabold text-sm shadow-xs">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{rewardPoints}</span>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 hidden sm:inline">แต้มโดปามีน</span>
          </div>

          {/* Water Drops Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/50 rounded-xl border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-semibold text-sm">
            <Droplet className="w-4 h-4 fill-sky-400 text-sky-500" />
            <span>{waterDrops}</span>
            <span className="text-xs font-normal text-sky-600 dark:text-sky-400 hidden sm:inline">หยดน้ำ</span>
          </div>

          {/* Sunlight Points Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold text-sm">
            <Sun className="w-4 h-4 fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '24s' }} />
            <span>{sunlightPoints}</span>
            <span className="text-xs font-normal text-amber-600 dark:text-amber-400 hidden sm:inline">แสงแดด</span>
          </div>
        </div>
      </div>

      {/* Visiting Cute Animals Habitat Banner (System 3: Gamification & Immediate Reward) */}
      <div className="relative z-10 mb-6 p-3 rounded-2xl bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm border border-emerald-100/90 dark:border-stone-700/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-200">
            <span>🐾 เพื่อนสัตว์น่ารักที่แวะมาเยี่ยมสวน ({unlockedAnimals.length}/{GARDEN_ANIMALS.length} ชนิด):</span>
          </div>
          <span className="text-[11px] text-stone-400">
            แต้มสะสมยิ่งเยอะ สัตว์ยิ่งมาเยอะ!
          </span>
        </div>

        {/* Animal avatars list */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {GARDEN_ANIMALS.map((animal) => {
            const isUnlocked = unlockedAnimals.includes(animal.id) || rewardPoints >= animal.unlockPoints;
            return (
              <div
                key={animal.id}
                onClick={() => {
                  if (isUnlocked) handleAnimalClick(animal);
                }}
                className={`relative px-3 py-2 rounded-2xl flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-stone-800 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs hover:scale-105'
                    : 'bg-stone-100/60 dark:bg-stone-800/30 border border-dashed border-stone-300 dark:border-stone-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className={`text-2xl ${isUnlocked ? 'animate-bounce' : 'grayscale'}`} style={{ animationDuration: '2.5s' }}>
                  {animal.emoji}
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    <span>{animal.nameTh}</span>
                    {!isUnlocked && (
                      <span className="text-[9px] bg-stone-200 dark:bg-stone-700 px-1 rounded-sm text-stone-500">
                        {animal.unlockPoints} แต้ม
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate max-w-[110px]">
                    {isUnlocked ? 'กดเพื่อทักทาย' : `ปลดล็อกที่ ${animal.unlockPoints} แต้ม`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animal dialogue bubble popup */}
        {animalTalkBubble && (
          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 font-medium animate-fadeIn flex items-center justify-between">
            <span>{animalTalkBubble}</span>
            <button
              onClick={() => setAnimalTalkBubble(null)}
              className="text-stone-400 hover:text-stone-600 text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Grid of 6 Interactive Plots */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {plots.map((plot) => {
          const flowerInfo = plot.flowerType ? FLOWER_MOODS[plot.flowerType] : null;
          const isSelected = selectedPlotId === plot.id;

          return (
            <div
              key={plot.id}
              onClick={() => {
                if (!plot.flowerType) {
                  onPlantNew(plot.index);
                } else {
                  setSelectedPlotId(plot.id);
                  onSelectPlot(plot);
                }
              }}
              className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between min-h-[220px] ${
                isSelected
                  ? 'ring-3 ring-emerald-500 bg-white/95 dark:bg-stone-800/95 shadow-xl scale-[1.02]'
                  : 'bg-white/70 dark:bg-stone-800/60 hover:bg-white/90 dark:hover:bg-stone-800/80 hover:shadow-lg border border-emerald-100/80 dark:border-stone-700'
              }`}
            >
              {/* Plot Index badge */}
              <div className="w-full flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 mb-1">
                <span className="font-medium">แปลงที่ {plot.index + 1}</span>
                {plot.flowerType && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${flowerInfo?.badgeBg} ${flowerInfo?.badgeText}`}>
                    {plot.stage === 'seed' && 'เมล็ดพันธุ์'}
                    {plot.stage === 'sprout' && 'หน่ออ่อน'}
                    {plot.stage === 'bud' && 'ดอกตูม'}
                    {plot.stage === 'bloom' && 'บานสะพรั่ง'}
                    {plot.stage === 'radiant' && 'เปล่งประกาย ✨'}
                  </span>
                )}
              </div>

              {/* Flower Centerpiece */}
              <div className="py-2 w-full flex items-center justify-center">
                <FlowerRenderer
                  flowerType={plot.flowerType}
                  stage={plot.stage}
                  progressPercent={plot.progressPercent}
                  waterLevel={plot.waterLevel}
                  className="w-28 h-28 sm:w-32 sm:h-32"
                />
              </div>

              {/* Plot Footer / Action info */}
              {plot.flowerType && flowerInfo ? (
                <div className="w-full mt-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex flex-col items-center text-center">
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    <span>{flowerInfo.emoji}</span>
                    <span>{flowerInfo.nameTh}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-full">
                    {flowerInfo.feeling.split('(')[0]}
                  </span>

                  {/* Quick Action Button */}
                  <div className="w-full mt-2 flex items-center gap-1.5 justify-center">
                    <button
                      onClick={(e) => handleWater(plot.id, e)}
                      disabled={waterDrops <= 0 || plot.waterLevel >= 100}
                      title="รดน้ำต้นไม้"
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                        waterDrops > 0 && plot.waterLevel < 100
                          ? 'bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300'
                          : 'bg-stone-100 text-stone-400 dark:bg-stone-700 dark:text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Droplet className="w-3.5 h-3.5" />
                      <span>รดน้ำ</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartFocusOnFlower(plot.flowerType!, plot.id);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>โฟกัส</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full mt-2 flex flex-col items-center justify-center text-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    ปลูกดอกไม้ใหม่
                  </span>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">
                    เลือกแทนอารมณ์ของคุณ
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Plot Detailed Inspector Sheet */}
      {activePlot && activePlot.flowerType && (
        <div className="mt-6 p-4 rounded-2xl bg-white/95 dark:bg-stone-800/95 border border-stone-200 dark:border-stone-700 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{FLOWER_MOODS[activePlot.flowerType].emoji}</span>
              <div>
                <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base">
                  {FLOWER_MOODS[activePlot.flowerType].nameTh} — แปลงที่ {activePlot.index + 1}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {FLOWER_MOODS[activePlot.flowerType].feeling}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {FLOWER_MOODS[activePlot.flowerType].feelingDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={(e) => handleWater(activePlot.id, e)}
                disabled={waterDrops <= 0 || activePlot.waterLevel >= 100}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-100 hover:bg-sky-200 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>รดน้ำดอกไม้นี้ (+15% ความชุ่มชื้น)</span>
              </button>

              <button
                onClick={() => onStartFocusOnFlower(activePlot.flowerType!, activePlot.id)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>เริ่มฝึกสมาธิกับดอกไม้นี้</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
