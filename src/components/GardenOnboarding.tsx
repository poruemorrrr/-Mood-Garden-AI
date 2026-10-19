import React, { useState } from 'react';
import { FlowerMoodType } from '../types/garden';
import { FLOWER_MOODS } from '../data/flowerConstants';
import { FlowerRenderer } from './FlowerRenderer';
import { Sprout, Sparkles, Bot, ArrowRight, Check, Heart, Shield } from 'lucide-react';

interface GardenOnboardingProps {
  onComplete: (data: {
    userName: string;
    targetActivities: string[];
    distractions: string[];
    preferredStyle: string;
    starterFlower: FlowerMoodType;
    plan: {
      strategyTitle: string;
      recommendedDuration: number;
      advice: string;
      microSteps: string[];
      encouragement: string;
    };
  }) => void;
}

export const GardenOnboarding: React.FC<GardenOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userName, setUserName] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['อ่านหนังสือและทบทวนบทเรียน']);
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>(['การแจ้งเตือนจากโทรศัพท์']);
  const [selectedStyle, setSelectedStyle] = useState('ชอบช่วงสั้นๆ 15 นาที มีเวลาพักเบาๆ');
  const [starterFlower, setStarterFlower] = useState<FlowerMoodType>('tulip');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const activitiesList = [
    { id: 'study', label: '📖 อ่านหนังสือสอบ & สรุปบทเรียน' },
    { id: 'homework', label: '✍️ ทำการบ้านและรายงาน' },
    { id: 'coding', label: '💻 ฝึกเขียนโปรแกรม / โปรเจกต์' },
    { id: 'art_music', label: '🎨 วาดรูป / ซ้อมดนตรี' },
    { id: 'language', label: '🗣️ ท่องศัพท์และภาษาต่างประเทศ' },
  ];

  const distractionList = [
    { id: 'shorts', label: '📱 สไลด์ TikTok / Instagram Reels' },
    { id: 'chat', label: '💬 แชทเพื่อน / การแจ้งเตือนเด้ง' },
    { id: 'gaming', label: '🎮 อยากแวะไปเล่นเกมสักตา' },
    { id: 'overthinking', label: '💭 ความคิดฟุ้งซ่าน / กังวลเรื่องอื่น' },
    { id: 'tired', label: '🥱 ความง่วงและความเหนื่อยล้า' },
  ];

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch('/api/ai/onboarding-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetActivities: selectedActivities,
          distractions: selectedDistractions,
          preferredStyle: selectedStyle,
        }),
      });
      if (res.ok) {
        const plan = await res.json();
        setGeneratedPlan(plan);
        setStep(4);
      }
    } catch (e) {
      setGeneratedPlan({
        recommendedDuration: 15,
        strategyTitle: 'กลยุทธ์ก้าวเล็กๆ แสนอบอุ่น (Micro-Focus Step)',
        advice: 'เริ่มต้นฝึกสมาธิด้วยช่วงสั้น 15 นาที เพื่อลดความกดดันจากสิ่งรบกวน เมื่อทำสำเร็จดอกไม้จะผลิใบแรกทันที',
        microSteps: [
          'วางโทรศัพท์ให้ห่างจากสายตา 1 เมตร',
          'เตรียมน้ำดื่ม 1 แก้วข้างโต๊ะ',
          'โฟกัสที่ภารกิจแรกเพียง 15 นาที',
        ],
        encouragement: 'ยินดีต้อนรับสู่สวนของคุณ ทุกการเติบโตเริ่มต้นจากเมล็ดพันธุ์เล็กๆ เสมอ 🌱',
      });
      setStep(4);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleFinish = () => {
    onComplete({
      userName: userName.trim() || 'เพื่อนรักสวนดอกไม้',
      targetActivities: selectedActivities,
      distractions: selectedDistractions,
      preferredStyle: selectedStyle,
      starterFlower,
      plan: generatedPlan,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-emerald-100 dark:border-stone-800 shadow-2xl">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>ขั้นตอนที่ 1: 🌱 เริ่มต้นด้วยสวนของตัวเอง</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 dark:text-stone-100">
          ยินดีต้อนรับสู่ Mood Garden AI
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-lg mx-auto">
          สวนดอกไม้อัจฉริยะที่จะเติบโตไปพร้อมกับสมาธิและความสุขทางใจของคุณ
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === s
                ? 'w-8 bg-emerald-600'
                : step > s
                ? 'w-2 bg-emerald-400'
                : 'w-2 bg-stone-200 dark:bg-stone-700'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: Basic Info & Target Activities */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              ให้สวนแห่งนี้เรียกคุณว่าอะไรดี?
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="เช่น มีน, นาวิน, พลอย หรือ ชื่อเล่นที่คุณชอบ..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              กิจกรรมที่คุณอยากฝึกจดจ่อให้สำเร็จ (เลือกได้มากกว่า 1 ข้อ)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activitiesList.map((act) => {
                const isSelected = selectedActivities.includes(act.label);
                return (
                  <div
                    key={act.id}
                    onClick={() => toggleItem(selectedActivities, setSelectedActivities, act.label)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs font-medium ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-emerald-300'
                    }`}
                  >
                    <span>{act.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>ต่อไป (บอกเล่าสิ่งรบกวน)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Distractions & Preferred Style */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              พฤติกรรมหรือสิ่งใดที่มักรบกวนสมาธิของคุณบ่อยที่สุด?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {distractionList.map((dist) => {
                const isSelected = selectedDistractions.includes(dist.label);
                return (
                  <div
                    key={dist.id}
                    onClick={() => toggleItem(selectedDistractions, setSelectedDistractions, dist.label)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs font-medium ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-rose-300'
                    }`}
                  >
                    <span>{dist.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-rose-500" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              สไตล์การโฟกัสที่คุณรู้สึกสบายใจ
            </label>
            <div className="space-y-2">
              {[
                'ชอบช่วงสั้นๆ 10-15 นาที ค่อยๆ ทำทีละขั้น (แนะนำ)',
                'ชอบช่วงกลาง 20-25 นาที แบบคลาสสิกโพโมโดโร',
                'ชอบโฟกัสเบาๆ พร้อมเสียงธรรมชาติ ไม่กดดัน',
              ].map((style) => (
                <div
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-2xl border cursor-pointer text-xs font-medium transition-all ${
                    selectedStyle === style
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {style}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>ต่อไป (เลือกดอกไม้ตั้งต้น)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose Starter Seed */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base mb-1">
              เลือกเมล็ดพันธุ์ดอกไม้ดอกแรกของคุณ 🌼
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              เมล็ดพันธุ์นี้จะถูกนำไปปลูกในแปลงแรกของสวนคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['sunflower', 'tulip', 'daisy'] as FlowerMoodType[]).map((f) => {
              const info = FLOWER_MOODS[f];
              const isSelected = starterFlower === f;
              return (
                <div
                  key={f}
                  onClick={() => setStarterFlower(f)}
                  className={`p-4 rounded-2xl border cursor-pointer text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 hover:border-emerald-300'
                  }`}
                >
                  <FlowerRenderer flowerType={f} stage="bloom" className="w-16 h-16 mb-2" />
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-100">
                    {info.emoji} {info.nameTh}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    {info.feeling.split('(')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={handleGeneratePlan}
              disabled={loadingPlan}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              <span>{loadingPlan ? 'AI กำลังสร้างแผนส่วนบุคคล...' : 'ให้ AI วิเคราะห์และสร้างแผนเริ่มต้น'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Adaptive Plan Presentation */}
      {step === 4 && generatedPlan && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 dark:from-stone-800 dark:via-emerald-950/30 dark:to-stone-800 border border-emerald-200 dark:border-stone-700 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
              <Bot className="w-4 h-4" />
              <span>แผนเริ่มต้นจาก AI Focus Guardian เฉพาะตัวคุณ</span>
            </div>
            <h3 className="text-lg font-extrabold text-stone-800 dark:text-stone-100 mb-2">
              {generatedPlan.strategyTitle}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              {generatedPlan.advice}
            </p>

            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                🌱 3 ก้าวเล็กๆ ในการเริ่มต้น:
              </span>
              {generatedPlan.microSteps?.map((stepStr: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{stepStr}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-emerald-100 dark:border-stone-700 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
              💌 <strong>ข้อความให้กำลังใจ:</strong> {generatedPlan.encouragement}
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            <span>เข้าสู่สวนและเริ่มปลูกดอกไม้แรกของคุณ 🌷</span>
          </button>
        </div>
      )}
    </div>
  );
};
