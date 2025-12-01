import { useState, useEffect } from 'react';

const DAILY_LOG_KEY = 'petMedical_dailyLogs';

const getDailyLogs = (petId) => {
  try {
    const allLogs = JSON.parse(localStorage.getItem(DAILY_LOG_KEY) || '{}');
    return allLogs[petId] || [];
  } catch {
    return [];
  }
};

const saveDailyLog = (petId, log) => {
  try {
    const allLogs = JSON.parse(localStorage.getItem(DAILY_LOG_KEY) || '{}');
    if (!allLogs[petId]) allLogs[petId] = [];
    
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = allLogs[petId].findIndex(l => l.date === today);
    
    if (existingIndex >= 0) {
      allLogs[petId][existingIndex] = { ...allLogs[petId][existingIndex], ...log, date: today };
    } else {
      allLogs[petId].push({ ...log, date: today });
    }
    
    localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(allLogs));
    return true;
  } catch {
    return false;
  }
};

export function DailyCareTracker({ petData, onLogUpdate }) {
  const [todayLog, setTodayLog] = useState({
    food_count: 0,
    walk_count: 0,
    water_count: 0,
    poop_count: 0,
    activity_level: 5,
    weight: null,
    notes: ''
  });

  useEffect(() => {
    if (!petData) return;
    
    const logs = getDailyLogs(petData.id);
    const today = new Date().toISOString().split('T')[0];
    const todayData = logs.find(l => l.date === today);
    
    if (todayData) {
      setTodayLog(todayData);
    }
  }, [petData]);

  const handleIncrement = (field) => {
    const newValue = (todayLog[field] || 0) + 1;
    updateLog({ [field]: newValue });
  };

  const updateLog = (updates) => {
    if (!petData) return;
    
    const newLog = { ...todayLog, ...updates };
    setTodayLog(newLog);
    saveDailyLog(petData.id, newLog);
    
    if (onLogUpdate) {
      onLogUpdate(newLog);
    }
  };

  if (!petData) return null;

  return (
    <div className="daily-care-tracker">
      <h3>📅 오늘의 케어 기록</h3>
      
      <div className="care-actions">
        <div className="care-action-item">
          <button className="care-btn" onClick={() => handleIncrement('food_count')}>
            🍽️ 밥 주기
          </button>
          <span className="care-count">{todayLog.food_count || 0}회</span>
        </div>
        
        <div className="care-action-item">
          <button className="care-btn" onClick={() => handleIncrement('water_count')}>
            💧 물 주기
          </button>
          <span className="care-count">{todayLog.water_count || 0}회</span>
        </div>
        
        <div className="care-action-item">
          <button className="care-btn" onClick={() => handleIncrement('walk_count')}>
            🚶 산책
          </button>
          <span className="care-count">{todayLog.walk_count || 0}회</span>
        </div>
        
        <div className="care-action-item">
          <button className="care-btn" onClick={() => handleIncrement('poop_count')}>
            💩 배변
          </button>
          <span className="care-count">{todayLog.poop_count || 0}회</span>
        </div>
      </div>
      
      <div className="care-inputs">
        <div className="input-group">
          <label>활동량 (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={todayLog.activity_level || 5}
            onChange={(e) => updateLog({ activity_level: parseInt(e.target.value) })}
          />
          <span>{todayLog.activity_level || 5}/10</span>
        </div>
        
        <div className="input-group">
          <label>체중 (kg)</label>
          <input
            type="number"
            step="0.1"
            placeholder="예: 5.2"
            value={todayLog.weight || ''}
            onChange={(e) => updateLog({ weight: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>
      </div>
    </div>
  );
}

export { getDailyLogs, saveDailyLog };

