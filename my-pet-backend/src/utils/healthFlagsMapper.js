// AI 진단 결과를 healthFlags로 변환하는 함수

/**
 * AI 진단 결과를 healthFlags로 매핑
 * @param {Object} aiResult - AI 진단 결과 객체
 * @returns {Object} healthFlags 객체
 */
export function mapDiagnosisToHealthFlags(aiResult) {
  const flags = {
    earIssue: false,
    digestionIssue: false,
    skinIssue: false,
    energyLevel: 0.8,
    fever: false,
  };

  // 진단 결과 텍스트를 모두 합쳐서 분석
  const textBlob = `
    ${aiResult.summary || ""}
    ${aiResult.description || ""}
    ${aiResult.diagnosis || ""}
    ${(aiResult.possibleDiseases || []).map(d => d.name || d).join(" ")}
    ${(aiResult.differentialDiagnosis || []).join(" ")}
    ${aiResult.reasoning || ""}
  `;

  const lower = textBlob.toLowerCase();

  // 아주 단순한 규칙 매핑 (해커톤용)
  if (lower.includes("귀") || lower.includes("이염") || lower.includes("ear") || lower.includes("otitis")) {
    flags.earIssue = true;
  }

  if (
    lower.includes("설사") ||
    lower.includes("장염") ||
    lower.includes("구토") ||
    lower.includes("소화기") ||
    lower.includes("diarrhea") ||
    lower.includes("vomit") ||
    lower.includes("digestion")
  ) {
    flags.digestionIssue = true;
  }

  if (
    lower.includes("피부") ||
    lower.includes("발진") ||
    lower.includes("가려움") ||
    lower.includes("skin") ||
    lower.includes("rash") ||
    lower.includes("itch")
  ) {
    flags.skinIssue = true;
  }

  if (
    lower.includes("열") ||
    lower.includes("발열") ||
    lower.includes("고열") ||
    lower.includes("fever") ||
    lower.includes("temperature")
  ) {
    flags.fever = true;
  }

  // 위험도에 따라 에너지 레벨 설정
  const riskLevel = aiResult.riskLevel || aiResult.emergency || "low";
  if (riskLevel === "high" || riskLevel === "High" || riskLevel === "Emergency") {
    flags.energyLevel = 0.2;
  } else if (riskLevel === "medium" || riskLevel === "Moderate") {
    flags.energyLevel = 0.5;
  } else {
    flags.energyLevel = 0.8;
  }

  // triage_score가 있으면 그것도 반영
  if (aiResult.triage_score !== undefined) {
    flags.energyLevel = Math.max(0.1, 1 - (aiResult.triage_score / 5));
  }

  return flags;
}

/**
 * health_flags 형식을 healthFlags 형식으로 변환
 * (snake_case -> camelCase)
 */
export function convertHealthFlagsFormat(healthFlags) {
  if (!healthFlags) return {};
  
  return {
    earIssue: healthFlags.ear_issue || healthFlags.earIssue || false,
    digestionIssue: healthFlags.digestion_issue || healthFlags.digestionIssue || false,
    skinIssue: healthFlags.skin_issue || healthFlags.skinIssue || false,
    energyLevel: healthFlags.energy_level !== undefined 
      ? healthFlags.energy_level 
      : healthFlags.energyLevel !== undefined 
      ? healthFlags.energyLevel 
      : 0.8,
    fever: healthFlags.fever || false
  };
}

