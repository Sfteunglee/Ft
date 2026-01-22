
/**
 * [Data Models]
 * 애플리케이션 전체에서 사용되는 일관된 데이터 구조 정의
 */

// 사용자 프로필 정보
export interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  gender: '남성' | '여성' | '';
  isLoggedIn: boolean;
  preferences: string[];
}

// 근거 카드 정보 (추천 이유, 리뷰 요약, 리스크 등)
export interface EvidenceCard {
  placeId: string;
  reason: string;      // "이런 분들께 추천해요"
  reviewSummary: string; // 핵심 리뷰 요약
  risks?: string;      // 주의사항 (사람이 많아요 등)
  trustScore: number;  // 신뢰도 점수 (0-100)
}

// 여행 코스를 구성하는 각 개별 지점 정보
export interface CoursePoint {
  id: string;
  type: '식당' | '카페' | '놀거리' | '공연' | '숙박' | '선택 전';
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  reason?: string;
  evidence?: EvidenceCard;
}

// 저장된 최종 여행 코스 데이터
export interface SavedCourse {
  id: string;
  userId: string;
  title: string;
  points: CoursePoint[];
  totalBudget: string;
  createdAt: string;
  description: string;
}

// AI와 주고받는 메시지 객체
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isDecisionPoint?: boolean;
  evidenceCards?: EvidenceCard[]; // AI 응답 하단에 노출될 근거 카드 목록
  status?: 'analyzing' | 'searching' | 'generating' | 'done'; // 진행 단계
}

// 지도나 리스트에서 활용할 장소 마스터 데이터
export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  reviewSnippets: string[];
  lat: number;
  lng: number;
}
