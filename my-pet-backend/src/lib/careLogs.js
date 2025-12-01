// 일상 케어 로그 관리 유틸리티

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

/**
 * 특정 날짜의 케어 로그 불러오기
 */
export function loadDailyLog(petId, date) {
  const key = `carelog_${petId}`;
  const all = JSON.parse(localStorage.getItem(key) || "{}");
  return all[date] || {
    date,
    mealCount: 0,
    waterCount: 0,
    walkCount: 0,
    poopCount: 0,
    weight: "",
    note: "",
  };
}

/**
 * 케어 로그 저장
 */
export function saveDailyLog(petId, log) {
  const key = `carelog_${petId}`;
  const all = JSON.parse(localStorage.getItem(key) || "{}");
  all[log.date] = log;
  localStorage.setItem(key, JSON.stringify(all));
}

/**
 * 모든 케어 로그 불러오기
 */
export function loadAllCareLogs(petId) {
  const key = `carelog_${petId}`;
  const all = JSON.parse(localStorage.getItem(key) || "{}");
  // all = { '2025-11-28': {..}, '2025-11-27': {..}, ... }
  return all;
}

/**
 * 최근 N일 케어 로그 가져오기
 */
export function getRecentCareLogs(petId, days = 7) {
  const all = loadAllCareLogs(petId);
  const dates = Object.keys(all).sort(); // 오름차순
  const recentDates = dates.slice(-days);
  return recentDates.map((d) => all[d]).filter(log => log && log.date);
}

