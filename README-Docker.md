# Tableau Slack Daily Report Service - Docker 배포 가이드

## 📋 프로젝트 개요

Tableau 데이터를 Slack으로 자동 전송하는 Python 서비스입니다.
k8s 환경에서 8080 포트로 실행되며, Flask 웹 서버를 통해 헬스체크 및 수동 실행 기능을 제공합니다.

## 🐳 Docker 정보

### 이미지 정보
- **Base Image**: `python:3.11-alpine`
- **Port**: `8080`
- **WorkDir**: `/workspace`
- **User**: `root` (nginx 권한 문제 방지)

### 빌드된 파일 구조
```
/workspace/
├── slack                 # 메인 Python 스크립트
├── web_server.py        # Flask 웹 서버
├── requirements.txt     # Python 의존성
└── start.sh            # 실행 스크립트
```

## 🚀 k8s 배포 요구사항

### 필수 환경 변수
```yaml
env:
  - name: TABLEAU_SERVER_URL
    value: "https://tableau.kakaocorp.com"
  - name: TABLEAU_PAT_NAME
    valueFrom:
      secretKeyRef:
        name: tableau-secrets
        key: pat-name
  - name: TABLEAU_PAT_SECRET
    valueFrom:
      secretKeyRef:
        name: tableau-secrets
        key: pat-secret
  - name: TABLEAU_SITE_ID
    value: "Kakao_Mobility"
  - name: SLACK_BOT_TOKEN
    valueFrom:
      secretKeyRef:
        name: slack-secrets
        key: bot-token
  - name: SLACK_CHANNEL
    valueFrom:
      secretKeyRef:
        name: slack-secrets
        key: channel-id
  - name: SLACK_TEAM_NAME
    value: "CX 시너지팀"
```

### Deployment 설정
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tableau-slack-report
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tableau-slack-report
  template:
    metadata:
      labels:
        app: tableau-slack-report
    spec:
      containers:
      - name: tableau-slack-report
        image: your-registry/tableau-slack-report:latest
        ports:
        - containerPort: 8080
        env:
          # 위의 환경 변수 설정
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
```

### Service 설정
```yaml
apiVersion: v1
kind: Service
metadata:
  name: tableau-slack-report-service
spec:
  selector:
    app: tableau-slack-report
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

## 🔧 로컬 테스트

### Docker Compose 사용
```bash
# 환경 변수 설정
export TABLEAU_PAT_NAME="your-pat-name"
export TABLEAU_PAT_SECRET="your-pat-secret"
export SLACK_BOT_TOKEN="xoxb-your-token"
export SLACK_CHANNEL="your-channel-id"

# 서비스 시작
docker-compose up -d

# 헬스체크
curl http://localhost:8080/health

# 수동 실행
curl -X POST http://localhost:8080/trigger

# 로그 확인
docker-compose logs -f
```

### 직접 Docker 빌드/실행
```bash
# 이미지 빌드
docker build -t tableau-slack-report .

# 컨테이너 실행
docker run -d \
  --name tableau-slack-report \
  -p 8080:8080 \
  -e TABLEAU_PAT_NAME="your-pat-name" \
  -e TABLEAU_PAT_SECRET="your-pat-secret" \
  -e SLACK_BOT_TOKEN="xoxb-your-token" \
  -e SLACK_CHANNEL="your-channel-id" \
  tableau-slack-report
```

## 🔍 API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/health` | GET | k8s 헬스체크 (환경 변수 검증 포함) |
| `/status` | GET | 서비스 상태 및 메트릭 |
| `/trigger` | POST | 수동 리포트 실행 |
| `/` | GET | 서비스 정보 |

### 헬스체크 응답 예시
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "tableau-slack-report"
}
```

## 🛠 트러블슈팅

### 일반적인 문제들

1. **환경 변수 누락**
   ```bash
   # 헬스체크 실패 시 확인
   curl http://localhost:8080/health
   # 응답에서 missing environment variables 확인
   ```

2. **Tableau 연결 실패**
   ```bash
   # 상태 확인
   curl http://localhost:8080/status
   # last_execution_status 확인
   ```

3. **Slack 전송 실패**
   ```bash
   # 로그 확인
   docker logs tableau-slack-report
   ```

### 로그 확인 방법
```bash
# Docker Compose
docker-compose logs -f tableau-slack-report

# 직접 실행
docker logs -f tableau-slack-report

# k8s
kubectl logs -f deployment/tableau-slack-report
```

## 📝 주의사항

1. **환경 변수 보안**: 민감한 정보는 반드시 k8s Secret으로 관리
2. **네트워크 접근**: Tableau 서버와 Slack API에 대한 아웃바운드 접근 필요
3. **타임존**: 컨테이너는 Asia/Seoul 타임존으로 설정됨
4. **로그 수집**: 표준 출력으로 로그 출력하므로 k8s 로그 수집 가능

## 📞 지원

이슈 발생 시 다음 정보와 함께 문의:
- 컨테이너 로그
- `/status` 엔드포인트 응답
- 환경 변수 설정 상태 (민감한 정보 제외)