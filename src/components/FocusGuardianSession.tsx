import React, { useState, useEffect, useRef } from 'react';
import { FlowerMoodType, GrowthStage, UserHabitProfile } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import { FlowerRenderer } from './FlowerRenderer';
import { soundSynth } from '../services/soundSynthesizer';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Bot,
  Heart,
  Droplet,
  Sun,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Coffee,
  X,
} from 'lucide-react';

interface FocusGuardianSessionProps {
  initialMoodFlower: FlowerMoodType;
  userProfile: UserHabitProfile;
  plotId?: string;
  onFinishSession: (sessionData: {
    durationMinutes: number;
    completed: boolean;
    actualMinutes: number;
    moodFlower: FlowerMoodType;
    selfFocusScore: number;
    distraction?: string;
    plotId?: string;
  }) => void;
  onCancel: () => void;
  onNavigateToSanctuary: () => void;
}

export const FocusGuardianSession: React.FC<FocusGuardianSessionProps> = ({
  initialMoodFlower,
  userProfile,
  plotId,
  onFinishSession,
  onCancel,
  onNavigateToSanctuary,
}) => {
  // Session Configuration
  const [taskTitle, setTaskTitle] = useState('อ่านหนังสือและทบทวนบทเรียน');
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Soundscape
  const [currentSound, setCurrentSound] = useState<'rain' | 'wind' | 'chimes' | 'stream' | 'bowl' | 'none'>('chimes');
  const [soundVolume, setSoundVolume] = useState<number>(0.35);

  // AI Guardian Adaptive Advice State
  const [guardianTip, setGuardianTip] = useState<{
    suggestedDuration: number;
    guardianMessage: string;
    gentleTip: string;
  } | null>(null);
  const [loadingGuardian, setLoadingGuardian] = useState(false);

  // Mercy Modal State (Non-punitive handling)
  const [showMercyModal, setShowMercyModal] = useState(false);
  const [mercyData, setMercyData] = useState<{
    supportiveTitle: string;
    mercyExplanation: string;
    suggestedMicroStep: string;
    calmPrompt: string;
  } | null>(null);
  const [loadingMercy, setLoadingMercy] = useState(false);

  // Completion / Self-Rating Modal State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selfScore, setSelfScore] = useState(8);
  const [selectedDistraction, setSelectedDistraction] = useState('ไม่มีสิ่งรบกวน โฟกัสได้ดี');

  // Fetch AI Guardian Initial Advice on mount
  useEffect(() => {
    async function fetchAdvice() {
      setLoadingGuardian(true);
      try {
        const res = await fetch('/api/ai/guardian-advice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodFlower: FLOWER_MOODS[initialMoodFlower].emoji,
            moodName: FLOWER_MOODS[initialMoodFlower].nameTh,
            recentSessionsCount: userProfile.completedSessionsCount,
            avgDuration: userProfile.totalFocusMinutes > 0
              ? Math.round(userProfile.totalFocusMinutes / Math.max(1, userProfile.completedSessionsCount))
              : 15,
            successRatePercent: userProfile.totalSessionsAttempted > 0
              ? Math.round((userProfile.completedSessionsCount / userProfile.totalSessionsAttempted) * 100)
              : 85,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setGuardianTip(data);
          if (data.suggestedDuration) {
            setSelectedDuration(data.suggestedDuration);
            setSecondsRemaining(data.suggestedDuration * 60);
          }
        }
      } catch (err) {
        console.warn('Guardian advice fetch error:', err);
      } finally {
        setLoadingGuardian(false);
      }
    }
    fetchAdvice();
  }, [initialMoodFlower]);

  // Manage Soundscape
  useEffect(() => {
    if (isStarted && !isPaused && currentSound !== 'none') {
      soundSynth.play(currentSound);
      soundSynth.setVolume(soundVolume);
    } else {
      soundSynth.stop();
    }
    return () => {
      soundSynth.stop();
    };
  }, [isStarted, isPaused, currentSound]);

  useEffect(() => {
    soundSynth.setVolume(soundVolume);
  }, [soundVolume]);

  // Timer Tick
  useEffect(() => {
    if (isStarted && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNormalComplete();
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
  }, [isStarted, isPaused]);

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleDurationChange = (minutes: number) => {
    if (!isStarted) {
      setSelectedDuration(minutes);
      setSecondsRemaining(minutes * 60);
    }
  };

  // Called when timer reaches 0 naturally
  const handleNormalComplete = () => {
    soundSynth.stop();
    soundSynth.playSuccessFanfare();
    setShowCompletionModal(true);
  };

  // Non-punitive mercy trigger when user wants to stop early
  const handleRequestEarlyStop = async () => {
    setIsPaused(true);
    soundSynth.stop();
    setLoadingMercy(true);
    setShowMercyModal(true);

    const elapsedMin = elapsedSeconds / 60;
    try {
      const res = await fetch('/api/ai/gentle-mercy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intendedDuration: selectedDuration,
          elapsedMinutes: elapsedMin,
          taskTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMercyData(data);
      }
    } catch (e) {
      setMercyData({
        supportiveTitle: 'ไม่เป็นไรเลยนะ ทุกนาทีมีความหมาย 🌸',
        mercyExplanation: `คุณได้ก้าวออกมาทำแล้ว ${Math.max(1, Math.round(elapsedMin))} นาที ดอกไม้ของคุณยังปลอดภัยและได้รับสารอาหารแห่งความพยายาม ไม่มีการลงโทษใดๆ`,
        suggestedMicroStep: 'ลองแบ่งภารกิจให้เล็กลงเหลือ 5-10 นาที แล้วค่อยทำต่อเมื่อพร้อม',
        calmPrompt: 'ลองแวะไปผ่อนคลายกับเสียงธรรมชาติในสวนพักใจสักครู่',
      });
    } finally {
      setLoadingMercy(false);
    }
  };

  // Complete after Mercy flow (still earns partial points and updates garden!)
  const handleConfirmMercyExit = (reducedToMinutes?: number) => {
    const actualMin = Math.max(1, Math.round(elapsedSeconds / 60));
    setShowMercyModal(false);

    if (reducedToMinutes) {
      // Re-adjust timer to micro-step
      setSelectedDuration(reducedToMinutes);
      setSecondsRemaining(reducedToMinutes * 60);
      setElapsedSeconds(0);
      setIsStarted(true);
      setIsPaused(false);
    } else {
      // Finish with mercy (no penalty)
      onFinishSession({
        durationMinutes: selectedDuration,
        completed: false,
        actualMinutes: actualMin,
        moodFlower: initialMoodFlower,
        selfFocusScore: 6,
        distraction: 'พักก่อนเวลา (AI ช่วยปรับภารกิจให้เล็กลง)',
        plotId,
      });
    }
  };

  // Final submit after natural completion
  const handleFinalSubmit = () => {
    const actualMin = selectedDuration;
    setShowCompletionModal(false);
    onFinishSession({
      durationMinutes: selectedDuration,
      completed: true,
      actualMinutes: actualMin,
      moodFlower: initialMoodFlower,
      selfFocusScore: selfScore,
      distraction: selectedDistraction,
      plotId,
    });
  };

  // Calculate dynamic growth stage as timer ticks
  const progressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / (selectedDuration * 60)) * 100)
  );

  let dynamicStage: GrowthStage = 'seed';
  if (progressPercent > 85) dynamicStage = 'radiant';
  else if (progressPercent > 60) dynamicStage = 'bloom';
  else if (progressPercent > 30) dynamicStage = 'bud';
  else if (progressPercent > 5) dynamicStage = 'sprout';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-stone-800 shadow-xl">
      {/* Session Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
            🧠
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              AI Focus Guardian
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                ระบบดูแลสมาธิวัยรุ่น
              </span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              จดจ่ออย่างอ่อนโยน สวนเติบโตตามเวลาจริง
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          disabled={isStarted && !isPaused}
          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* AI Guardian Adaptive Tip Card */}
      {guardianTip && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-sky-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3">
          <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              {guardianTip.guardianMessage}
            </p>
            <p className="text-emerald-700/80 dark:text-emerald-400 mt-1">
              💡 ทริคประจำวัน: {guardianTip.gentleTip}
            </p>
          </div>
        </div>
      )}

      {/* Task Input */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
          ภารกิจที่คุณต้องการฝึกสมาธิในครั้งนี้
        </label>
        <input
          type="text"
          disabled={isStarted}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="เช่น อ่านหนังสือประวัติศาสตร์ 1 บท, สรุปสูตรเคมี, ทบทวนศัพท์อังกฤษ..."
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:bg-stone-50 disabled:text-stone-500"
        />
      </div>

      {/* Center Flower & Timer Growth Visual */}
      <div className="flex flex-col items-center justify-center my-6 py-4 relative">
        {/* Flower Stage Renderer */}
        <div className="relative mb-2">
          <FlowerRenderer
            flowerType={initialMoodFlower}
            stage={dynamicStage}
            progressPercent={progressPercent}
            isFocusing={isStarted && !isPaused}
            className="w-44 h-44 sm:w-52 sm:h-52"
          />
        </div>

        {/* Big Digital Clock */}
        <div className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-800 dark:text-stone-100 font-mono my-2">
          {formatTime(secondsRemaining)}
        </div>

        {/* Growth Stage Text Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400 mt-1">
          <span>ความก้าวหน้า: {progressPercent}%</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {dynamicStage === 'seed' && '🌱 เมล็ดพันธุ์เริ่มตื่นตัว'}
            {dynamicStage === 'sprout' && '🌿 ต้นกล้าผลิใบแรก'}
            {dynamicStage === 'bud' && '🌷 ดอกตูมสะสมพลังงาน'}
            {dynamicStage === 'bloom' && '🌸 ดอกไม้เริ่มบานสะพรั่ง'}
            {dynamicStage === 'radiant' && '✨ บานเปล่งประกายพร้อมผีเสื้อ'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Duration Selector (Disabled when started) */}
      {!isStarted && (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
            เลือกระยะเวลาที่เหมาะกับพลังงานของคุณ
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {[10, 15, 20, 25, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedDuration === mins
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-700'
                }`}
              >
                {mins} นาที
                {guardianTip?.suggestedDuration === mins && (
                  <span className="block text-[9px] font-normal opacity-90 text-amber-200">
                    AI แนะนำ
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ambient Soundscape Controls */}
      <div className="mb-8 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-200">
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>เสียงธรรมชาติ:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'chimes', label: '🎐 กระดิ่งลม' },
            { id: 'rain', label: '🌧️ ฝนโปรย' },
            { id: 'stream', label: '💧 ลำธาร' },
            { id: 'wind', label: '🍃 สายลม' },
            { id: 'bowl', label: '🎵 ขันธิเบต' },
            { id: 'none', label: '🔇 เงียบ' },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => setCurrentSound(snd.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentSound === snd.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {currentSound !== 'none' && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-stone-400">ระดับเสียง:</span>
            <input
              type="range"
              min="0.05"
              max="0.9"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-16 accent-emerald-600"
            />
          </div>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        {!isStarted ? (
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>เริ่มโฟกัส ({selectedDuration} นาที)</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="px-5 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'ทำต่อ' : 'พักชั่วคราว'}</span>
            </button>

            <button
              onClick={handleRequestEarlyStop}
              className="px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-sm flex items-center gap-2 transition-colors border border-rose-200 dark:border-rose-900/40"
            >
              <Coffee className="w-4 h-4" />
              <span>ขอหยุดพัก / รู้สึกไม่ไหว</span>
            </button>
          </>
        )}
      </div>

      {/* NON-PUNITIVE MERCY MODAL (Crucial requirement from specification) */}
      {showMercyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                {mercyData?.supportiveTitle || 'ไม่เป็นไรเลยนะ คุณทำได้ยอดเยี่ยมแล้ว 🌸'}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {mercyData?.mercyExplanation ||
                  `คุณได้ใช้เวลาตั้งใจไปแล้ว ${Math.max(1, Math.round(elapsedSeconds / 60))} นาที ดอกไม้ของคุณไม่เหี่ยวเฉา และได้รับหยดน้ำแห่งความพยายาม ไม่มีการลงโทษใดๆ`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 mb-6 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                <span>คำแนะนำจาก AI Guardian:</span>
              </p>
              <p>{mercyData?.suggestedMicroStep || 'ลองปรับขนาดภารกิจให้เล็กลงเหลือ 5-7 นาที เพื่อความสบายใจ'}</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleConfirmMercyExit(5)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🌱 ลองต่ออีกเพียง 5 นาที (Micro-Focus Step)</span>
              </button>

              <button
                onClick={() => {
                  setShowMercyModal(false);
                  handleConfirmMercyExit();
                  onNavigateToSanctuary();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-semibold text-xs transition-colors border border-purple-200 dark:border-purple-800"
              >
                <span>🦋 แวะไปพักผ่อนในสวนพักใจก่อน (ฝึกหายใจ & ผีเสื้อ)</span>
              </button>

              <button
                onClick={() => handleConfirmMercyExit()}
                className="w-full py-2 px-4 rounded-xl text-stone-500 hover:text-stone-700 text-xs font-medium transition-colors"
              >
                บันทึกความพยายามวันนี้และกลับสู่สวน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETION & SELF-EVALUATION MODAL */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-1">
              ภารกิจสำเร็จงดงาม! 🎉
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              คุณโฟกัสสำเร็จ {selectedDuration} นาที ดอกไม้ของคุณผลิดอกบานสะพรั่ง
            </p>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/40 mb-6 flex items-center justify-center gap-6 text-sm font-bold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Droplet className="w-4 h-4 fill-sky-400 text-sky-500" />
                <span>+3 หยดน้ำ</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>+10 แสงแดด</span>
              </span>
            </div>

            {/* Self-Rating of Focus */}
            <div className="text-left mb-4">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                ประเมินระดับการจดจ่อของคุณด้วยตนเอง (1 - 10)
              </label>
              <div className="flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelfScore(num)}
                    className={`w-7 h-8 rounded-lg text-xs font-bold transition-all ${
                      selfScore === num
                        ? 'bg-emerald-600 text-white shadow-sm scale-110'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-emerald-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Distraction check */}
            <div className="text-left mb-6">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                มีสิ่งรบกวนเกิดขึ้นระหว่างทำหรือไม่?
              </label>
              <select
                value={selectedDistraction}
                onChange={(e) => setSelectedDistraction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="ไม่มีสิ่งรบกวน โฟกัสได้ดี">ไม่มีสิ่งรบกวน โฟกัสได้ดีเยี่ยม</option>
                <option value="แจ้งเตือนมือถือ / โซเชียลมีเดีย">แจ้งเตือนมือถือ / โซเชียลมีเดีย</option>
                <option value="ความคิดฟุ้งซ่าน / กังวลเรื่องอื่น">ความคิดฟุ้งซ่าน / กังวลเรื่องอื่น</option>
                <option value="เสียงรอบข้าง / คนในบ้านชวนคุย">เสียงรอบข้าง / คนในบ้านชวนคุย</option>
                <option value="ความง่วงหรือเหนื่อยล้า">ความง่วงหรือเหนื่อยล้า</option>
              </select>
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              นำคะแนนไปพัฒนาสวน 🌸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
