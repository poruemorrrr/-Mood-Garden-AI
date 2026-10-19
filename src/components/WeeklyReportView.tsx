import React, { useState, useEffect } from 'react';
import { FocusSessionRecord, UserHabitProfile } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import {
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Bot,
  Award,
  Smartphone,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Share2,
} from 'lucide-react';

interface WeeklyReportViewProps {
  sessions: FocusSessionRecord[];
  profile: UserHabitProfile;
  onClose: () => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  sessions,
  profile,
  onClose,
}) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summaryHeadline: string;
    habitInsight: string;
    distractionTip: string;
    botanicalMetaphor: string;
    growthEncouragement: string;
  } | null>(null);

  // Compute key stats
  const totalCompleted = sessions.filter((s) => s.completed).length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.actualMinutes, 0);

  // Best time of day calculation
  const morningCount = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 5 && hr < 12;
  }).length;
  const afternoonCount = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 12 && hr < 17;
  }).length;
  const eveningCount = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 17 || hr < 5;
  }).length;

  let bestTimeStr = 'ช่วงเย็นถึงหัวค่ำ (17:00 - 21:00 น.)';
  if (morningCount >= afternoonCount && morningCount >= eveningCount) {
    bestTimeStr = 'ช่วงเช้าสดใส (07:00 - 11:00 น.)';
  } else if (afternoonCount >= morningCount && afternoonCount >= eveningCount) {
    bestTimeStr = 'ช่วงบ่าย (13:00 - 16:00 น.)';
  }

  // Average self-evaluated focus score
  const scores = sessions.map((s) => s.selfFocusScore || 7);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '8.0';

  // Distraction breakdown
  const distractionMap: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.distraction) {
      distractionMap[s.distraction] = (distractionMap[s.distraction] || 0) + 1;
    }
  });

  // Fetch AI Report on mount
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalMinutes,
          completedTasks: totalCompleted,
          distractionReports: Object.keys(distractionMap).length,
          averageFocusScore: parseFloat(avgScore),
          unlockedFlowers: profile.unlockedSpecialFlowers.map((f) => FLOWER_MOODS[f]?.nameTh || f),
          bestTimeOfDay: bestTimeStr,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiReport(data);
      }
    } catch (e) {
      setAiReport({
        summaryHeadline: 'สวนของคุณกำลังเติบโตอย่างมั่นคงและงดงาม 🌻',
        habitInsight: `คุณมีจังหวะที่ดีที่สุดในช่วง ${bestTimeStr} สะสมเวลาฝึกสมาธิไปแล้ว ${totalMinutes} นาที`,
        distractionTip: 'การสังเกตสิ่งรบกวนด้วยใจที่เป็นมิตร จะช่วยให้ค่อยๆ วางมือถือได้ง่ายขึ้น',
        botanicalMetaphor: 'ดั่งต้นไม้ในสวนที่ค่อยๆ หยั่งรากลึก ทุกความพยายามเล็กๆ มีผลลัพธ์อันยิ่งใหญ่',
        growthEncouragement: 'รักษาสมดุลระหว่างการฝึกโฟกัสและการพักผ่อน แล้วดอกไม้สายพันธุ์ใหม่จะบานสะพรั่ง',
      });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>ขั้นตอนที่ 7: รายงานการเติบโตของสวน</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-100">
            บันทึกการเติบโตและสถิติพฤติกรรม 📊
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            สะท้อนการเข้าร่วมกิจกรรมและการปรับตัว ไม่ใช่คะแนนตัดสินความสามารถ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={loadingAI}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>อัปเดตวิเคราะห์ AI</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
          >
            ปิดรายงาน
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>เวลาโฟกัสรวม</span>
          </div>
          <div className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 font-mono">
            {totalMinutes} <span className="text-xs font-normal">นาที</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
          <div className="text-xs text-sky-800 dark:text-sky-300 font-medium mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>ภารกิจสำเร็จ</span>
          </div>
          <div className="text-2xl font-bold text-sky-950 dark:text-sky-100 font-mono">
            {totalCompleted} <span className="text-xs font-normal">รอบ</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
          <div className="text-xs text-amber-800 dark:text-amber-300 font-medium mb-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>คะแนนสมาธิประเมินเอง</span>
          </div>
          <div className="text-2xl font-bold text-amber-950 dark:text-amber-100 font-mono">
            {avgScore} <span className="text-xs font-normal">/ 10</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
          <div className="text-xs text-purple-800 dark:text-purple-300 font-medium mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>ฝึกฝนต่อเนื่อง</span>
          </div>
          <div className="text-2xl font-bold text-purple-950 dark:text-purple-100 font-mono">
            {profile.streakDays} <span className="text-xs font-normal">วัน</span>
          </div>
        </div>
      </div>

      {/* AI Botanical Growth Analysis Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-stone-800 dark:via-emerald-950/20 dark:to-stone-800 border border-emerald-200/70 dark:border-stone-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">
            บทวิเคราะห์การเติบโตจาก Adaptive AI Guardian
          </h3>
        </div>

        {loadingAI ? (
          <div className="py-6 flex items-center justify-center gap-2 text-xs text-stone-500">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Gemini AI กำลังวิเคราะห์แนวโน้มพฤติกรรมและการเติบโตของคุณ...</span>
          </div>
        ) : (
          aiReport && (
            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-3 bg-white/80 dark:bg-stone-900/80 rounded-xl border border-emerald-100 dark:border-stone-700 font-medium text-emerald-900 dark:text-emerald-200">
                ✨ {aiReport.summaryHeadline}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white/60 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-700">
                  <span className="font-bold text-stone-800 dark:text-stone-100 block mb-1">
                    🌿 รูปแบบสมาธิของคุณ:
                  </span>
                  <p className="leading-relaxed">{aiReport.habitInsight}</p>
                </div>

                <div className="p-3 bg-white/60 dark:bg-stone-900/60 rounded-xl border border-stone-200/60 dark:border-stone-700">
                  <span className="font-bold text-stone-800 dark:text-stone-100 block mb-1">
                    💡 รับมือกับสิ่งรบกวน:
                  </span>
                  <p className="leading-relaxed">{aiReport.distractionTip}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300">
                🌱 <strong>มุมมองสวนดอกไม้:</strong> {aiReport.botanicalMetaphor}
              </div>
            </div>
          )
        )}
      </div>

      {/* Two Columns: Time-of-Day Pattern & Distraction Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Time of Day Analysis */}
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
          <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>ช่วงเวลาที่คุณจดจ่อได้ดีที่สุด</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300 mb-1">
                <span>ช่วงเช้า (06:00 - 12:00)</span>
                <span>{morningCount} รอบ</span>
              </div>
              <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(morningCount / Math.max(1, sessions.length)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300 mb-1">
                <span>ช่วงบ่าย (12:00 - 17:00)</span>
                <span>{afternoonCount} รอบ</span>
              </div>
              <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${(afternoonCount / Math.max(1, sessions.length)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300 mb-1">
                <span>ช่วงเย็น/ค่ำ (17:00 - 23:00)</span>
                <span>{eveningCount} รอบ</span>
              </div>
              <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${(eveningCount / Math.max(1, sessions.length)) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-stone-400 dark:text-stone-500 pt-2 border-t border-stone-200 dark:border-stone-700">
              📌 ผลลัพธ์: คุณทำกิจกรรมได้ราบรื่นที่สุดในช่วง <strong>{bestTimeStr}</strong>
            </p>
          </div>
        </div>

        {/* Distraction Breakdown */}
        <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700">
          <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-rose-500" />
            <span>พฤติกรรมและสิ่งรบกวนที่รายงาน</span>
          </h4>

          {Object.keys(distractionMap).length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4 text-center">
              ยังไม่มีการรายงานสิ่งรบกวน คุณมีสมาธิที่ดีเยี่ยม
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {Object.entries(distractionMap).map(([distName, count]) => (
                <div
                  key={distName}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700"
                >
                  <span className="text-stone-700 dark:text-stone-300 truncate">{distName}</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                    {count} ครั้ง
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-stone-400 dark:text-stone-500 pt-1">
                การบันทึกสิ่งรบกวนช่วยให้คุณสังเกตตนเองได้อย่างเป็นกลางโดยไม่ตำหนิตนเอง
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Crucial Scientific Boundary Notice */}
      <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>หลักการประเมินผล:</strong> การเติบโตของดอกไม้และสถิติในรายงานนี้สะท้อนถึงการเข้าร่วมกิจกรรมและการจัดสรรเวลาจริงของผู้ใช้เท่านั้น <strong>ไม่ใช่หลักฐานหรือการประเมินทางการแพทย์เกี่ยวกับระดับสมาธิหรือสุขภาพจิต</strong> สวนดอกไม้เป็นกลไกสร้างแรงจูงใจเชิงบวก (Adaptive Positive Reinforcement) เพื่อการเรียนรู้อย่างมีความสุข
        </p>
      </div>
    </div>
  );
};
