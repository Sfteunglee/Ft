
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Navigation2, ArrowLeft } from 'lucide-react';

export const MapView = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1); // Default to Step 2 for Image 4 replication
  const [sheetOpen, setSheetOpen] = useState(false);

  const spots = [
    { id: '1', name: '조선대', transport: '15분(버스)', desc: '광주의 랜드마크 뷰와 로맨틱한 분위기', tags: ['#산책', '#야경'], img: 'https://images.unsplash.com/photo-1596436889106-be35c843f974?w=400' },
    { id: '2', name: '국립아시아문화전당 (ACC)', transport: '5분(도보)', desc: '광주의 문화 예술 복합 공간, 다양한 전시와 공연', tags: ['#예술', '#문화', '#전시', '#핫플'], img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400' },
    { id: '3', name: '동명동 카페거리', transport: '10분(도보)', desc: '세련된 한옥 카페와 소품샵이 많은 핫플레이스', tags: ['#카페', '#데이트'], img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
    { id: '4', name: '맛장소', transport: '종료', desc: '광주 로컬의 맛을 느낄 수 있는 숨은 맛집', tags: ['#맛집', '#로컬'], img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400' },
  ];

  const nextStep = () => setActiveStep(prev => (prev < spots.length - 1 ? prev + 1 : prev));
  const prevStep = () => setActiveStep(prev => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden font-['Inter']">

      {/* Real Map Simulation (Image 3/4) */}
      <div className="absolute inset-0 z-0 bg-[#E5E7EB]">
        <img
          src="https://media.wired.com/photos/59269770af0da22365359a68/master/w_2560%2Cc_limit/Google-Maps-Redesign.jpg"
          className="w-full h-full object-cover opacity-80"
          alt="map"
        />
        {/* Simulated Route Line (Blue) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg">
          <path
            d="M 100 500 L 200 400 L 350 450 L 500 300"
            fill="none"
            stroke="#0066FF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw"
          />
        </svg>

        {/* Markers (Image 3 style) */}
        {spots.map((s, i) => (
          <div
            key={s.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${i === activeStep ? 'z-50 scale-125' : 'z-10 opacity-70 scale-90'}`}
            style={{ top: `${60 - i * 15}%`, left: `${20 + i * 20}%` }}
            onClick={() => setActiveStep(i)}
          >
            <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center font-black ${i === activeStep ? 'bg-[#0066FF] text-white' : 'bg-white text-[#0066FF]'}`}>
              {i + 1}
            </div>
            <div className={`absolute top-full mt-2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap text-[10px] font-black border border-gray-100 ${i === activeStep ? 'text-[#0066FF]' : 'text-gray-400'}`}>
              {s.name}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Header */}
      <header className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        <button onClick={() => router.push('/')} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 active:scale-95 transition-all pointer-events-auto">
          <ArrowLeft size={24} />
        </button>
      </header>

      {/* Evidence Card & Bottom Sheet Integration (Image 3 Collapsed, Image 4 Expanded Style) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[3rem] transition-all duration-700 z-[200] ${sheetOpen ? 'h-[420px]' : 'h-[160px]'}`}>

        {/* Handle Bar */}
        <div className="w-full pt-4 pb-2 cursor-pointer flex justify-center" onClick={() => setSheetOpen(!sheetOpen)}>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="px-8 flex flex-col h-full overflow-hidden">
          {/* Collapsed Content (Image 3) */}
          {!sheetOpen && (
            <div className="flex items-center justify-between py-2 animate-fade-in">
              <div className="flex-1">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {activeStep + 1}. {spots[activeStep].name}
                  <span className="ml-3 text-gray-300 font-bold text-sm">| 다음 장소까지 {spots[activeStep].transport}</span>
                </h2>
              </div>
              <button className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Navigation2 size={24} fill="currentColor" />
              </button>
            </div>
          )}

          {/* Expanded Detailed Card (Image 4) */}
          {sheetOpen && (
            <div className="animate-fade-in space-y-6 pt-2">
              {/* Step Progress */}
              <div className="space-y-3">
                <span className="text-sm font-black text-gray-900 tracking-tight">단계 {activeStep + 1} / {spots.length}</span>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF] transition-all duration-700" style={{ width: `${((activeStep + 1) / spots.length) * 100}%` }} />
                </div>
              </div>

              {/* Detail Info */}
              <div className="flex gap-6 items-center">
                <span className="text-6xl font-black text-[#0066FF] opacity-80">{activeStep + 1}</span>
                <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-md shrink-0 ring-4 ring-gray-50">
                  <img src={spots[activeStep].img} className="w-full h-full object-cover" alt="place" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{spots[activeStep].name}</h3>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed mb-3 line-clamp-2">{spots[activeStep].desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {spots[activeStep].tags.map(t => (
                      <span key={t} className="text-[10px] font-black text-gray-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={prevStep} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#0066FF] transition-all active:scale-90"><ChevronLeft size={20} /></button>
                  <button onClick={nextStep} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#0066FF] transition-all active:scale-90"><ChevronRight size={20} /></button>
                </div>
              </div>

              <button className="w-full py-5 bg-[#0066FF] text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 mt-4 active:scale-[0.98] transition-all">
                상세 정보 및 경로 안내
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Padding Spacer */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white z-[150]" />
    </div>
  );
};
