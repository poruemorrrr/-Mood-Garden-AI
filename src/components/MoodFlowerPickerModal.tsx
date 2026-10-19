import React, { useState } from 'react';
import { FlowerMoodType } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import { FlowerRenderer } from './FlowerRenderer';
import { X, Check, Sparkles, HeartHandshake, Info } from 'lucide-react';

interface MoodFlowerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (flowerType: FlowerMoodType, customNote: string) => void;
  plotIndex?: number | null;
  unlockedSpecialFlowers?: FlowerMoodType[];
}

export const MoodFlowerPickerModal: React.FC<MoodFlowerPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  plotIndex,
  unlockedSpecialFlowers = [],
}) => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerMoodType>('tulip');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const standardFlowers: FlowerMoodType[] = ['sunflower', 'tulip', 'rose', 'lavender', 'daisy'];
  const specialFlowers: FlowerMoodType[] = ['lotus', 'sakura'];

  const handleConfirm = () => {
    onSelect(selectedFlower, customNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>ขั้นตอนที่ 2: เลือกดอกไม้แทนอารมณ์</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100">
            ตอนนี้ใจคุณรู้สึกอย่างไรบ้าง? 🌼
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
            เลือกดอกไม้ที่ตรงกับความรู้สึกในขณะนี้ เพื่อเริ่มปลูกในแปลง{plotIndex !== null && plotIndex !== undefined ? `ที่ ${plotIndex + 1}` : ''}
          </p>
        </div>

        {/* Core Notice (Strict requirement from specification) */}
        <div className="mb-6 p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p>
            <span className="font-semibold">ข้อความสำคัญ:</span> ดอกไม้เหล่านี้เป็นสัญลักษณ์ที่คุณเลือกเองเพื่อการสังเกตและสะท้อนตนเองอย่างอ่อนโยน <strong>ไม่ใช่เครื่องมือวินิจฉัยอารมณ์หรือสุขภาพจิตทางการแพทย์ของ AI</strong>
          </p>
        </div>

        {/* Flower Selection Grid */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {standardFlowers.map((type) => {
              const info = FLOWER_MOODS[type];
              const isSelected = selectedFlower === type;

              return (
                <div
                  key={type}
                  onClick={() => setSelectedFlower(type)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800 bg-stone-50/50 dark:bg-stone-800/40'
                  }`}
                >
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                    <FlowerRenderer flowerType={type} stage="bloom" className="w-14 h-14" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-100 text-sm">
                      <span>{info.emoji}</span>
                      <span>{info.nameTh}</span>
                    </div>
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      {info.feeling}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {info.feelingDescription}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlocked Special Flowers */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ดอกไม้พิเศษจากการฝึกสมาธิ</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialFlowers.map((type) => {
                const info = FLOWER_MOODS[type];
                const isUnlocked = unlockedSpecialFlowers.includes(type);
                const isSelected = selectedFlower === type;

                return (
                  <div
                    key={type}
                    onClick={() => {
                      if (isUnlocked) setSelectedFlower(type);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      !isUnlocked
                        ? 'opacity-60 bg-stone-100 dark:bg-stone-800/20 border-dashed border-stone-300 dark:border-stone-700 cursor-not-allowed'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 cursor-pointer'
                        : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 cursor-pointer bg-stone-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                      <FlowerRenderer flowerType={type} stage="radiant" className="w-12 h-12" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-100 text-xs">
                        <span>{info.emoji}</span>
                        <span>{info.nameTh}</span>
                        {!isUnlocked && (
                          <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-1.5 py-0.2 rounded-md">
                            ล็อคอยู่
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {info.feeling}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Short Personal Intention Note */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
            บันทึกความรู้สึกหรือสิ่งที่ตั้งใจจะทำ (ไม่บังคับ)
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="เช่น อยากอ่านสรุปบทนี้ให้จบอย่างสบายใจ, พักสมองจากการบ้าน..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <span>ปลูกเมล็ดพันธุ์ {FLOWER_MOODS[selectedFlower].emoji}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
