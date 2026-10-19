export type FlowerMoodType =
  | 'sunflower'
  | 'tulip'
  | 'rose'
  | 'lavender'
  | 'daisy'
  | 'lotus'
  | 'sakura';

export interface FlowerMoodInfo {
  id: FlowerMoodType;
  name: string;
  nameTh: string;
  emoji: string;
  feeling: string;
  feelingDescription: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
}

export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'radiant';

export interface GardenPlot {
  id: string;
  index: number;
  unlocked: boolean;
  flowerType: FlowerMoodType | null;
  flowerName: string | null;
  stage: GrowthStage;
  progressPercent: number; // 0 - 100
  waterLevel: number; // 0 - 100
  sunshineLevel: number;
  plantedAt?: string;
  lastWateredAt?: string;
  notes?: string;
}

export interface FocusSessionRecord {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  taskTitle: string;
  durationMinutes: number;
  completed: boolean;
  adaptedEarly: boolean;
  actualMinutes: number;
  moodFlower: FlowerMoodType;
  selfFocusScore?: number; // 1 to 10
  distraction?: string;
}

export interface UserHabitProfile {
  name: string;
  targetActivities: string[];
  commonDistractions: string[];
  preferredFocusStyle: string;
  totalFocusMinutes: number;
  completedSessionsCount: number;
  totalSessionsAttempted: number;
  waterDrops: number;
  sunlightPoints: number;
  streakDays: number;
  unlockedSpecialFlowers: FlowerMoodType[];
  unlockedSanctuaryZones: string[];
  hasCompletedOnboarding: boolean;
  adaptivePlan?: {
    strategyTitle: string;
    recommendedDuration: number;
    advice: string;
    microSteps: string[];
    encouragement: string;
  };
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  moodFlower: FlowerMoodType;
  gratitudeText: string;
  feelingNote: string;
  aiReflection?: string;
}
