// Information Agent - 정보 수집가 (시뮬레이션)
import { COMMON_CONTEXT } from './commonContext';

export const callInformationAgent = async (petData, symptomData, csSummary) => {
  // 현재는 시뮬레이션, 나중에 실제 API 연동 가능
  const prompt = `${COMMON_CONTEXT}

당신은 "Information Agent (정보 수집가)"입니다.

[역할]
- 다른 에이전트들이 참고할 수 있도록, 비구조화된 입력에서 구조화된 정보와 힌트를 뽑아냅니다.
- 실제 외부 API 호출, 웹 검색, 이미지 분석은 지금은 "시뮬레이션"으로만 처리합니다.
- 유사 케이스, 이전 진료 기록, 증상 키워드, 의심 질환 키워드를 정리합니다.

[입력]
- cs_summary: CS Agent가 만든 요약 결과(JSON)
- pet_profile: 반려동물 정보
- user_description: 원본 보호자 증상 설명

반려동물 정보:
- 이름: ${petData.petName}
- 종류: ${petData.species === 'dog' ? '개' : '고양이'}
- 품종: ${petData.breed || '미등록'}

CS Agent 요약:
${JSON.stringify(csSummary, null, 2)}

원본 증상 설명:
${symptomData.symptomText || '증상 정보 없음'}

[출력 형식 - JSON ONLY]

{
  "symptom_keywords": ["짧은 키워드 형태의 증상 1", "증상 2"],
  "body_part_focus": ["귀", "피부", "소화기", "호흡기", "눈", "관절/다리" 중 집중해야 할 부위 리스트],
  "severity_hint": "low | medium | high 중 하나",
  "possible_categories": ["피부질환", "귀질환", "소화기질환", "호흡기질환", "눈질환", "근골격", "행동/스트레스" 등 질환 카테고리 키워드],
  "related_past_cases_summary": "과거 진료 기록 중 이번 케이스와 관련 있어 보이는 내용을 한 문단으로 요약 (없으면 빈 문자열)",
  "notes_for_medical_agent": "Medical Agent가 진단에 참고할 만한 포인트를 한국어로 2~4문장으로 정리"
}

규칙:
- 외부 API나 실제 검색을 한 것처럼 구체적인 수치/병원명 등을 지어내지 마세요.
- 대신 '유사 케이스가 많음/적음' 정도의 뉘앙스만 간단히 언급할 수 있습니다.`;

  // 시뮬레이션: 간단한 규칙 기반 분석
  const symptomText = (symptomData.symptomText || '').toLowerCase();
  const keywords = [];
  const bodyParts = [];
  const categories = [];
  
  if (symptomText.includes('귀') || symptomText.includes('이염')) {
    keywords.push('귀 문제');
    bodyParts.push('귀');
    categories.push('귀질환');
  }
  if (symptomText.includes('설사') || symptomText.includes('구토') || symptomText.includes('배변')) {
    keywords.push('소화기 문제');
    bodyParts.push('소화기');
    categories.push('소화기질환');
  }
  if (symptomText.includes('피부') || symptomText.includes('발진') || symptomText.includes('가려움')) {
    keywords.push('피부 문제');
    bodyParts.push('피부');
    categories.push('피부질환');
  }
  if (symptomText.includes('기침') || symptomText.includes('호흡')) {
    keywords.push('호흡기 문제');
    bodyParts.push('호흡기');
    categories.push('호흡기질환');
  }
  
  const severityHint = csSummary?.first_urgency_assessment === 'emergency' || csSummary?.first_urgency_assessment === 'high' 
    ? 'high' 
    : csSummary?.first_urgency_assessment === 'moderate' 
    ? 'medium' 
    : 'low';
  
  return {
    json: {
      symptom_keywords: keywords.length > 0 ? keywords : ['일반 증상'],
      body_part_focus: bodyParts.length > 0 ? bodyParts : ['기타'],
      severity_hint: severityHint,
      possible_categories: categories.length > 0 ? categories : ['일반 질환'],
      related_past_cases_summary: '',
      notes_for_medical_agent: `증상 패턴 분석 완료. ${keywords.join(', ')} 관련 증상이 확인되었습니다. Medical Agent의 종합 진단을 기다립니다.`
    },
    message: `증상 정보 수집 완료.\n${symptomData.images?.length > 0 ? '📷 이미지 분석: 증상 부위 확인 중...\n' : ''}🔎 유사 케이스 검색: 데이터베이스 검색 중...\n📋 이전 진료 기록: 관련 기록 확인 중...\n📊 증상 패턴 분석: AI 모델 분석 중...\n\n→ 분석 완료. Veterinarian Agent에게 전달합니다.`
  };
};

