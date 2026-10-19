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
