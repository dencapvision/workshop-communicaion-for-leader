/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Play, Pause, RotateCw, Sparkles, BookOpen, 
  Compass, AlertTriangle, MessageSquare, Volume2, 
  HelpCircle, CheckCircle2, ChevronRight, UserCheck, 
  Download, Share2, Clipboard, Globe, RefreshCcw
} from 'lucide-react';
import { SlideData, SelfIntroState, ProjectProposalState, ReflectionCard } from '../types';
import { 
  SelfIntroWidget, ProjectProposalWidget, ActionPlannerWidget, playChimeSound 
} from './WorkbookWidgets';

interface SlideRendererProps {
  slide: SlideData;
  selfIntroState: SelfIntroState;
  setSelfIntroState: (state: SelfIntroState) => void;
  projectProposalState: ProjectProposalState;
  setProjectProposalState: (state: ProjectProposalState) => void;
  reflectionCards: ReflectionCard[];
  onAddReflectionCard: (card: Omit<ReflectionCard, 'id'>) => void;
  onDeleteReflectionCard: (id: string) => void;
  onSetSlide: (id: number) => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  selfIntroState,
  setSelfIntroState,
  projectProposalState,
  setProjectProposalState,
  reflectionCards,
  onAddReflectionCard,
  onDeleteReflectionCard,
  onSetSlide
}) => {
  // Timer State for Slide 9 (60 seconds) & Slide 23 (3 / 5 mins) & Slide 14 (10 mins)
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timerMax, setTimerMax] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Practice state
  const [revealedPointsCount, setRevealedPointsCount] = useState<number>(1);
  const [vocalPacing, setVocalPacing] = useState<'normal' | 'fast' | 'great'>('normal');

  // Slide 9 Feedback roulette state
  const [feedbackRoulette, setFeedbackRoulette] = useState<string>('คลิกสุ่มเพื่อรับคีย์สุนทรพจน์เชิงบวกจากวิทยาการ');
  const [rouletteSpinning, setRouletteSpinning] = useState<boolean>(false);

  // Slide 12 scenario picker
  const [selectedScenario12, setSelectedScenario12] = useState<number>(0);

  // Slide 14 Northern Zone Cases picker
  const [selectedCase14, setSelectedCase14] = useState<number>(0);

  // Slide 15 live note taker
  const [customRef15, setCustomRef15] = useState<string>('');
  const [refs15List, setRefs15List] = useState<string[]>([
    "3ส (สง่า, สบตา, เสียงแจ้งใจ) คือหมุดหมายปั้นภาพลักษณ์",
    "เราต้องสบตายอดเลนส์กล้อง Zoom ไม่ใช่ก้มมองแผ่นชาร์ต",
    "Box breathing คือยาขจัดปัดเป่ากระวนวายใจชั้นดี"
  ]);

  // Handle countdown timers
  useEffect(() => {
    // Reset timer when traveling to a slide
    if (slide.id === 9) {
      setTimeLeft(60);
      setTimerMax(60);
    } else if (slide.id === 14) {
      setTimeLeft(600);
      setTimerMax(600);
    } else if (slide.id === 23) {
      setTimeLeft(180);
      setTimerMax(180);
    }
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Reset revealed bullet count
    setRevealedPointsCount(1);
  }, [slide.id]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playChimeSound('buzzer');
            return 0;
          }
          if (prev % 15 === 0 && prev > 0) {
            playChimeSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    playChimeSound('pop');
  };

  const resetTimer = (sec: number = timerMax) => {
    setIsTimerRunning(false);
    setTimeLeft(sec);
    setTimerMax(sec);
    playChimeSound('pop');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Feedback Roulette simulator for Slide 9
  const triggerFeedbackRoulette = () => {
    const tips = [
      "🔥 'ลดสปีดลงนิด' และเน้นอักขระพยางค์หลังให้กังวานอิ่มเอิบ",
      "🌿 'หัวใจคือรอยยิ้ม' ยิ้มใน 10 วินาทีแรกเพื่อแผ่เสน่ห์และ Empathy",
      "👁️ 'จับจ้องยอดเลนส์คาดสายตา' เสมือนกำลังสบตาผู้ตรวจเขตตรวจสุข",
      "🎙️ 'เปิดเสียงด้วยน้ำเสียงลึก' (เสียงสองระดับทุ้ม) ดึงความตระหนักรู้หนักแน่น",
      "⚡ 'หยุดจังหวะเงียบเล้าใจ' (Pause 2 วิ) หลังพูด Hook เด็ดเพื่อสลักใจผู้ฟัง",
      "👐 'รักษาสรีระให้สง่าผึ่งผาย' เปิดปลายมือข้างลำตัวเพื่อสระล้างกังวล",
      "💎 'ขยี้คีย์เวิร์ดผลประโยชน์ประชาชน' ให้เสียงก้องและแผ่วช้าเน้นความคุ้ม"
    ];

    setRouletteSpinning(true);
    playChimeSound('tick');
    let counter = 0;
    const interval = setInterval(() => {
      setFeedbackRoulette(tips[Math.floor(Math.random() * tips.length)]);
      counter++;
      if (counter > 6) {
        clearInterval(interval);
        setFeedbackRoulette(tips[Math.floor(Math.random() * tips.length)]);
        setRouletteSpinning(false);
        playChimeSound('success');
      }
    }, 120);
  };

  // Slide 12 scenario switcher
  const scenarios12 = [
    {
      caseTitle: "เจ้าหน้าที่ส่งเอกสารรายงานสรุปงบประมาณล่าช้ากว่ากำหนด 2 สัปดาห์",
      ban: "⚠️ 'ทำไมงานสรุปงบล่าช้าขนาดนี้? ทำงานไม่รับผิดชอบเลยรึไง ด่วนที่สุดพรุ่งนี้บ่ายต้องได้เห็น!'",
      guide: "🌟 'จากอุปสรรคตรงจุดหนุนงบประมาณ คุณประเมินว่ามีข้อนโยบายตรงไหนของอำเภอที่ดึงทำให้ระบบข้อมูลติดขัดบ้าง? และอยากให้เขตเข้าไปช่วยปลดล็อกในจุดไหนเป็นพิเศษไหม?'"
    },
    {
      caseTitle: "ทีมผู้ปฏิบัติงานในพื้นที่ยังกริ่งเกรง ไม่ยินดีเปิดกล้องให้ความร่วมมือหารือผ่าน Zoom",
      ban: "⚠️ 'เปิดกล้องประชุมด้วยค่ะทุกคน นี่เป็นระเบียบราชการที่ต้องปฏิบัติ เคร่งครัดหน่อย!'",
      guide: "🌟 'วันนี้มีวาระข้อเรียนรู้ความร่วมมือลับสุดสำคัญที่อยากสบใจปรึกษา เพื่อเป็นการให้เกียรติไอเดียอันสร้างสรรค์ของทีมงาน ผมเชิญชวนทุกคนแง้มเปิดกล้องทักทายกันหน่อยดีไหมครับ?'"
    },
    {
      caseTitle: "รพ.สต. ในความกุมขอบเขตปฏิเสธการใช้วิธีจัดเก็บสถิติผู้ป่วยบนคลาวด์ตัวใหม่",
      ban: "⚠️ 'นี่กติกาเขตตรวจ ชี้ขาดต้องใช้ตัวนี้ตั้งเป้าความมั่นคง เลิกใช้ระบบมือเขียนได้แล้ว!'",
      guide: "🌟 'ผมทราบว่าทุกคนทำงานหนักและพึ่งพาระบบกระดาษมานาน ผมอยากสอบถามว่าขั้นตอนใช้อันใหม่ตรงไหนที่สร้างภาระจิตใจมากที่สุด? และเราจะสร้างพี่เลี้ยงช่วยประคองสเต็ปรับมือไปด้วยกันอย่างไรดีคะ?'"
    }
  ];

  // Slide 14 discussion case deck
  const cases14 = [
    {
      region: "ชาวบ้านชาติพันธุ์อมก๋อยไม่ยอมรับบริการรับวัคซีนหลักกลุ่มใหม่",
      pain: "ปัญหาความแตกต่างทางวัฒนธรรมและภาษา อัตราตื่นตระหนกสูงเนื่องจากพึ่งพาแพทย์หมอป่าแบบเดิม",
      task: "เป้าหมาย: โน้มน้าวดวงทีมงาน อสม. และผู้มีบารมีในชนเผ่าให้เปิดใจรับมาตรฐาน",
      ethos: "ศรัทธาวิชาชีพร่วมมือผู้ตรวจ, Pathos: ฟังเรื่องเล่าพืชป่าของพวกเขาด้วยใจ Empathy, Logos: ใช้สเปคตัวเลขรักษางามเปรียบเทียบหมู่บ้านข้างเคียง"
    },
    {
      region: "คลื่นกระแสฝุ่นละออง PM 2.5 เกินพิกัด ตลบขมุกขมัวทั่วด่านสันทราย",
      pain: "ประชาชนความหวังพังทลาย กล่าวหาการนิ่งกังวลกุมนโยบายของส่วนกลาง เสมือนผู้นำไม่ร่วมทุกข์",
      task: "เป้าหมาย: แถลงการณ์ต่อหน้าสื่อมวลชนท้องถิ่น คืนความคลายใจสง่างาม",
      ethos: "ไม่กล่าวแก้ปัดเป้ยอมรับกระแสประสานงาน, Pathos: นึกเห็นปอดและอารมณ์เด็กประถมล้านนา, Logos: ขีดเส้นนวัตกรรมเครื่องฟอกอากาศกี่ตัวประจักษ์เสร็จทัน 48 ชม."
    },
    {
      region: "งบส่งเสริมตรวจสุขภาพล่าช้า 3 เดือน ทีม รพ.สต. ท้อแท้เริ่มจับกลุ่มประธานด่าทอ",
      pain: "แรงขับเคลื่อนทำงานเฉื่อยชา ขาดความเคารพทิศทาง และขัดค่านิยมเป้าช่วยเหลือผู้ป่วยปฐมภูมิ",
      task: "เป้าหมาย: เรียกประชุม Zoom ด่วนผู้ปฏิบัติ พลิกฟื้นจิตอาสาถักทอสุข",
      ethos: "แสดงตนเป็นพวกเดียวลุยเคียงบ่า, Pathos: พูดคุยแลกไอเดีย ปลดปล่อยระบายล้อมสำคัญ, Logos: จัดสรรงบสำรองกู้ระบบระยะสั้น และสลักวันชี้อนุมัติชัดเจน"
    }
  ];

  // Helper to append note for Slide 15
  const handleAddNote15 = () => {
    if (!customRef15.trim()) return;
    setRefs15List([...refs15List, customRef15.trim()]);
    setCustomRef15('');
    playChimeSound('pop');
  };

  const handleRemoveNote15 = (idx: number) => {
    setRefs15List(refs15List.filter((_, i) => i !== idx));
    playChimeSound('pop');
  };

  // Generate individual slide content layouts
  const renderLayoutContent = () => {
    switch (slide.layout) {
      case 'cover':
        return (
          <div id="slide-layout-cover" className="flex flex-col items-center justify-center text-center h-full max-w-4xl mx-auto px-4 py-8 relative">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-[#1b6b50]/10 text-[#1b6b50] rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#e07a5f]" />
              <span>THE PROFESSIONAL AUTHORITY PRESENTATION</span>
            </div>

            <div className="w-18 h-1 bg-gradient-to-r from-[#1b6b50] via-[#f2cc8f] to-[#e07a5f] rounded-full mb-8"></div>
            
            <h1 id="cover-main-title" className="text-3xl md:text-[44px] lg:text-[48px] font-display font-bold leading-tight text-[#1b6b50] tracking-tight text-balance">
              {slide.title}
            </h1>
            
            {slide.subtitle && (
              <p id="cover-sub-title" className="text-sm md:text-md text-gray-500 font-sans mt-5 max-w-2xl border-t border-gray-100 pt-4 leading-relaxed">
                {slide.subtitle}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-12 bg-white/50 backdrop-blur-xs border border-gray-100 rounded-2xl p-5 shadow-xs font-sans">
              <div className="flex flex-col items-center p-3 text-center">
                <span className="text-[#333] text-sm font-semibold">💼 ครูเด่น มาสเตอร์ฟา</span>
                <span className="text-[11px] text-gray-400 mt-0.5">อนุสรณ์ หนองนา (ผู้อำนวยการสถาบัน)</span>
              </div>
              <div className="flex flex-col items-center p-3 text-center border-t md:border-t-0 md:border-x border-gray-100">
                <span className="text-[#333] text-sm font-semibold">📍 ผู้บริหารสาธารณสุขล้านนา</span>
                <span className="text-[11px] text-gray-400 mt-0.5">เขตสุขภาพภาคเหนือตอนล่างและยง</span>
              </div>
              <div className="flex flex-col items-center p-3 text-center border-t md:border-t-0">
                <span className="text-[#333] text-sm font-semibold">⏱️ มินิมอลอบอุ่น (6 ชม.)</span>
                <span className="text-[11px] text-gray-400 mt-0.5">ผ่าน Zoom Virtual Workshop</span>
              </div>
            </div>

            {slide.id === 26 && (
              <div className="mt-8 flex flex-col md:flex-row items-center gap-4 bg-lime-50/50 p-4 rounded-xl border border-lime-100/30">
                <div className="p-2.5 bg-[#1b6b50]/5 rounded-lg border border-primary-green/10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-stone-300 rounded flex items-center justify-center font-mono text-[9px] text-gray-500 text-center">
                    QR CODE<br/>@denmasterfa
                  </div>
                  <span className="text-[9px] text-[#1b6b50] font-sans font-bold mt-1">แสกนเพื่อนครูเด่น</span>
                </div>
                <div className="text-left font-sans space-y-1">
                  <p className="text-xs text-gray-600">📱 <strong>TikTok/Line/IG:</strong> @denmasterfa</p>
                  <p className="text-xs text-gray-600">🌐 <strong>เว็บทางการ:</strong> capvisionpartner.com</p>
                  <p className="text-xs text-[#1b6b50] font-semibold">🤝 ขอบคุณทุกท่านที่สะสางเวลามาแชร์ศักดิ์ศรีก้าวใหม่เพื่อสุขอนามัยพี่น้อง!</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div id="slide-layout-divider" className="bg-[#1b6b50] text-[#fbf7f0] rounded-2xl h-full flex flex-col items-center justify-center text-center p-8 md:p-12 relative overflow-hidden">
            {/* Visual background layers */}
            <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl"></div>
            <div className="absolute left-[-20px] top-[-20px] w-48 h-48 bg-[#f2cc8f]/5 rounded-full blur-2xl"></div>

            <div className="text-[#f2cc8f] text-[64px] md:text-[96px] font-display font-light leading-none tracking-tighter opacity-80 mb-2">
              {slide.hugeText}
            </div>
            
            <h2 id="divider-slide-title" className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight max-w-3xl text-balance">
              {slide.title}
            </h2>
            
            {slide.subtitle && (
              <p id="divider-slide-sub" className="text-sm md:text-md text-[#fbf7f0]/80 font-sans mt-6 max-w-xl border-t border-white/10 pt-4 leading-relaxed">
                {slide.subtitle}
              </p>
            )}

            <div className="mt-8 flex gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f2cc8f]"></span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#e07a5f]"></span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#fbf7f0]"></span>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div id="slide-layout-schedule" className="h-full flex flex-col py-3 px-2 md:px-5">
            <div className="mb-4">
              <span className="text-xs font-bold text-emerald-800 tracking-wider bg-emerald-50 px-2.5 py-1 rounded">AGENDA & TRACKER</span>
              <h2 className="text-2xl font-display font-bold mt-1 text-[#1b6b50] tracking-tight">{slide.title}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-sans">
              <div className="lg:col-span-2 space-y-3">
                {slide.points?.map((point, index) => {
                  const [time, desc] = point.split(' | ');
                  const activityNum = index === 0 ? 5 : index === 1 ? 9 : index === 3 ? 16 : 25;
                  return (
                    <div 
                      key={index} 
                      onClick={() => { playChimeSound('pop'); onSetSlide(activityNum); }}
                      id={`schedule-item-${index}`}
                      className="bg-white border hover:border-[#1b6b50]/40 rounded-xl p-3 md:p-3.5 shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-sm bg-[#1b6b50]/10 text-[#1b6b50] py-1 px-2 md:px-2.5 rounded-lg whitespace-nowrap">
                          {time}
                        </span>
                        <span className="text-xs md:text-sm font-semibold text-[#1c2722]">{desc}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                        วาร์ปสไลด์ <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#fcfbf9] border border-stone-200/40 p-4 rounded-xl space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#e07a5f] tracking-widest block">💡 ครูเด่นชวนตั้งสังเกต:</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  หลักสูตร 6 ชั่วโมงนี้ออกแบบมาประดุจงานวิปัสสนาทางปัญญา การจับถ้อยคำพูดและฝึกท่าสัมนา Zoom จะมีกระจกเงาขัดเกลาทุกช่วงเวลา
                </p>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">ความเสถียรอบรม</span>
                    <span className="text-xs text-slate-800 font-bold">Zoom Virtual 100%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">ผู้บริหารภูมิภาค</span>
                    <span className="text-xs text-[#1b6b50] font-bold">17 จังหวัดสาธรนสุล</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'standard':
        return (
          <div id="slide-layout-standard" className="h-full flex flex-col py-3 px-2 md:px-5">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-50 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {slide.section} | หลักเกณฑ์ความก้าวหน้า
                </span>
                <h2 className="text-2xl font-display font-bold mt-1 text-[#1b6b50] tracking-tight text-balance">{slide.title}</h2>
              </div>
              {slide.subtitle && (
                <span className="text-xs text-gray-500 font-sans italic bg-wheat/30 px-2.5 py-1 rounded max-w-sm">
                  🎯 {slide.subtitle}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
              <div className="lg:col-span-8 space-y-4">
                {slide.points?.map((pt, ind) => {
                  const isRevealed = ind < revealedPointsCount;
                  return (
                    <div 
                      key={ind}
                      onClick={() => {
                        if (!isRevealed) {
                          setRevealedPointsCount(ind + 1);
                          playChimeSound('pop');
                        }
                      }}
                      id={`bullet-card-${ind}`}
                      className={`p-3 md:p-4 rounded-xl border transition-all ${
                        isRevealed 
                          ? 'bg-white border-stone-200/60 shadow-xs translate-x-0 opacity-100' 
                          : 'bg-stone-50 border-dashed border-gray-200 opacity-40 cursor-pointer hover:opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isRevealed ? 'bg-[#1b6b50] text-[#fbf7f0]' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {ind + 1}
                        </span>
                        <div>
                          <p className={`text-xs md:text-sm font-semibold text-[#1c2722] ${!isRevealed && 'select-none filter blur-xs'}`}>
                            {pt}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {revealedPointsCount < (slide.points?.length || 0) && (
                  <button 
                    type="button"
                    id="btn-reveal-point-next"
                    onClick={() => {
                      setRevealedPointsCount(revealedPointsCount + 1);
                      playChimeSound('pop');
                    }}
                    className="text-xs text-[#1b6b50] hover:text-[#185d46] font-bold bg-[#1b6b50]/5 px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    🔍 คลิกคลิกเพื่อคลี่คลายประเด็นถัดไป... ({revealedPointsCount}/{slide.points?.length})
                  </button>
                )}
              </div>

              {/* Focus assistance side block */}
              <div className="lg:col-span-4 bg-[#fcfbf9] border border-stone-200/40 p-4 rounded-xl">
                <span className="text-[10px] text-[#e07a5f] font-extrabold uppercase tracking-widest block mb-2">🔥 คีย์เดี่ยวคิดแบบครูเด่น:</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  เมื่อขึ้นพูดที่ประชุม Zoom คีย์ความขลังไม่ใช่สไลด์ลั่นอักษร แต่คือการจับสัมผัสเสียงกังวานและใบหน้ายืดหยุ่นที่เล่าความจริงและมีอารมณ์รวมใจ
                </p>
                <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
                  <span className="text-[10px] text-gray-400 block">เทคนิคสบตาดักสมาธิ</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">สบยอดเลนส์</span>
                    <span className="text-[9px] font-semibold bg-[#e07a5f]/5 text-[#e07a5f] px-2 py-0.5 rounded">ค้างแสายตา 3 วินาที</span>
                    <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">ยิ้มนำยามหยุดพูด</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div id="slide-layout-activity" className="h-full flex flex-col py-2 px-1 md:px-4">
            {/* Header activity block */}
            <div className="border-l-4 border-[#e07a5f] pl-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <div>
                <span className="inline-block bg-[#e07a5f] text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {slide.bannerText || "กิจกรรม / ฝึกปฏิบัติ"}
                </span>
                <h2 className="text-2xl font-display font-semibold text-[#1c2722] mt-1 tracking-tight">{slide.title}</h2>
              </div>
              <span className="text-xs text-gray-500 bg-[#f2cc8f]/10 px-2.5 py-1 rounded border border-[#f2cc8f]/20 font-sans">
                ⏱️ ซ้อมความเร็วและคุมกล้อง
              </span>
            </div>

            {/* Embed individual widgets or timer based on slide list */}
            {slide.id === 9 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans">
                {/* 60s Timer */}
                <div className="lg:col-span-4 bg-white border border-[#e07a5f]/20 rounded-xl p-5 text-center flex flex-col items-center justify-center shadow-xs">
                  <Clock className="w-8 h-8 text-[#e07a5f] mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">จับเวลาแนะนำตัวด่วน</span>
                  <div className="text-4xl md:text-5xl font-mono font-bold text-[#1c2722] my-2 transition-all">
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex gap-2 w-full mt-3">
                    <button
                      type="button"
                      id="btn-timer-toggle"
                      onClick={toggleTimer}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 text-white shadow-xs cursor-pointer ${
                        isTimerRunning ? 'bg-[#e07a5f] hover:bg-[#c9634a]' : 'bg-[#1b6b50] hover:bg-[#15533e]'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isTimerRunning ? 'หยุดค้าง' : 'เริ่มนับถอย'}
                    </button>
                    <button
                      type="button"
                      id="btn-timer-reset"
                      onClick={() => resetTimer(60)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all"
                      title="รีเซ็ตเป็น 60 วินาที"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-1.5 w-full mt-2">
                    <button onClick={() => resetTimer(30)} id="btn-quick-30" className="flex-1 py-1 bg-stone-50 border border-gray-100 rounded text-[10px] font-semibold text-gray-500 hover:border-gray-300">30 วิ</button>
                    <button onClick={() => resetTimer(60)} id="btn-quick-60" className="flex-1 py-1 bg-stone-50 border border-gray-100 rounded text-[10px] font-semibold text-gray-500 hover:border-gray-300">60 วิ</button>
                    <button onClick={() => resetTimer(90)} id="btn-quick-90" className="flex-1 py-1 bg-stone-50 border border-gray-100 rounded text-[10px] font-semibold text-gray-500 hover:border-gray-300">90 วิ</button>
                  </div>
                </div>

                {/* Instructions and Feedback roulette wheel */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-amber-50/50 border border-[#f2cc8f]/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-[#e07a5f] mb-1.5 uppercase tracking-wider">โจทย์ฝึกซ้อมพูด Zoom (60 วินาที)</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      เปิดกล้องสบตารุม และทดสอบการพูดสรุปแนะนำวิสัยทัศน์และการช่วยล้านนารักษาสุข คุมโทนอารมณ์แบบมีความอบอุ่นและทรานสปุก
                    </p>
                  </div>

                  <div className="bg-[#fcfbf9] border border-stone-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                      <span className="text-[10px] font-bold text-[#1b6b50] uppercase tracking-wider flex items-center gap-1">
                        📢 ระบบสุ่มคำฟีดแบ็ก (Feedback Roulette Wheel)
                      </span>
                      <button
                        type="button"
                        id="btn-roulette-trigger"
                        onClick={triggerFeedbackRoulette}
                        className={`text-xs bg-[#e07a5f] hover:bg-[#c9634a] text-white font-bold px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${rouletteSpinning && 'opacity-65'}`}
                      >
                         {rouletteSpinning ? 'หมุนๆๆ...' : '⚡ คลิกเพื่อฟีดแบ็ก'}
                      </button>
                    </div>
                    <div className="p-3.5 bg-white border border-stone-100 rounded-lg text-center shadow-inner min-h-14 flex items-center justify-center">
                      <p className={`text-xs md:text-sm font-semibold ${rouletteSpinning ? 'text-gray-400 animate-pulse' : 'text-[#e07a5f]'}`}>
                        {feedbackRoulette}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slide.id === 10 && (
              <SelfIntroWidget state={selfIntroState} onChange={setSelfIntroState} />
            )}

            {slide.id === 14 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans">
                {/* 10 mins Timer */}
                <div className="lg:col-span-4 bg-white border border-[#e07a5f]/20 rounded-xl p-4 text-center flex flex-col items-center">
                  <Clock className="w-8 h-8 text-[#e07a5f] mb-1" />
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">เวลาสัมมนากลุ่มย่อย</span>
                  <div className="text-3xl font-mono font-bold text-[#1c2722] my-1.5">
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      id="btn-timer-14-toggle"
                      onClick={toggleTimer}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-white cursor-pointer ${
                        isTimerRunning ? 'bg-[#e07a5f]' : 'bg-[#1b6b50]'
                      }`}
                    >
                      {isTimerRunning ? 'พักค้าง' : 'เริ่มจับ'}
                    </button>
                    <button
                      type="button"
                      id="btn-timer-14-reset"
                      onClick={() => resetTimer(600)}
                      className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <RotateCw className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Preset Case study cards buttons */}
                  <div className="w-full mt-4 border-t border-gray-100 pt-3">
                    <span className="text-[10px] text-gray-400 font-bold block mb-2">เลือกเคสล้านนาเพื่อถก:</span>
                    <div className="flex flex-col gap-1.5">
                      {cases14.map((cs, idx) => (
                        <button
                          key={idx}
                          id={`btn-case-select-14-${idx}`}
                          onClick={() => { setSelectedCase14(idx); playChimeSound('pop'); }}
                          className={`text-left p-2 rounded text-[11px] leading-snug border transition-all truncate cursor-pointer ${
                            selectedCase14 === idx 
                              ? 'bg-[#1b6b50] text-[#fbf7f0] border-transparent font-medium' 
                              : 'bg-stone-50 text-gray-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          📍 {cs.region}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Case File Showcase */}
                <div className="lg:col-span-8 bg-white border border-stone-200/50 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                      <span className="bg-amber-100 text-[#e07a5f] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        แฟ้มโจทย์บริหารสัญจร
                      </span>
                      <strong className="text-xs text-[#1c2722]">{cases14[selectedCase14].region}</strong>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">ปัญหาสั่นคลอนสุขภาพ:</span>
                        <p className="text-xs text-gray-700 leading-relaxed mt-0.5">{cases14[selectedCase14].pain}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#e07a5f] block uppercase font-bold">ภารกิจฝึกพิจารณ์:</span>
                        <p className="text-xs text-gray-700 leading-relaxed mt-0.5 font-semibold text-balance">{cases14[selectedCase14].task}</p>
                      </div>
                      <div className="p-3 bg-[#fcfbf9] border-l-2 border-[#1b6b50] rounded-r-lg">
                        <span className="text-[10px] text-[#1b6b50] block uppercase font-bold">เทคนิคประยุกต์ล้านนา (Ethos-Pathos-Logos):</span>
                        <p className="text-xs text-stone-600 italic mt-0.5">{cases14[selectedCase14].ethos}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-gray-400 mt-6 pt-3 border-t border-gray-50">
                    💡 เคล็ดลับห้อมล้อมห้อง Zoom: ให้ 1 คนอาษาตอบคำถามวิกฤต และให้เพื่อนอีก 1 คนคอยยกความสำคัญ
                  </p>
                </div>
              </div>
            )}

            {slide.id === 15 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans">
                {/* Note inputs */}
                <div className="lg:col-span-5 bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
                  <h4 className="text-xs font-bold text-[#1b6b50] uppercase tracking-wider mb-2.5">
                    เขียนบันทึกตกผลึกส่วนที่ 1
                  </h4>
                  
                  <div className="space-y-3">
                    <textarea
                      value={customRef15}
                      id="text-ref15-input"
                      onChange={(e) => setCustomRef15(e.target.value)}
                      placeholder="เช่น 'สิ่งประทับใจพืชป่าล้านนากับสายตาผู้นำ...'"
                      className="w-full text-xs bg-stone-50 border border-gray-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2.5 h-18 outline-none resize-none font-sans"
                    />

                    <button
                      type="button"
                      id="btn-ref15-save"
                      onClick={handleAddNote15}
                      className="w-full bg-[#1b6b50] hover:bg-[#15533e] text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      ➕ แปะสติ๊กเกอร์ตกผลึก
                    </button>
                    
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-gray-400 block w-full mb-1">สะกิดปณิธานสำคัญ:</span>
                      <button onClick={() => setCustomRef15("จะพูดแนะนำตนเองโดยนำเสนอ Value Offered เป็นดั่งแกน")} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-100 px-2 py-1 rounded hover:bg-amber-100 transition-colors">แนะตัวด้วยประโยชน์</button>
                      <button onClick={() => setCustomRef15("เปลี่ยนประโยคสั่งการเป็นตั้งถามเคารพสติปัญญาทีม")} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-1 rounded hover:bg-emerald-100 transition-colors">ถามเชิงโค้ชชิ่ง</button>
                    </div>
                  </div>
                </div>

                {/* Stitched sticker board */}
                <div className="lg:col-span-7 bg-[#fcfbf9] border border-stone-100 p-4 rounded-xl min-h-60 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#e07a5f] uppercase tracking-wider block mb-3">
                      📌 บันทึกบอร์ดร่วมสัมมนา คอร์สส่วนที่ 1:
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {refs15List.map((refText, idx) => (
                        <div key={idx} className="bg-white border border-[#1b6b50]/15 p-2 rounded-lg shadow-2xs relative group">
                          <p className="text-[11px] text-gray-700 leading-relaxed pr-6">{refText}</p>
                          <button
                            type="button"
                            id={`btn-remove-note-15-${idx}`}
                            onClick={() => handleRemoveNote15(idx)}
                            className="absolute right-1 text-gray-300 hover:text-rose-500 transition-colors top-1 p-1 animate-none"
                            title="ลบบันทึก"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-center text-gray-400 mt-4">
                    💡 ข้อมูลเหล่านี้จะไปแฮปปี้สะพอนปราณเชื่อมเข้าแผ่นรายงานของคุณในหน้าขอบคุณ
                  </p>
                </div>
              </div>
            )}

            {slide.id === 22 && (
              <ProjectProposalWidget state={projectProposalState} onChange={setProjectProposalState} />
            )}

            {slide.id === 23 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start font-sans">
                {/* 3 mins Timer */}
                <div className="lg:col-span-4 bg-white border border-[#e07a5f]/25 rounded-xl p-5 text-center flex flex-col items-center">
                  <Clock className="w-8 h-8 text-[#e07a5f] mb-1 animate-pulse" />
                  <span className="text-xs font-bold text-gray-400 block uppercase">ฝึกพิทชิ่งด่วน 3-5 นาที</span>
                  <div className="text-4xl md:text-5xl font-mono font-bold text-[#1c2722] my-2">
                    {formatTime(timeLeft)}
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      id="btn-timer-23-toggle"
                      onClick={toggleTimer}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-white cursor-pointer ${
                        isTimerRunning ? 'bg-[#e07a5f]' : 'bg-[#1b6b50]'
                      }`}
                    >
                      {isTimerRunning ? 'หยุด' : 'พิทช์สด'}
                    </button>
                    <button
                      type="button"
                      id="btn-timer-23-reset"
                      onClick={() => resetTimer(180)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <RotateCw className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex gap-1.5 w-full mt-2">
                    <button onClick={() => resetTimer(180)} id="btn-quick-3m" className="flex-1 py-1 bg-stone-50 border border-gray-100 rounded text-[10px] font-semibold text-gray-500">3 นาที</button>
                    <button onClick={() => resetTimer(300)} id="btn-quick-5m" className="flex-1 py-1 bg-stone-50 border border-gray-100 rounded text-[10px] font-semibold text-gray-500">5 นาที</button>
                  </div>
                </div>

                {/* Practical Pacing Board */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-[#fcfbf9] border border-stone-200 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-[#1b6b50] tracking-wider block uppercase mb-2">
                      💡 แผงพยุงความชินจริตความเร็ว (Pacing Visual Meter)
                    </span>
                    
                    <div className="grid grid-cols-3 gap-2.5 mb-3 text-center">
                      <button
                        onClick={() => { setVocalPacing('fast'); playChimeSound('pop'); }}
                        id="btn-pacing-fast"
                        className={`p-2 rounded-lg border text-xs cursor-pointer ${vocalPacing === 'fast' ? 'bg-red-50 text-red-800 border-red-300 font-semibold' : 'bg-white opacity-60'}`}
                      >
                        ⚠️ พูดเร็วเกินไป<br/><span className="text-[10px] font-normal font-sans">คลังคำล้นลืมแซนด์วิช</span>
                      </button>
                      <button
                        onClick={() => { setVocalPacing('normal'); playChimeSound('pop'); }}
                        id="btn-pacing-normal"
                        className={`p-2 rounded-lg border text-xs cursor-pointer ${vocalPacing === 'normal' ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold' : 'bg-white opacity-60'}`}
                      >
                        ⏱️ พูดช้าเนือย<br/><span className="text-[10px] font-normal font-sans">คนฟัง Zoom นั่งสัปหงก</span>
                      </button>
                      <button
                        onClick={() => { setVocalPacing('great'); playChimeSound('pop'); }}
                        id="btn-pacing-great"
                        className={`p-2 rounded-lg border text-xs cursor-pointer ${vocalPacing === 'great' ? 'bg-green-50 text-green-800 border-green-300 font-semibold' : 'bg-white opacity-60'}`}
                      >
                        🌟 ปรับกังวานจังหวะเด่น<br/><span className="text-[10px] font-normal font-sans">เว้นวรรค 2 วิ ดลสะกดใจ</span>
                      </button>
                    </div>

                    <div className="p-3 bg-stone-100 rounded-lg text-[11px] leading-relaxed text-gray-700">
                      <strong>แนะวิธีเวทีพิทช์อนุมัติงบ:</strong> มั่นสบตารุม และเริ่มต้นบีบหัวใจคนฟังด้วยประโยควิกฤต Pain point เช่น 'เราพาสามชั่วโมงประพรมมาเหลือยี่สิบห้านาทีได้ด้วยสิ่งเสนอ' ชี้ให้เห็นกราฟแท่งเท่ ๆ ตบท้ายขอสิทธิ์ความมั่นใจ
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General points render for instructions slide */}
            {slide.points && slide.id !== 9 && slide.id !== 10 && slide.id !== 14 && slide.id !== 15 && slide.id !== 22 && slide.id !== 23 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 font-sans">
                {slide.points.map((pt, ind) => (
                  <div key={ind} className="bg-white/60 hover:bg-white border rounded-xl p-3 flex gap-2.5 transition-all">
                    <span className="w-4 h-4 bg-[#e07a5f]/15 rounded-full flex items-center justify-center text-[9px] font-bold text-[#e07a5f] mt-0.5 shrink-0">
                      ✓
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed font-semibold">{pt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'closing':
        return (
          <div id="slide-layout-closing" className="h-full flex flex-col py-2 px-1 md:px-4">
            <div className="mb-4">
              <span className="inline-block bg-[#1b6b50] text-[#fbf7f0] text-[10px] font-sans font-bold px-2.5 py-1 rounded">
                APPLICATION & WRAP-UP
              </span>
              <h2 className="text-2xl font-display font-semibold mt-1 text-[#1b6b50] tracking-tight">{slide.title}</h2>
            </div>

            <ActionPlannerWidget 
              cards={reflectionCards} 
              onAddCard={onAddReflectionCard} 
              onDeleteCard={onDeleteReflectionCard} 
            />
          </div>
        );

      default:
        return (
          <div className="p-5 font-sans">
            <p className="text-sm">การจัดรูปแบบบกพร่องสไลด์</p>
          </div>
        );
    }
  };

  // Switch and render slide component container which can be full screended or zoom centered
  return (
    <div className="h-full flex flex-col justify-between font-sans">
      <div className="flex-1">
        {renderLayoutContent()}
      </div>

      {/* Extra Interactive scenarios for Slide 12 (Executive questioning) */}
      {slide.id === 12 && (
        <div id="slide-12-scenarios-panel" className="mt-5 border border-[#1b6b50]/15 bg-stone-50 rounded-xl p-4 font-sans">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
            <span className="text-[10px] font-bold text-[#1b6b50] uppercase tracking-wider flex items-center gap-1.5">
              💡 ตัวช่วยวิทยากรครูเด่น: ฝึกเปลี่ยนคำสั่งด่วนเผชิญหน้า
            </span>
            <div className="flex gap-1.5">
              {scenarios12.map((_, i) => (
                <button
                  key={i}
                  id={`btn-scenario12-tab-${i}`}
                  onClick={() => { setSelectedScenario12(i); playChimeSound('pop'); }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedScenario12 === i ? 'bg-[#1b6b50] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  เคสที่ {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-[10px] block font-bold text-red-800 uppercase tracking-wide">🚫 คำสั่งแข็งกร้าวหยาบสะดุดหู</span>
              <p className="text-xs text-stone-700 leading-relaxed mt-1 font-semibold">{scenarios12[selectedScenario12].ban}</p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-[10px] block font-bold text-green-800 uppercase tracking-wide">🌟 คำถามโค้ชชิ่งปลุกปัญญาทีม (ครูเด่นคีย์)</span>
              <p className="text-xs text-stone-700 leading-relaxed mt-1 font-semibold">{scenarios12[selectedScenario12].guide}</p>
            </div>
          </div>
          <p className="text-[9px] text-gray-400 text-center mt-2">
            * คลิกแถบ 'เคสที่ 1-3' ด้านบนเพื่อเรียนรู้ศิลปะคำถามบริหารแบบใหม่ลดกระแสค้านร่วมใจ
          </p>
        </div>
      )}
    </div>
  );
};
