import React, { useState, useEffect, useRef } from 'react';
import { FlowerMoodType, MicroTaskStep, GrowthStage } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import { FlowerRenderer } from './FlowerRenderer';
import { soundSynth } from '../services/soundSynthesizer';
import {
  Play,
  Pause,
  Sparkles,
  Bot,
  Heart,
  Droplet,
  Sun,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  Volume2,
  VolumeX,
  X,
  Zap,
  Lock,
} from 'lucide-react';

interface AICompanionFocusModeProps {
  currentStep: MicroTaskStep;
  goalTitle?: string;
  moodFlower: FlowerMoodType;
  onFinishStep: (result: {
    stepId: string;
    completed: boolean;
    actualMinutes: number;
    emotion: 'happy' | 'neutral' | 'stressed';
    pointsEarned: number;
  }) => void;
  onCancel: () => void;
}

export const AICompanionFocusMode: React.FC<AICompanionFocusModeProps> = ({
  currentStep,
  goalTitle,
  moodFlower,
  onFinishStep,
  onCancel,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.max(60, currentStep.estimatedMinutes * 60)
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDistractionBlockedAlert, setIsDistractionBlockedAlert] = useState(false);

  // Companion avatar action state: 'reading' | 'cheering' | 'waving' | 'drinking'
  const [companionAction, setCompanionAction] = useState<'reading' | 'cheering' | 'waving' | 'drinking'>('reading');
  const [companionSpeech, setCompanionSpeech] = useState<string>(
    'เค้ากำลังนั่งทำงานอยู่ข้างๆ เธอนะ ลุยไปด้วยกันเลย!'
  );
  const [loadingCheer, setLoadingCheer] = useState(false);

  // Ambient sound
  const [soundTrack, setSoundTrack] = useState<'chimes' | 'rain' | 'stream' | 'none'>('chimes');

  // Completion & Emotion Reflection modal
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<'happy' | 'neutral' | 'stressed'>('happy');

  const timerRef = useRef<any>(null);

  // Start sound on mount
  useEffect(() => {
    soundSynth.play('chimes');
    soundSynth.setVolume(0.35);
    return () => {
      soundSynth.stop();
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleStepNaturalComplete();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Periodic companion dialogue updates (Body Doubling Role Model)
  useEffect(() => {
    const speechTimer = setInterval(() => {
      if (!isPaused && !showEmotionModal) {
        fetchCompanionCheer('working');
      }
    }, 45000);
    return () => clearInterval(speechTimer);
  }, [isPaused, showEmotionModal]);

  const fetchCompanionCheer = async (state: 'working' | 'distracted' | 'completed' | 'resting') => {
    setLoadingCheer(true);
    try {
      const res = await fetch('/api/ai/companion-cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionState: state,
          taskTitle: currentStep.title,
          elapsedMinutes: elapsedSeconds / 60,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompanionSpeech(data.cheerMessage || 'เค้าอยู่เป็นเพื่อนเสมอนะ!');
      }
    } catch {
      setCompanionSpeech('ก้าวทีละนิด ไม่ต้องรีบ สวนของเรากำลังเติบโต 🌸');
    } finally {
      setLoadingCheer(false);
    }
  };

  const handleStepNaturalComplete = () => {
    soundSynth.stop();
    soundSynth.playSuccessFanfare();
    setCompanionAction('cheering');
    setCompanionSpeech('เย้! ทำสเต็ปนี้สำเร็จแล้ว เก่งมากๆ เลย รับคะแนนไปเลย! 🎉');
    setShowEmotionModal(true);
  };

  const handleSimulateDistractionAttempt = () => {
    setIsDistractionBlockedAlert(true);
    setCompanionAction('waving');
    fetchCompanionCheer('distracted');
  };

  const handleConfirmFinish = () => {
    const actualMin = Math.max(1, Math.round(elapsedSeconds / 60));
    setShowEmotionModal(false);
    onFinishStep({
      stepId: currentStep.id,
      completed: true,
      actualMinutes: actualMin,
      emotion: selectedEmotion,
      pointsEarned: currentStep.points || 20,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalStepSecs = Math.max(60, currentStep.estimatedMinutes * 60);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalStepSecs) * 100));

  let dynamicStage: GrowthStage = 'seed';
  if (progressPercent > 80) dynamicStage = 'radiant';
  else if (progressPercent > 50) dynamicStage = 'bloom';
  else if (progressPercent > 20) dynamicStage = 'bud';
  else if (progressPercent > 5) dynamicStage = 'sprout';

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-emerald-50/90 via-sky-50/80 to-amber-50/80 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8">
      {/* Top Lock Mode Status Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>โหมดโฟกัสบล็อกสิ่งเร้า (Focus Mode ON)</span>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
            ปิดกั้น TikTok / เกมชั่วคราว
          </span>
        </div>

        <button
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Task & Goal Heading */}
      <div className="mb-6 text-center">
        {goalTitle && (
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-3 py-1 rounded-full inline-block mb-2">
            ภารกิจหลัก: {goalTitle}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-black text-stone-800 dark:text-stone-100">
          สเต็ปปัจจุบัน: {currentStep.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-lg mx-auto">
          {currentStep.description}
        </p>
      </div>

      {/* CENTER STAGE: AI COMPANION (ROLE MODEL) & BLOSSOMING FLOWER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-6 p-6 rounded-3xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 shadow-inner">
        {/* Left: AI Companion Body Double Avatar */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-3">
            {/* Cute Companion SVG Avatar */}
            <div className="w-36 h-36 relative flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                {/* Companion Desk */}
                <ellipse cx="60" cy="98" rx="46" ry="12" fill="#D7CCC8" />
                <rect x="25" y="86" width="70" height="8" rx="4" fill="#BCAAA4" />

                {/* Companion Body (Round Cute Sprout Buddy) */}
                <circle cx="60" cy="55" r="32" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
                <circle cx="60" cy="58" r="28" fill="#6EE7B7" />

                {/* Sprout Antennas on head */}
                <path d="M60 25 Q54 12 46 16 Q52 24 60 25" fill="#10B981" />
                <path d="M60 25 Q66 12 74 16 Q68 24 60 25" fill="#34D399" />
                <circle cx="60" cy="24" r="3" fill="#FBBF24" />

                {/* Eyes */}
                {companionAction === 'reading' ? (
                  // Focused happy smiling eyes
                  <g>
                    <path d="M47 54 Q51 59 55 54" stroke="#065F46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M65 54 Q69 59 73 54" stroke="#065F46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </g>
                ) : (
                  // Open excited eyes
                  <g>
                    <ellipse cx="50" cy="52" rx="3.5" ry="4.5" fill="#065F46" />
                    <circle cx="49" cy="50" r="1.5" fill="#FFF" />
                    <ellipse cx="70" cy="52" rx="3.5" ry="4.5" fill="#065F46" />
                    <circle cx="69" cy="50" r="1.5" fill="#FFF" />
                  </g>
                )}

                {/* Blush cheeks */}
                <circle cx="43" cy="60" r="4.5" fill="#FDA4AF" opacity="0.8" />
                <circle cx="77" cy="60" r="4.5" fill="#FDA4AF" opacity="0.8" />

                {/* Little smile */}
                <path d="M56 62 Q60 66 64 62" stroke="#065F46" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Tiny open book on desk */}
                <rect x="42" y="76" width="16" height="12" rx="1.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                <rect x="62" y="76" width="16" height="12" rx="1.5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                <line x1="45" y1="80" x2="55" y2="80" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="45" y1="84" x2="53" y2="84" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="65" y1="80" x2="75" y2="80" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="65" y1="84" x2="73" y2="84" stroke="#CBD5E1" strokeWidth="1" />

                {/* Little mug with steam */}
                <rect x="84" y="80" width="8" height="8" rx="2" fill="#F472B6" />
                <path d="M86 76 Q88 74 86 72" stroke="#FDA4AF" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Companion Name Tag */}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shadow-xs">
              🤖 น้องการ์เด้น (เพื่อนร่วมเรียน Role Model)
            </span>
          </div>

          {/* Speech Bubble */}
          <div className="relative p-3 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-200 max-w-xs shadow-xs animate-pulse-soft">
            "{companionSpeech}"
          </div>
        </div>

        {/* Right: Real-time Flower Growth & Digital Timer */}
        <div className="flex flex-col items-center justify-center text-center">
          <FlowerRenderer
            flowerType={moodFlower}
            stage={dynamicStage}
            progressPercent={progressPercent}
            isFocusing={!isPaused}
            className="w-32 h-32 sm:w-36 sm:h-36 mb-2"
          />

          <div className="text-4xl sm:text-5xl font-mono font-black text-stone-800 dark:text-stone-100 my-1">
            {formatTime(secondsRemaining)}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
            <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>ทำเสร็จรับทันที +{currentStep.points} แต้มโดปามีน</span>
          </div>

          {/* Mini progress track */}
          <div className="w-full max-w-[200px] h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Impulse Control Simulation Trigger & Ambient Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDistractionAttempt}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900/40 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ทดสอบเมื่อเผลอเปิด TikTok / สิ่งเร้า</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">เสียงช่วยสมาธิ:</span>
          {(['chimes', 'rain', 'stream', 'none'] as const).map((snd) => (
            <button
              key={snd}
              onClick={() => {
                setSoundTrack(snd);
                if (snd === 'none') soundSynth.stop();
                else {
                  soundSynth.play(snd);
                  soundSynth.setVolume(0.35);
                }
              }}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${
                soundTrack === snd
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              {snd === 'chimes' && '🎐 กระดิ่ง'}
              {snd === 'rain' && '🌧️ ฝน'}
              {snd === 'stream' && '💧 ลำธาร'}
              {snd === 'none' && '🔇 ปิด'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-6 py-3 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs shadow-sm border border-stone-200 dark:border-stone-700 flex items-center gap-2 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'ทำต่อกับบัดดี้' : 'พักชั่วคราว'}</span>
        </button>

        <button
          onClick={handleStepNaturalComplete}
          className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>ทำสเต็ปนี้เสร็จแล้ว! (รับแต้ม)</span>
        </button>
      </div>

      {/* DISTRACTION BLOCKED OVERLAY ALERT (System 2: Impulse Control) */}
      {isDistractionBlockedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 dark:border-rose-900 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-stone-800 dark:text-stone-100 mb-1">
              แอปสิ่งเร้าถูกบล็อกไว้ชั่วคราว! 🛡️
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              สมองกำลังอยากหนีไปหาสารกระตุ้นง่ายๆ (TikTok/Reels/เกม) เป็นเรื่องปกติของสมาธิสั้น
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 mb-6 text-left space-y-1.5">
              <p className="font-bold flex items-center gap-1.5">
                <span>🤖 น้องการ์เด้นสะกิดเตือน:</span>
              </p>
              <p>
                "ไม่เป็นไรเลยนะ เราเพิ่งทำสเต็ปนี้ไปได้อีกแค่นิดเดียวเอง หายใจลึกๆ 1 ครั้ง แล้วกลับมาทำต่อกัน อีกไม่กี่นาทีสวนจะมีสัตว์น่ารักมาเพิ่มนะ!"
              </p>
            </div>

            <button
              onClick={() => setIsDistractionBlockedAlert(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              กลับมาโฟกัสกับบัดดี้ต่อ 🌿
            </button>
          </div>
        </div>
      )}

      {/* POST-TASK EMOTION REFLECTION MODAL (System 4: Emotional Reflection) */}
      {showEmotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Zap className="w-8 h-8 fill-current" />
            </div>

            <h3 className="text-2xl font-black text-stone-800 dark:text-stone-100 mb-1">
              ยอดเยี่ยมมาก! +{currentStep.points} แต้ม 🌟
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              คุณทำสเต็ป "{currentStep.title}" สำเร็จแล้ว สารโดปามีนเชิงบวกกำลังช่วยให้สมองมีความสุข
            </p>

            {/* 3-Emoji Reflection Prompt (Mandatory System 4 Requirement) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 mb-6 text-left">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                จบสเต็ปนี้แล้ว ใจเธอรู้สึกอย่างไรบ้าง? (เลือก 1 ข้อ)
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'happy' as const, emoji: '😊', label: 'มีความสุข / ภูมิใจ', desc: 'ทำได้ลื่นไหล' },
                  { id: 'neutral' as const, emoji: '😐', label: 'เฉยๆ สบายๆ', desc: 'พอทำได้เรื่อยๆ' },
                  { id: 'stressed' as const, emoji: '😫', label: 'เครียด / เหนื่อย', desc: 'อยากได้พักผ่อน' },
                ].map((emo) => (
                  <button
                    key={emo.id}
                    onClick={() => setSelectedEmotion(emo.id)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      selectedEmotion === emo.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                    }`}
                  >
                    <span className="text-2xl mb-1">{emo.emoji}</span>
                    <span className="text-[11px] font-bold text-stone-800 dark:text-stone-100">{emo.label}</span>
                    <span className="text-[10px] text-stone-400">{emo.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmFinish}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all"
            >
              รับรางวัลและอัปเกรดสวนดอกไม้ 🌸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
