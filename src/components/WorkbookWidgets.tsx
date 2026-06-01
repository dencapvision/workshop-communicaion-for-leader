/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Sparkles, Check, RefreshCw, Trash2, Plus, ArrowRight, Eye, ClipboardCheck } from 'lucide-react';
import { SelfIntroState, ProjectProposalState, ReflectionCard } from '../types';

// Web audio service
export const playChimeSound = (type: 'success' | 'buzzer' | 'tick' | 'pop') => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
      osc.start();
      osc.frequency.setValueAtTime(329.63, audioCtx.currentTime + 0.08); // E4
      osc.frequency.setValueAtTime(392.00, audioCtx.currentTime + 0.16); // G4
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.24); // C5
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.start();
      gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc.stop(audioCtx.currentTime + 0.45);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.stop(audioCtx.currentTime + 0.08);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, audioCtx.currentTime);
      osc.start();
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.stop(audioCtx.currentTime + 0.04);
    }
  } catch (e) {
    console.warn("Audio Context not allowed yet by browser policies", e);
  }
};

interface SelfIntroWidgetProps {
  state: SelfIntroState;
  onChange: (state: SelfIntroState) => void;
}

export const SelfIntroWidget: React.FC<SelfIntroWidgetProps> = ({ state, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleInputChange = (field: keyof SelfIntroState, val: string) => {
    onChange({
      ...state,
      [field]: val
    });
  };

  const handleCopy = () => {
    const speechText = `สวัสดีครับ/ค่ะทุกท่าน ${state.hook || '[ Hook ดึงดูดสายตา ]'}` +
      ` ผม/ดิฉัน ${state.mission || '[ หน้าที่และความภูมิใจหลัก ]'}` +
      ` ซึ่งโครงการนี้จะเข้าไปมีส่วนช่วยผู้ร่วมงานและประชาชนเรื่อง ${state.value || '[ คุณค่าที่ส่งมอบ ]'}` +
      ` และผมคาดหวังใจจริงที่จะได้รับความร่วมมือด้าน ${state.goal || '[ เป้าประสงค์ร่วมมือ ]'} ครับ/ค่ะ`;
    
    navigator.clipboard.writeText(speechText);
    setCopied(true);
    playChimeSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    onChange({
      hook: "ในรอยต่อพื้นที่ชายแดน หูที่คอยฟังประชาชนที่เร็วที่สุดคือหูของผู้บริหารเขตเรานี่เองครับ",
      mission: "อนุสรณ์ หนองนา ผู้อำนวยการเขตสุขภาพที่ 1 ดูแลคุ้มครองประชากรในภูมิภาค 8 ล้านชีวิต",
      value: "ช่วยยกระดับระบบวิบาลถึงหุบเขาด้วยแพลตฟอร์มโทรเวชกรรม (Telemedicine) อัจฉริยะวิภาค",
      goal: "การสนับสนุนด้านงบพัฒนาเครือข่ายความเร็วสูงจากผู้ว่าราชการจังหวัดร่วมกัน"
    });
    playChimeSound('pop');
  };

  const resetForm = () => {
    onChange({ hook: '', mission: '', value: '', goal: '' });
    playChimeSound('pop');
  };

  return (
    <div id="self-intro-builder" className="bg-white border border-black/5 rounded-[32px] p-6 md:p-8 shadow-sm font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h4 className="font-display font-semibold text-lg text-[#1b6b50] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e07a5f]" />
            เครื่องมือฝึกแต่งทักษะแนะนำตนเอง 60 วินาที
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">พิมพ์สคริปต์สั้นๆ ของท่านและทดลองเปล่งกระบังลมอย่างผู้นำ</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            type="button"
            onClick={loadExample}
            id="btn-intro-example"
            className="text-xs bg-[#f2cc8f]/30 hover:bg-[#f2cc8f]/50 text-gray-800 font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            💡 โหลดตัวอย่างครูเด่น
          </button>
          <button 
            type="button"
            onClick={resetForm}
            id="btn-intro-reset"
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-650 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> รีเซ็ต
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#e07a5f] uppercase tracking-wider mb-1 flex items-center justify-between font-sans">
              <span>ขั้นที่ 1: คำทักทายเด่นสะกดฟัง (Greeting Hook)</span>
              <span className="text-[10px] text-gray-400 font-normal">ความตระหนักรู้ 15 วินาที</span>
            </label>
            <textarea
              value={state.hook}
              id="intro-input-hook"
              onChange={(e) => handleInputChange('hook', e.target.value)}
              placeholder="เปรียบเปรย สถิตินอกกรอบ หรือเปิดประเด็นสลักหู เช่น 'ทราบไหมครับว่า 70% ของเวลาผู้ป่วยเขตเหนือเสียไปกับการรอคอยรถส่งส่ง...'"
              className="w-full text-xs bg-white border border-gray-250 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-18 text-gray-800 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b6b50] uppercase tracking-wider mb-1 flex items-center justify-between font-sans">
              <span>ขั้นที่ 2: ผู้นำกับการประกาศพันธกิจภาพลักษณ์ (Core Mission)</span>
              <span className="text-[10px] text-gray-400 font-normal">ความตระหนักรู้ 15 วินาที</span>
            </label>
            <input
              type="text"
              value={state.mission}
              id="intro-input-mission"
              onChange={(e) => handleInputChange('mission', e.target.value)}
              placeholder="แนะนำชื่อ-สกุล สังกัดงาน และเป้าหมายความรับผิดชอบเชิงบริหาร"
              className="w-full text-xs bg-white border border-gray-250 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between font-sans">
              <span>ขั้นที่ 3: คุณค่าช่วยเหลือประชาชนในพื้นที่ (Value Offered)</span>
              <span className="text-[10px] text-gray-400 font-normal">ความตระหนักรู้ 15 วินาที</span>
            </label>
            <textarea
              value={state.value}
              id="intro-input-value"
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="อธิบายว่าหน้างานของท่านช่วยลดอัตราป่วย หรือช่วยเปลี่ยนวิถีชีวิตผู้รักษาระดับตำบลอย่างไรบ้าง"
              className="w-full text-xs bg-white border border-gray-250 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-16 text-gray-800 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c2722] uppercase tracking-wider mb-1 flex items-center justify-between font-sans">
              <span>ขั้นที่ 4: คำสรุปเชิญเชื่อมสะพานความร่วมมือ (Action Goal)</span>
              <span className="text-[10px] text-gray-400 font-normal">ความตระหนักรู้ 15 วินาที</span>
            </label>
            <input
              type="text"
              value={state.goal}
              id="intro-input-goal"
              onChange={(e) => handleInputChange('goal', e.target.value)}
              placeholder="เป้าหมายดิ้นร่วมงานกับเพื่อข้าราชการวงเสวนา เช่น 'เพื่อให้งานโทรเวชเขตภาคเหนือคลอดสำเร็จด้วยรอยยิ้ม'"
              className="w-full text-xs bg-white border border-gray-250 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
            />
          </div>
        </div>

        {/* Live Presentation Output card */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col h-full justify-between bg-[#fbf7f0]/60 border border-black/5 rounded-2xl p-5 md:p-6 shadow-xs font-sans">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5">
              <span className="text-[10px] font-extrabold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                สคริปต์สุนทรพจน์ผู้นำ
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                id="btn-intro-toggle-preview"
                className="text-xs text-[#1b6b50] hover:underline flex items-center gap-1 font-bold"
              >
                <Eye className="w-3.5 h-3.5" /> {showPreview ? 'ซ่อนโพย' : 'แสดงโพย'}
              </button>
            </div>

            {showPreview ? (
              <div id="intro-preview-content" className="text-sm md:text-md text-gray-750 leading-relaxed font-sans space-y-3 prose">
                <p>
                  “ สวัสดีครับ/ค่ะทุกท่าน <span className="bg-[#e07a5f]/10 text-gray-900 px-1.5 py-0.5 rounded font-bold border-b border-[#e07a5f]/35">{state.hook || "______ (ทักทายให้ฉุกคิดสะกดสายตา)"}</span>
                </p>
                <p>
                  ผม/ดิฉัน <span className="bg-[#1b6b50]/10 text-gray-900 px-1.5 py-0.5 rounded font-bold border-b border-[#1b6b50]/35">{state.mission || "______ (ชื่อตำแหน่งบทบาทความเชี่ยวชาญ)"}</span>
                </p>
                <p>
                  ซึ่งในบทบาทหน้าที่นี้ ผมมุ่งหวังร่วมส่งมอบคุณค่าการคุ้มครองสุขภาพเรื่อง <span className="bg-[#f2cc8f]/30 text-gray-900 px-1.5 py-0.5 rounded font-bold border-b border-[#f2cc8f]/55">{state.value || "______ (คุณค่าการยื่นมือแก้ไขและอำนวยระบบ)"}</span>
                </p>
                <p>
                  และในเวทีประชุมวันนี้ ผมปรารถนาจะจับมือร่วมมือประสานแนวคิดร่วมกันในด้าน <span className="bg-slate-100 text-gray-900 px-1.5 py-0.5 rounded font-bold border-b border-slate-300">{state.goal || "______ (คำทอดสะพานชวนยินดีเชื่อมสิทธิ์)"}</span> ครับ/ค่ะ ”
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <ClipboardCheck className="w-12 h-12 stroke-1 mb-2 text-[#1b6b50]/40" />
                <p className="text-sm font-bold text-gray-600">ปิดหน้าจอคู่มือฝึกสปีดแล้ว</p>
                <p className="text-xs text-gray-400 max-w-xs mt-1">ตั้งสมาธิให้มั่น, ยิ้มกว้าง, จ้องเลนส์แล้วพูดสดเปล่งกังวานด้วยความสง่า!</p>
              </div>
            )}
          </div>

          <div className="mt-8 font-sans">
            <button
              type="button"
              id="intro-btn-copy"
              onClick={handleCopy}
              className="w-full bg-[#1b6b50] hover:bg-[#15533e] text-[#fbf7f0] font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> คันลอกสำเร็จแล้ว!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> คัดลอกสคริปต์ไปซ้อมต่อ
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              💡 ความเร็วเฉลี่ย: ประมาณ 130-140 คำต่อนาที ช่วยให้จบได้ใน 60 วินาทีพอดี
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectProposalWidgetProps {
  state: ProjectProposalState;
  onChange: (state: ProjectProposalState) => void;
}

export const ProjectProposalWidget: React.FC<ProjectProposalWidgetProps> = ({ state, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'card'>('edit');

  const handleInputChange = (field: keyof ProjectProposalState, val: string) => {
    onChange({
      ...state,
      [field]: val
    });
  };

  const handleCopy = () => {
    const pitchText = `📢 หัวข้อโครงการ: ${state.title || '[ ชื่อไอเดียโครงการปัง ]'}\n` +
      `🔥 ปัญหาสำคัญ: ในเขตภาคเหนือ เรากำลังเจอวิกฤตร้ายแรงคือ ${state.challenge || '[ ความท้าทายตึงเครียด ]'}\n` +
      `🚀 ขอนวัตนวัตกรรม: สิ่งที่เราสร้างสรรค์เสนอแก้ด่วนคือ ${state.solution || '[ รายละเอียดสิ่งปรับประสงค์ ]'}\n` +
      `📊 ผลลัพธ์: ซึ่งหากโครงการได้รับนุมัติ จะเปลี่ยนผลสุขประชาชนคือ ${state.outcome || '[ ตัวประเวกวัดปริมาณผลประโยชน์ ]'}\n` +
      `🤝 ปณิธานร่วมลงมือ: จึงขอเสนอให้ผู้บริหารและผู้ตวจเขต ${state.cta || '[ คำเสนออนุมัติ/ความร่วมมือ ]'}`;
    
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    playChimeSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    onChange({
      title: "Tele-Northern-Care หมอทางไกลส่งล้านนาสุขใจ",
      challenge: "ผู้หญิงท้องและกลุ่มผู้ป่วยเบาหวานในเขตห้วยคอกดอยลำคลอง ชายขอบพะเยา ต้องลื่นล้มฉุกเฉินและสูญการช่วยพยาบาลเนื่องจากการเสียเวลาเดินข้ามเขา 3 ชั่วโมงเต็ม",
      solution: "ติดตั้งตู้ตรวจวิบาลปฐมภูมิอัจฉริยะ (Telemedicine Health Cube) บริการเชื่อมตรงทีมแพทย์เขต 1 วงเสวนารับรู้ดั่งใกล้จอ",
      outcome: "ลดค่าใช้จ่ายร่อนเดินทางผู้รักษาระดับตำบลลง 45% พยุงชีวิตหญิงคลอดได้เร็วขึ้นใน 25 นาทีเฉลี่ยแรกประสงค์",
      cta: "พิจารณาอนุมัติงบกองทุนส่งเสริมจังหวัดเขต 1 ประจำงบหนุนแบรนด์ระดับ 1.2 ล้านเพื่อโครงการนำร่องประสาน"
    });
    playChimeSound('pop');
  };

  const resetForm = () => {
    onChange({ title: '', challenge: '', solution: '', outcome: '', cta: '' });
    playChimeSound('pop');
  };

  return (
    <div id="project-pitch-builder" className="bg-[#fcfbf9] border border-[#e07a5f]/20 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100">
        <div>
          <h4 className="font-display font-semibold text-lg text-[#1b6b50] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e07a5f]" />
            เวิร์กชอปประพันธ์โครงการพิทชิ่งใน 3 นาที (Sandwich Structure)
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">แปลโครงการวิจัยทางการแพทย์หน้าแน่นกระดุม ให้เป็นหัวใจสปีชพิทช์อนุมัติสะกิดตังค์กระอิ่ม</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={loadExample}
            id="btn-pitch-example"
            className="text-xs bg-[#f2cc8f]/30 hover:bg-[#f2cc8f]/50 text-gray-800 font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            💡 ตัวอย่างของครูเด่น
          </button>
          <button 
            type="button"
            onClick={resetForm}
            id="btn-pitch-reset"
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 animate-none"
          >
             รีเซ็ต
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-100 pb-2">
        <button
          onClick={() => { setActiveTab('edit'); playChimeSound('pop'); }}
          id="btn-tab-edit"
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all font-sans ${activeTab === 'edit' ? 'bg-[#1b6b50] text-[#fbf7f0] shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📝 กรอกแก้ไขข้อมูลโครงร่าง
        </button>
        <button
          onClick={() => { setActiveTab('card'); playChimeSound('pop'); }}
          id="btn-tab-card"
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all font-sans ${activeTab === 'card' ? 'bg-[#e07a5f] text-white shadow-md' : 'bg-gray-100 text-gray-650 hover:bg-gray-200'}`}
        >
          🗂️ ดูสถิติหน้าตาการ์ดพรีเซนต์
        </button>
      </div>

      {activeTab === 'edit' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans" id="pitch-edit-mode">
          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-[#1c2722] mb-1.5 font-sans">
                📌 1. ชื่อโครงการปัง (Project Pitch Title)
              </label>
              <input
                type="text"
                value={state.title}
                id="pitch-input-title"
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="ชื่อนวัตกรรมเข้าใจทันที เช่น 'รถฉุกเฉินช่วยคลอดเคลื่อนที่เวิ้งพะเยา'"
                className="w-full text-xs bg-[#fbf7f0]/40 border border-black/5 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#e07a5f] mb-1.5 font-sans">
                🔥 2. วิกฤตปัญหาขี่คอชีวิต (Urgent Pain) — ขนมปังแผ่นบน
              </label>
              <textarea
                value={state.challenge}
                id="pitch-input-challenge"
                onChange={(e) => handleInputChange('challenge', e.target.value)}
                placeholder="ความล้มเหลวเจ็บปวด สถิติขยายผลร้ายแรง เช่น 'อัตราแม่และเด็กตายพุ่งขึ้น 30% ทันการหากรักษารถฉุกเฉินหนุนด่านล่าช้า...'"
                className="w-full text-xs bg-[#fbf7f0]/40 border border-black/5 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-24 text-gray-800 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-[#1b6b50] mb-1.5 font-sans">
                💡 3. นวัตกรรมที่ยื่นช่วยเหลือ (Proposed Solution) — เนื้อไส้แซนด์วิช
              </label>
              <textarea
                value={state.solution}
                id="pitch-input-solution"
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="แกนหลักของเทคโนโลยี วิธีแก้ปัญหาที่จับทำได้จริง มีระเบียบ"
                className="w-full text-xs bg-[#fbf7f0]/40 border border-black/5 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none resize-none h-24 text-gray-800 transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-gray-650 mb-1.5 font-sans">
                  📈 4. ตัวชี้ผลความคุ้ม (Outcome)
                </label>
                <input
                  type="text"
                  value={state.outcome}
                  id="pitch-input-outcome"
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  placeholder="ช่วยประชาชนลดเวลารอได้ 50%, ลดตาย..."
                  className="w-full text-xs bg-[#fbf7f0]/40 border border-black/5 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1c2722] mb-1.5 font-sans">
                  🤝 5. ร้องอนุมัติร่วมทำ (Call to Action)
                </label>
                <input
                  type="text"
                  value={state.cta}
                  id="pitch-input-cta"
                  onChange={(e) => handleInputChange('cta', e.target.value)}
                  placeholder="ขอความร่วมมือทดลอง 2 อำเภอ / แลกเสนองบเขต..."
                  className="w-full text-xs bg-[#fbf7f0]/40 border border-black/5 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-xl p-3 outline-none text-gray-800 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#fbf7f0]/60 border border-black/5 rounded-[24px] p-6 lg:p-8 relative overflow-hidden font-sans" id="pitch-card-mode">
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-[#f2cc8f]/20 rounded-full blur-xl animate-pulse"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#e07a5f] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full font-sans">
              PITCHING CARD
            </span>
            <span className="text-xs text-gray-400 font-bold font-sans">พร้อมนำเสนอความกล้าหาญบริหาร</span>
          </div>

          <h3 className="text-xl font-display font-extrabold text-[#1b6b50] border-b border-black/5 pb-3 mb-4 tracking-tight">
            📢 {state.title || "--- (ชื่อแนวคิดร่วมใจปัง) ---"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-[#e07a5f]/5 p-4 rounded-2xl border border-[#e07a5f]/10">
              <h5 className="text-xs font-bold text-[#e07a5f] mb-1.5 uppercase tracking-wider flex items-center gap-1 font-sans">
                <span>Bread Top: วิกฤตเร้าใจ</span>
              </h5>
              <p className="text-xs text-gray-755 font-semibold leading-relaxed font-sans">
                {state.challenge || "กรุณาป้อนปัญหาสาธารณสุขความกริ่งเกรงที่เกิดขึ้นจริงในป่าดอยพะเยา เพื่อดลใจให้ผู้ฟังตื่นรู้ใน 30 วินาที"}
              </p>
            </div>

            <div className="bg-[#1b6b50]/5 p-4 rounded-2xl border border-[#1b6b50]/10 md:col-span-2 font-sans">
              <h5 className="text-xs font-bold text-[#1b6b50] mb-1.5 uppercase tracking-wider font-sans">
                Meat Core Value: นวัตกรรมผงาดและประโยชน์ที่จะชูรับ
              </h5>
              <div className="space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed font-sans">
                  <strong className="text-gray-900 font-extrabold">วิธีแสร้งแก้:</strong> {state.solution || "กรอกแนวโครงการนวัตกรรมหรือโปรแกรมบำรุงหัวใจ"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-black/5 font-sans">
                  <p className="text-[11px] text-gray-655 font-bold">
                    🥇 <strong className="text-gray-900">ผลชี้นับ:</strong> {state.outcome || "รอดกี่วิ, คุ้มใจกี่บาท"}
                  </p>
                  <p className="text-[11px] text-[#1c2722] font-bold">
                    🤝 <strong className="text-gray-900 font-extrabold">Bread Bottom CTA:</strong> {state.cta || "ขอแรงเซ็น หรือหนุนทีมข้าราชการ"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6 font-sans">
        <button
          type="button"
          onClick={handleCopy}
          id="btn-pitch-copy-all"
          className="bg-[#1b6b50] hover:bg-[#15533e] text-[#fbf7f0] text-xs font-bold py-3 px-5 rounded-2xl cursor-pointer transition-colors flex items-center justify-center gap-2 hover:translate-y-[-1px] shadow-md font-sans"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> บันทึกโครงพิทช์ลงบอร์ดจำแล้ว!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> คัดลอกแบบแผนคอร์สพิทชิ่งไปพูดสด
            </>
          )}
        </button>
      </div>
    </div>
  );
};


interface ActionPlannerWidgetProps {
  cards: ReflectionCard[];
  onAddCard: (card: Omit<ReflectionCard, 'id'>) => void;
  onDeleteCard: (id: string) => void;
}

export const ActionPlannerWidget: React.FC<ActionPlannerWidgetProps> = ({ cards, onAddCard, onDeleteCard }) => {
  const [inputText, setInputText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'start' | 'stop' | 'continue'>('start');
  const [showInspiration, setShowInspiration] = useState(false);

  const presets = {
    start: [
      "ซ้อมพูดแซนด์วิชเปิด-ปิดด่วนใน 1 สัปดาห์",
      "ถ่ายวีดีโอบันทึกพฤติกรรมสายตาทดลองพรีเซนต์เพื่อขัดแต่ง",
      "ทำ Box Breathing 3 นาทีก่อนเชื่อม Zoom แถลงข่าววิกฤต",
      "วางสมุดหนุนบอร์ดไอแพดระดับเลนส์สบตามั่น"
    ],
    stop: [
      "หยุดทำสไลด์ตัวหนังสือแห้อัดแน่นพังสายตาคนเรียน",
      "ยกเว้นการเลี่ยงจ้องกล้องหนีตา หรือก้มอ่านเศษโพยรัวกริ่น",
      "ละทิ้งการใช้อารมณ์สะอึกเหวี่ยงค้านคำถามประชาชนพาล",
      "เลิกกล่าวคำว่า 'อันนี้คร่าวๆ นะคะ' โดยพร่ำเพรื่อ"
    ],
    continue: [
      "ครองภาพรอยยิ้มอุ่นและความสุภาพอ่อนพ้องล้านนา",
      "เตรียมสรุปตัวเลขงานนำเสนอด้วยอินโฟกราฟิกสวยจัด",
      "นำ PREP Model และหลัก Aristotle สมดุลศรัทธาสืบสาน"
    ]
  };

  const handleCreate = (text: string, cat: 'start' | 'stop' | 'continue') => {
    if (!text.trim()) return;
    onAddCard({ text, category: cat });
    playChimeSound('pop');
  };

  const handleAddPreset = (txt: string) => {
    handleCreate(txt, activeCategory);
  };

  const toggleInspiration = () => {
    setShowInspiration(!showInspiration);
    if (!showInspiration) {
      playChimeSound('success');
    } else {
      playChimeSound('pop');
    }
  };

  return (
    <div id="action-planner-workspace" className="bg-[#fcfbf9] border border-[#1b6b50]/20 rounded-xl p-5 shadow-sm font-sans mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-100 mb-5 gap-3">
        <div>
          <h4 className="font-display font-semibold text-lg text-[#1b6b50] flex items-center gap-2">
            🚀 ปฏิบัติการตกผลึกคำมั่นสัญญาของหัวหน้าราชการ (Start-Stop-Continue Board)
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">จดบันทึกปณิธานกลับล้านนาไปปรับใช้จริง เพื่อเปลี่ยนภาพลักษณ์คุณให้อย่างก้าวกระโดด</p>
        </div>
        <button
          onClick={toggleInspiration}
          id="btn-trigger-heart"
          className="text-xs bg-gradient-to-r from-[#e07a5f] to-[#f2cc8f] text-gray-900 cursor-pointer hover:opacity-90 font-bold px-3 py-2 rounded-lg transition-opacity flex items-center gap-1.5"
        >
          💖 ปลุกพลังใจฟูของครูเด่น
        </button>
      </div>

      {showInspiration && (
        <div id="heart-warming-box" className="bg-gradient-to-br from-[#1b6b50] to-[#1c2722] text-[#fbf7f0] rounded-xl p-5 mb-5 border-l-4 border-[#e07a5f] relative animate-fade-in shadow-lg">
          <div className="absolute right-3 top-3 text-7xl opacity-10">🌿</div>
          <p className="text-md font-display font-medium leading-relaxed max-w-2xl">
            “คำกล่าวของผู้นำการแพทย์และสาธารณสุขล้านนา ไม่ใช่หลักคิดพร่ำเพรื่อเพื่อชี้ขาดว่าหน้าโต๊ะ แต่เปรียบประดุจโคมประภัสสรส่องทางสืบจิตวิญญาณแห่งการมีคุณภาพชีวิตที่อบอุ่น อ่อนหวาน ทรงภูมิ และจับใจประชาชนตราบนานเท่านานครับ”
          </p>
          <div className="mt-3 text-xs font-semibold text-[#f2cc8f] tracking-widest flex items-center gap-1.5">
            -- มอบพลังบวกพ้องถิ่นจากใจ ครูเด่น มาสเตอร์ฟา
          </div>
        </div>
      )}

      {/* Quick Input Panel */}
      <div className="bg-white border border-gray-100 rounded-lg p-3.5 mb-5 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end shadow-inner">
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">1. พลังข้อความคำมั่นสัญญาของท่าน</label>
          <input
            type="text"
            value={inputText}
            id="planner-custom-input"
            onChange={(e) => setInputText(e.target.value)}
            placeholder="เช่น 'จะใช้สูตร 3ส ทุกการขึ้นพูด Zoom ประชุม'"
            className="w-full text-xs bg-white border border-gray-200 focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50] rounded-lg p-2 md:p-2.5 outline-none text-gray-800 transition-all font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreate(inputText, activeCategory);
                setInputText('');
              }
            }}
          />
        </div>
        
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">2. ตกหมวดหมู่งานคอร์ส</label>
          <div className="flex gap-2">
            {(['start', 'stop', 'continue'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setActiveCategory(cat); playChimeSound('pop'); }}
                id={`btn-planner-cat-${cat}`}
                className={`flex-1 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? cat === 'start'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : cat === 'stop'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-indigo-100 text-indigo-800 border border-[#f2cc8f]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <button
            type="button"
            id="btn-planner-add"
            onClick={() => {
              handleCreate(inputText, activeCategory);
              setInputText('');
            }}
            className="w-full bg-[#1b6b50] hover:bg-[#15533e] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all outline-none shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> บันทึกปฏิทินเด่น
          </button>
        </div>
      </div>

      {/* Preset chip helpers */}
      <div className="mb-5 bg-stone-50 border border-stone-100 p-3 rounded-lg">
        <span className="text-[10px] font-bold text-[#e07a5f] uppercase tracking-wider block mb-2">
          💡 คลิกด่วนเพื่อชูคำแนะนำเด่นของครูเด่น เข้าบอร์ดหมวด {activeCategory.toUpperCase()}:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets[activeCategory].map((text, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${activeCategory}-${idx}`}
              onClick={() => handleAddPreset(text)}
              className="text-[11px] bg-white border border-gray-100 rounded-full px-2.5 py-1 text-gray-600 hover:border-[#1b6b50] hover:text-[#1b6b50] transition-all cursor-pointer shadow-sm text-left truncate max-w-sm"
            >
              ➕ {text}
            </button>
          ))}
        </div>
      </div>

      {/* Columns display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* START COLUMN */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 flex flex-col h-70">
          <h5 className="font-display font-extrabold text-sm text-emerald-800 pb-2 border-b border-emerald-100 flex items-center justify-between">
            <span>🚀 START (เริ่มทำทันที)</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full">
              {cards.filter(c => c.category === 'start').length}
            </span>
          </h5>
          <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
            {cards.filter(c => c.category === 'start').map(c => (
              <div key={c.id} className="bg-white border border-emerald-100 p-2.5 rounded-lg shadow-sm flex items-start justify-between gap-1">
                <span className="text-xs text-gray-700 leading-relaxed font-sans">{c.text}</span>
                <button
                  type="button"
                  id={`btn-delete-${c.id}`}
                  onClick={() => { onDeleteCard(c.id); playChimeSound('pop'); }}
                  className="text-gray-300 hover:text-rose-500 p-0.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {cards.filter(c => c.category === 'start').length === 0 && (
              <p className="text-[11px] text-gray-400 text-center py-10">ยังไม่มีแผนบุกเบิกในบอร์ดนี้</p>
            )}
          </div>
        </div>

        {/* STOP COLUMN */}
        <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-4 flex flex-col h-70">
          <h5 className="font-display font-extrabold text-sm text-rose-800 pb-2 border-b border-rose-100 flex items-center justify-between">
            <span>🛑 STOP (หยุดพฤติกรรมนี้)</span>
            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full">
              {cards.filter(c => c.category === 'stop').length}
            </span>
          </h5>
          <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
            {cards.filter(c => c.category === 'stop').map(c => (
              <div key={c.id} className="bg-white border border-rose-100 p-2.5 rounded-lg shadow-sm flex items-start justify-between gap-1">
                <span className="text-xs text-gray-700 leading-relaxed font-sans">{c.text}</span>
                <button
                  type="button"
                  id={`btn-delete-${c.id}`}
                  onClick={() => { onDeleteCard(c.id); playChimeSound('pop'); }}
                  className="text-gray-300 hover:text-rose-500 p-0.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {cards.filter(c => c.category === 'stop').length === 0 && (
              <p className="text-[11px] text-gray-400 text-center py-10">ยังไม่มีข้อยกเว้นที่บรรจุลงบอร์ด</p>
            )}
          </div>
        </div>

        {/* CONTINUE COLUMN */}
        <div className="bg-[#f2cc8f]/10 border border-[#f2cc8f]/30 rounded-xl p-4 flex flex-col h-70">
          <h5 className="font-display font-extrabold text-sm text-[#1c2722] pb-2 border-b border-[#f2cc8f]/30 flex items-center justify-between">
            <span>🌟 CONTINUE (ทำต่อไปให้เด่น)</span>
            <span className="bg-[#f2cc8f]/30 text-gray-900 text-[10px] px-1.5 py-0.5 rounded-full">
              {cards.filter(c => c.category === 'continue').length}
            </span>
          </h5>
          <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
            {cards.filter(c => c.category === 'continue').map(c => (
              <div key={c.id} className="bg-white border border-[#f2cc8f]/20 p-2.5 rounded-lg shadow-sm flex items-start justify-between gap-1">
                <span className="text-xs text-gray-700 leading-relaxed font-sans">{c.text}</span>
                <button
                  type="button"
                  id={`btn-delete-${c.id}`}
                  onClick={() => { onDeleteCard(c.id); playChimeSound('pop'); }}
                  className="text-gray-300 hover:text-rose-500 p-0.5 transition-colors animate-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {cards.filter(c => c.category === 'continue').length === 0 && (
              <p className="text-[11px] text-gray-400 text-center py-10 font-sans">ยังไม่มีทักษะสืบสานบรรจุลง</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
