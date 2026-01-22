
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoursePoint, SavedCourse, Message, EvidenceCard } from "../types";

/**
 * [Knowledge Base / Mock RAG]
 * 외부 지식 검색(RAG)을 흉내내기 위한 광주 주요 명소 데이터셋
 */
const MOCK_KNOWLEDGE_BASE = [
  {
    id: "p1",
    name: "조선대 장미원",
    info: "장미원과 본관 뷰가 유명함. 밤 산책 코스로 인기.",
    reason: "광주 동구의 랜드마크 뷰와 로맨틱한 분위기를 동시에 즐길 수 있어요.",
    reviewSummary: "장미 시즌이 아니어도 본관 야경이 아름답다는 평이 많아요.",
    risks: "경사가 조금 있어 편한 신발을 추천해요.",
    trustScore: 92,
    keywords: ["산책", "대학교", "야경", "사진"]
  },
  {
    id: "p2",
    name: "국립아시아문화전당(ACC)",
    info: "아시아 최대 규모 문화시설. 하늘마당 피크닉 명소.",
    reason: "트렌디한 피크닉 문화와 예술 전시를 한 자리에서 경험할 수 있어요.",
    reviewSummary: "주말에는 하늘마당에 사람이 많으니 돗자리를 미리 준비하세요.",
    risks: "시설이 매우 넓어 동선을 미리 확인하는 것이 좋아요.",
    trustScore: 98,
    keywords: ["문화", "예술", "피크닉", "잔디밭"]
  },
  {
    id: "p3",
    name: "동명동 카페거리",
    info: "세련된 한옥 카페와 소품샵이 많음. 젊은 데이트 코스 1위.",
    reason: "광주에서 가장 힙한 카페들과 로컬 맛집들이 모여있어 실패가 없어요.",
    reviewSummary: "웨이팅이 있는 가게가 많으니 원격 줄서기 앱을 활용하세요.",
    risks: "주차가 매우 협소하므로 ACC 주차장을 이용하는 것이 팁!",
    trustScore: 85,
    keywords: ["카페", "데이트", "인스타그램", "맛집"]
  }
];

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    this.ai = new GoogleGenerativeAI("MOCK_KEY"); // 프론트엔드 시뮬레이션을 위해 Mock 처리
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async processRequest(input: string, onStatusChange?: (status: Message['status']) => void): Promise<Message> {
    // 1단계: 의도 분석 (시뮬레이션)
    onStatusChange?.('analyzing');
    await this.sleep(1500);

    // 2단계: 지식 검색 (시뮬레이션)
    onStatusChange?.('searching');
    const knowledge = MOCK_KNOWLEDGE_BASE.filter(item =>
      item.keywords.some(k => input.includes(k)) || input.includes(item.name)
    );
    await this.sleep(2000);

    // 3단계: 코스 구성 및 응답 생성 (시뮬레이션)
    onStatusChange?.('generating');
    await this.sleep(2000);

    const isPlanRequest = input.includes("코스") || input.includes("추천") || input.includes("여행");

    const evidenceCards: EvidenceCard[] = knowledge.map(k => ({
      placeId: k.id,
      reason: k.reason,
      reviewSummary: k.reviewSummary,
      risks: k.risks,
      trustScore: k.trustScore
    }));

    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: isPlanRequest
        ? `광주 동구 쪽 코스를 원하시는군요! ${knowledge.map(k => k.name).join(', ')}를 중심으로 한 감성 여행 코스를 준비해봤어요. 이대로 코스를 생성할까요?`
        : "네, 궁금하신 내용에 대해 정보를 찾아드릴게요! 어떤 장소에 대해 더 알고 싶으신가요?",
      isDecisionPoint: isPlanRequest,
      evidenceCards: evidenceCards,
      status: 'done'
    };
  }

  async saveCourse(course: SavedCourse): Promise<boolean> {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
    return true;
  }

  async getCourses(): Promise<SavedCourse[]> {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  }

  async deleteCourse(id: string): Promise<void> {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const filtered = courses.filter((c: any) => c.id !== id);
    localStorage.setItem('courses', JSON.stringify(filtered));
  }
}
