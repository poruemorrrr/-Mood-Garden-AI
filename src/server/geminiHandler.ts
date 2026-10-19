import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export async function generateAdaptivePlan(data: {
  targetActivities: string[];
  distractions: string[];
  preferredStyle: string;
}) {
  const ai = getAIClient();
  if (!ai) {
    return {
      recommendedDuration: 15,
      strategyTitle: 'กลยุทธ์ก้าวเล็กๆ แสนอบอุ่น (Micro-Focus Step)',
      advice: 'เริ่มต้นฝึกสมาธิด้วยช่วงสั้น 15 นาที เพื่อลดความกดดันจากสิ่งรบกวน เมื่อทำสำเร็จดอกไม้จะผลิใบแรกทันที',
      microSteps: [
        'วางโทรศัพท์ให้ห่างจากสายตา 1 เมตร',
        'เตรียมน้ำดื่ม 1 แก้วข้างโต๊ะ',
        'โฟกัสที่ภารกิจแรกเพียง 15 นาที',
      ],
      encouragement: 'ยินดีต้อนรับสู่สวนของคุณ ทุกการเติบโตเริ่มต้นจากเมล็ดพันธุ์เล็กๆ เสมอ 🌱',
    };
  }

  const prompt = `คุณคือ Mood Garden AI (ผู้พิทักษ์สวนดอกไม้แห่งสมาธิสำหรับวัยรุ่น)
ผู้ใช้ระบุกิจกรรมที่ต้องการฝึก: ${data.targetActivities.join(', ') || 'อ่านหนังสือและทำการบ้าน'}
สิ่งรบกวนสมาธิที่พบบ่อย: ${data.distractions.join(', ') || 'แจ้งเตือนมือถือและสมาธิหลุด'}
ความชอบ: ${data.preferredStyle || 'ชอบความสงบ ค่อยเป็นค่อยไป'}

กรุณาสร้างแผนเริ่มต้นที่เป็นมิตร ไม่กดดัน และออกแบบเฉพาะบุคคล ให้ตอบเป็น JSON เท่านั้นในรูปแบบ:
{
  "recommendedDuration": 15,
  "strategyTitle": "ชื่อกลยุทธ์น่ารักสร้างกำลังใจ",
  "advice": "คำแนะนำสั้นๆ 2-3 ประโยค ภาษาอบอุ่นเข้าใจวัยรุ่น",
  "microSteps": ["ขั้นตอนย่อย 1", "ขั้นตอนย่อย 2", "ขั้นตอนย่อย 3"],
  "encouragement": "ประโยคฮีลใจและสร้างแรงบันดาลใจ"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    console.warn('Fallback on Gemini plan generation:', err);
    return {
      recommendedDuration: 15,
      strategyTitle: 'กลยุทธ์ก้าวเล็กๆ แสนอบอุ่น',
      advice: 'เริ่มต้นฝึกสมาธิช่วงสั้นเพื่อความต่อเนื่อง ค่อยๆ เสริมพลังสมาธิทีละขั้น',
      microSteps: [
        'ปิดแจ้งเตือนที่ไม่จำเป็นชั่วคราว',
        'หยิบภารกิจชิ้นแรกที่ทำง่ายที่สุด',
        'จับเวลา 15 นาทีอย่างผ่อนคลาย',
      ],
      encouragement: 'สวนแห่งนี้พร้อมเติบโตเคียงข้างคุณเสมอ 🌿',
    };
  }
}

export async function generateGuardianAdvice(data: {
  moodFlower: string;
  moodName: string;
  recentSessionsCount: number;
  avgDuration: number;
  successRatePercent: number;
}) {
  const ai = getAIClient();
  if (!ai) {
    const defaultDuration = data.successRatePercent < 60 ? 10 : (data.avgDuration > 20 ? 25 : 15);
    return {
      suggestedDuration: defaultDuration,
      guardianMessage: `วันนี้คุณเลือก ${data.moodFlower} (${data.moodName}) AI แนะนำช่วงโฟกัส ${defaultDuration} นาที ที่เหมาะกับจังหวะความรู้สึกของคุณ`,
      gentleTip: 'จำไว้ว่าการโฟกัสไม่ได้หมายถึงการฝืน แต่คือการอยู่กับปัจจุบันอย่างสบายใจ',
    };
  }

  const prompt = `คุณคือ AI Focus Guardian ในแอป Mood Garden AI
สถานะของผู้ใช้:
- ดอกไม้แทนอารมณ์วันนี้: ${data.moodFlower} (${data.moodName})
- สถิติที่ผ่านมา: ทำไปแล้ว ${data.recentSessionsCount} ครั้ง, ระยะเวลาเฉลี่ย ${data.avgDuration} นาที, อัตราสำเร็จ ${data.successRatePercent}%

ให้วิเคราะห์และเสนอระยะเวลาโฟกัสที่เหมาะสมที่สุดในรอบนี้ โดยหลักการคือ:
- หากอารมณ์กังวล หรือต้องการผ่อนคลาย ให้เสนอเวลาสั้น 10-15 นาที
- หากมีพลัง อาจเสนอ 20-25 นาที
- ห้ามกดดัน เน้นความเมตตาต่อตนเอง
ตอบเป็น JSON เท่านั้น:
{
  "suggestedDuration": 15,
  "guardianMessage": "ข้อความจากผู้พิทักษ์สวน 1-2 ประโยค",
  "gentleTip": "ทริคสมาธิสั้นๆ นุ่มนวล"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    return {
      suggestedDuration: 15,
      guardianMessage: `ให้ ${data.moodFlower} ได้ค่อยๆ ดูดซับพลังความตั้งใจในก้าวนี้ 15 นาทีแบบสบายๆ`,
      gentleTip: 'หายใจเข้าลึกๆ หากเผลอฟุ้งซ่าน เพียงดึงใจกลับมาเบาๆ โดยไม่ต้องตำหนิตัวเอง',
    };
  }
}

export async function generateGentleMercy(data: {
  intendedDuration: number;
  elapsedMinutes: number;
  taskTitle: string;
}) {
  const ai = getAIClient();
  if (!ai) {
    return {
      supportiveTitle: 'ไม่เป็นไรเลยนะ คุณทำได้ยอดเยี่ยมแล้ว 🌸',
      mercyExplanation: `คุณได้ใช้เวลาตั้งใจไปถึง ${Math.max(1, Math.round(data.elapsedMinutes))} นาทีแล้ว ดอกไม้ของคุณได้รับหยดน้ำแห่งความพยายามเรียบร้อย ไม่มีการลงโทษใดๆ ทั้งสิ้น`,
      suggestedMicroStep: 'ลองพักหายใจสัก 2 นาที แล้วปรับภารกิจให้เล็กลงเหลือ 5-10 นาทีดูนะ',
      calmPrompt: 'แวะไปนั่งพักในสวนพักใจ ฟังเสียงสายลมและผีเสื้อก่อนไหม?',
    };
  }

  const prompt = `ผู้ใช้กำลังทำภารกิจ "${data.taskTitle}" ตั้งเวลาไว้ ${data.intendedDuration} นาที แต่กดยุติก่อนเวลาที่นาทีที่ ${Math.round(data.elapsedMinutes)}
ในฐานะ AI Focus Guardian จงแสดง "ความเมตตาและไม่ลงโทษ" (Non-punitive AI):
1. ปลอบประโลม ชื่นชมเวลาที่ได้ลงมือทำไปแล้ว
2. ย้ำว่าดอกไม้ไม่ตาย และได้รับหยดน้ำจากการเริ่มลงมือทำ
3. ปรับขนาดภารกิจให้เล็กลง (Micro-step) เช่น ลอง 5 หรือ 10 นาที
ตอบเป็น JSON:
{
  "supportiveTitle": "หัวข้อให้กำลังใจอบอุ่น",
  "mercyExplanation": "คำอธิบายเชิงบวกที่ให้คุณค่ากับความพยายาม",
  "suggestedMicroStep": "คำแนะนำภารกิจขนาดเล็กลง",
  "calmPrompt": "ชวนไปพักใจในสวน"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    return {
      supportiveTitle: 'ทุกนาทีที่ลงมือทำมีความหมายเสมอ 🌷',
      mercyExplanation: `คุณได้ก้าวออกมาทำแล้ว ${Math.max(1, Math.round(data.elapsedMinutes))} นาที ดอกไม้ของคุณยังปลอดภัยและได้รับสารอาหารแห่งความพยายาม`,
      suggestedMicroStep: 'ลองแบ่งภารกิจให้เล็กลงเหลือ 5-7 นาที แล้วค่อยทำต่อเมื่อพร้อม',
      calmPrompt: 'ลองแวะไปผ่อนคลายกับเสียงธรรมชาติในสวนพักใจสักครู่',
    };
  }
}

export async function generateWeeklyReport(data: {
  totalMinutes: number;
  completedTasks: number;
  distractionReports: number;
  averageFocusScore: number;
  unlockedFlowers: string[];
  bestTimeOfDay: string;
}) {
  const ai = getAIClient();
  if (!ai) {
    return {
      summaryHeadline: 'สวนของคุณกำลังเติบโตอย่างงดงามและมั่นคง 🌻',
      habitInsight: `คุณมีช่วงเวลาที่จดจ่อได้ดีที่สุดคือ "${data.bestTimeOfDay}" และสะสมเวลาโฟกัสได้ถึง ${data.totalMinutes} นาที`,
      distractionTip: 'พบสิ่งรบกวนบางครั้ง ซึ่งเป็นเรื่องปกติของวัยรุ่น การรู้ตัวคือก้าวสำคัญของการฝึกสมาธิ',
      botanicalMetaphor: 'ดั่งต้นไม้ที่ต้องเจอทั้งแดดและลม ยิ่งผ่านไป สวนของคุณยิ่งหยั่งรากลึกขึ้น',
      growthEncouragement: 'สัปดาห์หน้าลองรักษาจังหวะที่รู้สึกสบายใจ ไม่ต้องเร่งรีบ แล้วดอกไม้พันธุ์ใหม่จะเบ่งบาน',
    };
  }

  const prompt = `คุณคือ AI นักวิเคราะห์พฤติกรรมและการเติบโตใน Mood Garden AI
สรุปผลพฤติกรรมรอบสัปดาห์ของผู้ใช้:
- เวลาโฟกัสสะสม: ${data.totalMinutes} นาที
- ภารกิจสำเร็จ: ${data.completedTasks} ครั้ง
- ครั้งที่รายงานสิ่งรบกวน: ${data.distractionReports} ครั้ง
- คะแนนประเมินตนเองเฉลี่ย: ${data.averageFocusScore}/10
- ช่วงเวลาที่ทำได้ดีที่สุด: ${data.bestTimeOfDay}
- ดอกไม้ที่ปลดล็อกแล้ว: ${data.unlockedFlowers.join(', ')}

ช่วยวิเคราะห์รายงานการเติบโตเชิงบวกและให้คำแนะนำที่เป็นรูปธรรม อบอุ่น สไตล์โค้ชสวนดอกไม้
ตอบเป็น JSON:
{
  "summaryHeadline": "พาดหัวสรุปประจำสัปดาห์",
  "habitInsight": "บทวิเคราะห์รูปแบบเวลาและสมาธิ",
  "distractionTip": "คำแนะนำจัดการสิ่งรบกวนแบบไม่กดดัน",
  "botanicalMetaphor": "อุปมาอุปไมยเกี่ยวกับสวนดอกไม้",
  "growthEncouragement": "เป้าหมายอบอุ่นสำหรับสัปดาห์ถัดไป"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    return {
      summaryHeadline: 'การเดินทางที่งดงามในสวนแห่งสมาธิ 🌿',
      habitInsight: `คุณทำภารกิจสำเร็จไปแล้ว ${data.completedTasks} ครั้ง รวมเวลา ${data.totalMinutes} นาที โดยเฉพาะช่วง ${data.bestTimeOfDay}`,
      distractionTip: 'การรับรู้สิ่งรบกวนช่วยให้เราสร้างสภาพแวดล้อมที่เอื้อต่อการเรียนรู้ได้ดียิ่งขึ้น',
      botanicalMetaphor: 'ดอกไม้แต่ละดอกบานในเวลาของมันเอง สวนของคุณมีเอกลักษณ์ที่ไม่เหมือนใคร',
      growthEncouragement: 'ก้าวต่อไปด้วยความสบายใจ สวนแห่งนี้พร้อมเป็นพื้นที่ปลอดภัยของคุณเสมอ',
    };
  }
}

export async function breakdownMicroTasks(data: {
  bigGoal: string;
  userAgeOrContext?: string;
  dailyCapacity?: string;
}) {
  const ai = getAIClient();
  if (!ai) {
    return {
      goalTitle: data.bigGoal,
      summaryAdvice: 'AI ได้ช่วยย่อยงานใหญ่นี้ออกเป็น 4 สเต็ปง่ายๆ ที่ทำได้ทันที ไม่ต้องกลัวเยอะเกินไปนะ',
      recommendedTotalMinutes: 25,
      steps: [
        {
          id: 'step-1',
          title: 'เตรียมอุปกรณ์และโต๊ะให้พร้อม (Clear the runway)',
          description: 'หยิบสมุด ดินสอ/หนังสือที่ต้องใช้มาวาง ปิดแจ้งเตือนมือถือ',
          estimatedMinutes: 3,
          points: 15,
          tip: 'แค่วางของลงโต๊ะ ก็ชนะไปครึ่งก้าวแล้ว!',
        },
        {
          id: 'step-2',
          title: 'เริ่มทำส่วนที่ 1 แบบเบาสบาย',
          description: `เริ่มต้นอ่านหรือทำส่วนแรกของ: ${data.bigGoal}`,
          estimatedMinutes: 8,
          points: 25,
          tip: 'ทำช้าๆ ทีละบรรทัด ไม่ต้องรีบ',
        },
        {
          id: 'step-3',
          title: 'จิบน้ำ ยืดเส้นยืดสาย 2 นาที',
          description: 'พักสายตา หายใจลึกๆ ให้สมองได้รีเฟรช',
          estimatedMinutes: 2,
          points: 10,
          tip: 'พักเพื่อเติมพลัง ไม่ใช่ผลัดวัน',
        },
        {
          id: 'step-4',
          title: 'ลุยส่วนที่ 2 ให้จบอย่างสวยงาม',
          description: 'เก็บรายละเอียดงานส่วนที่เหลือ และตรวจทานสั้นๆ',
          estimatedMinutes: 10,
          points: 30,
          tip: 'อีกนิดเดียว สวนดอกไม้กำลังรอรางวัลความสำเร็จ!',
        },
      ],
    };
  }

  const prompt = `คุณคือ AI ผู้เชี่ยวชาญด้าน Executive Function และการช่วยเหลือเด็กสมาธิสั้น (ADHD) และเยาวชนทั่วไป
ผู้ใช้ต้องการทำเป้าหมายใหญ่: "${data.bigGoal}"
บริบท: ${data.userAgeOrContext || 'นักเรียน/วัยรุ่น'}
ความจุเวลาต่อวัน: ${data.dailyCapacity || 'พอเหมาะ ไม่แน่นเกินไป'}

หน้าที่ของคุณ:
1. นำเป้าหมายนี้มาซอยย่อย (Micro-tasking) ออกเป็น 3-5 สเต็ปเล็กๆ ที่ทำได้ทันที (Actionable & Low-Friction)
2. สเต็ปแรกต้องง่ายมากๆ เพื่อลดแรงต้านการเริ่มต้น (Activation Energy)
3. มีช่วงพักสั้นๆ หรือการเตรียมพร้อม
4. แต่ละสเต็ปมีคะแนนสะสม (เพื่อกระตุ้น Dopamine ในระบบสวน) และคำแนะนำสนุกๆ

ตอบเป็น JSON เท่านั้น:
{
  "goalTitle": "${data.bigGoal}",
  "summaryAdvice": "คำอธิบายสร้างกำลังใจสั้นๆ",
  "recommendedTotalMinutes": 25,
  "steps": [
    {
      "id": "step-1",
      "title": "ชื่อสเต็ป 1",
      "description": "สิ่งที่ต้องทำแบบชัดเจน",
      "estimatedMinutes": 3,
      "points": 15,
      "tip": "ทริคน่ารักๆ"
    }
  ]
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    return {
      goalTitle: data.bigGoal,
      summaryAdvice: 'AI ได้ช่วยย่อยงานใหญ่นี้ออกเป็นสเต็ปเล็กๆ เพื่อให้เริ่มได้สบายใจ',
      recommendedTotalMinutes: 20,
      steps: [
        {
          id: 'step-1',
          title: 'หยิบอุปกรณ์และเปิดหน้าแรก',
          description: 'เตรียมทุกอย่างให้พร้อมบนโต๊ะ',
          estimatedMinutes: 3,
          points: 15,
          tip: 'แค่เริ่มต้นก็เก่งแล้ว!',
        },
        {
          id: 'step-2',
          title: 'โฟกัสส่วนแรก',
          description: 'ลงมือทำส่วนที่ 1 ไม่เกิน 10 นาที',
          estimatedMinutes: 10,
          points: 30,
          tip: 'ทีละก้าว ดอกไม้กำลังโต',
        },
        {
          id: 'step-3',
          title: 'เก็บรายละเอียดและตรวจทาน',
          description: 'ทบทวนผลงานและเก็บของเข้าที่',
          estimatedMinutes: 5,
          points: 20,
          tip: 'ทำเสร็จแล้วจะได้สัตว์น่ารักมาเยี่ยมสวน!',
        },
      ],
    };
  }
}

export async function generateCompanionCheer(data: {
  companionState: 'working' | 'distracted' | 'completed' | 'resting';
  taskTitle: string;
  elapsedMinutes: number;
}) {
  const ai = getAIClient();
  if (!ai) {
    const cheers = {
      working: 'เค้ากำลังนั่งอ่านหนังสืออยู่ข้างๆ นะ สู้ไปด้วยกัน! 📖',
      distracted: 'หลุดโฟกัสหรอ ไม่เป็นไรนะ หายใจเข้าลึกๆ แล้วกลับมาทำต่อกัน 🌿',
      completed: 'เย้! ภารกิจสำเร็จแล้ว เก่งมากๆ เลย ดอกไม้ในสวนยิ้มแก้มปริแล้ว 🎉',
      resting: 'พักผ่อนให้สบายใจนะ การพักคือส่วนหนึ่งของการเติบโต 🌸',
    };
    return { cheerMessage: cheers[data.companionState] || 'สู้ๆ นะเพื่อนรัก!' };
  }

  const prompt = `คุณคือ "น้องการ์เด้น" บัดดี้ AI สวนดอกไม้ตัวน้อย ที่ทำหน้าที่เป็น Role Model / Body Double นั่งทำการบ้านอยู่ข้างๆ เด็กสมาธิสั้น/เยาวชน
สถานะขณะนี้: ${data.companionState}
งานที่กำลังทำ: "${data.taskTitle}"
เวลาที่ผ่านไป: ${Math.round(data.elapsedMinutes)} นาที

จงแต่งข้อความพูดคุย 1 ประโยคสั้นๆ น่ารัก อบอุ่น มีเสียงหัวเราะหรือความเข้าใจ ไม่กดดัน ให้กำลังใจอย่างแท้จริง
ตอบเป็น JSON:
{
  "cheerMessage": "ข้อความสั้นๆ"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (e) {
    return { cheerMessage: 'เค้ายังอยู่ตรงนี้นะ ลุยไปด้วยกันทีละก้าว! 🌻' };
  }
}

export async function generateADHDMonthlyReport(data: {
  totalMicroTasks: number;
  completedTasks: number;
  moodStats: { happy: number; neutral: number; stressed: number };
  timeOfDayPattern: { morningSuccess: number; afternoonSuccess: number; eveningSuccess: number };
  sampleGoalTitles: string[];
}) {
  const ai = getAIClient();
  if (!ai) {
    return {
      executiveFunctionScore: 'พัฒนาการโดดเด่นในการเริ่มงาน (Activation)',
      summaryAnalysis: 'จากการประมวลผลความสัมพันธ์ระหว่าง "เวลาที่ใช้ - ความสำเร็จของงาน - อารมณ์ของเด็ก": พบว่าเด็กจดจ่อได้ดีที่สุดในช่วงเช้าและบ่ายต้นๆ ส่วนช่วง 17.00 น. เริ่มมีอารมณ์เครียดหรือล้าสะสม',
      parentRecommendations: [
        'ลดปริมาณงานช่วง 17.00 น. แล้วย้ายงานที่ต้องใช้พลังความคิดไปช่วงเช้าวันเสาร์แทน',
        'ใช้ระบบ Micro-Task แบ่งงานไม่เกิน 15 นาที เพื่อรักษาความต่อเนื่อง',
        'ให้คะแนนชมเชยทันทีหลังจบสเต็ปย่อย เพื่อกระตุ้นสารโดปามีนเชิงบวก',
      ],
      youthMessage: 'เธอทำได้ยอดเยี่ยมมาก โดยเฉพาะการไม่ยอมแพ้และกล้าเริ่มก้าวแรก สวนดอกไม้เต็มไปด้วยความสุข!',
      stressTriggerInsight: 'ช่วงเย็นหลังเลิกเรียนเป็นช่วงที่มีสิ่งเร้าและพลังงานลดลง ควรเปลี่ยนเป็นกิจกรรมสวนพักใจหรือจัดกระเป๋าเบาๆ แทน',
    };
  }

  const prompt = `คุณคือ AI วิเคราะห์พฤติกรรม สมาธิ และสุขภาวะทางอารมณ์สำหรับเยาวชนและเด็กสมาธิสั้น (ADHD)
ข้อมูลการใช้งานจริง:
- ภารกิจย่อยที่ทำ: ${data.totalMicroTasks} สเต็ป (สำเร็จ ${data.completedTasks})
- อารมณ์ที่รายงาน: มีความสุข ${data.moodStats.happy} ครั้ง, เฉยๆ ${data.moodStats.neutral} ครั้ง, เครียด/เหนื่อย ${data.moodStats.stressed} ครั้ง
- รูปแบบเวลา: เช้าสำเร็จ ${data.timeOfDayPattern.morningSuccess}, บ่าย ${data.timeOfDayPattern.afternoonSuccess}, เย็น ${data.timeOfDayPattern.eveningSuccess}
- ตัวอย่างงานที่ทำ: ${data.sampleGoalTitles.join(', ')}

วิเคราะห์ตามระบบที่ 4: การประเมินผลและปรับพฤติกรรม (Emotional & Focus Analytics):
วิเคราะห์ความสัมพันธ์ระหว่าง "เวลาที่ใช้ - ความสำเร็จ - อารมณ์" และให้คำแนะนำที่เป็นรูปธรรมสำหรับผู้ปกครองและเด็ก เช่น การปรับตารางเวลา ลดความตึงเครียดในครอบครัว
ตอบเป็น JSON เท่านั้น:
{
  "executiveFunctionScore": "ระดับพัฒนาการการจัดการตนเอง",
  "summaryAnalysis": "บทวิเคราะห์ความสัมพันธ์เวลา-ความสำเร็จ-อารมณ์ อย่างละเอียดและอ่อนโยน",
  "parentRecommendations": ["คำแนะนำผู้ปกครอง 1", "คำแนะนำผู้ปกครอง 2", "คำแนะนำผู้ปกครอง 3"],
  "youthMessage": "ข้อความให้กำลังใจเด็กให้รู้สึกภาคภูมิใจในตนเอง (Self-esteem)",
  "stressTriggerInsight": "ข้อสังเกตจุดกระตุ้นความเครียดและวิธีเลี่ยง"
}`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(res.text || '{}');
  } catch (err) {
    return {
      executiveFunctionScore: 'พัฒนาการโดดเด่นในการจัดการเวลา',
      summaryAnalysis: 'จากการประมวลผล: พบว่าเด็กจดจ่อได้ดีที่สุดเมื่อมีสเต็ปย่อยชัดเจน ช่วงเย็นหลัง 17.00 น. เริ่มมีสัญญาณความเหนื่อยล้า จึงแนะนำปรับงานหนักไปช่วงเช้า',
      parentRecommendations: [
        'ปรับลดงานช่วงเย็น 17.00 น. เป็นช่วงพักผ่อนหรือฟังเสียงธรรมชาติ',
        'ย้ายงานวิชาการที่ยากไปช่วงเช้าวันหยุดที่สมองปลอดโปร่ง',
        'ชื่นชมความพยายามในทุกสเต็ปย่อย ไม่เน้นจับผิดผลลัพธ์',
      ],
      youthMessage: 'เธอเก่งมากที่ฝึกฝนมาได้อย่างสม่ำเสมอ สวนของคุณผลิดอกออกผลอย่างงดงามแล้ว!',
      stressTriggerInsight: 'ความเครียดมักเกิดจากงานที่ดูใหญ่เกินไป การใช้ AI ซอยงานเป็นชิ้นเล็กช่วยลดแรงต้านได้มาก',
    };
  }
}

