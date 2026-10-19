import React, { useState, useEffect } from 'react';
import {
  FlowerMoodType,
  GardenPlot,
  FocusSessionRecord,
  UserHabitProfile,
  BigGoalProject,
  MicroTaskStep,
} from './types/garden';
import { FLOWER_MOODS, GARDEN_ANIMALS } from './data/flowerConstants';
import { GardenCanvas } from './components/GardenCanvas';
import { MoodFlowerPickerModal } from './components/MoodFlowerPickerModal';
import { FocusGuardianSession } from './components/FocusGuardianSession';
import { MindfulSanctuary } from './components/MindfulSanctuary';
import { WeeklyReportView } from './components/WeeklyReportView';
import { GardenOnboarding } from './components/GardenOnboarding';
import { AdaptiveAIEcosystemCard } from './components/AdaptiveAIEcosystemCard';
import { AIMicroTaskBreakerModal } from './components/AIMicroTaskBreakerModal';
import { AICompanionFocusMode } from './components/AICompanionFocusMode';
import { EmotionalAnalyticsReport } from './components/EmotionalAnalyticsReport';
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
  Zap,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Bot,
  ArrowRight,
  Smile,
  Check,
} from 'lucide-react';

const STORAGE_KEY = 'mood_garden_ai_combined_v2';

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
    progressPercent: 45,
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

const INITIAL_PROJECTS: BigGoalProject[] = [
  {
    id: 'proj-1',
    title: 'ทำการบ้านวิชาคณิตศาสตร์ 5 ข้อ',
    category: 'homework',
    createdAt: new Date().toISOString(),
    totalEstimatedMinutes: 20,
    moodFlower: 'sunflower',
    completed: false,
    steps: [
      {
        id: 'step-1-1',
        title: 'หยิบสมุดการบ้านและเตรียมดินสอยางลบ',
        description: 'วางของบนโต๊ะ เคลียร์หน้าจอโทรศัพท์',
        estimatedMinutes: 2,
        points: 15,
        tip: 'แค่วางอุปกรณ์ก็ชนะไปครึ่งก้าวแล้ว!',
        completed: true,
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        emotionReflected: 'happy',
      },
      {
        id: 'step-1-2',
        title: 'ทำข้อ 1 และ ข้อ 2 แบบชิลๆ',
        description: 'อ่านโจทย์ทีละบรรทัด ค่อยๆ เขียนวิธีทำ',
        estimatedMinutes: 8,
        points: 25,
        tip: 'ทำช้าๆ มี AI นั่งทำอยู่ข้างๆ นะ',
        completed: false,
      },
      {
        id: 'step-1-3',
        title: 'จิบน้ำเปล่า ยืดเส้นยืดสาย 2 นาที',
        description: 'พักสายตา หายใจลึกๆ ให้สมองได้รีเซ็ต',
        estimatedMinutes: 2,
        points: 10,
        tip: 'การพักช่วยให้สมองจดจำได้ดีขึ้น',
        completed: false,
      },
      {
        id: 'step-1-4',
        title: 'ลุยข้อ 3-5 และตรวจทานความเรียบร้อย',
        description: 'เก็บรายละเอียดงานส่วนที่เหลือให้ครบถ้วน',
        estimatedMinutes: 8,
        points: 30,
        tip: 'อีกนิดเดียว สัตว์น่ารักกำลังรอปลดล็อก!',
        completed: false,
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'จัดกระเป๋านักเรียนและเตรียมชุดพรุ่งนี้',
    category: 'room_bag',
    createdAt: new Date().toISOString(),
    totalEstimatedMinutes: 10,
    moodFlower: 'tulip',
    completed: false,
    steps: [
      {
        id: 'step-2-1',
        title: 'เปิดตารางเรียนวันพรุ่งนี้',
        description: 'ดูว่ามีวิชาอะไรบ้างและต้องส่งการบ้านชิ้นไหน',
        estimatedMinutes: 2,
        points: 10,
        tip: 'เช็กทีละวิชาสบายใจ',
        completed: false,
      },
      {
        id: 'step-2-2',
        title: 'หยิบหนังสือและกล่องดินสอใส่กระเป๋า',
        description: 'จัดใส่ช่องให้เรียบร้อย รูดซิปปิด',
        estimatedMinutes: 5,
        points: 20,
        tip: 'กระเป๋าพร้อม ใจก็พร้อม!',
        completed: false,
      },
      {
        id: 'step-2-3',
        title: 'แขวนชุดนักเรียนเตรียมไว้',
        description: 'วางถุงเท้าข้างชุด พรุ่งนี้เช้าจะได้ไม่ต้องรีบ',
        estimatedMinutes: 3,
        points: 15,
        tip: 'เช้าวันใหม่จะราบรื่นสดใส',
        completed: false,
      },
    ],
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
    postEmotion: 'happy',
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
    postEmotion: 'neutral',
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
    postEmotion: 'happy',
  },
  {
    id: 's-4',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    date: '2026-10-18',
    time: '17:15',
    taskTitle: 'หยิบสมุดการบ้านและเตรียมดินสอยางลบ',
    durationMinutes: 5,
    completed: true,
    adaptedEarly: false,
    actualMinutes: 3,
    moodFlower: 'sunflower',
    selfFocusScore: 7,
    distraction: 'ความง่วงหลังเลิกเรียน',
    postEmotion: 'stressed',
  },
];

const INITIAL_PROFILE: UserHabitProfile = {
  name: 'เพื่อนรักสวนดอกไม้',
  targetActivities: ['อ่านหนังสือสอบ', 'ทำการบ้าน', 'จัดกระเป๋า'],
  commonDistractions: ['แจ้งเตือนมือถือ', 'เผลอคิดเรื่องอื่น', 'ความเหนื่อยตอนเย็น'],
  preferredFocusStyle: 'ชอบช่วงสั้นๆ 15 นาที มีเวลาพักเบาๆ',
  totalFocusMinutes: 55,
  completedSessionsCount: 4,
  totalSessionsAttempted: 4,
  waterDrops: 12,
  sunlightPoints: 45,
  totalRewardPoints: 85,
  streakDays: 3,
  unlockedSpecialFlowers: ['lotus'],
  unlockedSanctuaryZones: ['sunbeam', 'zen_pond'],
  unlockedAnimals: ['bunny', 'squirrel'],
  hasCompletedOnboarding: true,
  roleMode: 'youth',
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

  const [projects, setProjects] = useState<BigGoalProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
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

  // Current View: 'garden' | 'sanctuary' | 'focus' | 'companion_focus'
  const [activeView, setActiveView] = useState<'garden' | 'sanctuary' | 'focus' | 'companion_focus'>('garden');

  // Active Micro-task for Companion Focus
  const [activeStep, setActiveStep] = useState<MicroTaskStep | null>(null);
  const [activeGoalTitle, setActiveGoalTitle] = useState<string>('');
  const [activeMoodFlower, setActiveMoodFlower] = useState<FlowerMoodType>('tulip');

  // Classic Focus Setup
  const [focusMoodFlower, setFocusMoodFlower] = useState<FlowerMoodType>('tulip');
  const [focusPlotId, setFocusPlotId] = useState<string | undefined>(undefined);

  // Modals
  const [showMicroTaskModal, setShowMicroTaskModal] = useState(false);
  const [showFlowerPicker, setShowFlowerPicker] = useState(false);
  const [targetPlotIndex, setTargetPlotIndex] = useState<number | null>(null);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showEmotionReport, setShowEmotionReport] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_plots', JSON.stringify(plots));
  }, [plots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_projects', JSON.stringify(projects));
  }, [projects]);

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

  // Start Companion Focus on a micro-task step
  const handleStartStepWithCompanion = (step: MicroTaskStep, flower: FlowerMoodType, goalTitle?: string) => {
    setActiveStep(step);
    setActiveMoodFlower(flower);
    setActiveGoalTitle(goalTitle || 'ภารกิจย่อย');
    setActiveView('companion_focus');
  };

  // Finish a Micro-task Step from Companion Focus
  const handleFinishStep = (result: {
    stepId: string;
    completed: boolean;
    actualMinutes: number;
    emotion: 'happy' | 'neutral' | 'stressed';
    pointsEarned: number;
  }) => {
    const now = new Date();

    // Mark step completed in project
    setProjects((prev) =>
      prev.map((proj) => {
        const stepExists = proj.steps.some((s) => s.id === result.stepId);
        if (stepExists) {
          const updatedSteps = proj.steps.map((s) =>
            s.id === result.stepId
              ? { ...s, completed: true, completedAt: now.toISOString(), emotionReflected: result.emotion }
              : s
          );
          const allDone = updatedSteps.every((s) => s.completed);
          return { ...proj, steps: updatedSteps, completed: allDone };
        }
        return proj;
      })
    );

    // Record session
    const newSession: FocusSessionRecord = {
      id: `s-${Date.now()}`,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      taskTitle: activeStep?.title || 'ภารกิจย่อย',
      durationMinutes: activeStep?.estimatedMinutes || 5,
      completed: true,
      adaptedEarly: false,
      actualMinutes: result.actualMinutes,
      moodFlower: activeMoodFlower,
      selfFocusScore: result.emotion === 'happy' ? 9 : result.emotion === 'neutral' ? 8 : 6,
      postEmotion: result.emotion,
      microTaskId: result.stepId,
    };
    setSessions((prev) => [newSession, ...prev]);

    // Update profile points & animals
    setProfile((prev) => {
      const newRewardPoints = prev.totalRewardPoints + result.pointsEarned;
      const newTotalMin = prev.totalFocusMinutes + result.actualMinutes;
      const newUnlockedAnimals = [...prev.unlockedAnimals];

      GARDEN_ANIMALS.forEach((animal) => {
        if (newRewardPoints >= animal.unlockPoints && !newUnlockedAnimals.includes(animal.id)) {
          newUnlockedAnimals.push(animal.id);
        }
      });

      return {
        ...prev,
        totalRewardPoints: newRewardPoints,
        totalFocusMinutes: newTotalMin,
        completedSessionsCount: prev.completedSessionsCount + 1,
        totalSessionsAttempted: prev.totalSessionsAttempted + 1,
        waterDrops: prev.waterDrops + 2,
        sunlightPoints: prev.sunlightPoints + 8,
        unlockedAnimals: newUnlockedAnimals,
      };
    });

    // Advance first active plot growth
    setPlots((prev) =>
      prev.map((p, idx) => {
        if (idx === 0 || (p.flowerType && p.progressPercent < 100)) {
          const newProgress = Math.min(100, p.progressPercent + 20);
          let nextStage = p.stage;
          if (newProgress >= 90) nextStage = 'radiant';
          else if (newProgress >= 60) nextStage = 'bloom';
          else if (newProgress >= 30) nextStage = 'bud';
          else if (newProgress >= 10) nextStage = 'sprout';
          return { ...p, progressPercent: newProgress, stage: nextStage, waterLevel: Math.min(100, p.waterLevel + 15) };
        }
        return p;
      })
    );

    setActiveView('garden');
  };

  // Finish Classic Focus Session
  const handleFinishClassicSession = (data: any) => {
    const now = new Date();
    const newSession: FocusSessionRecord = {
      id: `s-${Date.now()}`,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      taskTitle: 'ฝึกสมาธิกับสวนดอกไม้',
      durationMinutes: data.durationMinutes,
      completed: data.completed,
      adaptedEarly: !data.completed,
      actualMinutes: data.actualMinutes,
      moodFlower: data.moodFlower,
      selfFocusScore: data.selfFocusScore,
      distraction: data.distraction,
      postEmotion: 'happy',
    };
    setSessions((prev) => [newSession, ...prev]);

    setProfile((prev) => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + data.actualMinutes,
      totalRewardPoints: prev.totalRewardPoints + (data.completed ? 30 : 10),
      waterDrops: prev.waterDrops + (data.completed ? 3 : 1),
      sunlightPoints: prev.sunlightPoints + (data.completed ? 10 : 4),
    }));

    setActiveView('garden');
  };

  // Toggle Role Mode: Youth vs Parent
  const toggleRoleMode = () => {
    setProfile((prev) => ({
      ...prev,
      roleMode: prev.roleMode === 'parent' ? 'youth' : 'parent',
    }));
  };

  if (!profile.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-4 sm:p-8 flex items-center justify-center">
        <GardenOnboarding
          onComplete={(data) => {
            setProfile((prev) => ({
              ...prev,
              name: data.userName,
              targetActivities: data.targetActivities,
              commonDistractions: data.distractions,
              preferredFocusStyle: data.preferredStyle,
              hasCompletedOnboarding: true,
              adaptivePlan: data.plan,
            }));
            setPlots((prev) =>
              prev.map((p, idx) =>
                idx === 0
                  ? {
                      ...p,
                      flowerType: data.starterFlower,
                      flowerName: FLOWER_MOODS[data.starterFlower]?.nameTh || 'ดอกไม้',
                      stage: 'sprout',
                      progressPercent: 25,
                      waterLevel: 90,
                      sunshineLevel: 80,
                    }
                  : p
              )
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div
            onClick={() => setActiveView('garden')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              🌷
            </div>
            <div>
              <span className="font-black text-stone-900 dark:text-stone-100 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                Mood Garden AI
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                  ADHD & Youth
                </span>
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                ระบบแบ่งงานจิ๋ว • บัดดี้ตัวช่วยโฟกัส • สวนให้รางวัล • รายงานอารมณ์
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveView('garden')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'garden'
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              🌿 สวนดอกไม้ & สัตว์
            </button>

            <button
              onClick={() => setShowMicroTaskModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>🧩 AI แบ่งงานจิ๋ว</span>
            </button>

            <button
              onClick={() => setActiveView('sanctuary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeView === 'sanctuary'
                  ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              🦋 สวนพักใจ
            </button>

            <button
              onClick={() => setShowEmotionReport(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>📊 รายงานอารมณ์ & ADHD</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              title="คู่มือ 4 ระบบการทำงาน"
            >
              <Info className="w-4 h-4" />
            </button>
          </nav>

          {/* Role Toggle & Counters */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dopamine Score Badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs font-black text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs"
              title="คะแนนโดปามีนสะสมเพื่อปลดล็อกสัตว์และดอกไม้"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{profile.totalRewardPoints} แต้ม</span>
            </div>

            {/* Role Mode Toggle Button (Youth vs Parent Family Bridge) */}
            <button
              onClick={toggleRoleMode}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                profile.roleMode === 'parent'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
              title="สลับมุมมองเยาวชน / ผู้ปกครอง"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {profile.roleMode === 'parent' ? 'โหมดผู้ปกครอง' : 'โหมดเยาวชน'}
              </span>
            </button>

            {/* Quick Micro-Task CTA */}
            <button
              onClick={() => setShowMicroTaskModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all transform hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>แบ่งงานใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Subnav */}
      <div className="lg:hidden flex items-center justify-around bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('garden')}
          className={`px-2.5 py-1 rounded-lg font-bold ${
            activeView === 'garden' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70' : 'text-stone-500'
          }`}
        >
          🌿 สวน & สัตว์
        </button>
        <button
          onClick={() => setShowMicroTaskModal(true)}
          className="px-2.5 py-1 rounded-lg font-bold text-emerald-700"
        >
          🧩 ซอยงาน
        </button>
        <button
          onClick={() => setActiveView('sanctuary')}
          className={`px-2.5 py-1 rounded-lg font-bold ${
            activeView === 'sanctuary' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/70' : 'text-stone-500'
          }`}
        >
          🦋 สวนพักใจ
        </button>
        <button
          onClick={() => setShowEmotionReport(true)}
          className="px-2.5 py-1 rounded-lg font-bold text-purple-700"
        >
          📊 รายงานอารมณ์
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: COMPANION FOCUS MODE (System 2: Body Doubling & Impulse Control) */}
        {activeView === 'companion_focus' && activeStep && (
          <AICompanionFocusMode
            currentStep={activeStep}
            goalTitle={activeGoalTitle}
            moodFlower={activeMoodFlower}
            onFinishStep={handleFinishStep}
            onCancel={() => setActiveView('garden')}
          />
        )}

        {/* VIEW 2: CLASSIC FOCUS GUARDIAN */}
        {activeView === 'focus' && (
          <FocusGuardianSession
            initialMoodFlower={focusMoodFlower}
            userProfile={profile}
            plotId={focusPlotId}
            onFinishSession={handleFinishClassicSession}
            onCancel={() => setActiveView('garden')}
            onNavigateToSanctuary={() => setActiveView('sanctuary')}
          />
        )}

        {/* VIEW 3: MINDFUL SANCTUARY (สวนพักใจ) */}
        {activeView === 'sanctuary' && (
          <MindfulSanctuary
            unlockedZones={profile.unlockedSanctuaryZones}
            totalFocusMinutes={profile.totalFocusMinutes}
            onBackToGarden={() => setActiveView('garden')}
          />
        )}

        {/* VIEW 4: MAIN GARDEN & MICRO-TASK ECOSYSTEM */}
        {activeView === 'garden' && (
          <>
            {/* Top Greeting & Family Bridge Notice if Parent Mode */}
            {profile.roleMode === 'parent' ? (
              <div className="p-4 rounded-3xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                    👨‍👩‍👧
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-purple-950 dark:text-purple-200">
                      คุณกำลังอยู่ในมุมมองผู้ปกครอง (Parent Mode — Family Bridge)
                    </h3>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      ช่วยลูกจัดการเป้าหมายโดยไม่ต้องดุด่า ตรวจดูรายงานอารมณ์และตารางเวลาที่เหมาะสม
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMicroTaskModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    + ตั้งเป้าหมายย่อยให้ลูก
                  </button>
                  <button
                    onClick={() => setShowEmotionReport(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 text-xs font-bold border border-purple-200 dark:border-purple-700"
                  >
                    ดูรายงานคำแนะนำ AI 📊
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-stone-900/60 p-4 sm:p-5 rounded-3xl border border-stone-200/70 dark:border-stone-800 shadow-xs">
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <span>สวัสดี, {profile.name}</span>
                    <span className="text-xl">🌻</span>
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    พร้อมลุยงานชิ้นเล็กๆ ไปกับบัดดี้ AI แล้วหรือยัง? สวนกำลังรอให้ดอกไม้บานนะ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMicroTaskModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>🧩 ซอยงานเป็นชิ้นจิ๋ว (AI Micro-Tasking)</span>
                  </button>

                  <button
                    onClick={() => {
                      setTargetPlotIndex(plots.findIndex((p) => !p.flowerType) !== -1 ? plots.findIndex((p) => !p.flowerType) : 0);
                      setShowFlowerPicker(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900/40 transition-colors"
                  >
                    🌼 ปลูกดอกไม้ใหม่
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE MICRO-TASK PROJECTS BOARD (System 1: Executive Function / Micro-Tasks) */}
            <div className="bg-white/85 dark:bg-stone-900/85 rounded-3xl p-5 sm:p-6 border border-emerald-100/90 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    🧩
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-800 dark:text-stone-100 flex items-center gap-2">
                      <span>ภารกิจย่อยของฉัน (Micro-Tasks Board)</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        ลดอาการผัดวันประกันพรุ่ง
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      เลือกทำสเต็ปที่ทำง่ายที่สุดก่อน เพื่อเปิดโหมดโฟกัสไปพร้อมกับน้องการ์เด้น
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowMicroTaskModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มเป้าหมายใหม่</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {projects.map((proj) => {
                  const completedSteps = proj.steps.filter((s) => s.completed).length;
                  const totalSteps = proj.steps.length;
                  const percentDone = Math.round((completedSteps / Math.max(1, totalSteps)) * 100);

                  return (
                    <div
                      key={proj.id}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80"
                    >
                      {/* Project Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {FLOWER_MOODS[proj.moodFlower]?.emoji || '🌸'}
                          </span>
                          <h4 className="font-black text-sm text-stone-800 dark:text-stone-100">
                            {proj.title}
                          </h4>
                          {proj.completed && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                              สำเร็จครบทุกสเต็ปแล้ว 🎉
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span>ความก้าวหน้า: {completedSteps}/{totalSteps} สเต็ป ({percentDone}%)</span>
                          <div className="w-20 h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${percentDone}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Micro Steps Checklist */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {proj.steps.map((st, sIdx) => (
                          <div
                            key={st.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                              st.completed
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-75'
                                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                                  st.completed
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-stone-300 dark:border-stone-600 text-stone-500'
                                }`}
                              >
                                {st.completed ? <Check className="w-3.5 h-3.5 stroke-3" /> : sIdx + 1}
                              </div>
                              <div className="min-w-0">
                                <span className={`font-semibold block truncate ${st.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-100'}`}>
                                  {st.title}
                                </span>
                                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{st.estimatedMinutes} นาที</span>
                                  <span>•</span>
                                  <span className="text-amber-600 font-bold">+{st.points} แต้ม</span>
                                </span>
                              </div>
                            </div>

                            {!st.completed ? (
                              <button
                                onClick={() => handleStartStepWithCompanion(st, proj.moodFlower, proj.title)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-xs transition-all"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>ทำกับบัดดี้</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                                <span>{st.emotionReflected === 'happy' ? '😊' : st.emotionReflected === 'stressed' ? '😫' : '😐'}</span>
                                <span>สำเร็จ</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GARDEN CANVAS WITH VISITING ANIMALS & REWARDS (System 3) */}
            <GardenCanvas
              plots={plots}
              waterDrops={profile.waterDrops}
              sunlightPoints={profile.sunlightPoints}
              rewardPoints={profile.totalRewardPoints}
              unlockedAnimals={profile.unlockedAnimals}
              onSelectPlot={() => {}}
              onPlantNew={(plotIdx) => {
                setTargetPlotIndex(plotIdx);
                setShowFlowerPicker(true);
              }}
              onWaterPlot={handleWaterPlot}
              onStartFocusOnFlower={(flowerType, plotId) => {
                setFocusMoodFlower(flowerType);
                setFocusPlotId(plotId);
                setActiveView('focus');
              }}
            />

            {/* ADAPTIVE AI ECOSYSTEM CARD */}
            <AdaptiveAIEcosystemCard
              profile={profile}
              sessions={sessions}
              onOpenReport={() => setShowEmotionReport(true)}
            />
          </>
        )}
      </main>

      {/* MODAL 1: AI MICRO-TASK BREAKER (System 1) */}
      <AIMicroTaskBreakerModal
        isOpen={showMicroTaskModal}
        onClose={() => setShowMicroTaskModal(false)}
        onStartProject={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
        }}
        onDirectStartStep={(step, flower) => {
          handleStartStepWithCompanion(step, flower);
        }}
      />

      {/* MODAL 2: EMOTIONAL & FOCUS ANALYTICS REPORT (System 4) */}
      {showEmotionReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EmotionalAnalyticsReport
              sessions={sessions}
              projects={projects}
              profile={profile}
              onClose={() => setShowEmotionReport(false)}
            />
          </div>
        </div>
      )}

      {/* MODAL 3: MOOD FLOWER PICKER */}
      <MoodFlowerPickerModal
        isOpen={showFlowerPicker}
        onClose={() => setShowFlowerPicker(false)}
        onSelect={handlePlantFlower}
        plotIndex={targetPlotIndex}
        unlockedSpecialFlowers={profile.unlockedSpecialFlowers}
      />

      {/* MODAL 4: WEEKLY GROWTH REPORT */}
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

      {/* MODAL 5: 4-SYSTEM & ADHD INNOVATION GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-stone-200 dark:border-stone-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="font-black text-stone-800 dark:text-stone-100 text-lg flex items-center gap-2">
                <span>🌟</span>
                <span>โครงสร้าง 4 ระบบการทำงาน & แนวคิดช่วยเด็กสมาธิสั้น (ADHD)</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xs px-2.5 py-1 rounded-lg hover:bg-stone-100"
              >
                ปิด
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <strong className="text-emerald-900 dark:text-emerald-200 block mb-1">
                  1. ระบบรับข้อมูลและแบ่งงาน (AI Input & Micro-Tasking):
                </strong>
                ช่วยเด็กสมาธิสั้นด้าน <strong>Executive Function</strong> โดยซอยงานใหญ่ให้เป็นสเต็ปเล็ก 2-8 นาที ลดอาการผัดวันประกันพรุ่งและลดความท้อแท้ก่อนเริ่มงาน
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <strong className="text-sky-900 dark:text-sky-200 block mb-1">
                  2. ระบบเพื่อนคู่คิดและตัวช่วยโฟกัส (AI Companion & Focus Mode):
                </strong>
                ช่วยด้าน <strong>Impulse Control</strong> ด้วยระบบจำลองการบล็อกสิ่งเร้า (TikTok/เกม) และมีน้องการ์เด้นทำหน้าที่เป็น Body Double / Role Model นั่งอ่านหนังสืออยู่ข้างๆ
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <strong className="text-amber-900 dark:text-amber-200 block mb-1">
                  3. ระบบสวนดอกไม้ให้รางวัล (Gamification & Immediate Reward):
                </strong>
                กระตุ้นสารโดปามีน (Dopamine) เชิงบวกทันทีที่ทำสเต็ปย่อยเสร็จ ดอกไม้ผลิบานและมีเพื่อนสัตว์น่ารัก (กระต่าย, กระรอก, ลูกนก, ลูกเป็ด) แวะมาเยี่ยมสวน
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <strong className="text-purple-900 dark:text-purple-200 block mb-1">
                  4. ระบบประเมินผลและปรับพฤติกรรม (Emotional & Focus Analytics):
                </strong>
                ช่วยด้าน <strong>Emotional Regulation</strong> บันทึกอารมณ์ 3 รูปแบบ (😊/😐/😫) หลังจบงาน และวิเคราะห์ความสัมพันธ์ "เวลา - ความสำเร็จ - อารมณ์" เช่น แนะนำลดงานช่วง 17.00 น. ย้ายไปช่วงเช้าวันเสาร์ เพื่อลดความตึงเครียดในครอบครัว
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
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
            <span>นวัตกรรมสวนดอกไม้อัจฉริยะเพื่อสมาธิและสุขภาวะทางอารมณ์ในเยาวชนและเด็ก ADHD</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Positive Reinforcement & Family Bridge</span>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการรีเซ็ตข้อมูลและทดสอบ Onboarding ใหม่หรือไม่?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="hover:text-stone-600 dark:hover:text-stone-300 underline"
            >
              รีเซ็ตข้อมูลเริ่มต้นใหม่
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
