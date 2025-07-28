#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask Web Server for k8s Deployment
Tableau Slack Daily Report Service

This web server provides:
- Health check endpoint (/health)
- Status endpoint (/status) 
- Manual trigger endpoint (/trigger)
- Root endpoint (/) with service information
"""

from flask import Flask, jsonify, request
import os
import sys
import threading
import time
from datetime import datetime
import subprocess
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Flask 앱 생성
app = Flask(__name__)

# 서비스 상태 관리
service_status = {
    "status": "healthy",
    "last_execution": None,
    "last_execution_status": None,
    "uptime_start": datetime.now().isoformat(),
    "version": "1.0.0"
}

def run_slack_script():
    """메인 Slack 스크립트 실행"""
    try:
        logger.info("Executing slack script...")
        result = subprocess.run(
            [sys.executable, "slack"],
            capture_output=True,
            text=True,
            timeout=300  # 5분 타임아웃
        )
        
        service_status["last_execution"] = datetime.now().isoformat()
        
        if result.returncode == 0:
            service_status["last_execution_status"] = "success"
            logger.info("Slack script executed successfully")
        else:
            service_status["last_execution_status"] = "error"
            logger.error(f"Slack script failed: {result.stderr}")
            
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        service_status["last_execution"] = datetime.now().isoformat()
        service_status["last_execution_status"] = "timeout"
        logger.error("Slack script execution timed out")
        return False
    except Exception as e:
        service_status["last_execution"] = datetime.now().isoformat()
        service_status["last_execution_status"] = "error"
        logger.error(f"Error executing slack script: {str(e)}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """k8s 헬스체크 엔드포인트"""
    try:
        # 환경 변수 체크
        required_vars = ['TABLEAU_PAT_NAME', 'TABLEAU_PAT_SECRET', 'SLACK_BOT_TOKEN', 'SLACK_CHANNEL']
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        
        if missing_vars:
            return jsonify({
                "status": "unhealthy",
                "error": f"Missing environment variables: {', '.join(missing_vars)}",
                "timestamp": datetime.now().isoformat()
            }), 503
            
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "service": "tableau-slack-report"
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 503

@app.route('/status', methods=['GET'])
def status():
    """서비스 상태 확인 엔드포인트"""
    uptime = datetime.now() - datetime.fromisoformat(service_status["uptime_start"])
    
    return jsonify({
        **service_status,
        "uptime_seconds": int(uptime.total_seconds()),
        "environment_variables": {
            "TABLEAU_SERVER_URL": os.environ.get('TABLEAU_SERVER_URL', 'Not set'),
            "TABLEAU_SITE_ID": os.environ.get('TABLEAU_SITE_ID', 'Not set'),
            "SLACK_TEAM_NAME": os.environ.get('SLACK_TEAM_NAME', 'Not set'),
            "required_vars_set": len([var for var in ['TABLEAU_PAT_NAME', 'TABLEAU_PAT_SECRET', 'SLACK_BOT_TOKEN', 'SLACK_CHANNEL'] if os.environ.get(var)])
        }
    }), 200

@app.route('/trigger', methods=['POST'])
def trigger_report():
    """수동으로 리포트 실행 트리거"""
    try:
        logger.info("Manual trigger requested")
        success = run_slack_script()
        
        if success:
            return jsonify({
                "status": "success",
                "message": "Report executed successfully",
                "timestamp": datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Report execution failed",
                "timestamp": datetime.now().isoformat()
            }), 500
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/', methods=['GET'])
def root():
    """루트 엔드포인트 - 서비스 정보"""
    return jsonify({
        "service": "Tableau Slack Daily Report Service",
        "version": "1.0.0",
        "description": "Automated daily report service for Tableau data to Slack",
        "endpoints": {
            "/health": "Health check for k8s",
            "/status": "Service status and metrics",
            "/trigger": "Manual report trigger (POST)",
            "/": "Service information"
        },
        "timestamp": datetime.now().isoformat()
    }), 200

@app.errorhandler(404)
def not_found(error):
    """404 에러 핸들러"""
    return jsonify({
        "error": "Not Found",
        "message": "The requested endpoint does not exist",
        "available_endpoints": ["/", "/health", "/status", "/trigger"],
        "timestamp": datetime.now().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """500 에러 핸들러"""
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "timestamp": datetime.now().isoformat()
    }), 500

def scheduled_task():
    """백그라운드에서 실행되는 스케줄된 작업 (필요시 활성화)"""
    # 현재는 수동 실행만 지원하지만, 필요시 여기에 스케줄링 로직 추가 가능
    pass

if __name__ == '__main__':
    # 환경 변수 확인
    required_vars = ['TABLEAU_PAT_NAME', 'TABLEAU_PAT_SECRET', 'SLACK_BOT_TOKEN', 'SLACK_CHANNEL']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    
    if missing_vars:
        logger.warning(f"Missing environment variables: {', '.join(missing_vars)}")
        logger.warning("Service will start but may not function properly until variables are set")
    
    logger.info("Starting Tableau Slack Daily Report Web Server...")
    logger.info(f"Server will be available at http://0.0.0.0:8080")
    logger.info(f"Health check endpoint: http://0.0.0.0:8080/health")
    
    # Flask 앱 실행 (k8s 환경에 맞게 8080 포트, 모든 인터페이스에서 접근 가능)
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=False,
        threaded=True
    )