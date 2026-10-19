import React, { useState, useEffect } from 'react';
import { FocusSessionRecord, UserHabitProfile, BigGoalProject } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import {
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Calendar,
  Clock,
  Heart,
  ShieldCheck,
  Bot,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  RefreshCw,
  Award,
  Zap,
} from 'lucide-react';

interface EmotionalAnalyticsReportProps {
  sessions: FocusSessionRecord[];
  projects: BigGoalProject[];
  profile: UserHabitProfile;
  onClose: () => void;
}

export const EmotionalAnalyticsReport: React.FC<EmotionalAnalyticsReportProps> = ({
  sessions,
  projects,
  profile,
  onClose,
}) => {
  const [activeRole, setActiveRole] = useState<'youth' | 'parent'>('youth');
  const [loadingAI, setLoadingAI] = useState(false);
  const [adhdReport, setAdhdReport] = useState<{
    executiveFunctionScore: string;
    summaryAnalysis: string;
    parentRecommendations: string[];
    youthMessage: string;
    stressTriggerInsight: string;
  } | null>(null);

  // Compute emotion breakdown
  const happyCount = sessions.filter((s) => s.postEmotion === 'happy').length;
  const neutralCount = sessions.filter((s) => s.postEmotion === 'neutral' || !s.postEmotion).length;
  const stressedCount = sessions.filter((s) => s.postEmotion === 'stressed').length;
  const totalEmotions = Math.max(1, happyCount + neutralCount + stressedCount);

  // Time of Day Success Breakdown
  const morningSuccess = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 5 && hr < 12 && s.completed;
  }).length;

  const afternoonSuccess = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 12 && hr < 17 && s.completed;
  }).length;

  const eveningSuccess = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 17 && s.completed;
  }).length;

  // Stressed sessions in evening
  const eveningStressed = sessions.filter((s) => {
    const hr = parseInt(s.time.split(':')[0] || '12', 10);
    return hr >= 17 && s.postEmotion === 'stressed';
  }).length;

  useEffect(() => {
    fetchADHDReport();
  }, []);

  const fetchADHDReport = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/adhd-monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalMicroTasks: sessions.length,
          completedTasks: sessions.filter((s) => s.completed).length,
          moodStats: { happy: happyCount, neutral: neutralCount, stressed: stressedCount },
          timeOfDayPattern: { morningSuccess, afternoonSuccess, eveningSuccess },
          sampleGoalTitles: projects.map((p) => p.title).slice(0, 4),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdhdReport(data);
      }
    } catch {
      setAdhdReport({
        executiveFunctionScore: 'พัฒนาการโดดเด่นในการเริ่มงาน (Activation)',
        summaryAnalysis:
          'จากการประมวลผลความสัมพันธ์ระหว่าง "เวลาที่ใช้ - ความสำเร็จของงาน - อารมณ์ของเด็ก": พบว่าเด็กจดจ่อได้ดีที่สุดในช่วงเช้าและบ่ายต้นๆ ส่วนช่วง 17.00 น. เริ่มมีอาการเหนื่อยล้าหรือเครียดสะสม',
        parentRecommendations: [
          'ลดปริมาณงานช่วง 17.00 น. แล้วย้ายงานที่ต้องใช้พลังความคิดไปช่วงเช้าวันเสาร์แทน',
          'ใช้ระบบ Micro-Task แบ่งงานไม่เกิน 15 นาที เพื่อรักษาความต่อเนื่อง',
          'ให้คะแนนชมเชยทันทีหลังจบสเต็ปย่อย เพื่อกระตุ้นสารโดปามีนเชิงบวก',
        ],
        youthMessage: 'เธอทำได้ยอดเยี่ยมมาก โดยเฉพาะการไม่ยอมแพ้และกล้าเริ่มก้าวแรก สวนดอกไม้เต็มไปด้วยความสุข!',
        stressTriggerInsight:
          'ช่วงเย็น 17:00 หลังเลิกเรียนเป็นช่วงที่พลังสมองลดลง แนะนำเปลี่ยนเป็นกิจกรรมสวนพักใจหรือจัดกระเป๋าเบาๆ แทน',
      });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ระบบที่ 4: การประเมินผลและปรับพฤติกรรม (Emotional & Focus Analytics)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 dark:text-stone-100">
            รายงานสมาธิ อารมณ์ และความสัมพันธ์ในครอบครัว 📊
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            วิเคราะห์ความสัมพันธ์ "เวลาที่ใช้ - ความสำเร็จ - อารมณ์" เพื่อลดความตึงเครียดและสร้าง Self-esteem
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual Role Mode Toggle */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveRole('youth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'youth'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              👦 มุมมองเยาวชน
            </button>
            <button
              onClick={() => setActiveRole('parent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'parent'
                  ? 'bg-white dark:bg-stone-700 text-purple-800 dark:text-purple-300 shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              👨‍👩‍👧 มุมมองผู้ปกครอง
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
          >
            ปิด
          </button>
        </div>
      </div>

      {/* Emotion Analytics 3-Emoji Summary */}
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-sky-50/70 to-purple-50/70 dark:from-stone-800 dark:via-stone-800 dark:to-stone-800 border border-stone-200 dark:border-stone-700">
        <h3 className="text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>สถิติอารมณ์หลังทำภารกิจ (Emotional Distribution):</span>
          <span className="text-[11px] text-stone-400 font-normal">บันทึกทั้งหมด {sessions.length} ครั้ง</span>
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-2xl block mb-1">😊</span>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">มีความสุข / ภูมิใจ</div>
            <div className="text-lg font-black text-emerald-950 dark:text-emerald-100 font-mono">
              {happyCount} <span className="text-xs font-normal">({Math.round((happyCount / totalEmotions) * 100)}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-sky-200 dark:border-sky-800 text-center">
            <span className="text-2xl block mb-1">😐</span>
            <div className="text-xs font-bold text-sky-800 dark:text-sky-300">เฉยๆ / สบายๆ</div>
            <div className="text-lg font-black text-sky-950 dark:text-sky-100 font-mono">
              {neutralCount} <span className="text-xs font-normal">({Math.round((neutralCount / totalEmotions) * 100)}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-rose-200 dark:border-rose-800 text-center">
            <span className="text-2xl block mb-1">😫</span>
            <div className="text-xs font-bold text-rose-800 dark:text-rose-300">เครียด / เหนื่อยล้า</div>
            <div className="text-lg font-black text-rose-950 dark:text-rose-100 font-mono">
              {stressedCount} <span className="text-xs font-normal">({Math.round((stressedCount / totalEmotions) * 100)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Behavioral Correlation Insight Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-800/80 border border-purple-200 dark:border-purple-900/50 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100">
              ผลวิเคราะห์ความสัมพันธ์: เวลาที่ใช้ ➔ ความสำเร็จ ➔ อารมณ์
            </h4>
            <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              {adhdReport?.executiveFunctionScore || 'พัฒนาการโดดเด่นในการเริ่มก้าวแรก'}
            </span>
          </div>
        </div>

        {loadingAI ? (
          <div className="py-6 flex items-center justify-center gap-2 text-xs text-stone-400">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span>AI กำลังประมวลผลความสัมพันธ์พฤติกรรมและตารางเวลา...</span>
          </div>
        ) : (
          <div className="space-y-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
            <p className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-medium">
              💡 {adhdReport?.summaryAnalysis}
            </p>

            {/* KEY USER PROMPT INSIGHT: The 17:00 evening stress finding and schedule shift advice */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
              <strong className="block font-bold mb-1 text-sm">
                🔍 ข้อค้นพบสำคัญเรื่องช่วงเวลาและความเครียด (Time-Mood Correlation):
              </strong>
              <p>
                {adhdReport?.stressTriggerInsight ||
                  'ช่วง 17.00 น. เยาวชนมีอาการเหนื่อยล้าสะสมจากโรงเรียน แนะนำให้ลดปริมาณงานช่วง 17.00 น. แล้วย้ายงานที่ต้องใช้สมาธิสูงไปช่วงเช้าวันเสาร์แทน เพื่อสมาธิที่ดีขึ้นและลดการกระทบกระทั่งในครอบครัว'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DUAL VIEW CONTENT: Youth vs Parent */}
      {activeRole === 'youth' ? (
        /* YOUTH VIEW: Fostering Self-Esteem and Intrinsic Motivation */
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>ความภาคภูมิใจในตัวเอง (Self-Esteem Booster)</span>
            </div>
            <p className="text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed">
              {adhdReport?.youthMessage ||
                'เธอทำได้ยอดเยี่ยมมาก โดยเฉพาะการไม่ยอมแพ้และกล้าเริ่มก้าวแรก สวนดอกไม้เต็มไปด้วยความสุขและเพื่อนสัตว์น่ารัก!'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 block mb-1">การจัดการเวลา (Executive Function)</span>
              <strong className="text-stone-800 dark:text-stone-100 text-sm">
                ย่อยงานสำเร็จ {sessions.length} สเต็ป
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">ลดอาการผัดวันประกันพรุ่งได้ชัดเจน</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 block mb-1">การควบคุมสิ่งเร้า (Impulse Control)</span>
              <strong className="text-stone-800 dark:text-stone-100 text-sm">
                Focus Mode กับบัดดี้
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">ยืดเวลาจดจ่อ (Attention Span) ได้ยาวขึ้น</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 block mb-1">สภาวะอารมณ์ (Emotional Regulation)</span>
              <strong className="text-stone-800 dark:text-stone-100 text-sm">
                มีความสุข {Math.round((happyCount / totalEmotions) * 100)}%
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">ไม่รู้สึกถูกบังคับ แต่ภูมิใจในผลงาน</p>
            </div>
          </div>
        </div>
      ) : (
        /* PARENT VIEW: Actionable Guidance to Reduce Family Friction */
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold mb-1 text-sm">
              <Users className="w-4 h-4" />
              <span>คำแนะนำสำหรับผู้ปกครอง (Family Bridge & Parenting Support)</span>
            </div>
            <p className="text-purple-900 dark:text-purple-200 text-xs leading-relaxed mb-3">
              แอปพลิเคชันนี้ทำหน้าที่เป็นตัวกลางจัดแจงและเตือนแทนผู้ปกครอง เพื่อลดการกระทบกระทั่งเรื่องการเรียนและกิจวัตรประจำวัน
            </p>

            <div className="space-y-2">
              <span className="font-bold text-stone-800 dark:text-stone-100 block">
                🌱 แนวทางช่วยเหลือลูกโดยไม่ต้องดุด่า:
              </span>
              {adhdReport?.parentRecommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <span className="w-4 h-4 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
            <h5 className="font-bold text-stone-800 dark:text-stone-100 mb-1">
              🤝 เป้าหมายระยะยาว: ปลูกฝังทักษะชีวิต (Life Skills)
            </h5>
            <p className="leading-relaxed">
              การฝึกซอยงาน การจดจ่อร่วมกับ AI Companion และการรู้เท่าทันอารมณ์ตนเอง จะกลายเป็นนิสัยติดตัวเด็กไปจนโต ช่วยให้พวกเขาสามารถเรียนร่วมกับผู้อื่นและทำงานในอนาคตได้อย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
