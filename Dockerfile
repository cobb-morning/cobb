# 프로덕션 준비 완료된 Dockerfile for k8s 배포
# Python 3.11 Alpine 기반 이미지 사용 (보안성 및 경량화)
FROM python:3.11-alpine

# 빌드 인수 (캐시 무효화용)
ARG CACHEBUST=1

# 메타데이터 라벨
LABEL maintainer="DevOps Team"
LABEL description="Tableau Slack Daily Report Service"
LABEL version="1.0"

# 시스템 의존성 설치 (빌드 및 런타임 도구)
RUN apk add --no-cache \
    tzdata \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# 타임존 설정 (Asia/Seoul)
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 작업 디렉토리 설정 (프로젝트 이름 기반)
WORKDIR /workspace

# Python 환경 최적화
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=UTF-8 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 캐시 무효화를 위한 더미 명령
RUN echo "Cache bust: $(date)" > /tmp/cachebust

# 의존성 파일 복사 및 설치
COPY requirements.txt ./requirements.txt

# pip 업그레이드 및 의존성 설치
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일 복사
COPY slack .
COPY web_server.py .

# 실행 스크립트 생성
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting Tableau Slack Daily Report Service..."\n\
echo "Environment variables check:"\n\
echo "- TABLEAU_SERVER_URL: ${TABLEAU_SERVER_URL:-"Not set"}" \n\
echo "- TABLEAU_SITE_ID: ${TABLEAU_SITE_ID:-"Not set"}" \n\
echo "- SLACK_TEAM_NAME: ${SLACK_TEAM_NAME:-"Not set"}" \n\
echo "Starting Flask web server on port 8080..."\n\
python web_server.py\n\
' > /workspace/start.sh && chmod +x /workspace/start.sh

# 포트 8080 노출 (k8s manifest 요구사항)
EXPOSE 8080

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# 애플리케이션 실행
CMD ["/workspace/start.sh"]