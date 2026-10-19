import React, { useState, useEffect, useRef } from 'react';
import { soundSynth } from '../services/soundSynthesizer';
import { FlowerMoodType } from '../types/garden';
import { FLOWER_MOODS, SANCTUARY_ZONES } from '../data/flowerConstants';
import {
  Wind,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Bot,
  Send,
  Coffee,
  RotateCcw,
  Compass,
  Smile,
  Shield,
  Eye,
} from 'lucide-react';

interface MindfulSanctuaryProps {
  unlockedZones: string[];
  totalFocusMinutes: number;
  onBackToGarden: () => void;
}

export const MindfulSanctuary: React.FC<MindfulSanctuaryProps> = ({
  unlockedZones,
  totalFocusMinutes,
  onBackToGarden,
}) => {
  // Active Tab: Breathing exercise, Butterfly Glade, Ambient Soundboard, Reflection Journal
  const [activeTab, setActiveTab] = useState<'breathe' | 'butterflies' | 'journal' | 'soundboard'>('breathe');

  // Breathing state: Inhale (4s), Hold (4s), Exhale (4s), Rest (4s) - Box breathing
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);
  const [breathsCompleted, setBreathsCompleted] = useState(0);

  // Soundscape
  const [activeSound, setActiveSound] = useState<'wind' | 'rain' | 'chimes' | 'stream' | 'bowl' | 'none'>('chimes');
  const [volume, setVolume] = useState(0.4);

  // Journaling & Reflection
  const [journalMood, setJournalMood] = useState<FlowerMoodType>('lavender');
  const [journalNote, setJournalNote] = useState('');
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [loadingReflection, setLoadingReflection] = useState(false);

  // Butterfly Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const butterfliesRef = useRef<
    { x: number; y: number; vx: number; vy: number; color: string; size: number; flapAngle: number }[]
  >([]);

  // Start initial sound
  useEffect(() => {
    soundSynth.play('chimes');
    soundSynth.setVolume(volume);
    return () => {
      soundSynth.stop();
    };
  }, []);

  const handleSoundChange = (snd: 'wind' | 'rain' | 'chimes' | 'stream' | 'bowl' | 'none') => {
    setActiveSound(snd);
    if (snd === 'none') {
      soundSynth.stop();
    } else {
      soundSynth.play(snd);
      soundSynth.setVolume(volume);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    soundSynth.setVolume(v);
  };

  // Breathing Loop
  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          // Switch phase
          setBreathPhase((current) => {
            if (current === 'inhale') return 'hold';
            if (current === 'hold') return 'exhale';
            if (current === 'exhale') {
              setBreathsCompleted((b) => b + 1);
              return 'rest';
            }
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // Butterfly Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 360);

    // Initialize 6 gentle butterflies
    const colors = ['#38BDF8', '#F472B6', '#A78BFA', '#FBBF24', '#34D399', '#FB7185'];
    butterfliesRef.current = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.2,
      color: colors[i % colors.length],
      size: 14 + Math.random() * 8,
      flapAngle: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      butterfliesRef.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.flapAngle += 0.2;

        // Boundaries
        if (b.x < 20 || b.x > width - 20) b.vx *= -1;
        if (b.y < 20 || b.y > height - 20) b.vy *= -1;

        // Gentle wandering
        b.vx += (Math.random() - 0.5) * 0.2;
        b.vy += (Math.random() - 0.5) * 0.2;
        b.vx = Math.max(-2, Math.min(2, b.vx));
        b.vy = Math.max(-1.5, Math.min(1.5, b.vy));

        // Draw Butterfly
        const flap = Math.sin(b.flapAngle);
        ctx.save();
        ctx.translate(b.x, b.y);

        // Wing 1
        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(-b.size * 0.6 * Math.abs(flap), -b.size * 0.3, b.size * 0.7 * Math.abs(flap), b.size * 0.5, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Wing 2
        ctx.beginPath();
        ctx.ellipse(b.size * 0.6 * Math.abs(flap), -b.size * 0.3, b.size * 0.7 * Math.abs(flap), b.size * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(0, 0, 2.5, b.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);

  const handleJournalSubmit = async () => {
    if (!journalNote.trim()) return;
    setLoadingReflection(true);
    try {
      const res = await fetch('/api/ai/gentle-mercy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intendedDuration: 0,
          elapsedMinutes: 0,
          taskTitle: `บันทึกความรู้สึกในสวน: "${journalNote}" (อารมณ์: ${FLOWER_MOODS[journalMood].nameTh})`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiReflection(data.mercyExplanation || data.calmPrompt || 'การรับรู้และเขียนความรู้สึกออกมา คือการรดน้ำให้หัวใจตัวเองอย่างแท้จริง 🌱');
      }
    } catch (e) {
      setAiReflection('การได้หยุดพักและยอมรับทุกอารมณ์คือจุดเริ่มต้นของความสงบสุขในใจ สวนแห่งนี้พร้อมโอบกอดคุณเสมอ 🌸');
    } finally {
      setLoadingReflection(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-teal-50/90 via-sky-50/70 to-emerald-50/90 dark:from-stone-900 dark:via-stone-900 dark:to-teal-950/30 border border-teal-100 dark:border-stone-800 shadow-xl p-6 sm:p-8">
      {/* Sanctuary Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-teal-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-white flex items-center justify-center text-2xl shadow-md">
            🦋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100">
                สวนพักใจ (Mindful Sanctuary)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                พื้นที่ปลอดภัย
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              พักผ่อนโดยไม่มีการกดดัน ไม่ต้องทำภารกิจเพื่อรักษาสวนให้สวยงาม 🌿
            </p>
          </div>
        </div>

        <button
          onClick={onBackToGarden}
          className="px-4 py-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors shadow-xs"
        >
          กลับสู่สวนดอกไม้ 🌱
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 my-6 overflow-x-auto pb-1">
        {[
          { id: 'breathe', label: '🌸 ฝึกหายใจ (Box Breathing)', icon: '💨' },
          { id: 'butterflies', label: '🦋 ลานผีเสื้อและสายน้ำ', icon: '🦋' },
          { id: 'soundboard', label: '🎶 เสียงธรรมชาติบำบัด', icon: '🍃' },
          { id: 'journal', label: '📝 สมุดบันทึกใจอบอุ่น', icon: '💌' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-[1.02]'
                : 'bg-white/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-teal-50 dark:hover:bg-stone-700'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: GUIDED BREATHING */}
      {activeTab === 'breathe' && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mb-8">
            การฝึกหายใจแบบกล่อง (Box Breathing) 4 จังหวะ ช่วยปรับระบบประสาทให้สงบ ลดความเครียดและความวิตกกังวล
          </p>

          {/* Interactive Breathing Flower Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            {/* Outer expanding halo */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out ${
                breathPhase === 'inhale'
                  ? 'scale-115 bg-teal-200/50 dark:bg-teal-900/40 blur-md'
                  : breathPhase === 'hold'
                  ? 'scale-115 bg-cyan-200/60 dark:bg-cyan-900/50 blur-md'
                  : breathPhase === 'exhale'
                  ? 'scale-85 bg-pink-200/50 dark:bg-pink-900/40 blur-md'
                  : 'scale-90 bg-amber-100/40 dark:bg-amber-900/30'
              }`}
            />

            {/* Inner pulsing circle with flower */}
            <div
              className={`relative z-10 w-48 h-48 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-300 to-sky-300 dark:from-teal-700 dark:via-emerald-600 dark:to-cyan-600 shadow-xl flex flex-col items-center justify-center text-white transition-transform duration-1000 ease-in-out ${
                breathPhase === 'inhale'
                  ? 'scale-110'
                  : breathPhase === 'hold'
                  ? 'scale-110'
                  : 'scale-90'
              }`}
            >
              <span className="text-3xl mb-1">
                {breathPhase === 'inhale' && '🌬️'}
                {breathPhase === 'hold' && '✨'}
                {breathPhase === 'exhale' && '🍃'}
                {breathPhase === 'rest' && '🌸'}
              </span>

              <div className="text-xl font-extrabold tracking-wide">
                {breathPhase === 'inhale' && 'หายใจเข้า'}
                {breathPhase === 'hold' && 'กลั้นหายใจนิ่ง'}
                {breathPhase === 'exhale' && 'หายใจออกช้าๆ'}
                {breathPhase === 'rest' && 'ผ่อนคลายสบาย'}
              </div>

              <div className="text-4xl font-bold font-mono mt-1 opacity-90">
                {breathCounter}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
            <span>ฝึกหายใจไปแล้ว: <strong className="text-teal-700 dark:text-teal-300">{breathsCompleted} รอบ</strong></span>
            <span>•</span>
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold hover:bg-teal-200 transition-colors"
            >
              {isBreathingActive ? 'หยุดชั่วคราว' : 'เริ่มต่อ'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: BUTTERFLIES CANVAS */}
      {activeTab === 'butterflies' && (
        <div className="flex flex-col items-center">
          <div className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-emerald-100/60 dark:from-stone-800 dark:to-stone-900 border border-teal-100 dark:border-stone-700 shadow-inner">
            <canvas ref={canvasRef} className="w-full h-80 cursor-pointer block" />
            <div className="absolute bottom-3 left-4 text-[11px] text-stone-500 dark:text-stone-400 bg-white/70 dark:bg-stone-800/80 px-2.5 py-1 rounded-full backdrop-blur-xs">
              🦋 ผีเสือกำลังโบยบินอย่างอิสระในสวนแห่งความสงบ
            </div>
          </div>

          {/* Unlocked Sanctuary Biomes */}
          <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SANCTUARY_ZONES.map((zone) => {
              const isUnlocked = totalFocusMinutes >= zone.minFocusMinutes;
              return (
                <div
                  key={zone.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-white dark:bg-stone-800/80 border-teal-200 dark:border-stone-700 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800/30 border-dashed border-stone-300 dark:border-stone-700 opacity-60'
                  }`}
                >
                  <div className="text-xl mb-1">{zone.icon}</div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center justify-between">
                    <span>{zone.name.split('(')[0]}</span>
                    {!isUnlocked && <span className="text-[10px] text-stone-400">สะสม {zone.minFocusMinutes} น.</span>}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                    {zone.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AMBIENT SOUNDBOARD */}
      {activeTab === 'soundboard' && (
        <div className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { id: 'chimes', title: 'กระดิ่งลมเซน (Zen Chimes)', desc: 'เสียงกระดิ่งเพนทาโทนิกกังวาน ปรับสมองสู่คลื่นอัลฟา', icon: '🎐' },
              { id: 'rain', title: 'ฝนโปรยปราย (Soft Rain)', desc: 'เสียงละอองฝนกระทบใบไม้ เพิ่มความรู้สึกอบอุ่น ปลอดภัย', icon: '🌧️' },
              { id: 'stream', title: 'ลำธารในสวน (Garden Stream)', desc: 'สายน้ำไหลเอื่อย ช่วยชะล้างความเหนื่อยล้าของวัน', icon: '💧' },
              { id: 'wind', title: 'สายลมแผ่วเบา (Gentle Breeze)', desc: 'เสียงลมพัดผ่านแมกไม้ ช่วยคลายความตึงเครียด', icon: '🍃' },
              { id: 'bowl', title: 'ขันธิเบต (Singing Bowl)', desc: 'คลื่นเสียงสะท้อนลึก เสริมความสงบนิ่งและจิตสำนึกรู้', icon: '🎵' },
              { id: 'none', title: 'ปิดเสียง (Pure Silence)', desc: 'อยู่กับความเงียบสงบในพื้นที่ส่วนตัวของคุณ', icon: '🔇' },
            ].map((snd) => {
              const isPlaying = activeSound === snd.id;
              return (
                <div
                  key={snd.id}
                  onClick={() => handleSoundChange(snd.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isPlaying
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-800/60 hover:border-teal-300'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{snd.icon}</div>
                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-1 flex items-center justify-between">
                    <span>{snd.title}</span>
                    {isPlaying && (
                      <span className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full animate-pulse">
                        กำลังเล่น
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {snd.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Master Volume Slider */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center gap-4">
            <Volume2 className="w-5 h-5 text-teal-600 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                <span>ระดับเสียงบำบัด</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMOTION JOURNAL & GRATITUDE */}
      {activeTab === 'journal' && (
        <div className="max-w-xl mx-auto py-2">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              เลือกดอกไม้ที่แทนความรู้สึกของคุณในขณะนี้
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['sunflower', 'tulip', 'rose', 'lavender', 'daisy'] as FlowerMoodType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setJournalMood(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    journalMood === f
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <span>{FLOWER_MOODS[f].emoji}</span>
                  <span>{FLOWER_MOODS[f].nameTh}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              เขียนสิ่งที่อยากระบาย ขอบคุณ หรือปล่อยวางในวันนี้
            </label>
            <textarea
              rows={4}
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="วันนี้เรารู้สึกเหนื่อยกับการสอบนิดหน่อย แต่ก็ภูมิใจที่ยังสู้ต่อ... หรือ สิ่งเล็กๆ ที่ทำให้ยิ้มได้วันนี้คือ..."
              className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
            />
          </div>

          <button
            onClick={handleJournalSubmit}
            disabled={!journalNote.trim() || loadingReflection}
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{loadingReflection ? 'AI กำลังรับฟังและส่งพลังใจ...' : 'ส่งบันทึกและรับพลังใจจากสวน'}</span>
          </button>

          {/* AI Empathetic Reflection */}
          {aiReflection && (
            <div className="mt-6 p-4 rounded-2xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-start gap-3 text-xs sm:text-sm text-teal-900 dark:text-teal-200 animate-fadeIn">
              <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-teal-800 dark:text-teal-300">
                  ข้อความสะท้อนใจจาก AI Garden Companion:
                </p>
                <p className="leading-relaxed">{aiReflection}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
