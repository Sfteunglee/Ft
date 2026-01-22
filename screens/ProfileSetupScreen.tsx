
"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, ChevronRight, Sparkles } from 'lucide-react';

export const ProfileSetupScreen = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'guest';
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [age, setAge] = useState<string | null>(null);

    const ages = ['20대 이하', '20대', '30대', '40대', '50대 이상'];

    const handleComplete = () => {
        if (gender && age) {
            if (mode === 'google') {
                console.log('Google User: Profile saved to MongoDB (Simulated)');
                // 실제 고도화 시 localStorage나 전역 상태 관리(Zustand/Redux)에 저장
            } else {
                console.log('Guest: Temporary profile used for current session');
            }
            router.push('/survey');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col p-8 font-['Inter'] animate-fade-in transition-all">
            <div className="mt-12 mb-12">
                <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 mb-6">
                    <User className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight italic">
                    맞춤 여행을 위해<br />
                    <span className="text-[#0066FF]">기본 정보</span>를 알려주세요.
                </h1>
            </div>

            <div className="space-y-12">
                {/* Gender Selection */}
                <section className="space-y-4">
                    <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest px-1">성별 선택</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setGender('male')}
                            className={`flex-1 py-5 rounded-3xl font-bold transition-all border-2 ${gender === 'male' ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xl shadow-blue-100' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            남성
                        </button>
                        <button
                            onClick={() => setGender('female')}
                            className={`flex-1 py-5 rounded-3xl font-bold transition-all border-2 ${gender === 'female' ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xl shadow-blue-100' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            여성
                        </button>
                    </div>
                </section>

                {/* Age Selection */}
                <section className="space-y-4">
                    <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest px-1">연령대 선택</h3>
                    <div className="flex flex-wrap gap-3">
                        {ages.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAge(a)}
                                className={`px-6 py-4 rounded-3xl font-bold transition-all border-2 ${age === a ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="mt-auto pt-12">
                <button
                    onClick={handleComplete}
                    disabled={!gender || !age}
                    className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${gender && age ? 'bg-[#0066FF] text-white shadow-blue-100 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    설정 완료
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
