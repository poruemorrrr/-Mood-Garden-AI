import React from 'react';
import { UserHabitProfile, FocusSessionRecord } from '../types/garden';
import { Bot, Sparkles, TrendingUp, Compass, Heart, Shield, Award, Lightbulb } from 'lucide-react';

interface AdaptiveAIEcosystemCardProps {
  profile: UserHabitProfile;
  sessions: FocusSessionRecord[];
  onOpenReport: () => void;
}

export const AdaptiveAIEcosystemCard: React.FC<AdaptiveAIEcosystemCardProps> = ({
  profile,
  sessions,
  onOpenReport,
}) => {
  // Compute adaptive intelligence insights
  const shortSessions = sessions.filter((s) => s.durationMinutes <= 15);
  const shortSuccessRate =
    shortSessions.length > 0
      ? Math.round(
          (shortSessions.filter((s) => s.completed).length / shortSessions.length) * 100
        )
      : 92;

  const totalMin = profile.totalFocusMinutes;
  let personaName = '🌱 ต้นกล้าผู้เริ่มต้นอย่างตั้งใจ';
  let personaDescription = 'กำลังค้นหาจังหวะสมาธิที่พอดีกับตนเองอย่างอ่อนโยน';

  if (totalMin > 120 || profile.streakDays >= 5) {
    personaName = '🌸 ผู้พิทักษ์สวนดอกไม้แห่งสติ';
    personaDescription = 'มีวินัยที่หยั่งรากลึก รู้จักจังหวะการโฟกัสและการพักผ่อนอย่างสมดุล';
  } else if (totalMin > 40) {
    personaName = '🌿 นักผจญภัยก้าวเล็กผู้สม่ำเสมอ';
    personaDescription = 'จดจ่อได้ดีเยี่ยมกับภารกิจขนาดเล็กที่ต่อเนื่อง';
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/80 dark:from-stone-900 dark:via-stone-900/90 dark:to-emerald-950/30 border border-emerald-100/90 dark:border-stone-800 shadow-lg p-5 sm:p-6">
      {/* Decorative botanical icon background */}
      <div className="absolute top-2 right-2 opacity-5 dark:opacity-10 pointer-events-none text-8xl">
        🌺
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-100/70 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-800 dark:text-stone-100">
                Adaptive AI Flower Ecosystem
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                AI เรียนรู้สวนของคุณ
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              สวนและคำแนะนำปรับเปลี่ยนตามพฤติกรรมจริงเฉพาะบุคคล
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReport}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>ดูรายงานสัปดาห์ 📊</span>
        </button>
      </div>

      {/* Persona & Real-time Insight */}
      <div className="relative z-10 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Persona Box */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 flex items-start gap-3">
          <div className="text-2xl mt-0.5">🏆</div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              ลักษณะนิสัยการโฟกัสของคุณ
            </span>
            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 mt-0.5">
              {personaName}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-snug">
              {personaDescription}
            </p>
          </div>
        </div>

        {/* Adaptive Observation */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 flex items-start gap-3">
          <div className="text-2xl mt-0.5">💡</div>
          <div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              ข้อค้นพบของ AI ต่อสวนคุณ
            </span>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5 leading-snug">
              คุณทำภารกิจช่วงสั้น 15 นาทีได้สำเร็จสูงถึง <strong>{shortSuccessRate}%</strong> AI จึงแบ่งการเติบโตของดอกไม้เป็นหลายขั้นย่อย เพื่อให้เห็นความก้าวหน้าได้ชัดเจนในทุกการลงมือทำ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
