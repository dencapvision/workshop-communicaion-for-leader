/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Sparkles, Copy, Download, RefreshCw, 
  Trash2, Plus, Check, Volume2, ArrowRight, Eye, Play, Heart,
  UserCheck, CheckCircle2
} from 'lucide-react';
import { SelfIntroState, ProjectProposalState, ReflectionCard, PresentationPrepState } from '../types';
import { playChimeSound } from './WorkbookWidgets';

interface InteractiveWorkbookViewProps {
  selfIntro: SelfIntroState;
  setSelfIntro: (state: SelfIntroState) => void;
  projectProposal: ProjectProposalState;
  setProjectProposal: (state: ProjectProposalState) => void;
  presentationPrep: PresentationPrepState;
  setPresentationPrep: (state: PresentationPrepState) => void;
  reflectionCards: ReflectionCard[];
  onAddReflectionCard: (card: Omit<ReflectionCard, 'id'>) => void;
  onDeleteReflectionCard: (id: string) => void;
  handleExportWorkbook: () => void;
}

export const InteractiveWorkbookView: React.FC<InteractiveWorkbookViewProps> = ({
  selfIntro,
  setSelfIntro,
  projectProposal,
  setProjectProposal,
  presentationPrep,
  setPresentationPrep,
  reflectionCards,
  onAddReflectionCard,
  onDeleteReflectionCard,
  handleExportWorkbook,
}) => {
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [inputTextReflection, setInputTextReflection] = useState('');
  const [categoryReflection, setCategoryReflection] = useState<'start' | 'stop' | 'continue'>('start');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleCopySection1 = () => {
    const text = `### 💥 ส่วนที่ 1: เฟรมเวิร์คแนะนำตัว 60 วินาที ของผู้นำ
- **คำทักทายเด่นสะกดฟัง (Hook):** ${selfIntro.hook || 'ยังไม่ได้ระบุข้อมูล'}
- **พันธกิจภาพลักษณ์ (Mission):** ${selfIntro.mission || 'ยังไม่ได้ระบุข้อมูล'}
- **คุณค่าช่วยเหลือประชาชน (Value):** ${selfIntro.value || 'ยังไม่ได้ระบุข้อมูล'}
- **คำซักชวนเครือข่ายความร่วมมือ (Action Goal):** ${selfIntro.goal || 'ยังไม่ได้ระบุข้อมูล'}

*คำสุนทรพจน์ประสานรวม:*
“สวัสดีครับ/ค่ะทุกท่าน ${selfIntro.hook || '...'} ผม/ดิฉัน ${selfIntro.mission || '...'} ซึ่งความคุ้มครอบคุณค่าที่ผมช่วยหนุนช่วยเหลือประชาชนคือ ${selfIntro.value || '...'} และผมหวังประสานที่จะได้รับความร่วมมือด้าน ${selfIntro.goal || '...'} ครับ/ค่ะ”`;
    
    navigator.clipboard.writeText(text);
    setCopiedSection(1);
    playChimeSound('success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopySection2 = () => {
    const text = `### 📢 ส่วนที่ 2: โครงร่างประดิษฐ์สปีช Pitching ใน 3 นาที
- **ชื่อโครงการหมุดหมายปัง (Project Title):** ${projectProposal.title || 'ยังไม่ได้ระบุข้อมูล'}
- **วิกฤตความจำเป็นสูงสุด (Urgent Pain):** ${projectProposal.challenge || 'ยังไม่ได้ระบุข้อมูล'}
- **นวัตกรรมระบบปราบชำนาญ (Proposed Solution):** ${projectProposal.solution || 'ยังไม่ได้ระบุข้อมูล'}
- **สถิติปริมาณความคุ้มค่า (Outcome):** ${projectProposal.outcome || 'ยังไม่ได้ระบุข้อมูล'}
- **คำของบหรือเซ็นร่วมงานด่วน (Call to Action):** ${projectProposal.cta || 'ยังไม่ได้ระบุข้อมูล'}`;
    
    navigator.clipboard.writeText(text);
    setCopiedSection(2);
    playChimeSound('success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopySection2_5 = () => {
    const text = `### 🥪 ส่วนที่ 2.5: กระดาษแผ่นเตรียมตัวพิทชิ่งการนำเสนอ (โครงสร้างแซนด์วิช)
- **หัวข้อการพิทชิ่ง:** ${presentationPrep.title || 'ยังไม่ได้ระบุข้อมูล'}
- **กลุ่มผู้ฟังหลัก (Audience):** ${presentationPrep.audience || 'ยังไม่ได้ระบุข้อมูล'}
- **วัตถุประสงค์หลัก:** ${presentationPrep.objective === 'inform' ? 'แจ้งส่งข้อมูลประยุกต์เข้าใจง่าย' : presentationPrep.objective === 'persuade' ? 'ปรับเปลี่ยนทัศนะยินดีคัดเลือก' : 'กระตุ้นให้ลงตราอนุมัติพัฒนา'}
- **ขนมปังบน (Hook):** ${presentationPrep.hook || 'ยังไม่ได้ระบุข้อมูล'}
- **ไส้เนื้อแซนด์วิช (ประเด็นกลาง):**
  1. ${presentationPrep.body1 || '-'}
  2. ${presentationPrep.body2 || '-'}
  3. ${presentationPrep.body3 || '-'}
- **ขนมปังล่าง (CTA):** ${presentationPrep.cta || 'ยังไม่ได้ระบุข้อมูล'}
- **เช็คลิสต์ผ่อนพักกายใจ (ครูเด่นเกื้อหนุน):**
  - แบบฝึกลมหายใจ Box Breathing: ${presentationPrep.checkedBreathing ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - ปรับสรีระยืดกาย แผ่ไหล่พยุงพลัง: ${presentationPrep.checkedPosture ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - สบตากล้อง Zoom เสมือนสัตย์ประสาน: ${presentationPrep.checkedEyeContact ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - นอบน้อมแอมป์เป้าประสงค์: ${presentationPrep.checkedConfidence ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}`;

    navigator.clipboard.writeText(text);
    setCopiedSection(25);
    playChimeSound('success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyWholeDocument = () => {
    const startCardsText = reflectionCards.filter(c => c.category === 'start').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';
    const stopCardsText = reflectionCards.filter(c => c.category === 'stop').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';
    const continueCardsText = reflectionCards.filter(c => c.category === 'continue').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';

    const documentText = `# เวิร์กชอปคู่มือตกผลึก: ทักษะการสื่อสารและการนำเสนอสำหรับผู้นำ

### 💥 ส่วนที่ 1: เฟรมเวิร์คแนะนำตัว 60 วินาที ของผู้นำ
- **คำทักทายเด่นสะกดฟัง (Hook):** ${selfIntro.hook || 'ยังไม่ได้ระบุข้อมูล'}
- **พันธกิจภาพลักษณ์ (Mission):** ${selfIntro.mission || 'ยังไม่ได้ระบุข้อมูล'}
- **คุณค่าช่วยเหลือประชาชน (Value):** ${selfIntro.value || 'ยังไม่ได้ระบุข้อมูล'}
- **คำซักชวนเครือข่ายความร่วมมือ (Action Goal):** ${selfIntro.goal || 'ยังไม่ได้ระบุข้อมูล'}

*คำสุนทรพจน์ประสานรวม:*
“สวัสดีครับ/ค่ะทุกท่าน ${selfIntro.hook || '...'} ผม/ดิฉัน ${selfIntro.mission || '...'} ซึ่งความคุ้มครอบคุณค่าที่ผมช่วยหนุนช่วยเหลือประชาชนคือ ${selfIntro.value || '...'} และผมหวังประสานที่จะได้รับความร่วมมือด้าน ${selfIntro.goal || '...'} ครับ/ค่ะ”

### 📢 ส่วนที่ 2: โครงร่างประดิษฐ์สปีช Pitching ใน 3 นาที
- **ชื่อโครงการหมุดหมายปัง (Project Title):** ${projectProposal.title || 'ยังไม่ได้ระบุข้อมูล'}
- **วิกฤตความจำเป็นสูงสุด (Urgent Pain):** ${projectProposal.challenge || 'ยังไม่ได้ระบุข้อมูล'}
- **นวัตกรรมระบบปราบชำนาญ (Proposed Solution):** ${projectProposal.solution || 'ยังไม่ได้ระบุข้อมูล'}
- **สถิติปริมาณความคุ้มค่า (Outcome):** ${projectProposal.outcome || 'ยังไม่ได้ระบุข้อมูล'}
- **คำของบหรือเซ็นร่วมงานด่วน (Call to Action):** ${projectProposal.cta || 'ยังไม่ได้ระบุข้อมูล'}

### 🥪 ส่วนที่ 2.5: กระดาษแผ่นเตรียมตัวพิทชิ่งการนำเสนอ (โครงสร้างแซนด์วิช)
- **หัวข้อการพิทชิ่ง:** ${presentationPrep.title || 'ยังไม่ได้ระบุข้อมูล'}
- **กลุ่มผู้ฟังหลัก (Audience):** ${presentationPrep.audience || 'ยังไม่ได้ระบุข้อมูล'}
- **วัตถุประสงค์หลัก:** ${presentationPrep.objective === 'inform' ? 'แจ้งส่งข้อมูลประยุกต์เข้าใจง่าย' : presentationPrep.objective === 'persuade' ? 'ปรับเปลี่ยนทัศนะยินดีคัดเลือก' : 'กระตุ้นให้ลงตราอนุมัติพัฒนา'}
- **ขนมปังบน (Hook):** ${presentationPrep.hook || 'ยังไม่ได้ระบุข้อมูล'}
- **ไส้เนื้อแซนด์วิช (ประเด็นสำคัญ):**
  1. ${presentationPrep.body1 || '-'}
  2. ${presentationPrep.body2 || '-'}
  3. ${presentationPrep.body3 || '-'}
- **ขนมปังล่าง (CTA):** ${presentationPrep.cta || 'ยังไม่ได้ระบุข้อมูล'}
- **เช็คลิสต์ผ่อนพักกายใจ (ครูเด่นเกื้อหนุน):**
  - แบบฝึกลมหายใจ Box Breathing: ${presentationPrep.checkedBreathing ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - ปรับสรีระยืดกาย แผ่ไหล่พยุงพลัง: ${presentationPrep.checkedPosture ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - สบตากล้อง Zoom เสมือนสัตย์ประสาน: ${presentationPrep.checkedEyeContact ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}
  - นอบน้อมแอมป์เป้าประสงค์: ${presentationPrep.checkedConfidence ? '✓ สำเร็จ' : '✗ ยังไม่พร้อม'}

### 🚀 ส่วนที่ 3: แผนตกผลึก Start-Stop-Continue บันดาลสรุป
- **START (จะเริ่มต้นทำ):**
${startCardsText}
- **STOP (จะตัดใจงดเว้น):**
${stopCardsText}
- **CONTINUE (จะสืบสานต่อ):**
${continueCardsText}

---
*จัดทำโดยผู้เรียนหลักสูตรร่วมใจพัฒนาศักยภาพผู้บริหารสาธารณสุขล้านนา*`;

    navigator.clipboard.writeText(documentText);
    setCopiedMarkdown(true);
    playChimeSound('success');
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const loadTeacherDenExamples = () => {
    setSelfIntro({
      hook: "ในรอยต่อพื้นที่ชายแดน หูที่คอยฟังประชาชนที่เร็วที่สุดคือหูของผู้บริหารเขตเรานี่เองครับ",
      mission: "อนุสรณ์ หนองนา ผู้อำนวยการเขตสุขภาพที่ 1 ดูแลคุ้มครองประชากรในภูมิภาค 8 ล้านชีวิต",
      value: "ช่วยยกระดับระบบวิบาลถึงหุบเขาด้วยแพลตฟอร์มโทรเวชกรรม (Telemedicine) อัจฉริยะวิภาค",
      goal: "การสนับสนุนด้านงบพัฒนาเครือข่ายความเร็วสูงจากผู้ว่าราชการจังหวัดร่วมกัน"
    });

    setProjectProposal({
      title: "Tele-Northern-Care หมอทางไกลส่งล้านนาสุขใจ",
      challenge: "ผู้หญิงท้องและกลุ่มผู้ป่วยเบาหวานในเขตห้วยคอกดอยลำคลอง ชายขอบพะเยา ต้องลื่นล้มฉุกเฉินและสูญการช่วยพยาบาลเนื่องจากการเสียเวลาเดินข้ามเขา 3 ชั่วโมงเต็ม",
      solution: "ติดตั้งตู้ตรวจวิบาลปฐมภูมิอัจฉริยะ (Telemedicine Health Cube) บริการเชื่อมตรงทีมแพทย์เขต 1 วงเสวนารับรู้ดั่งใกล้จอ",
      outcome: "ลดค่าใช้จ่ายร่อนเดินทางผู้รักษาระดับตำบลลง 45% พยุงชีวิตหญิงคลอดได้เร็วขึ้นใน 25 นาทีเฉลี่ยแรกประสงค์",
      cta: "พิจารณาอนุมัติงบกองทุนส่งเสริมจังหวัดเขต 1 ประจำงบหนุนแบรนด์ระดับ 1.2 ล้านเพื่อโครงการนำร่องประสาน"
    });

    setPresentationPrep({
      title: "โครงการฝ่าด่านฝุ่นเมืองเหนือ (Clean Air Project)",
      audience: "ผู้ว่าราชการจังหวัด และคณะกรรมการงบประมาณกลุ่มจังหวัดภาคเหนือ",
      objective: "action",
      hook: "พี่น้องตระหนักไหมครับว่า วิกฤตฝุ่นควันภาคเหนือปีนี้ กำลังช่วงชิงลมหายใจของเด็กเล็กและพรากเวลาชีวิตผู้สูงอายุไปเฉลี่ยคนละ 2 ปีแล้วนะครับ",
      body1: "แกน 1 (Pain point): อัตราผู้ป่วยมะเร็งปอดและโรคทางเดินหายใจพุ่งทะยานสูงขึ้น 30% ทั่วทุกด่านชายแดนเชียงใหม่-เชียงราย",
      body2: "แกน 2 (Solution): เรามีต้นแบบเครื่องฟอกฝุ่นความกดดันบวกระดับประชารัฐ (Positive Pressure Air Room) ฝีมือคนไทยที่ติดตั้งเสร็จใน 48 ชั่วโมง",
      body3: "แกน 3 (Outcome): ความคุ้มค่าคือปกป้องปอดบริสุทธิ์ของกลุ่มเปราะบางกว่า 5,000 ครอบครัว ลดเตียงแน่นและงบพยาบาลฉุกเฉินเขตได้ปีละ 4 ล้านบาท",
      cta: "ขอท่านอนุมัติงบกองทุนกลางร้อยละ 5 เพื่อสมทบสร้างห้องฟอกปอดนำร่องทั้ง 15 เขตเสี่ยงสูงด่วนที่สุดครับ",
      checkedConfidence: true,
      checkedPosture: true,
      checkedEyeContact: true,
      checkedBreathing: true
    });

    playChimeSound('success');
  };

  const handleResetAll = () => {
    setSelfIntro({ hook: '', mission: '', value: '', goal: '' });
    setProjectProposal({ title: '', challenge: '', solution: '', outcome: '', cta: '' });
    setPresentationPrep({
      title: '',
      audience: '',
      objective: 'persuade',
      hook: '',
      body1: '',
      body2: '',
      body3: '',
      cta: '',
      checkedConfidence: false,
      checkedPosture: false,
      checkedEyeContact: false,
      checkedBreathing: false
    });
    playChimeSound('pop');
  };

  const handleAddReflection = () => {
    if (!inputTextReflection.trim()) return;
    onAddReflectionCard({
      text: inputTextReflection.trim(),
      category: categoryReflection
    });
    setInputTextReflection('');
    playChimeSound('pop');
  };

  return (
    <div id="interactive-workbook-container" className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-1 sm:p-2 animate-fade-in font-sans">
      
      {/* Workbook Header Card */}
      <div className="bg-white border border-sand/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fbf7f0] to-transparent pointer-events-none opacity-40"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#1b6b50]/10 text-[#1b6b50] rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#e07a5f]" />
              Interactive Workshop Guidebook
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#1b6b50] tracking-tight">
            # เวิร์กชอปคู่มือตกผลึก: ทักษะการสื่อสารและการนำเสนอสำหรับผู้นำ
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-3xl">
            พิมพ์ข้อมูลของท่านในแต่ละส่วนเพื่อเติมเต็มสมุดคู่มือตกผลึกส่วนบุคคล ระบบจะเชื่อมใจผสานทุกส่วนเข้าด้วยกันอย่างสวยงาม ท่านสามารถเซฟไฟล์ ดาวน์โหลด หรือคัดลอกมาร์กดาวน์เพื่อนำไปใช้ปฏิบัติต่อได้ทันที
          </p>
        </div>

        {/* Action Controls for entire sheet */}
        <div className="flex flex-wrap md:flex-col lg:flex-row gap-2 shrink-0 relative z-10">
          <button
            type="button"
            id="book-btn-load-example"
            onClick={loadTeacherDenExamples}
            className="text-xs bg-[#f2cc8f]/20 hover:bg-[#f2cc8f]/40 text-stone-850 font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer border border-[#f2cc8f]/40 flex items-center gap-1.5"
          >
            💡 โหลดตัวอย่างครูเด่น
          </button>
          
          <button
            type="button"
            id="book-btn-reset"
            onClick={handleResetAll}
            className="text-xs bg-stone-100 hover:bg-stone-250 text-gray-700 px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> รีเซ็ต
          </button>
        </div>
      </div>

      {/* Main Grid: Left Side is Form Entry, Right Side is Live Sheet Render */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Form Editors */}
        <div className="space-y-6">
          
          {/* Section 1 Editor */}
          <div className="bg-white border border-sand/20 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-extrabold text-md text-[#1b6b50] flex items-center gap-2">
                <span className="bg-[#1b6b50]/10 text-[#1b6b50] w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center">1</span>
                💥 ส่วนที่ 1: แนะนำตัว 60 วินาที
              </h3>
              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-semibold uppercase">
                <span>ความยาว 60 วินาที</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#e07a5f] uppercase tracking-wider mb-1 flex justify-between">
                  <span>• คำทักทายเด่นสะกดฟัง (Hook)</span>
                </label>
                <textarea
                  value={selfIntro.hook}
                  id="sheet-intro-hook"
                  onChange={(e) => setSelfIntro({ ...selfIntro, hook: e.target.value })}
                  placeholder="เปรียบเปรยหรือเปิดสถิติกึกก้อง เช่น 'ทราบไหมครับว่าคนล้านนาร้อยละ 70 ลืมตามาเพื่อรอรถวิบาล...'"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-16 text-gray-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1b6b50] uppercase tracking-wider mb-1">
                  <span>• พันธกิจภาพลักษณ์ (Mission)</span>
                </label>
                <input
                  type="text"
                  value={selfIntro.mission}
                  id="sheet-intro-mission"
                  onChange={(e) => setSelfIntro({ ...selfIntro, mission: e.target.value })}
                  placeholder="สูตร: ชื่อ-ตำแหน่ง และ เขตรับผิดชอบหลักดูแลชีวิต"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  <span>• คุณค่าช่วยเหลือประชาชน (Value Offered)</span>
                </label>
                <textarea
                  value={selfIntro.value}
                  id="sheet-intro-value"
                  onChange={(e) => setSelfIntro({ ...selfIntro, value: e.target.value })}
                  placeholder="หน้างานท่านช่วยบรรเทาความเจ็บไข้ได้สวยงามอย่างไร"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-14 text-gray-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1c2722] uppercase tracking-wider mb-1">
                  <span>• คำชักชวนเครือข่ายความร่วมมือ (Action Goal)</span>
                </label>
                <input
                  type="text"
                  value={selfIntro.goal}
                  id="sheet-intro-goal"
                  onChange={(e) => setSelfIntro({ ...selfIntro, goal: e.target.value })}
                  placeholder="เป้าหมายทอดสัมพันธภาพร่วมวงดนตรีสุขภาวะ"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2 Editor */}
          <div className="bg-white border border-sand/20 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-extrabold text-md text-[#1b6b50] flex items-center gap-2">
                <span className="bg-[#1b6b50]/10 text-[#1b6b50] w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center">2</span>
                📢 ส่วนที่ 2: โครงร่าง Pitching ใน 3 นาที
              </h3>
              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-semibold uppercase">
                <span>โครงสร้างลิขิต</span>
              </div>
            </div>

            <div className="space-y-3.5 font-sans">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  <span>• ชื่อโครงการหมุดหมายปัง (Project Title)</span>
                </label>
                <input
                  type="text"
                  value={projectProposal.title}
                  id="sheet-pitch-title"
                  onChange={(e) => setProjectProposal({ ...projectProposal, title: e.target.value })}
                  placeholder="ชื่อนวัตกรรมที่กระจ่างด่วน"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#e07a5f] uppercase tracking-wider mb-1">
                  <span>• วิกฤตความจำเป็นสูงสุด (Urgent Pain)</span>
                </label>
                <textarea
                  value={projectProposal.challenge}
                  id="sheet-pitch-challenge"
                  onChange={(e) => setProjectProposal({ ...projectProposal, challenge: e.target.value })}
                  placeholder="ความเจ็บป่วย เจ็บลึกทางคลินิกที่ยังไม่ได้รับการพยาบาลพูนล้านนา"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-16 text-gray-800 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1b6b50] uppercase tracking-wider mb-1">
                  <span>• นวัตกรรมระบบปราบชำนาญ (Proposed Solution)</span>
                </label>
                <textarea
                  value={projectProposal.solution}
                  id="sheet-pitch-solution"
                  onChange={(e) => setProjectProposal({ ...projectProposal, solution: e.target.value })}
                  placeholder="กลวิธี ขีดกระบวนการ และเทคโนโลยีแก้ปัญหา"
                  className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-16 text-gray-800 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    <span>• สถิติปริมาณความคุ้ม (Outcome)</span>
                  </label>
                  <input
                    type="text"
                    value={projectProposal.outcome}
                    id="sheet-pitch-outcome"
                    onChange={(e) => setProjectProposal({ ...projectProposal, outcome: e.target.value })}
                    placeholder="ร้อยละตายลดลง 50% วัยงานดลคืน..."
                    className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1c2722] uppercase tracking-wider mb-1">
                    <span>• คำของบหรืออนุมัติด่วน (CTA)</span>
                  </label>
                  <input
                    type="text"
                    value={projectProposal.cta}
                    id="sheet-pitch-cta"
                    onChange={(e) => setProjectProposal({ ...projectProposal, cta: e.target.value })}
                    placeholder="ขอทดลองใน 3 อำเภอล้านนาเร่งด่วน"
                    className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2.5 Editor (เทมเพลตเตรียมตัวการนำเสนอ) */}
          <div className="bg-white border border-sand/20 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-extrabold text-md text-[#1b6b55] flex items-center gap-2">
                <span className="bg-[#1b6b50]/10 text-[#1b6b50] w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center">2.5</span>
                🥪 ส่วนที่ 2.5: แผ่นขัดเกลาคำพูดและเช็คลิสต์เตรียมนำเสนอ (Sandwich + Mindfulness)
              </h3>
              <button
                type="button"
                onClick={handleCopySection2_5}
                className="text-[10px] bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 font-bold px-2 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copiedSection === 25 ? "คัดลอกแล้ว!" : "คัดลอกส่วนนี้"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Form fields */}
              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">• หัวข้อพิทชิ่งโครงการ</label>
                    <input
                      type="text"
                      value={presentationPrep.title}
                      onChange={(e) => setPresentationPrep({ ...presentationPrep, title: e.target.value })}
                      placeholder="เช่น ขจัดควันเมืองน่าน..."
                      className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-2.5 outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">• ผู้ฟังเป้าหมาย (Audience)</label>
                    <input
                      type="text"
                      value={presentationPrep.audience}
                      onChange={(e) => setPresentationPrep({ ...presentationPrep, audience: e.target.value })}
                      placeholder="เช่น คณะกรรมการเขต..."
                      className="w-full text-xs bg-stone-50/50 border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-2.5 outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">• วัตถุประสงค์ในการเข้าสปีช</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'inform', icon: '📢', label: 'แจ้งเข้าใจง่าย' },
                      { key: 'persuade', icon: '🧠', label: 'ฟังสบายคล้อยตาม' },
                      { key: 'action', icon: '🔥', label: 'ลงมือร่วมกระทำ' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setPresentationPrep({ ...presentationPrep, objective: item.key });
                          playChimeSound('pop');
                        }}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                          presentationPrep.objective === item.key 
                            ? 'bg-[#1b6b50] text-white border-[#1b6b50]'
                            : 'bg-stone-50/50 text-gray-600 border-gray-200 hover:border-[#1b6b50]/40'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/15 p-2 rounded-xl border border-amber-200/20 space-y-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#8c6239] mb-0.5">🍞 ขนมปังแผ่นบน (Hook ดึงความสนใจ/บิดเบือนประเด็น):</label>
                    <textarea
                      value={presentationPrep.hook}
                      onChange={(e) => setPresentationPrep({ ...presentationPrep, hook: e.target.value })}
                      placeholder="เช่น ท่านเชื่อมโยงชีวิตของครึ่งเมืองกับยอดฝبار..."
                      className="w-full text-xs bg-white border border-stone-200 focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] rounded-lg p-2 h-11 outline-none resize-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-emerald-800 mb-0.5">🥩 ไส้สารอาหารแซนด์เวช (3 สาระประจักษ์):</label>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={presentationPrep.body1}
                        onChange={(e) => setPresentationPrep({ ...presentationPrep, body1: e.target.value })}
                        placeholder="1. กระทุ้งปัญหาวิกฤตสุขภาพ..."
                        className="w-full text-xs bg-white border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 outline-none font-sans"
                      />
                      <input
                        type="text"
                        value={presentationPrep.body2}
                        onChange={(e) => setPresentationPrep({ ...presentationPrep, body2: e.target.value })}
                        placeholder="2. โครงการคลายปมแก้ไขจุดอ่อน..."
                        className="w-full text-xs bg-white border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 outline-none font-sans"
                      />
                      <input
                        type="text"
                        value={presentationPrep.body3}
                        onChange={(e) => setPresentationPrep({ ...presentationPrep, body3: e.target.value })}
                        placeholder="3. ตัววัดผลลัพธ์พูนสุขนิจ..."
                        className="w-full text-xs bg-white border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 outline-none font-sans"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#e07a5f] mb-0.5">🍞 ขนมปังแผ่นล่าง (Call to Action ร้องขอใจกระตุกความจริง):</label>
                    <input
                      type="text"
                      value={presentationPrep.cta}
                      onChange={(e) => setPresentationPrep({ ...presentationPrep, cta: e.target.value })}
                      placeholder="เช่น ขอล้านนาเปิดใจตบอนุมัติโครงการ..."
                      className="w-full text-xs bg-white border border-stone-200 focus:border-[#e07a5f] focus:ring-1 focus:ring-[#e07a5f] rounded-lg p-2 outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Physical check box and real-time visualization */}
              <div className="space-y-3 font-sans">
                <div className="bg-[#fcfaee]/30 border border-amber-200/40 p-3 rounded-2xl relative overflow-hidden">
                  <span className="text-[10px] font-extrabold text-[#8c6239] tracking-wider uppercase block border-b border-[#8c6239]/10 pb-1 mb-2">
                    🥪 ตัวกรองการเรียงลำดับแซนด์วิชสเปคคุณ:
                  </span>
                  <div className="space-y-1.5 text-[10.5px] leading-relaxed">
                    <p className="truncate"><strong className="text-[#8c6239]">Hook บน:</strong> <span className="text-gray-600 italic">"{presentationPrep.hook || '-'}"</span></p>
                    <p className="truncate"><strong className="text-emerald-800">ไส้กลาง 1:</strong> <span className="text-gray-600">"{presentationPrep.body1 || '-'}"</span></p>
                    <p className="truncate"><strong className="text-emerald-800">ไส้กลาง 2:</strong> <span className="text-gray-600">"{presentationPrep.body2 || '-'}"</span></p>
                    <p className="truncate"><strong className="text-emerald-800">ไส้กลาง 3:</strong> <span className="text-gray-600">"{presentationPrep.body3 || '-'}"</span></p>
                    <p className="truncate"><strong className="text-[#e07a5f]">CTA ล่าง:</strong> <span className="text-gray-600 italic">"{presentationPrep.cta || '-'}"</span></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-700 block uppercase tracking-wider">• เช็คลิสต์ระลึกความมั่นคงในใจ (ชวนสังเกตสั่นสะท้าน)</span>
                  
                  {[
                    { key: 'checkedBreathing', label: '🧘‍♂️ Box Breathing (สูด 4 - กลั้น 4 - ระบาย 4 - นิ่ง 4)', color: 'border-blue-200 bg-blue-50/10' },
                    { key: 'checkedPosture', label: '🧍‍♂️ สันหลังยืดตรง ผ่อนคลายไหล่ ปอยร่างโปร่งยืนตรงสง่า', color: 'border-emerald-200 bg-emerald-50/10' },
                    { key: 'checkedEyeContact', label: '👀 สบตาพิกัดตรงที่เลนส์กล้อง Zoom มุ่งมั่นส่งดวงใจ', color: 'border-amber-200 bg-amber-50/10' },
                    { key: 'checkedConfidence', label: '💚 นึกถึงคำพยานครูเด่น "ปลอดภัย-ก้าวหน้าและกูลเกื้อ"', color: 'border-rose-200 bg-rose-50/10' }
                  ].map((chk) => {
                    const isChecked = !!(presentationPrep as any)[chk.key];
                    return (
                      <div
                        key={chk.key}
                        onClick={() => {
                          setPresentationPrep({ ...presentationPrep, [chk.key]: !isChecked });
                          playChimeSound(isChecked ? 'pop' : 'success');
                        }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked 
                            ? 'bg-emerald-50/40 border-emerald-300 text-emerald-950' 
                            : 'bg-stone-50/40 border-stone-200 hover:bg-stone-50 text-gray-600'
                        }`}
                      >
                        <span className="text-[11px] font-bold">{chk.label}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#1b6b55] border-[#1b6b55] text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Section 3 Card Editor */}
          <div className="bg-white border border-sand/20 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-extrabold text-md text-[#1b6b50] flex items-center gap-2">
                <span className="bg-[#1b6b50]/10 text-[#1b6b50] w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center">3</span>
                🚀 ส่วนที่ 3: แผนตกผลึก Start-Stop-Continue
              </h3>
              <span className="text-[11px] text-zinc-400 font-semibold uppercase">บันทึกปณิธาน</span>
            </div>

            <div className="space-y-4 font-sans">
              <div className="bg-[#fbf7f0]/60 p-3 rounded-2xl border border-sand/15 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-bold text-gray-550 mb-1">พิมพ์คำมั่นสัญญาของท่าน</label>
                  <input
                    type="text"
                    value={inputTextReflection}
                    id="sheet-reflection-add-input"
                    onChange={(e) => setInputTextReflection(e.target.value)}
                    placeholder="เช่น จะใช้ทักษะเปิดด้วยดึงดูดใจ 15 วิแรก"
                    className="w-full text-xs bg-white border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 outline-none text-gray-800 transition-all font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReflection();
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-gray-550 mb-1">หมวดหมู่</label>
                  <select
                    value={categoryReflection}
                    id="sheet-reflection-add-category"
                    onChange={(e) => setCategoryReflection(e.target.value as any)}
                    className="w-full text-xs bg-white border border-stone-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 outline-none text-gray-800 transition-all cursor-pointer font-sans"
                  >
                    <option value="start">🟢 START</option>
                    <option value="stop">🔴 STOP</option>
                    <option value="continue">🔵 CONTINUE</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleAddReflection}
                    id="sheet-btn-add-reflection"
                    className="w-full bg-[#1b6b50] hover:bg-[#15533e] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่ม
                  </button>
                </div>
              </div>

              {/* Display Reflection Items in table or small cards for easy remove */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reflectionCards.map((c) => (
                  <div key={c.id} className="flex justify-between items-center gap-2 p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        c.category === 'start' ? 'bg-emerald-100 text-emerald-800' :
                        c.category === 'stop' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {c.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-800 font-medium font-sans leading-relaxed">{c.text}</span>
                    </div>
                    <button
                      type="button"
                      id={`sheet-reflection-remove-${c.id}`}
                      onClick={() => { onDeleteReflectionCard(c.id); playChimeSound('pop'); }}
                      className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Beautiful Live Paper Template Sheet rendering */}
        <div className="space-y-6">
          
          {/* Live Render container styled as premium paper document */}
          <div className="bg-[#fcfbf9] border border-[#1b6b50]/20 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col justify-between" style={{ minHeight: '620px' }}>
            {/* Top paper corner ribbon */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sand/30 to-transparent pointer-events-none"></div>
            
            {/* Live Paper Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-sand/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://res.cloudinary.com/dmo4kq7ej/image/upload/v1780335603/ChatGPT_Image_1_%E0%B8%A1%E0%B8%B4.%E0%B8%A2._2569_15_12_58_cvzm9y.png"
                    alt="สถาบันแคปวิชั่น"
                    className="h-9 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="w-[1px] h-6 bg-stone-200" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c6239]">คู่มือพิจารณาส่วนบุคคล</span>
                </div>

                <button
                  type="button"
                  id="book-btn-copy-all"
                  onClick={handleCopyWholeDocument}
                  className="bg-[#1b6b50] hover:bg-[#15533e] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedMarkdown ? (
                    <>
                      <Check className="w-3 h-3 text-sand" /> คัดลอกแล้ว!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> คัดลอกมาร์กดาวน์ทั้งหมด
                    </>
                  )}
                </button>
              </div>

              {/* Printable-like document workspace design exactly matching user structure requirements */}
              <div className="space-y-6 prose prose-stone max-w-none text-gray-800">
                <div className="text-center pb-2">
                  <h3 className="font-display font-black text-lg md:text-xl text-[#1b6b50] tracking-tight leading-relaxed select-all">
                    เวิร์กชอปคู่มือตกผลึก: ทักษะการสื่อสารและการนำเสนอสำหรับผู้นำ
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-[#1b6b50] via-[#f2cc8f] to-[#e07a5f] rounded-full mx-auto mt-1.5"></div>
                </div>

                {/* ส่วนที่ 1 */}
                <div className="bg-white/75 border border-stone-100 rounded-2xl p-4 shadow-2xs space-y-3 relative group">
                  <button
                    type="button"
                    onClick={handleCopySection1}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-md transition-all cursor-pointer"
                    title="คัดลอกส่วนที่ 1"
                  >
                    {copiedSection === 1 ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  </button>

                  <h4 className="font-display font-extrabold text-[#1b6b50] text-sm flex items-center gap-1.5 shrink-0 border-b border-stone-50 pb-1.5">
                    <span>💥 ส่วนที่ 1: เฟรมเวิร์คแนะนำตัว 60 วินาที ของผู้นำ</span>
                  </h4>
                  <ul className="list-none pl-0 space-y-1.5 text-xs text-gray-750 font-sans">
                    <li>
                      <strong>• คำทักทายเด่นสะกดฟัง (Hook):</strong>{' '}
                      <span className={selfIntro.hook ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {selfIntro.hook || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• พันธกิจภาพลักษณ์ (Mission):</strong>{' '}
                      <span className={selfIntro.mission ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {selfIntro.mission || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• คุณค่าช่วยเหลือประชาชน (Value):</strong>{' '}
                      <span className={selfIntro.value ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {selfIntro.value || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• คำซักชวนเครือข่ายความร่วมมือ (Action Goal):</strong>{' '}
                      <span className={selfIntro.goal ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {selfIntro.goal || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                  </ul>
                  
                  {/* Generated composite speech section 1 */}
                  <div className="bg-[#1b6b50]/5 border-l-2 border-[#1b6b50]/40 p-3 rounded-r-xl mt-3 text-xs leading-relaxed italic text-stone-700">
                    <span className="text-[10px] block font-extrabold text-[#1b6b50] tracking-wider uppercase mb-1 not-italic">คำสุนทรพจน์ประสานรวม:</span>
                    “สวัสดีครับ/ค่ะทุกท่าน <strong className="font-sans text-gray-900 not-italic">{selfIntro.hook || '...'}</strong> ผม/ดิฉัน <strong className="font-sans text-gray-900 not-italic">{selfIntro.mission || '...'}</strong> ซึ่งความคุ้มครอบคุณค่าที่ผมช่วยหนุนช่วยเหลือประชาชนคือ <strong className="font-sans text-gray-900 not-italic">{selfIntro.value || '...'}</strong> และผมหวังประสานที่จะได้รับความร่วมมือด้าน <strong className="font-sans text-gray-900 not-italic">{selfIntro.goal || '...'}</strong> ครับ/ค่ะ”
                  </div>
                </div>

                {/* ส่วนที่ 2 */}
                <div className="bg-white/75 border border-stone-100 rounded-2xl p-4 shadow-2xs space-y-3 relative group">
                  <button
                    type="button"
                    onClick={handleCopySection2}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-md transition-all cursor-pointer"
                    title="คัดลอกส่วนที่ 2"
                  >
                    {copiedSection === 2 ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  </button>

                  <h4 className="font-display font-extrabold text-[#1b6b50] text-sm flex items-center gap-1.5 border-b border-stone-50 pb-1.5">
                    <span>📢 ส่วนที่ 2: โครงร่างประดิษฐ์สปีช Pitching ใน 3 นาที</span>
                  </h4>
                  <ul className="list-none pl-0 space-y-1.5 text-xs text-gray-750 font-sans">
                    <li>
                      <strong>• ชื่อโครงการหมุดหมายปัง (Project Title):</strong>{' '}
                      <span className={projectProposal.title ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {projectProposal.title || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• วิกฤตความจำเป็นสูงสุด (Urgent Pain):</strong>{' '}
                      <span className={projectProposal.challenge ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {projectProposal.challenge || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• นวัตกรรมระบบปราบชำนาญ (Proposed Solution):</strong>{' '}
                      <span className={projectProposal.solution ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {projectProposal.solution || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• สถิติปริมาณความคุ้มค่า (Outcome):</strong>{' '}
                      <span className={projectProposal.outcome ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {projectProposal.outcome || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                    <li>
                      <strong>• คำของบหรือเซ็นร่วมงานด่วน (Call to Action):</strong>{' '}
                      <span className={projectProposal.cta ? 'text-stone-900 font-semibold font-sans' : 'text-rose-500 italic font-medium'}>
                        {projectProposal.cta || 'ยังไม่ได้ระบุข้อมูล'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* ส่วนที่ 3 */}
                <div className="bg-white/75 border border-stone-100 rounded-2xl p-4 shadow-2xs space-y-3">
                  <h4 className="font-display font-extrabold text-[#1b6b50] text-sm flex items-center gap-1.5 border-b border-stone-50 pb-1.5">
                    <span>🚀 ส่วนที่ 3: แผนตกผลึก Start-Stop-Continue บันดาลสรุป</span>
                  </h4>
                  
                  <div className="space-y-3.5">
                    <div>
                      <strong className="text-xs text-emerald-800 block">🟢 START (จะเริ่มต้นทำ):</strong>
                      <ul className="list-disc pl-5 mt-1 text-xs text-gray-700 spacing-y-1 font-sans">
                        {reflectionCards.filter(c => c.category === 'start').length > 0 ? (
                          reflectionCards.filter(c => c.category === 'start').map((c) => (
                            <li key={c.id} className="font-sans leading-relaxed text-stone-800">{c.text}</li>
                          ))
                        ) : (
                          <li className="text-stone-400 italic font-sans font-normal list-none pl-0">ไม่มีข้อมูล</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-xs text-rose-800 block">🔴 STOP (จะตัดใจงดเว้น):</strong>
                      <ul className="list-disc pl-5 mt-1 text-xs text-gray-700 spacing-y-1 font-sans">
                        {reflectionCards.filter(c => c.category === 'stop').length > 0 ? (
                          reflectionCards.filter(c => c.category === 'stop').map((c) => (
                            <li key={c.id} className="font-sans leading-relaxed text-stone-800">{c.text}</li>
                          ))
                        ) : (
                          <li className="text-stone-400 italic font-sans font-normal list-none pl-0">ไม่มีข้อมูล</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-xs text-indigo-800 block">🔵 CONTINUE (จะสืบสานต่อ):</strong>
                      <ul className="list-disc pl-5 mt-1 text-xs text-gray-700 spacing-y-1 font-sans">
                        {reflectionCards.filter(c => c.category === 'continue').length > 0 ? (
                          reflectionCards.filter(c => c.category === 'continue').map((c) => (
                            <li key={c.id} className="font-sans leading-relaxed text-stone-800">{c.text}</li>
                          ))
                        ) : (
                          <li className="text-stone-400 italic font-sans font-normal list-none pl-0">ไม่มีข้อมูล</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Document footer & copyright */}
              <div className="pt-6 border-t border-sand/30 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 gap-2">
                <span>จัดทำโดยผู้เรียนหลักสูตรร่วมใจพัฒนาศักยภาพผู้บริหารสาธารณสุขล้านนา</span>
                <span className="font-semibold text-stone-500">สถาบันแคปวิชั่นพาร์ทเนอร์</span>
              </div>
            </div>

            {/* Downloader CTA bar */}
            <div className="mt-8 pt-4 border-t border-sand/20 flex items-center justify-between gap-4 font-sans">
              <p className="text-[10px] text-stone-450 max-w-sm">
                * ข้อมูลทั้งหมดจะถูกเซฟเก็บไว้โดยอัตโนมัติในหน่วยความจำเครื่องบราวเซอร์ของท่าน (LocalStorage)
              </p>
              
              <button
                type="button"
                id="book-btn-export-final"
                onClick={handleExportWorkbook}
                className="bg-secondary-terracotta hover:bg-secondary-terracotta/90 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:translate-y-[-1px]"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดเอกสารคู่มือ (.MD)</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
