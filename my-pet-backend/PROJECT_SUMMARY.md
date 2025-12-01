# 🐾 PetMedical.AI 프로젝트 현황 요약

## 📋 프로젝트 개요

**목적**: 24시간 반려동물 진료 접근성 문제 해결을 위한 AI 기반 멀티 에이전트 진단 시스템

**현재 상태**: ✅ 핵심 기능 구현 완료, 실제 AI API 연동 완료

**기술 스택**: React 18 + Vite, LocalStorage (백엔드 없음)

---

## ✨ 구현된 주요 기능

### 1. 반려동물 프로필 관리 ✅
- 여러 마리 반려동물 등록 가능
- 프로필 정보: 이름, 종류(개/고양이), 품종, 생년월일, 성별, 중성화 여부, 거주 지역
- 프로필 목록 화면
- 프로필 선택 및 전환
- 로컬 스토리지에 자동 저장

### 2. 증상 입력 시스템 ✅
- 텍스트 입력 (증상 설명)
- 사진 업로드 (다중 이미지 지원)
- 이미지 미리보기 및 삭제
- 반려동물 선택 드롭다운

### 3. 멀티 에이전트 AI 진료 시스템 ✅
**실제 AI API 연동 완료**

4명의 전문 AI 에이전트가 순차적으로 협업:

#### CS Agent (상담 간호사) 💬
- **모델**: Gemini 1.5 Flash
- **역할**: 증상 접수, 환자 정보 확인, 응급도 1차 판단
- **특징**: 빠르고 저렴, 문진/요약 특화

#### Information Agent (정보수집가) 🔍
- **역할**: 증상 정보 수집, 이미지 분석, 유사 케이스 검색
- **구현**: 현재는 시뮬레이션 (향후 실제 API 연동 가능)

#### Medical Agent (전문 수의사) 👨‍⚕️
- **모델**: GPT-4o (환경 변수로 변경 가능)
- **역할**: 종합 진단, 위험도 평가, 응급 여부 판단, 치료 방안 제시
- **특징**: 의학 reasoning 최강, 정확한 진단

#### Ops Agent (데이터 처리자) 💾
- **모델**: Claude 3.5 Sonnet
- **역할**: 진료 기록 구조화, 진단서 템플릿 생성, JSON 포맷팅
- **특징**: JSON 구조화/기록 최강, 안정성

#### Care Agent (케어 플래너) 💊
- **모델**: Gemini 1.5 Pro (환경 변수로 변경 가능)
- **역할**: 홈케어 가이드 작성, 치료 방법 상세 설명
- **특징**: 홈케어 가이드 작성 특화

### 진료 과정 시각화 ✅
- 실시간 에이전트별 메시지 스트림
- 진행 단계 표시 (접수 → 분석 → 진단 → 완료)
- 애니메이션 효과 (pulse, slideIn)
- 타이핑 인디케이터

### 4. 대화형 진료 기능 ✅
- AI 의사가 추가 질문 가능
- 사용자가 AI 의사에게 질문 가능
- 실시간 채팅 인터페이스
- 대화 히스토리 관리

### 5. 진단서 생성 및 표시 ✅
- 진단 결과 (주요 진단명, 확률)
- 응급도 표시 (🟢 경미 / 🟡 보통 / 🔴 응급)
- 즉시 조치 사항
- 병원 방문 권장 여부 및 시급성
- 상세 설명
- 로컬 스토리지에 자동 저장

### 6. 직접 치료하기 기능 ✅
- 상세 치료 리포트
- 단계별 조치 가이드
- 예상 회복 기간
- 주의사항 및 금지사항
- 일일 체크리스트

### 7. 마이페이지 ✅
- **반려동물 탭**: 등록된 반려동물 목록 및 관리
- **진료 기록 탭**: 과거 진단 기록 목록
- 진단서 상세 보기
- 날짜별 정렬
- 응급도별 색상 표시

### 8. 병원 예약 기능 (UI만 구현)
- 병원 예약하기 버튼
- 기본 UI 구조 (실제 카카오맵 API 연동은 미구현)

---

## 🧠 멀티 에이전트 구조 상세

### 에이전트 실행 순서
1. **CS Agent** (Gemini Flash) → 증상 접수 및 요약
2. **Information Agent** → 정보 수집 (현재 시뮬레이션)
3. **Medical Agent** (GPT-4o) → 종합 진단 수행
4. **Ops Agent** (Claude 3.5 Sonnet) → 진단서 구조화
5. **Care Agent** (Gemini Pro) → 홈케어 가이드 생성

### 각 에이전트별 API 연동
- **CS Agent**: `src/services/ai/csAgent.js` - Gemini API 호출
- **Medical Agent**: `src/services/ai/medicalAgent.js` - OpenAI API 호출
- **Ops Agent**: `src/services/ai/opsAgent.js` - Anthropic API 호출
- **Care Agent**: `src/services/ai/careAgent.js` - Gemini API 호출
- **Orchestrator**: `src/services/ai/agentOrchestrator.js` - 전체 흐름 관리

---

## 📁 프로젝트 구조

```
my-pet/
├── src/
│   ├── components/
│   │   └── MyPage.jsx                    # 마이페이지 컴포넌트
│   ├── services/
│   │   └── ai/
│   │       ├── csAgent.js                # CS Agent (Gemini Flash)
│   │       ├── medicalAgent.js           # Medical Agent (GPT-4o)
│   │       ├── opsAgent.js               # Ops Agent (Claude 3.5 Sonnet)
│   │       ├── careAgent.js              # Care Agent (Gemini Pro)
│   │       └── agentOrchestrator.js      # 멀티 에이전트 오케스트레이터
│   └── main.jsx                          # React 엔트리 포인트
├── App.jsx                               # 메인 앱 컴포넌트 (모든 화면 포함)
├── App.css                               # 스타일시트
├── index.html                            # HTML 템플릿
├── package.json                          # 의존성 관리
├── vite.config.js                        # Vite 설정
└── .env                                  # 환경 변수 (API 키)
```

---

## 🔧 기술 스택

### Frontend
- **React 18.2.0** - UI 프레임워크
- **Vite 5.0.8** - 빌드 도구 및 개발 서버
- **CSS3** - 스타일링 (커스텀 CSS, 그라데이션, 애니메이션)

### AI/ML APIs
- **Google Gemini API**
  - CS Agent: `gemini-1.5-flash`
  - Care Agent: `gemini-1.5-pro` (환경 변수로 변경 가능)
- **OpenAI API**
  - Medical Agent: `gpt-4o` (환경 변수 `VITE_OPENAI_MODEL`로 변경 가능)
- **Anthropic Claude API**
  - Ops Agent: `claude-3-5-sonnet-20241022`

### 데이터 저장
- **LocalStorage** - 반려동물 프로필 및 진료 기록 저장
  - 키: `petMedical_pets`, `petMedical_diagnoses`

---

## 🎯 주요 화면 및 플로우

### 화면 구조
1. **프로필 등록** (`registration`) - 첫 방문 시
2. **프로필 목록** (`profile-list`) - 여러 반려동물 관리
3. **대시보드** (`dashboard`) - 메인 화면
4. **증상 입력** (`symptom-input`) - 증상 입력
5. **AI 진료** (`diagnosis`) - 멀티 에이전트 진료 진행
6. **직접 치료하기** (`treatment`) - 홈케어 가이드
7. **병원 예약** (`hospital`) - 병원 찾기 (UI만)
8. **마이페이지** (`mypage`) - 반려동물 및 기록 관리
9. **진단서 보기** (`diagnosis-view`) - 저장된 진단서 상세

### 사용자 플로우
```
프로필 등록 → 대시보드 → 증상 입력 → AI 진료 → 진단서 확인
                                 ↓
                    직접 치료하기 / 병원 예약하기
                                 ↓
                          마이페이지에서 기록 확인
```

---

## 🔑 환경 변수 설정

`.env` 파일에 다음 변수들이 필요합니다:

```bash
# 필수 API 키
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key

# 선택사항: 모델 변경
VITE_OPENAI_MODEL=gpt-4o                    # Medical Agent용
VITE_GEMINI_CARE_MODEL=gemini-1.5-pro      # Care Agent용
```

---

## ✅ 완료된 기능

- [x] 반려동물 프로필 등록 및 관리
- [x] 증상 입력 (텍스트 + 사진)
- [x] 멀티 에이전트 AI 진료 시스템 (실제 API 연동)
- [x] 대화형 진료 (AI 질문/사용자 질문)
- [x] 진단서 생성 및 저장
- [x] 직접 치료하기 가이드
- [x] 마이페이지 (반려동물 관리 + 진료 기록)
- [x] 로컬 스토리지 데이터 저장
- [x] 반응형 디자인 (모바일 중심)

---

## 🚧 미구현 기능

- [ ] 병원 추천 (카카오맵 API 연동)
- [ ] 병원 예약 기능 (실제 예약 시스템)
- [ ] 음성 입력 기능
- [ ] PDF 업로드 및 파싱
- [ ] 이전 진료 기록 불러오기
- [ ] 백엔드 서버 연동
- [ ] 사용자 인증 시스템

---

## 📊 현재 코드 상태

### 메인 파일
- **App.jsx**: 약 1,400줄, 모든 화면 컴포넌트 포함
- **App.css**: 약 1,500줄, 모든 스타일 포함
- **단일 파일 구조**: 모든 컴포넌트가 App.jsx에 포함되어 있음

### AI 서비스
- 각 에이전트별 독립적인 서비스 파일
- 에러 처리 및 Fallback 로직 포함
- 환경 변수 기반 모델 선택

### 데이터 관리
- LocalStorage 기반
- JSON 형식으로 저장
- 자동 저장 및 불러오기

---

## 🎨 UI/UX 특징

- 그라데이션 배경 (보라색 계열)
- 카드 기반 레이아웃
- 부드러운 애니메이션
- 모바일 우선 반응형 디자인
- 직관적인 네비게이션
- 실시간 피드백 (로딩, 타이핑 인디케이터)

---

## 🚀 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

브라우저에서 `http://localhost:5173` 접속

---

## 📝 주요 특징

1. **멀티 에이전트 구조**: 4명의 전문 AI가 각자의 역할 수행
2. **최적화된 모델 선택**: 각 에이전트별로 가장 적합한 AI 모델 사용
3. **실시간 대화형**: AI와 실시간 질문/답변 가능
4. **로컬 기반**: 백엔드 없이 LocalStorage로 동작
5. **완전한 프론트엔드**: React 단일 페이지 애플리케이션

---

## 🔄 다음 단계 제안

1. 병원 추천 기능 구현 (카카오맵 API)
2. 음성 입력 기능 추가
3. 컴포넌트 분리 (App.jsx를 여러 파일로 분리)
4. 백엔드 서버 구축 (선택사항)
5. 사용자 인증 시스템 (선택사항)

---

**마지막 업데이트**: 2025년 1월
**프로젝트 상태**: ✅ 핵심 기능 완료, 실제 AI API 연동 완료

