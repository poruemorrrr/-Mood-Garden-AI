import { FlowerMoodInfo, FlowerMoodType } from '../types/garden';

export const FLOWER_MOODS: Record<FlowerMoodType, FlowerMoodInfo> = {
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    nameTh: 'ดอกทานตะวัน',
    emoji: '🌻',
    feeling: 'รู้สึกมีพลัง (Energetic)',
    feelingDescription: 'พร้อมลุย มีไฟ มีแรงบันดาลใจ เหมาะกับการเริ่มภารกิจที่ท้าทาย',
    color: '#EAB308', // amber-500
    badgeBg: 'bg-amber-100 dark:bg-amber-950/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    iconBg: 'from-amber-400 to-yellow-500',
  },
  tulip: {
    id: 'tulip',
    name: 'Tulip',
    nameTh: 'ดอกทิวลิป',
    emoji: '🌷',
    feeling: 'รู้สึกสงบ (Calm & Peaceful)',
    feelingDescription: 'จิตใจนิ่ง สบายๆ ไม่รีบร้อน เหมาะกับการอ่านหนังสือและทำความเข้าใจ',
    color: '#EC4899', // pink-500
    badgeBg: 'bg-pink-100 dark:bg-pink-950/40',
    badgeText: 'text-pink-800 dark:text-pink-300',
    iconBg: 'from-pink-400 to-rose-400',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    nameTh: 'ดอกกุหลาบ',
    emoji: '🌹',
    feeling: 'รู้สึกกังวล (Anxious / Overthinking)',
    feelingDescription: 'มีความคิดวนเวียน ตึงเครียด หรือกลัวทำไม่ทัน เราจะปลอบโยนและเริ่มทีละก้าว',
    color: '#E11D48', // rose-600
    badgeBg: 'bg-rose-100 dark:bg-rose-950/40',
    badgeText: 'text-rose-800 dark:text-rose-300',
    iconBg: 'from-rose-500 to-red-600',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    nameTh: 'ดอกลาเวนเดอร์',
    emoji: '🪻',
    feeling: 'ต้องการผ่อนคลาย (Need Relaxation)',
    feelingDescription: 'เหนื่อยล้าจากทั้งวัน อยากโฟกัสแบบเบาๆ ไม่บีบคั้นตัวเอง หรือพักใจ',
    color: '#8B5CF6', // purple-500
    badgeBg: 'bg-purple-100 dark:bg-purple-950/40',
    badgeText: 'text-purple-800 dark:text-purple-300',
    iconBg: 'from-purple-400 to-indigo-500',
  },
  daisy: {
    id: 'daisy',
    name: 'Daisy',
    nameTh: 'ดอกเดซี่',
    emoji: '🌼',
    feeling: 'รู้สึกเบิกบาน (Cheerful & Joyful)',
    feelingDescription: 'อารมณ์ดี สดใส อยากเรียนรู้อย่างมีความสุข สนุกกับทุกหน้ากระดาษ',
    color: '#F59E0B', // amber-500
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/40',
    badgeText: 'text-yellow-800 dark:text-yellow-300',
    iconBg: 'from-yellow-300 to-amber-400',
  },
  lotus: {
    id: 'lotus',
    name: 'Mindful Lotus',
    nameTh: 'บัวแก้วสมาธิ',
    emoji: '🪷',
    feeling: 'สมาธิตกผลึก (Deep Mindfulness)',
    feelingDescription: 'ปลดล็อกเมื่อฝึกต่อเนื่อง สมาธิที่อยู่เหนือน้ำและความคิดฟุ้งซ่าน',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/40',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    iconBg: 'from-cyan-400 to-teal-500',
  },
  sakura: {
    id: 'sakura',
    name: 'Hope Sakura',
    nameTh: 'ซากุระแห่งความหวัง',
    emoji: '🌸',
    feeling: 'เริ่มต้นใหม่เสมอ (Fresh Horizon)',
    feelingDescription: 'ปลดล็อกเมื่อดูแลสวนครบ 5 วัน ทุกความพยายามมีคุณค่าและผลิดอกงาม',
    color: '#F472B6',
    badgeBg: 'bg-pink-100 dark:bg-pink-950/40',
    badgeText: 'text-pink-800 dark:text-pink-300',
    iconBg: 'from-pink-300 to-rose-400',
  },
};

export const SANCTUARY_ZONES = [
  {
    id: 'sunbeam',
    name: 'ทุ่งหญ้าแสงตะวัน (Sunbeam Meadow)',
    icon: '☀️',
    desc: 'พื้นที่เปิดโล่งรับแสงแดดอุ่น ช่วยเพิ่มพลังและทัศนคติเชิงบวก',
    minFocusMinutes: 0,
  },
  {
    id: 'zen_pond',
    name: 'สระบัวเซนพักใจ (Zen Water Lily Pond)',
    icon: '💧',
    desc: 'ผิวน้ำสงบนิ่งและปลาคาร์ปว่ายเวียน ช่วยให้จิตใจนิ่งสงบ',
    minFocusMinutes: 30,
  },
  {
    id: 'firefly_glade',
    name: 'ป่าหิ่งห้อยราตรี (Firefly Twilight Glade)',
    icon: '✨',
    desc: 'ลานหิ่งห้อยส่องแสงระยิบระยับ เหมาะกับการปล่อยวางความเครียดก่อนนอน',
    minFocusMinutes: 60,
  },
];

export const GARDEN_ANIMALS = [
  {
    id: 'bunny',
    name: 'Baby Bunny',
    nameTh: 'กระต่ายน้อยขนปุย',
    emoji: '🐰',
    unlockPoints: 25,
    description: 'กระโดดดุ๊กดิ๊กอยู่ข้างกอดอกไม้ ให้กำลังใจทุกครั้งที่เริ่มงาน',
  },
  {
    id: 'squirrel',
    name: 'Fluffy Squirrel',
    nameTh: 'กระรอกหางฟูนักสะสม',
    emoji: '🐿️',
    unlockPoints: 60,
    description: 'ชอบวิ่งเก็บลูกสนและคอยมองดูเธอทำการบ้านอย่างตั้งใจ',
  },
  {
    id: 'songbird',
    name: 'Chirping Finch',
    nameTh: 'ลูกนกกระจิบเพลงเพราะ',
    emoji: '🐦',
    unlockPoints: 100,
    description: 'เกาะบนกิ่งไม้ร้องเพลงเบาๆ เป็นสัญญาณว่าสมาธิกำลังมา',
  },
  {
    id: 'duckling',
    name: 'Happy Duckling',
    nameTh: 'ลูกเป็ดน้อยลอยน้ำ',
    emoji: '🦆',
    unlockPoints: 160,
    description: 'ว่ายน้ำตุ๊บป่องในสระบัว ช่วยให้จิตใจร่มเย็นไม่ว้าวุ่น',
  },
  {
    id: 'hedgehog',
    name: 'Gentle Hedgehog',
    nameTh: 'เม่นแคระตัวกลม',
    emoji: '🦔',
    unlockPoints: 230,
    description: 'ขดตัวนอนใต้พุ่มไม้ คอยเตือนให้เธออย่าลืมพักผ่อน',
  },
  {
    id: 'ladybug',
    name: 'Lucky Ladybug',
    nameTh: 'เต่าทองนำโชค',
    emoji: '🐞',
    unlockPoints: 300,
    description: 'เกาะบนกลีบดอกไม้ นำพาความสุขและโชคดีในการเรียนมาให้',
  },
];

