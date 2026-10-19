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

export interface MicroTaskStep {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  points: number;
  tip?: string;
  completed: boolean;
  completedAt?: string;
  emotionReflected?: 'happy' | 'neutral' | 'stressed';
}

export interface BigGoalProject {
  id: string;
  title: string;
  category: 'homework' | 'study' | 'room_bag' | 'creative' | 'routine';
  steps: MicroTaskStep[];
  createdAt: string;
  totalEstimatedMinutes: number;
  moodFlower: FlowerMoodType;
  completed: boolean;
}

export interface GardenAnimal {
  id: string;
  name: string;
  nameTh: string;
  emoji: string;
  unlockPoints: number;
  description: string;
  soundEffect?: string;
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
  postEmotion?: 'happy' | 'neutral' | 'stressed';
  microTaskId?: string;
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
  totalRewardPoints: number; // Dopamine game score
  streakDays: number;
  unlockedSpecialFlowers: FlowerMoodType[];
  unlockedSanctuaryZones: string[];
  unlockedAnimals: string[]; // ids of visiting cute animals
  hasCompletedOnboarding: boolean;
  roleMode?: 'youth' | 'parent'; // View toggle for youth or parent
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

