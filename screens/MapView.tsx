"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation2, ArrowLeft } from 'lucide-react';
import Script from 'next/script';

export const MapView = () => {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  // SRS 및 제공해주신 샘플 데이터를 기반으로 한 지점 설정
  const spots = [
    { id: '1', name: '조선대 장미원', lat: 35.1402, lng: 126.9298, transport: '10분(버스)', desc: '광주의 랜드마크 뷰와 로맨틱한 분위기', tags: ['#산책', '#야경'], img: 'https://images.unsplash.com/photo-1596436889106-be35c843f974?w=400' },
    { id: '2', name: '국립아시아문화전당 (ACC)', lat: 35.1465, lng: 126.9203, transport: '5분(도보)', desc: '광주의 문화 예술 복합 공간, 다양한 전시와 공연', tags: ['#예술', '#문화', '#전시', '#핫플'], img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400' },
    { id: '3', name: '동명동 카페거리', lat: 35.1492, lng: 126.9231, transport: '5분(도보)', desc: '세련된 한옥 카페와 소품샵이 많은 핫플레이스', tags: ['#카페', '#데이트'], img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
    { id: '4', name: '로컬 맛집 (동명동)', lat: 35.1510, lng: 126.9245, transport: '종료', desc: '광주 로컬의 맛을 느낄 수 있는 숨은 맛집', tags: ['#맛집', '#로컬'], img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400' },
  ];

  // 지도 초기화 함수 (Tmapv3 Vector JS 적용)
  const initMap = () => {
    if (typeof window === 'undefined' || !(window as any).Tmapv3 || mapInstance.current || !mapRef.current) return;

    const Tmapv3 = (window as any).Tmapv3;

    // 1. 지도 인스턴스 생성 (v3에서는 center에 LatLng 객체 전달)
    mapInstance.current = new Tmapv3.Map(mapRef.current, {
      center: new Tmapv3.LatLng(spots[0].lat, spots[0].lng),
      width: "100%",
      height: "100%",
      zoom: 15,
      zoomControl: false,
    });

    // 2. 마커 및 경로 데이터 생성
    const path: any[] = [];
    spots.forEach((spot, index) => {
      const position = new Tmapv3.LatLng(spot.lat, spot.lng);
      path.push(position);

      // v3 마커 생성
      new Tmapv3.Marker({
        position: position,
        map: mapInstance.current,
        label: `<div style="background:#0066FF; color:white; padding:4px 10px; border-radius:20px; font-weight:900; font-size:12px; border:2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">${index + 1}</div>`,
        title: spot.name
      });
    });

    // 3. 경로(Polyline) 그리기
    new Tmapv3.Polyline({
      path: path,
      strokeColor: "#0066FF",
      strokeWeight: 6,
      map: mapInstance.current,
    });
  };

  // 활성 단계 변경 시 지도 중심 이동
  useEffect(() => {
    if (mapInstance.current && (window as any).Tmapv3) {
      const Tmapv3 = (window as any).Tmapv3;
      mapInstance.current.setCenter(new Tmapv3.LatLng(spots[activeStep].lat, spots[activeStep].lng));
    }
  }, [activeStep]);

  const nextStep = () => setActiveStep(prev => (prev < spots.length - 1 ? prev + 1 : prev));
  const prevStep = () => setActiveStep(prev => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden font-['Inter']">
      {/* Tmap v3 Vector JS SDK 로드 */}
      <Script
        src={`https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=jPRzT6UeRD3htjZFhlTuP572ZxLGGTBK7a0M457h`}
        onLoad={initMap}
      />

      {/* Tmap Container (SRS REQ-07) */}
      <div
        ref={mapRef}
        id="map_div"
        className="absolute inset-0 z-0 bg-[#E5E7EB]"
        style={{ height: "100vh" }} // 화면 가득 채우기
      />

      {/* Floating Header */}
      <header className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        <button onClick={() => router.push('/')} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-400 pointer-events-auto">
          <ArrowLeft size={24} />
        </button>
      </header>

      {/* 여행 정보 카드 & 바텀 시트 (Mobile UI) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[3rem] transition-all duration-700 z-[200] ${sheetOpen ? 'h-[440px]' : 'h-[180px]'}`}>

        {/* Handle Bar */}
        <div className="w-full pt-4 pb-2 cursor-pointer flex justify-center" onClick={() => setSheetOpen(!sheetOpen)}>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="px-8 flex flex-col h-full overflow-hidden">
          {!sheetOpen ? (
            <div className="flex items-center justify-between py-4 animate-fade-in">
              <div className="flex-1">
                <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest mb-1 block">최적 경로 분석 완료</span>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {activeStep + 1}. {spots[activeStep].name}
                </h2>
                <span className="text-gray-300 font-bold text-sm">다음 장소까지 {spots[activeStep].transport}</span>
              </div>
              <button
                onClick={() => setSheetOpen(true)}
                className="w-14 h-14 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                <Navigation2 size={24} fill="currentColor" />
              </button>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6 pt-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 tracking-tight">단계 {activeStep + 1} / {spots.length}</span>
                  <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-3 py-1 rounded-full">Tmap 실시간 데이터</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF] transition-all duration-700" style={{ width: `${((activeStep + 1) / spots.length) * 100}%` }} />
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-md shrink-0">
                  <img src={spots[activeStep].img} className="w-full h-full object-cover" alt="place" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{spots[activeStep].name}</h3>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed mb-3 line-clamp-2">{spots[activeStep].desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {spots[activeStep].tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} disabled={activeStep === 0} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm disabled:opacity-30">이전</button>
                <button onClick={nextStep} disabled={activeStep === spots.length - 1} className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-2xl font-black text-sm disabled:opacity-30">다음 장소</button>
              </div>

              <button className="w-full py-5 bg-[#0066FF] text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 mt-2">
                상세 경로 안내 시작
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Spacer */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white z-[150]" />
    </div>
  );
};
