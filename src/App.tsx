import React, { useState, useEffect } from 'react';
import {
  FlowerMoodType,
  GardenPlot,
  FocusSessionRecord,
  UserHabitProfile,
} from './types/garden';
import { FLOWER_MOODS } from './data/flowerConstants';
import { GardenCanvas } from './components/GardenCanvas';
import { MoodFlowerPickerModal } from './components/MoodFlowerPickerModal';
import { FocusGuardianSession } from './components/FocusGuardianSession';
import { MindfulSanctuary } from './components/MindfulSanctuary';
import { WeeklyReportView } from './components/WeeklyReportView';
import { GardenOnboarding } from './components/GardenOnboarding';
import { AdaptiveAIEcosystemCard } from './components/AdaptiveAIEcosystemCard';
import { soundSynth } from './services/soundSynthesizer';
import {
  Sprout,
  Heart,
  Droplet,
  Sun,
  Flame,
  BarChart3,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  BookOpen,
} from 'lucide-react';

const STORAGE_KEY = 'mood_garden_ai_state_v1';

const INITIAL_PLOTS: GardenPlot[] = [
  {
    id: 'plot-0',
    index: 0,
    unlocked: true,
    flowerType: 'tulip',
    flowerName: 'ดอกทิวลิปความสงบ',
    stage: 'bloom',
    progressPercent: 70,
    waterLevel: 85,
    sunshineLevel: 90,
  },
  {
    id: 'plot-1',
    index: 1,
    unlocked: true,
    flowerType: 'sunflower',
    flowerName: 'ทานตะวันพลังบวก',
    stage: 'bud',
    progressPercent: 40,
    waterLevel: 65,
    sunshineLevel: 75,
  },
  {
    id: 'plot-2',
    index: 2,
    unlocked: true,
    flowerType: null,
    flowerName: null,
    stage: 'seed',
    progressPercent: 0,
    waterLevel: 50,
    sunshineLevel: 50,
  },
  {
    id: 'plot-3',
    index: 3,
    unlocked: true,
    flowerType: 'lavender',
    flowerName: 'ลาเวนเดอร์ผ่อนคลาย',
    stage: 'radiant',
    progressPercent: 100,
    waterLevel: 90,
    sunshineLevel: 95,
  },
  {
    id: 'plot-4',
    index: 4,
    unlocked: true,
    flowerType: null,
    flowerName: null,
    stage: 'seed',
    progressPercent: 0,
    waterLevel: 50,
    sunshineLevel: 50,
  },
  {
    id: 'plot-5',
    index: 5,
    unlocked: true,
    flowerType: null,
    flowerName: null,
    stage: 'seed',
    progressPercent: 0,
    waterLevel: 50,
    sunshineLevel: 50,
  },
];

const INITIAL_SESSIONS: FocusSessionRecord[] = [
  {
    id: 's-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    date: '2026-10-16',
    time: '09:30',
    taskTitle: 'ทบทวนชีววิทยาระบบประสาท',
    durationMinutes: 15,
    completed: true,
    adaptedEarly: false,
    actualMinutes: 15,
    moodFlower: 'sunflower',
    selfFocusScore: 9,
    distraction: 'ไม่มีสิ่งรบกวน โฟกัสได้ดี',
  },
  {
    id: 's-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    date: '2026-10-17',
    time: '19:45',
    taskTitle: 'ทำการบ้านคณิตศาสตร์ เรื่องแคลคูลัส',
    durationMinutes: 20,
    completed: true,
    adaptedEarly: false,
    actualMinutes: 20,
    moodFlower: 'tulip',
    selfFocusScore: 8,
    distraction: 'แจ้งเตือนมือถือ / โซเชียลมีเดีย',
  },
  {
    id: 's-3',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    date: '2026-10-18',
    time: '14:15',
    taskTitle: 'เขียนสรุปบทความภาษาอังกฤษ',
    durationMinutes: 15,
    completed: true,
    adaptedEarly: false,
    actualMinutes: 15,
    moodFlower: 'lavender',
    selfFocusScore: 9,
    distraction: 'ไม่มีสิ่งรบกวน โฟกัสได้ดี',
  },
];

const INITIAL_PROFILE: UserHabitProfile = {
  name: 'เพื่อนรักสวนดอกไม้',
  targetActivities: ['อ่านหนังสือสอบ', 'ทำการบ้าน'],
  commonDistractions: ['แจ้งเตือนมือถือ', 'เผลอคิดเรื่องอื่น'],
  preferredFocusStyle: 'ชอบช่วงสั้นๆ 15 นาที มีเวลาพักเบาๆ',
  totalFocusMinutes: 50,
  completedSessionsCount: 3,
  totalSessionsAttempted: 3,
  waterDrops: 8,
  sunlightPoints: 35,
  streakDays: 3,
  unlockedSpecialFlowers: ['lotus'],
  unlockedSanctuaryZones: ['sunbeam', 'zen_pond'],
  hasCompletedOnboarding: true,
  adaptivePlan: {
    strategyTitle: 'กลยุทธ์ก้าวเล็กๆ แสนอบอุ่น (Micro-Focus Step)',
    recommendedDuration: 15,
    advice: 'เริ่มต้นฝึกสมาธิด้วยช่วงสั้น 15 นาที เพื่อลดความกดดันจากสิ่งรบกวน เมื่อทำสำเร็จดอกไม้จะผลิใบแรกทันที',
    microSteps: [
      'วางโทรศัพท์ให้ห่างจากสายตา 1 เมตร',
      'เตรียมน้ำดื่ม 1 แก้วข้างโต๊ะ',
      'โฟกัสที่ภารกิจแรกเพียง 15 นาที',
    ],
    encouragement: 'ยินดีต้อนรับสู่สวนของคุณ ทุกการเติบโตเริ่มต้นจากเมล็ดพันธุ์เล็กๆ เสมอ 🌱',
  },
};

export default function App() {
  const [profile, setProfile] = useState<UserHabitProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [plots, setPlots] = useState<GardenPlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_plots');
      return saved ? JSON.parse(saved) : INITIAL_PLOTS;
    } catch {
      return INITIAL_PLOTS;
    }
  });

  const [sessions, setSessions] = useState<FocusSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  // Current View: 'garden' | 'sanctuary' | 'focus'
  const [activeView, setActiveView] = useState<'garden' | 'sanctuary' | 'focus'>('garden');

  // Active Focus Setup
  const [focusMoodFlower, setFocusMoodFlower] = useState<FlowerMoodType>('tulip');
  const [focusPlotId, setFocusPlotId] = useState<string | undefined>(undefined);

  // Modals
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [targetPlotIndex, setTargetPlotIndex] = useState<number | null>(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle Planting new flower in a plot
  const handlePlantFlower = (flowerType: FlowerMoodType, customNote: string) => {
    if (targetPlotIndex === null) return;
    setPlots((prev) =>
      prev.map((p) => {
        if (p.index === targetPlotIndex) {
          return {
            ...p,
            flowerType,
            flowerName: FLOWER_MOODS[flowerType]?.nameTh || 'ดอกไม้',
            stage: 'seed',
            progressPercent: 5,
            waterLevel: 60,
            sunshineLevel: 70,
            notes: customNote,
            plantedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    setProfile((prev) => ({
      ...prev,
      sunlightPoints: prev.sunlightPoints + 5,
    }));
    soundSynth.playWaterSplash();
  };

  // Water a plot using 1 water drop
  const handleWaterPlot = (plotId: string) => {
    if (profile.waterDrops <= 0) return;
    setProfile((prev) => ({
      ...prev,
      waterDrops: Math.max(0, prev.waterDrops - 1),
    }));
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id === plotId) {
          const newWater = Math.min(100, p.waterLevel + 25);
          const newProgress = Math.min(100, p.progressPercent + 10);
          let newStage = p.stage;
          if (newProgress >= 90) newStage = 'radiant';
          else if (newProgress >= 65) newStage = 'bloom';
          else if (newProgress >= 35) newStage = 'bud';
          else if (newProgress >= 10) newStage = 'sprout';

          return {
            ...p,
            waterLevel: newWater,
            progressPercent: newProgress,
            stage: newStage,
            lastWateredAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  // Start Focus Session on a specific flower
  const handleStartFocus = (flowerType: FlowerMoodType, plotId?: string) => {
    setFocusMoodFlower(flowerType);
    setFocusPlotId(plotId);
    setActiveView('focus');
  };

  // Finish a Focus Session (Normal or with Mercy)
  const handleFinishFocusSession = (data: {
    durationMinutes: number;
    completed: boolean;
    actualMinutes: number;
    moodFlower: FlowerMoodType;
    selfFocusScore: number;
    distraction?: string;
    plotId?: string;
  }) => {
    const now = new Date();
    const newSession: FocusSessionRecord = {
      id: `s-${Date.now()}`,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      taskTitle: data.distraction?.includes('พักก่อน') ? 'มินิโฟกัส (Micro-Focus)' : 'ฝึกสมาธิกับสวน',
      durationMinutes: data.durationMinutes,
      completed: data.completed,
      adaptedEarly: !data.completed,
      actualMinutes: data.actualMinutes,
      moodFlower: data.moodFlower,
      selfFocusScore: data.selfFocusScore,
      distraction: data.distraction,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Reward points (even partial completion earns rewards!)
    const earnedDrops = data.completed ? 3 : 1;
    const earnedSunlight = data.completed ? 10 : 4;

    setProfile((prev) => {
      const newTotalMin = prev.totalFocusMinutes + data.actualMinutes;
      const newUnlockedFlowers = [...prev.unlockedSpecialFlowers];
      if (newTotalMin >= 30 && !newUnlockedFlowers.includes('lotus')) {
        newUnlockedFlowers.push('lotus');
      }
      if (newTotalMin >= 60 && !newUnlockedFlowers.includes('sakura')) {
        newUnlockedFlowers.push('sakura');
      }

      return {
        ...prev,
        totalFocusMinutes: newTotalMin,
        completedSessionsCount: prev.completedSessionsCount + (data.completed ? 1 : 0),
        totalSessionsAttempted: prev.totalSessionsAttempted + 1,
        waterDrops: prev.waterDrops + earnedDrops,
        sunlightPoints: prev.sunlightPoints + earnedSunlight,
        unlockedSpecialFlowers: newUnlockedFlowers,
      };
    });

    // Advance plot growth if targeted
    if (data.plotId) {
      setPlots((prev) =>
        prev.map((p) => {
          if (p.id === data.plotId) {
            const addedProgress = data.completed ? 30 : 15;
            const newProgress = Math.min(100, p.progressPercent + addedProgress);
            let nextStage = p.stage;
            if (newProgress >= 90) nextStage = 'radiant';
            else if (newProgress >= 60) nextStage = 'bloom';
            else if (newProgress >= 30) nextStage = 'bud';
            else if (newProgress >= 10) nextStage = 'sprout';

            return {
              ...p,
              progressPercent: newProgress,
              stage: nextStage,
              waterLevel: Math.min(100, p.waterLevel + 20),
            };
          }
          return p;
        })
      );
    }

    setActiveView('garden');
  };

  // Onboarding completion
  const handleOnboardingComplete = (data: any) => {
    setProfile((prev) => ({
      ...prev,
      name: data.userName,
      targetActivities: data.targetActivities,
      commonDistractions: data.distractions,
      preferredFocusStyle: data.preferredStyle,
      hasCompletedOnboarding: true,
      adaptivePlan: data.plan,
    }));

    // Plant starter flower in plot 0
    setPlots((prev) =>
      prev.map((p, idx) => {
        if (idx === 0) {
          return {
            ...p,
            flowerType: data.starterFlower as FlowerMoodType,
            flowerName: FLOWER_MOODS[data.starterFlower as FlowerMoodType]?.nameTh || 'ดอกไม้',
            stage: 'sprout',
            progressPercent: 20,
            waterLevel: 90,
            sunshineLevel: 80,
          };
        }
        return p;
      })
    );
  };

  // If user has not completed onboarding
  if (!profile.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-4 sm:p-8 flex items-center justify-center">
        <GardenOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveView('garden')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
              🌷
            </div>
            <div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                Mood Garden AI
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Adaptive
                </span>
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                สวนดอกไม้อัจฉริยะเพื่อสมาธิและสุขภาวะทางอารมณ์ในวัยรุ่น
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveView('garden')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'garden'
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              🌿 สวนของฉัน
            </button>

            <button
              onClick={() => setActiveView('sanctuary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'sanctuary'
                  ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              🦋 สวนพักใจ
            </button>

            <button
              onClick={() => setShowWeeklyReport(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>รายงานสัปดาห์</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              title="คู่มือ 7 ขั้นตอน"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Stat Counters & Focus CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40"
              title="ฝึกต่อเนื่องสะสม"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profile.streakDays} วัน</span>
            </div>

            {/* Quick Focus Button */}
            {activeView !== 'focus' && (
              <button
                onClick={() => handleStartFocus('tulip')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all transform hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>เริ่มโฟกัส</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-white/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('garden')}
          className={`px-3 py-1 rounded-lg font-semibold ${
            activeView === 'garden' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70' : 'text-stone-500'
          }`}
        >
          🌿 สวนดอกไม้
        </button>
        <button
          onClick={() => setActiveView('sanctuary')}
          className={`px-3 py-1 rounded-lg font-semibold ${
            activeView === 'sanctuary' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/70' : 'text-stone-500'
          }`}
        >
          🦋 สวนพักใจ
        </button>
        <button
          onClick={() => setShowWeeklyReport(true)}
          className="px-3 py-1 rounded-lg font-semibold text-stone-500"
        >
          📊 รายงาน
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: ACTIVE FOCUS SESSION (AI Focus Guardian) */}
        {activeView === 'focus' && (
          <FocusGuardianSession
            initialMoodFlower={focusMoodFlower}
            userProfile={profile}
            plotId={focusPlotId}
            onFinishSession={handleFinishFocusSession}
            onCancel={() => setActiveView('garden')}
            onNavigateToSanctuary={() => setActiveView('sanctuary')}
          />
        )}

        {/* VIEW 2: MINDFUL SANCTUARY (สวนพักใจ) */}
        {activeView === 'sanctuary' && (
          <MindfulSanctuary
            unlockedZones={profile.unlockedSanctuaryZones}
            totalFocusMinutes={profile.totalFocusMinutes}
            onBackToGarden={() => setActiveView('garden')}
          />
        )}

        {/* VIEW 3: GARDEN HOME & ECOSYSTEM */}
        {activeView === 'garden' && (
          <>
            {/* User Greeting & Adaptive Plan Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-stone-900/60 p-4 sm:p-5 rounded-3xl border border-stone-200/70 dark:border-stone-800 shadow-xs">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-stone-800 dark:text-stone-100">
                  สวัสดี, {profile.name} 🌻
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  ยินดีต้อนรับกลับสู่สวนของคุณ สวนนี้จะปรับเปลี่ยนตามการเติบโตของคุณเสมอ
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTargetPlotIndex(plots.findIndex((p) => !p.flowerType) !== -1 ? plots.findIndex((p) => !p.flowerType) : 0);
                    setShowFlowerPicker(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-900/40 flex items-center gap-1.5 transition-colors"
                >
                  <span>🌼 เลือกดอกไม้แทนอารมณ์</span>
                </button>

                <button
                  onClick={() => setActiveView('sanctuary')}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-900/40 flex items-center gap-1.5 transition-colors"
                >
                  <span>🦋 พักใจชั่วคราว</span>
                </button>
              </div>
            </div>

            {/* Interactive Garden Canvas (6 plots) */}
            <GardenCanvas
              plots={plots}
              waterDrops={profile.waterDrops}
              sunlightPoints={profile.sunlightPoints}
              onSelectPlot={() => {}}
              onPlantNew={(plotIdx) => {
                setTargetPlotIndex(plotIdx);
                setShowFlowerPicker(true);
              }}
              onWaterPlot={handleWaterPlot}
              onStartFocusOnFlower={(flowerType, plotId) => handleStartFocus(flowerType, plotId)}
            />

            {/* Adaptive AI Flower Ecosystem Card (AI เรียนรู้สวนของผู้ใช้) */}
            <AdaptiveAIEcosystemCard
              profile={profile}
              sessions={sessions}
              onOpenReport={() => setShowWeeklyReport(true)}
            />

            {/* Recent Focus History Logs */}
            <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>บันทึกการเติบโตล่าสุด (Focus Sessions)</span>
                </h3>
                <span className="text-xs text-stone-400">
                  ทั้งหมด {sessions.length} ครั้ง
                </span>
              </div>

              {sessions.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4 text-center">
                  ยังไม่มีบันทึกการฝึก ลองกด "เริ่มโฟกัส" เพื่อให้ดอกไม้แรกของคุณเริ่มเติบโต
                </p>
              ) : (
                <div className="space-y-2.5">
                  {sessions.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {FLOWER_MOODS[s.moodFlower]?.emoji || '🌸'}
                        </span>
                        <div>
                          <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <span>{s.taskTitle}</span>
                            {s.completed ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 rounded-md font-normal">
                                สำเร็จ
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 rounded-md font-normal">
                                ก้าวเล็กๆ
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">
                            {s.date} เวลา {s.time} น. • จดจ่อ {s.actualMinutes} นาที • คะแนนสมาธิ: {s.selfFocusScore || 8}/10
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-stone-500">
                        {s.distraction && (
                          <span className="text-[10px] text-stone-400 truncate max-w-[140px] block">
                            {s.distraction}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* MODAL: MOOD FLOWER PICKER */}
      <MoodFlowerPickerModal
        isOpen={showFlowerPicker}
        onClose={() => setShowFlowerPicker(false)}
        onSelect={handlePlantFlower}
        plotIndex={targetPlotIndex}
        unlockedSpecialFlowers={profile.unlockedSpecialFlowers}
      />

      {/* MODAL: WEEKLY GROWTH REPORT */}
      {showWeeklyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <WeeklyReportView
              sessions={sessions}
              profile={profile}
              onClose={() => setShowWeeklyReport(false)}
            />
          </div>
        </div>
      )}

      {/* MODAL: 7-STEP APPLICATION GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="font-extrabold text-stone-800 dark:text-stone-100 text-lg flex items-center gap-2">
                <span>🌷</span>
                <span>7 ขั้นตอนการทำงานของ Mood Garden AI</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs px-2.5 py-1 rounded-lg hover:bg-stone-100"
              >
                ปิด
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                <strong className="text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  1. 🌱 เริ่มต้นด้วยสวนของตัวเอง:
                </strong>
                ผู้ใช้ได้รับสวนขนาดเล็ก AI สอบถามกิจกรรมที่ต้องการฝึกและสิ่งรบกวนเพื่อสร้างแผนเริ่มต้น
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30">
                <strong className="text-amber-800 dark:text-amber-300 block mb-0.5">
                  2. 🌼 เลือกดอกไม้แทนอารมณ์:
                </strong>
                ทานตะวัน (มีพลัง), ทิวลิป (สงบ), กุหลาบ (กังวล), ลาเวนเดอร์ (ผ่อนคลาย), เดซี่ (เบิกบาน) ดอกไม้เป็นสัญลักษณ์ที่เลือกเอง ไม่ใช่เครื่องมือวินิจฉัยของ AI
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30">
                <strong className="text-sky-800 dark:text-sky-300 block mb-0.5">
                  3. 🧠 AI Focus Guardian:
                </strong>
                เสนอระยะเวลาที่เหมาะสม หากทำไม่สำเร็จ AI จะช่วยปรับภารกิจให้เล็กลง โดยไม่ลงโทษผู้ใช้
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30">
                <strong className="text-teal-800 dark:text-teal-300 block mb-0.5">
                  4. 🌿 สวนเติบโตตามพฤติกรรม:
                </strong>
                เริ่มภารกิจดอกไม้เริ่มงอก ทำสำเร็จดอกไม้บานสะพรั่ง ปลดล็อกพันธุ์ใหม่ การเติบโตสะท้อนการเข้าร่วม ไม่ใช่คะแนนสมอง
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30">
                <strong className="text-purple-800 dark:text-purple-300 block mb-0.5">
                  5. 🤖 AI เรียนรู้สวนของผู้ใช้:
                </strong>
                วิเคราะห์ประวัติและปรับประสบการณ์ เช่น เสนอภารกิจขนาดเล็กพร้อมแบ่งการเติบโตหลายขั้น
              </div>

              <div className="p-3 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30">
                <strong className="text-pink-800 dark:text-pink-300 block mb-0.5">
                  6. 🦋 สวนตอบสนองต่อความต้องการ: โหมดสวนพักใจ:
                </strong>
                มีเสียงธรรมชาติ แอนิเมชันผีเสื้อ และกิจกรรมฝึกหายใจ โดยไม่บังคับทำภารกิจ
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30">
                <strong className="text-indigo-800 dark:text-indigo-300 block mb-0.5">
                  7. 📊 รายงานการเติบโตของสวน:
                </strong>
                แสดงภารกิจสำเร็จ ช่วงเวลาที่ทำได้ดี สิ่งรบกวน และพัฒนาการของสวน
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/60 dark:border-stone-800/80 bg-white/50 dark:bg-stone-900/50 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>🌷 Mood Garden AI</span>
            <span>•</span>
            <span>สวนดอกไม้อัจฉริยะเพื่อสมาธิและสุขภาวะทางอารมณ์ในวัยรุ่น</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Adaptive AI Flower Ecosystem</span>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการรีเซ็ตสวนและทำ Onboarding ใหม่หรือไม่?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="hover:text-stone-600 dark:hover:text-stone-300 underline"
            >
              รีเซ็ตสวนเริ่มต้นใหม่
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
