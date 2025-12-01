# 🐾 PetMedical.AI - 반려동물 AI 진료 시스템

24시간 반려동물 진료 접근성 문제 해결을 위한 AI 기반 멀티 에이전트 진단 시스템

## ✨ 주요 기능

- **멀티 에이전트 AI 진료**: 4명의 전문 AI가 협업하여 정확한 진단
- **반려동물 프로필 관리**: 여러 마리 반려동물 등록 및 관리
- **증상 입력**: 텍스트, 사진, 음성 등 다양한 방식
- **실시간 대화형 진료**: AI 의사와 실시간 질문/답변
- **진단서 생성**: 상세한 진단 결과 및 치료 가이드
- **마이페이지**: 반려동물 관리 및 진료 기록 확인

## 🧠 멀티 에이전트 구조

각 에이전트는 최적화된 AI 모델을 사용합니다:

| 에이전트 | 역할 | 사용 모델 | 이유 |
|---------|------|----------|------|
| **CS Agent** | 상담 간호사 | **Gemini 1.5 Flash** | 빠르고 저렴, 문진/요약 특화 |
| **Medical Agent** | 전문 수의사 | **GPT-4o** (환경 변수로 변경 가능) | 의학 reasoning 최강, 정확한 진단 |
| **Ops Agent** | 데이터 처리자 | **Claude 3.5 Sonnet** | JSON 구조화/기록 최강, 안정성 |
| **Care Agent** | 케어 플래너 | **Gemini 1.5 Pro** (환경 변수로 변경 가능) | 홈케어 가이드 작성 특화 |

### 모델 선택 가이드

**Medical Agent (수의사)**: 
- `gpt-4o` (기본값, 권장) - 최신 모델, 비용 대비 성능 우수
- `gpt-4-turbo` - 빠른 응답
- `gpt-4` - 안정적인 성능

**Care Agent (케어 플래너)**:
- `gemini-1.5-pro` (기본값) - 상세한 가이드 작성
- `gemini-1.5-flash` - 빠른 응답, 비용 절감

## 🚀 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 API 키를 설정하세요:

```bash
# AI API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI Model (Medical Agent용)
# gpt-4o (기본값, 권장), gpt-4-turbo, gpt-4 등
VITE_OPENAI_MODEL=gpt-4o

# Gemini Care Model (Care Agent용, 선택사항)
# gemini-1.5-pro (기본값), gemini-1.5-flash (빠르고 저렴)
VITE_GEMINI_CARE_MODEL=gemini-1.5-pro
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 📋 API 키 발급 방법

### Gemini API (Google AI Studio)
1. https://aistudio.google.com/ 접속
2. API 키 생성
3. `.env` 파일에 `VITE_GEMINI_API_KEY` 설정

### OpenAI API
1. https://platform.openai.com/ 접속
2. API Keys 메뉴에서 키 생성
3. `.env` 파일에 `VITE_OPENAI_API_KEY` 설정

### Anthropic API (Claude)
1. https://console.anthropic.com/ 접속
2. API Keys 메뉴에서 키 생성
3. `.env` 파일에 `VITE_ANTHROPIC_API_KEY` 설정

## 🎯 사용 방법

1. **반려동물 등록**: 첫 방문 시 반려동물 정보 입력
2. **증상 입력**: 대시보드에서 "증상이 있어요" 클릭 후 증상 입력
3. **AI 진료**: 4명의 AI 에이전트가 순차적으로 진료 수행
4. **대화형 상담**: AI 의사와 실시간 질문/답변
5. **진단서 확인**: 진단 결과 및 치료 가이드 확인
6. **마이페이지**: 반려동물 관리 및 진료 기록 확인

## 📁 프로젝트 구조

```
my-pet/
├── src/
│   ├── components/
│   │   └── MyPage.jsx          # 마이페이지 컴포넌트
│   ├── services/
│   │   └── ai/
│   │       ├── csAgent.js      # CS Agent (Gemini Flash)
│   │       ├── medicalAgent.js # Medical Agent (GPT-4.1/5.1)
│   │       ├── opsAgent.js     # Ops Agent (Claude 3.5 Sonnet)
│   │       ├── careAgent.js    # Care Agent (Gemini Pro)
│   │       └── agentOrchestrator.js # 멀티 에이전트 오케스트레이터
│   └── main.jsx
├── App.jsx                      # 메인 앱 컴포넌트
├── App.css                      # 스타일
└── package.json
```

## 🔧 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **Gemini API** - CS Agent, Care Agent
- **OpenAI API** - Medical Agent
- **Anthropic API** - Ops Agent
- **LocalStorage** - 데이터 저장

## 📝 라이센스

MIT

