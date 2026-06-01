/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, BookOpen, Clock, Users, MapPin, 
  Settings, Columns, Sliders, Play, Pause, RotateCcw, 
  Download, Sparkles, Volume2, Maximize, FileText, CheckCircle2, 
  HelpCircle, Eye, AlertCircle, Copy, Check, ExternalLink, Menu
} from 'lucide-react';
import { SLIDES_DATA } from './data/slides';
import { SlideRenderer } from './components/SlideRenderer';
import { playChimeSound } from './components/WorkbookWidgets';
import { SelfIntroState, ProjectProposalState, ReflectionCard } from './types';

export default function App() {
  // Current Slide Navigation State
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const activeSlide = SLIDES_DATA[currentSlideIdx];

  // Core UI Toggles
  const [showOutline, setShowOutline] = useState<boolean>(true);
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(true);
  const [textSize, setTextSize] = useState<'s' | 'm' | 'l'>('m');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  // Auto-play feature
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState<boolean>(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Shared Workbook states
  const [selfIntro, setSelfIntro] = useState<SelfIntroState>({ hook: '', mission: '', value: '', goal: '' });
  const [projectProposal, setProjectProposal] = useState<ProjectProposalState>({ title: '', challenge: '', solution: '', outcome: '', cta: '' });
  const [reflectionCards, setReflectionCards] = useState<ReflectionCard[]>([
    { id: 'ref-1', text: "ซ้อมพูดในใจและ Box Breathing ก่อนเริ่มประชุม Zoom มิติต่างๆ", category: "start" },
    { id: 'ref-2', text: "ลดการก้มหน้าอ่านตัวหนังสือแห้อัดแน่นบนแผ่นสไลด์อย่างประหม่า", category: "stop" },
    { id: 'ref-3', text: "สบดวงตาตรงยอดเลนส์กล้อง Zoom เสมือนการสบตานั่งจริง", category: "continue" }
  ]);

  // Sync state loading on initialization
  useEffect(() => {
    try {
      const savedIntro = localStorage.getItem('masterfa_self_intro');
      const savedPitch = localStorage.getItem('masterfa_project_pitch');
      const savedCards = localStorage.getItem('masterfa_reflection_cards');
      if (savedIntro) setSelfIntro(JSON.parse(savedIntro));
      if (savedPitch) setProjectProposal(JSON.parse(savedPitch));
      if (savedCards) setReflectionCards(JSON.parse(savedCards));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, []);

  // Save changes automatically
  useEffect(() => {
    try {
      localStorage.setItem('masterfa_self_intro', JSON.stringify(selfIntro));
    } catch (e) {}
  }, [selfIntro]);

  useEffect(() => {
    try {
      localStorage.setItem('masterfa_project_pitch', JSON.stringify(projectProposal));
    } catch (e) {}
  }, [projectProposal]);

  useEffect(() => {
    try {
      localStorage.setItem('masterfa_reflection_cards', JSON.stringify(reflectionCards));
    } catch (e) {}
  }, [reflectionCards]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing within form fields
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIdx]);

  // Autoplay handler
  useEffect(() => {
    if (isAutoPlayEnabled) {
      autoPlayRef.current = setInterval(() => {
        handleNextSlide();
      }, 10000); // 10s slide cycle
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlayEnabled, currentSlideIdx]);

  const handleNextSlide = () => {
    if (currentSlideIdx < SLIDES_DATA.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
      playChimeSound('pop');
    } else {
      setIsAutoPlayEnabled(false);
      playChimeSound('success');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
      playChimeSound('pop');
    }
  };

  const selectSlide = (idx: number) => {
    setCurrentSlideIdx(idx);
    playChimeSound('pop');
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('slide-projection-screen');
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        el.requestFullscreen();
        playChimeSound('success');
      } else {
        document.exitFullscreen();
        playChimeSound('pop');
      }
    } catch (e) {
      console.warn("Fullscreen API blocked or unsupported", e);
    }
  };

  // Add card to action board
  const handleAddReflectionCard = (card: Omit<ReflectionCard, 'id'>) => {
    const newCard: ReflectionCard = {
      id: `ref-${Date.now()}`,
      ...card
    };
    setReflectionCards([...reflectionCards, newCard]);
  };

  const handleDeleteReflectionCard = (id: string) => {
    setReflectionCards(reflectionCards.filter(c => c.id !== id));
  };

  // Compile and Export the user's filled interactive workbook data
  const handleExportWorkbook = () => {
    const introText = `### 💥 ส่วนที่ 1: เฟรมเวิร์คแนะนำตัว 60 วินาที ของผู้นำ
- **คำทักทายเด่นสะกดฟัง (Hook):** ${selfIntro.hook || 'ยังไม่ได้ระบุข้อมูล'}
- **พันธกิจภาพลักษณ์ (Mission):** ${selfIntro.mission || 'ยังไม่ได้ระบุข้อมูล'}
- **คุณค่าช่วยเหลือประชาชน (Value):** ${selfIntro.value || 'ยังไม่ได้ระบุข้อมูล'}
- **คำซักชวนเครือข่ายความร่วมมือ (Action Goal):** ${selfIntro.goal || 'ยังไม่ได้ระบุข้อมูล'}

*คำสุนทรพจน์ประสานรวม:*
“สวัสดีครับ/ค่ะทุกท่าน ${selfIntro.hook || '...'} ผม/ดิฉัน ${selfIntro.mission || '...'} ซึ่งความคุ้มครอบคุณค่าที่ผมช่วยหนุนช่วยเหลือประชาชนคือ ${selfIntro.value || '...'} และผมหวังประสานที่จะได้รับความร่วมมือด้าน ${selfIntro.goal || '...'} ครับ/ค่ะ”`;

    const pitchText = `### 📢 ส่วนที่ 2: โครงร่างประดิษฐ์สปีช Pitching ใน 3 นาที
- **ชื่อโครงการหมุดหมายปัง (Project Title):** ${projectProposal.title || 'ยังไม่ได้ระบุข้อมูล'}
- **วิกฤตความจำเป็นสูงสุด (Urgent Pain):** ${projectProposal.challenge || 'ยังไม่ได้ระบุข้อมูล'}
- **นวัตกรรมระบบปราบชำนาญ (Proposed Solution):** ${projectProposal.solution || 'ยังไม่ได้ระบุข้อมูล'}
- **สถิติปริมาณความคุ้มค่า (Outcome):** ${projectProposal.outcome || 'ยังไม่ได้ระบุข้อมูล'}
- **คำของบหรือเซ็นร่วมงานด่วน (Call to Action):** ${projectProposal.cta || 'ยังไม่ได้ระบุข้อมูล'}`;

    const startCardsText = reflectionCards.filter(c => c.category === 'start').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';
    const stopCardsText = reflectionCards.filter(c => c.category === 'stop').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';
    const continueCardsText = reflectionCards.filter(c => c.category === 'continue').map(c => `  - ${c.text}`).join('\n') || '  - ไม่มี';

    const reflectionText = `### 🚀 ส่วนที่ 3: แผนตกผลึก Start-Stop-Continue บันดาลสรุป
- **START (จะเริ่มต้นทำ):**\n${startCardsText}
- **STOP (จะตัดใจงดเว้น):**\n${stopCardsText}
- **CONTINUE (จะสืบสานต่อ):**\n${continueCardsText}`;

    const documentText = `# เวิร์กชอปคู่มือตกผลึก: ทักษะการสื่อสารและการนำเสนอสำหรับผู้นำ\n\n${introText}\n\n${pitchText}\n\n${reflectionText}\n\n---\n*จัดทำโดยผู้เรียนหลักสูตรร่วมใจพัฒนาศักยภาพผู้บริหารสาธารณสุขล้านนา*`;
    
    try {
      const blob = new Blob([documentText], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Workbook_MasterFA_${Date.now()}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
      playChimeSound('success');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      playChimeSound('success');
    } catch (e) {
      console.warn("Copy link failed", e);
    }
  };

  // Group slides by section
  const groupedSlides = SLIDES_DATA.reduce((acc, s) => {
    const sec = s.section || 'อื่นๆ';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(s);
    return acc;
  }, {} as Record<string, typeof SLIDES_DATA>);

  return (
    <div className="min-h-screen bg-warm-white text-ink font-sans flex flex-col p-4 md:p-6 lg:p-8 gap-5 lg:gap-6 selection:bg-sand/30 selection:text-ink">
      
      {/* Top Professional Header Bar */}
      <header id="workshop-top-navbar" className="bg-primary-green text-warm-white p-5 md:px-8 rounded-2xl md:rounded-3xl border border-sand/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-sans shrink-0 relative overflow-hidden">
        {/* Luxury top light accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sand via-secondary-terracotta to-sand opacity-60" />
        
        <div className="flex items-center gap-3 relative z-10">
          <BookOpen className="w-5 h-5 text-sand shrink-0" />
          <div>
            <h1 className="font-display font-extrabold text-sm md:text-md tracking-tight uppercase">
              สไลด์หลักสูตร: ทักษะการสื่อสารและการนำเสนอสำหรับผู้นำ
            </h1>
            <p className="text-[10px] text-warm-white/70 flex items-center gap-1.5 mt-0.5 font-normal">
              <span>ผู้บริหารสาธารณสุขภาคเหนือ (6 ชม. Zoom)</span>
              <span className="opacity-40">•</span>
              <span className="text-sand font-bold">ครูเด่น มาสเตอร์ฟา (สถาบันแคปวิชั่น)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {/* Action to download Compiled Workbook */}
          <button
            type="button"
            id="btn-global-export"
            onClick={handleExportWorkbook}
            className="hidden md:flex items-center gap-1.5 bg-secondary-terracotta hover:bg-secondary-terracotta/90 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm transition-all cursor-pointer border border-sand/20"
            title="ดาวน์โหลดสมุดบันทึกกิจกรรมส่วนตัว"
          >
            <Download className="w-3.5 h-3.5" />
            <span>เซฟสมุดกิจกรรม (.MD)</span>
          </button>

          <button
            type="button"
            id="btn-copy-address"
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-1 bg-primary-green/60 hover:bg-primary-green text-warm-white border border-sand/25 text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            {copiedLink ? 'เลเซอร์ลิงก์แล้ว!' : 'แชร์เวิร์กเว็บ'}
          </button>

          <span className="h-6 w-[1px] bg-sand/20 hidden sm:inline-block mx-1"></span>

          {/* Quick config settings */}
          <div className="flex items-center bg-primary-green/40 p-0.5 rounded-lg border border-sand/15 gap-1 text-[10px]">
            <button 
              onClick={() => { setTextSize('s'); playChimeSound('pop'); }} 
              id="size-s" 
              className={`px-1.5 py-1 rounded transition-colors font-semibold cursor-pointer ${textSize === 's' ? 'bg-warm-white text-primary-green font-bold' : 'text-warm-white hover:bg-warm-white/10'}`}
            >
              เล็ก
            </button>
            <button 
              onClick={() => { setTextSize('m'); playChimeSound('pop'); }} 
              id="size-m" 
              className={`px-1.5 py-1 rounded transition-colors font-semibold cursor-pointer ${textSize === 'm' ? 'bg-warm-white text-primary-green font-bold' : 'text-warm-white hover:bg-warm-white/10'}`}
            >
              กลาง
            </button>
            <button 
              onClick={() => { setTextSize('l'); playChimeSound('pop'); }} 
              id="size-l" 
              className={`px-1.5 py-1 rounded transition-colors font-semibold cursor-pointer ${textSize === 'l' ? 'bg-warm-white text-primary-green font-bold' : 'text-warm-white hover:bg-warm-white/10'}`}
            >
              ใหญ่
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-6 relative min-h-0">
        
        {/* Left Collapsible Outline Map */}
        <aside 
          id="slides-map-sidebar" 
          className={`bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-sand/15 w-full lg:w-72 shrink-0 shadow-md transition-all ${showOutline ? 'flex' : 'hidden'} flex-col h-full overflow-hidden`}
        >
          <div className="p-4 bg-stone-50/50 border-b border-sand/10 flex items-center justify-between shrink-0 font-sans">
            <span className="text-xs font-extrabold text-primary-green tracking-wider flex items-center gap-1.5 uppercase font-sans">
              <Sliders className="w-3.5 h-3.5 text-primary-green" />
              สารบัญการสอน (26 สไลด์)
            </span>
            <button
              onClick={() => { setShowOutline(false); playChimeSound('pop'); }}
              id="btn-sidebar-close-outline"
              className="lg:hidden text-xs text-gray-400 hover:text-gray-900 font-bold cursor-pointer"
            >
              ค้างปิด
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 max-h-[40vh] lg:max-h-none font-sans">
            {Object.entries(groupedSlides).map(([category, list]) => (
              <div key={category} className="space-y-1">
                <span className="text-[10px] font-extrabold text-secondary-terracotta uppercase tracking-widest pl-2 block mb-1 font-sans">
                  📁 {category}
                </span>
                <div className="space-y-1">
                  {list.map((slideItem) => {
                    const isSelected = activeSlide.id === slideItem.id;
                    const index = slideItem.id - 1;
                    return (
                      <button
                        key={slideItem.id}
                        type="button"
                        id={`outline-slide-btn-${slideItem.id}`}
                        onClick={() => selectSlide(index)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-primary-green text-warm-white font-bold font-sans shadow-md translate-x-1 border border-sand/20' 
                            : 'bg-transparent text-ink/80 hover:bg-primary-green/5 border border-transparent'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] shrink-0 font-extrabold ${
                          isSelected ? 'bg-warm-white text-primary-green' : 'bg-primary-green/10 text-primary-green'
                        }`}>
                          {slideItem.id}
                        </span>
                        <span className="truncate pr-1 leading-snug">{slideItem.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Slide Bento card */}
          {currentSlideIdx < SLIDES_DATA.length - 1 && (
            <div className="m-3.5 p-4 bg-sand/10 border border-sand/30 rounded-2xl font-sans">
              <p className="text-[10px] font-bold text-sand uppercase mb-1 tracking-wider">แผ่นสไลด์ถัดไป (Upcoming)</p>
              <p className="text-xs font-extrabold text-ink truncate">[{currentSlideIdx + 2}] {SLIDES_DATA[currentSlideIdx + 1].title}</p>
            </div>
          )}

          {/* Connect Bento Card */}
          <div className="mx-3.5 mb-3.5 p-4 bg-ink text-white rounded-2xl border border-sand/20 font-sans shrink-0 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 text-3xl opacity-10">🌿</div>
            <p className="text-[9px] text-sand/80 uppercase mb-1 tracking-wider font-semibold">ติดต่อวิทยากร</p>
            <p className="text-[11px] text-warm-white/75 mb-0.5 font-medium">Line / IG / TikTok</p>
            <p className="text-sm font-bold text-sand">@denmasterfa</p>
          </div>

          <div className="p-4 bg-stone-50/50 border-t border-stone-100 hidden lg:block font-sans shrink-0">
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-1.5">คีย์ลัดคีย์บอร์ด</span>
            <div className="flex gap-2 text-[9px] text-gray-500 font-semibold font-sans">
              <kbd className="bg-white border border-gray-200 rounded px-1.5 shadow-2xs">▶ / Space</kbd> ถัดไป
              <kbd className="bg-white border border-gray-200 rounded px-1.5 shadow-2xs font-sans">◀</kbd> ถอย
            </div>
          </div>
        </aside>

        {/* Center Slide Stage view / Presentation Screen */}
        <main className="flex-1 overflow-y-auto p-0 flex flex-col items-center justify-start min-h-0">
          
          {/* Quick action helper icons on Zoom */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-4 text-xs font-semibold font-sans text-stone-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowOutline(!showOutline); playChimeSound('pop'); }}
                id="btn-toggle-outline"
                className="bg-white hover:bg-stone-50 border border-stone-200 p-2 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title={`${showOutline ? 'ซ่อน' : 'แสดง'} แผนผังสไลด์ด้านซ้าย`}
              >
                <Menu className="w-4 h-4 text-primary-green" />
                <span className="hidden sm:inline text-ink/80 text-xs font-semibold">คอร์สลิสต์</span>
              </button>

              <button
                onClick={() => { setShowPresenterNotes(!showPresenterNotes); playChimeSound('pop'); }}
                id="btn-toggle-notes"
                className="bg-white hover:bg-stone-50 border border-stone-200 p-2 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title={`${showPresenterNotes ? 'ซ่อน' : 'แสดง'} คู่มือติวครูเด่นด้านขวา`}
              >
                <Columns className="w-4 h-4 text-secondary-terracotta" />
                <span className="hidden sm:inline text-ink/80 text-xs font-semibold">คู่มือครูเด่น ({showPresenterNotes ? 'ซ่อน' : 'เปิด'})</span>
              </button>
            </div>

            {/* Quick Workbook Save Prompt inside workspace */}
            {showSaveSuccess && (
              <span className="bg-sand/10 text-primary-green text-[10px] px-2.5 py-1 rounded border border-sand/35 animate-pulse font-bold">
                ✓ บันทึกความก้าวหน้าลงเครื่องดาวน์โหลดเรียบร้อย!
              </span>
            )}

            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sand animate-pulse"></span>
              <span className="text-xs font-semibold text-ink/70">Zoom Live Interactive Stage</span>
            </div>
          </div>

          {/* Slide Deck Container (Preserves the beautiful Slide layout) */}
          <div 
            id="slide-projection-screen" 
            className={`w-full max-w-4xl bg-white border border-sand/20 rounded-[32px] md:rounded-[40px] p-6 md:p-10 lg:p-12 shadow-xl slide-active-shadow transition-all relative overflow-hidden flex flex-col justify-between select-text ${
              textSize === 's' ? 'text-sm' : textSize === 'l' ? 'text-lg' : 'text-base'
            }`}
            style={{ minHeight: '540px' }}
          >
            {/* Visual background accents to emulate premium slide paper */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${
              activeSlide.layout === 'activity' ? 'bg-secondary-terracotta' : activeSlide.layout === 'divider' ? 'bg-sand' : 'bg-primary-green'
            }`} />

            {/* Slide Header details */}
            {activeSlide.layout !== 'divider' && (
              <div className="flex items-center justify-between pb-3 text-xs text-[#8c6239] border-b border-sand/10 mb-4 shrink-0 font-sans">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://res.cloudinary.com/dmo4kq7ej/image/upload/v1780335603/ChatGPT_Image_1_%E0%B8%A1%E0%B8%B4.%E0%B8%A2._2569_15_12_58_cvzm9y.png"
                    alt="สถาบันแคปวิชั่น"
                    className="h-8 md:h-10 w-auto object-contain shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="opacity-30 self-stretch border-r border-[#8c6239]/20" />
                  <div className="flex flex-col">
                    <span className="font-extrabold uppercase bg-sand/10 text-primary-green px-1.5 py-0.5 rounded tracking-widest text-[8.5px] border border-sand/15 w-max leading-none">
                      SLIDE {activeSlide.id} / 26
                    </span>
                    <span className="text-[10px] font-semibold text-primary-green mt-0.5">{activeSlide.section}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-stone-500">
                  <span className="font-medium text-primary-green font-sans text-right hidden sm:block">ครูเด่นมาสเตอร์ฟา</span>
                  <span className="opacity-40 hidden sm:inline">•</span>
                  <span>capvisionpartner.com</span>
                </div>
              </div>
            )}

            {/* Renderer for Slide Structure */}
            <div className="flex-1">
              <SlideRenderer 
                slide={activeSlide} 
                selfIntroState={selfIntro}
                setSelfIntroState={setSelfIntro}
                projectProposalState={projectProposal}
                setProjectProposalState={setProjectProposal}
                reflectionCards={reflectionCards}
                onAddReflectionCard={handleAddReflectionCard}
                onDeleteReflectionCard={handleDeleteReflectionCard}
                onSetSlide={selectSlide}
              />
            </div>

            {/* Slide Footer Details */}
            {activeSlide.layout !== 'divider' && (
              <div className="mt-8 pt-3 border-t border-sand/10 flex items-center justify-between text-[11px] text-[#8c6239]/70 shrink-0 font-sans">
                <p className="font-medium">💡 ซ้อมพูดสด & ใช้ Keyboard ควบคุมสไลด์ผ่านระบบ Zoom</p>
                <div className="text-right font-semibold">
                  <strong>พัฒนาทักษะการเรียนรู้ร่วมใจ</strong> / 6 ชม.
                </div>
              </div>
            )}
          </div>

          {/* Quick Mini Controls under Projector */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mt-5 bg-white border border-sand/15 rounded-3xl p-4 shadow-md gap-4 font-sans">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-slide-prev"
                onClick={handlePrevSlide}
                disabled={currentSlideIdx === 0}
                className="bg-warm-white border border-sand/20 hover:bg-stone-50 text-ink/80 px-3 py-2 rounded-lg transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-xs font-bold"
              >
                ◀ ย้อนกลับ
              </button>
              
              <span className="text-xs text-primary-green font-extrabold mx-2">
                แผ่นที่ {currentSlideIdx + 1} / 26
              </span>
              
              <button
                type="button"
                id="btn-slide-next"
                onClick={handleNextSlide}
                disabled={currentSlideIdx === SLIDES_DATA.length - 1}
                className="bg-primary-green text-warm-white hover:bg-primary-green/90 px-4 py-2 rounded-lg border border-sand/20 transition-all cursor-pointer text-xs font-extrabold flex items-center gap-1 disabled:opacity-40"
              >
                ถัดไป (Space) ▶
              </button>
            </div>

            {/* Interactive countdown autoplay */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-toggle-autoplay"
                onClick={() => { setIsAutoPlayEnabled(!isAutoPlayEnabled); playChimeSound('pop'); }}
                className={`py-1.5 px-2.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  isAutoPlayEnabled ? 'bg-sand/15 text-secondary-terracotta border border-sand/30 font-bold' : 'bg-warm-white text-stone-500 border border-sand/10 hover:border-sand/30'
                }`}
              >
                {isAutoPlayEnabled ? <Pause className="w-3.5 h-3.5 animate-spin text-secondary-terracotta" /> : <Play className="w-3.5 h-3.5" />}
                <span>Auto-Reveal (10s)</span>
              </button>

              <button
                type="button"
                id="btn-fullscreen-toggle"
                onClick={toggleFullscreen}
                className="bg-warm-white hover:bg-sand/10 text-primary-green border border-sand/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="เต็มปุ่มสำหรับ Zoom Presentation"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>เต็มเลนส์ฉาก (F)</span>
              </button>
              
              {/* Mobile download helper */}
              <button
                type="button"
                id="btn-mobile-download"
                onClick={handleExportWorkbook}
                className="md:hidden bg-secondary-terracotta hover:bg-secondary-terracotta/90 text-white p-2 rounded-lg"
                title="ดาวน์โหลดกิจกรรมด่วน"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Collapsible Presenter Companion Panel */}
        <aside 
          id="presenter-companion" 
          className={`bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-sand/15 transition-all ${
            showPresenterNotes ? 'w-full lg:w-80 flex' : 'w-0 hidden'
          } shrink-0 flex flex-col h-full overflow-hidden shadow-md`}
        >
          <div className="p-4 bg-stone-50/50 border-b border-sand/10 flex items-center justify-between shrink-0 font-sans">
            <span className="text-xs font-bold text-primary-green tracking-wider flex items-center gap-1.5 uppercase">
              <Columns className="w-4 h-4 text-secondary-terracotta" />
              ติวเตอร์โน้ต (ครูเด่นมาสเตอร์ฟา)
            </span>
            <button
              onClick={() => { setShowPresenterNotes(false); playChimeSound('pop'); }}
              id="btn-close-notes"
              className="text-xs text-gray-400 hover:text-gray-900 font-bold cursor-pointer"
            >
              × ซ่อนคู่มือ
            </button>
          </div>

          {/* Detailed Zoom instruction content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans">
            <div>
              <span className="bg-secondary-terracotta/10 text-secondary-terracotta text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max border border-secondary-terracotta/20 font-sans shadow-2xs">
                🎯 คู่มือนำคุยประจำสไลเดอร์ที่ {activeSlide.id}
              </span>
              <h4 className="text-sm font-display font-bold mt-2 text-primary-green leading-snug">
                {activeSlide.presenterNotes.title}
              </h4>
            </div>

            <div className="space-y-3 pt-3 border-t border-sand/10">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
                🗣️ สคริปต์พูด & แนวการแนะนำผู้บริหาร:
              </span>
              {activeSlide.presenterNotes.points.map((pt, idx) => (
                <div key={idx} className="bg-white border border-sand/10 p-3.5 rounded-2xl shadow-2xs text-xs text-[#2c3e35] leading-relaxed flex gap-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sand" />
                  <span className="text-secondary-terracotta font-extrabold shrink-0">{idx + 1}.</span>
                  <p className="font-semibold leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-sand/10 space-y-2">
              <span className="text-[10px] text-primary-green uppercase font-bold block">
                ⚙️ จัดเตรียมระบบ Zoom & บรรยากาศ:
              </span>
              <div className="p-3.5 bg-warm-white/45 rounded-xl text-ink/75 text-[11px] leading-relaxed border border-sand/10">
                • <strong>มุมกล้องประสงค์:</strong> สบเท่สอดประสานช่องเลนส์ สานความลึกเชิงบวกผ่านมุมแสงสว่าง<br/>
                • <strong>ระเบียบน้ำเสียง:</strong> ผ่อนสปีดช้าแต่นุ่ม เอื้อเฟื้ออารมณ์บวกร่มเย็นแบบล้านนา<br/>
                • <strong>สไลด์กราฟฟิก:</strong> สะกดสายตาผู้นำให้จับจ้องพื้นที่ว่าง (Negative Space) ส่งทรานสพาร์ค
              </div>
            </div>

            {/* Contact widget card */}
            <div className="bg-gradient-to-br from-primary-green/5 to-sand/10 p-4 rounded-2xl border border-sand/15 text-center space-y-2 mt-4 shadow-sm">
              <span className="text-[9px] bg-sand/10 border border-sand/35 text-primary-green px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                CAPVISION SPEAKER NETWORK
              </span>
              <p className="text-[11px] text-ink font-bold leading-relaxed">
                ครูเด่น มาสเตอร์ฟา — วิทยากรระดับผู้นำราชการล้านนา
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-secondary-terracotta hover:underline font-bold">
                <ExternalLink className="w-3 h-3" />
                <a href="https://capvisionpartner.com" target="_blank" rel="noreferrer">capvisionpartner.com</a>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Floating Compact Indicator for Mobile with helpful shortcuts */}
      <footer id="global-action-footer" className="bg-ink text-xs text-warm-white/60 py-3.5 px-6 text-center rounded-2xl md:rounded-3xl border border-sand/10 font-sans flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative overflow-hidden">
        <p className="font-sans text-[11px]">
          © 2026 สถาบันแคปวิชั่น — สเวตเตอร์ระบบนำเสนอสไลด์ปฏิสัมพันธ์ทักษะผู้บริหารเพื่อสุขภาวะอันอุ่นชื่น
        </p>
        <div className="flex gap-4">
          <a href="https://capvisionpartner.com/speakers/den-masterfa" target="_blank" rel="noreferrer" className="text-sand hover:text-white hover:underline font-semibold flex items-center gap-1 font-sans">
            <span>ครูเด่น มาสเตอร์ฟา — Master Facilitator</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
