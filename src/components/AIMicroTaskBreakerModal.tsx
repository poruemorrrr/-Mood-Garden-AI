import React, { useState } from 'react';
import { FlowerMoodType, MicroTaskStep, BigGoalProject } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  X,
  Lightbulb,
  Award,
  Zap,
  BookOpen,
  Briefcase,
  Layers,
} from 'lucide-react';

interface AIMicroTaskBreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProject: (project: BigGoalProject) => void;
  onDirectStartStep: (step: MicroTaskStep, moodFlower: FlowerMoodType) => void;
}

export const AIMicroTaskBreakerModal: React.FC<AIMicroTaskBreakerModalProps> = ({
  isOpen,
  onClose,
  onStartProject,
  onDirectStartStep,
}) => {
  const [bigGoalInput, setBigGoalInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'homework' | 'study' | 'room_bag' | 'creative' | 'routine'>('homework');
  const [capacity, setCapacity] = useState('สบายๆ ไม่เกิน 20-25 นาที มีเวลาพัก');
  const [selectedMoodFlower, setSelectedMoodFlower] = useState<FlowerMoodType>('tulip');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    goalTitle: string;
    summaryAdvice: string;
    recommendedTotalMinutes: number;
    steps: MicroTaskStep[];
  } | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    { text: 'ทำการบ้านวิชาคณิตศาสตร์ 5 ข้อ', category: 'homework' as const, flower: 'sunflower' as const },
    { text: 'จัดกระเป๋านักเรียนและเตรียมชุดพรุ่งนี้', category: 'room_bag' as const, flower: 'tulip' as const },
    { text: 'อ่านหนังสือสอบวิทยาศาสตร์บทที่ 2', category: 'study' as const, flower: 'lavender' as const },
    { text: 'เก็บกวาดโต๊ะเขียนหนังสือให้โล่งสบาย', category: 'routine' as const, flower: 'daisy' as const },
    { text: 'เขียนบทความสรุปภาษาอังกฤษ 1 หน้า', category: 'creative' as const, flower: 'tulip' as const },
  ];

  const handleBreakdown = async (goalText?: string) => {
    const textToProcess = goalText || bigGoalInput;
    if (!textToProcess.trim()) return;

    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/micro-task-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bigGoal: textToProcess,
          userAgeOrContext: 'เด็กและเยาวชน (เน้นลดแรงต้าน ADHD)',
          dailyCapacity: capacity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const stepsWithCompleted: MicroTaskStep[] = (data.steps || []).map((s: any, idx: number) => ({
          id: s.id || `step-${idx + 1}`,
          title: s.title,
          description: s.description,
          estimatedMinutes: s.estimatedMinutes || 5,
          points: s.points || 20,
          tip: s.tip,
          completed: false,
        }));

        setGeneratedResult({
          goalTitle: data.goalTitle || textToProcess,
          summaryAdvice: data.summaryAdvice || 'AI ช่วยซอยงานเป็นชิ้นเล็กๆ แล้ว เริ่มได้สบายใจเลย!',
          recommendedTotalMinutes: data.recommendedTotalMinutes || 20,
          steps: stepsWithCompleted,
        });
      }
    } catch (e) {
      console.warn('Fallback breakdown:', e);
      setGeneratedResult({
        goalTitle: textToProcess,
        summaryAdvice: 'AI ช่วยย่อยงานเป็น 4 สเต็ปย่อยเพื่อให้เด็กเริ่มได้ทันทีโดยไม่รู้สึกกดดัน',
        recommendedTotalMinutes: 20,
        steps: [
          {
            id: 'step-1',
            title: 'เตรียมอุปกรณ์และหยิบชิ้นงานมาวางบนโต๊ะ',
            description: 'นำสมุด หนังสือ หรืออุปกรณ์มาวาง ปิดหน้าจอสิ่งรบกวน',
            estimatedMinutes: 3,
            points: 15,
            tip: 'แค่เริ่มต้นหยิบของก็ชนะไปแล้วครึ่งหนึ่ง!',
            completed: false,
          },
          {
            id: 'step-2',
            title: 'เริ่มทำส่วนที่ 1 แบบชิลๆ',
            description: `ลงมือทำส่วนแรกของ: ${textToProcess}`,
            estimatedMinutes: 8,
            points: 25,
            tip: 'ทำช้าๆ ทีละนิด ไม่ต้องเร่งรีบ',
            completed: false,
          },
          {
            id: 'step-3',
            title: 'จิบน้ำ ยืดเส้นยืดสาย 2 นาที',
            description: 'พักสายตา หายใจลึกๆ ให้สมองได้รีเฟรช',
            estimatedMinutes: 2,
            points: 10,
            tip: 'พักสมองเพื่อให้โฟกัสก้าวต่อไปคมชัดขึ้น',
            completed: false,
          },
          {
            id: 'step-4',
            title: 'เก็บรายละเอียดส่วนสุดท้ายและตรวจทาน',
            description: 'ทำต่อส่วนที่เหลือแล้วเช็กความเรียบร้อย',
            estimatedMinutes: 8,
            points: 30,
            tip: 'ทำจบแล้วจะได้คะแนนและสัตว์น่ารักมาเยี่ยมสวน!',
            completed: false,
          },
        ],
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCreateAndStartFirst = (step: MicroTaskStep) => {
    if (!generatedResult) return;
    const project: BigGoalProject = {
      id: `proj-${Date.now()}`,
      title: generatedResult.goalTitle,
      category: selectedCategory,
      steps: generatedResult.steps,
      createdAt: new Date().toISOString(),
      totalEstimatedMinutes: generatedResult.recommendedTotalMinutes,
      moodFlower: selectedMoodFlower,
      completed: false,
    };
    onStartProject(project);
    onDirectStartStep(step, selectedMoodFlower);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>ระบบที่ 1: การรับข้อมูลและแบ่งงาน (AI Micro-Tasking)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 dark:text-stone-100">
            เปลี่ยนเป้าหมายใหญ่ ให้เป็นสเต็ปจิ๋วทำง่าย 🧩
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
            แก้ปัญหาการผลัดวันประกันพรุ่งและลดความท้อแท้สำหรับเด็กสมาธิสั้น (ADHD) และเยาวชน
          </p>
        </div>

        {!generatedResult ? (
          <div className="space-y-5">
            {/* Input Big Goal */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                เป้าหมายหรืองานใหญ่ที่ต้องการทำ (ผู้ใช้หรือผู้ปกครองกรอกได้เลย)
              </label>
              <input
                type="text"
                value={bigGoalInput}
                onChange={(e) => setBigGoalInput(e.target.value)}
                placeholder="เช่น ทำการบ้านวิชาเลข 5 ข้อ, จัดกระเป๋านักเรียน, สรุปประวัติศาสตร์..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
                ⚡ ตัวอย่างงานที่พบบ่อย (กดเพื่อเลือกได้ทันที):
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBigGoalInput(preset.text);
                      setSelectedCategory(preset.category);
                      setSelectedMoodFlower(preset.flower);
                      handleBreakdown(preset.text);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-medium border border-stone-200/70 dark:border-stone-700 transition-colors"
                  >
                    {preset.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity & Pace */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  ความจุและจังหวะเวลาต่อวัน
                </label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
                >
                  <option value="สบายๆ ไม่เกิน 15-20 นาที มีเวลาพัก">ช่วงสั้นสบายๆ (15-20 นาที)</option>
                  <option value="ปานกลาง 25-30 นาที แบ่ง 4 สเต็ป">ปานกลาง (25-30 นาที แบ่ง 4 สเต็ป)</option>
                  <option value="ก้าวเล็กๆ พิเศษ 10 นาที สำหรับวันที่เหนื่อย">ก้าวเล็กพิเศษ (10 นาที สำหรับวันเหนื่อย)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  ดอกไม้แทนพลังใจสำหรับงานนี้
                </label>
                <div className="flex items-center gap-1.5">
                  {(['sunflower', 'tulip', 'lavender', 'daisy'] as FlowerMoodType[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedMoodFlower(f)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                        selectedMoodFlower === f
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      <span>{FLOWER_MOODS[f].emoji}</span>
                      <span className="hidden sm:inline">{FLOWER_MOODS[f].nameTh.replace('ดอก', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleBreakdown()}
              disabled={!bigGoalInput.trim() || loadingAI}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingAI ? 'AI กำลังซอยย่อยงานให้ทำง่ายๆ...' : 'ให้ AI ย่อยเป็นขั้นตอนเล็กๆ (Micro-Tasks)'}</span>
            </button>
          </div>
        ) : (
          /* RESULT VIEW: STEP BY STEP MICRO TASKS */
          <div className="space-y-5 animate-fadeIn">
            {/* Header Result */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>เป้าหมาย: {generatedResult.goalTitle}</span>
                </span>
                <span className="bg-emerald-200/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-lg">
                  รวม ~{generatedResult.recommendedTotalMinutes} นาที
                </span>
              </div>
              <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80 mt-1">
                💡 {generatedResult.summaryAdvice}
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {generatedResult.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                        <span>{step.title}</span>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.2 rounded-full border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-amber-500" />
                          <span>+{step.points} แต้ม</span>
                        </span>
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {step.description}
                      </p>
                      {step.tip && (
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 flex items-center gap-1">
                          <span>✨</span>
                          <span>{step.tip}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{step.estimatedMinutes} นาที</span>
                    </span>

                    <button
                      onClick={() => handleCreateAndStartFirst(step)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <span>เริ่มทำสเต็ปนี้ 🚀</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => setGeneratedResult(null)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                ← ปรับแต่งเป้าหมายใหม่
              </button>

              <button
                onClick={() => {
                  if (generatedResult.steps[0]) {
                    handleCreateAndStartFirst(generatedResult.steps[0]);
                  }
                }}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                <span>เริ่มสเต็ปที่ 1 พร้อม AI บัดดี้ทันที</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
