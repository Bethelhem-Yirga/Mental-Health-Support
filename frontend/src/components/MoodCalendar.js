import React from 'react';

function MoodCalendar({ moodEntries }) {
  // Color mapping for mood values (0-4)
  const getMoodColor = (moodValue) => {
    if (moodValue === undefined || moodValue === null) {
      return '#ebedf0'; // No data - light gray
    }
    
    switch(moodValue) {
      case 0: // 😊 Great
        return '#216e39'; // Dark green
      case 1: // 🙂 Good  
        return '#30a14e'; // Medium green
      case 2: // 😐 Okay
        return '#40c463'; // Light green
      case 3: // 😔 Low
        return '#9be9a8'; // Very light green
      case 4: // 😢 Very Low
        return '#ebedf0'; // Gray
      default:
        return '#ebedf0';
    }
  };
  
  const getMoodEmoji = (moodValue) => {
    switch(moodValue) {
      case 0: return '😊';
      case 1: return '🙂';
      case 2: return '😐';
      case 3: return '😔';
      case 4: return '😢';
      default: return '❓';
    }
  };
  
  const getMoodLabel = (moodValue) => {
    switch(moodValue) {
      case 0: return 'Great';
      case 1: return 'Good';
      case 2: return 'Okay';
      case 3: return 'Low';
      case 4: return 'Very Low';
      default: return 'No data';
    }
  };
  
  // Create mood map for quick lookup
  const moodMap = {};
  moodEntries.forEach(entry => {
    const dateKey = new Date(entry.date).toISOString().split('T')[0];
    moodMap[dateKey] = {
      value: entry.moodValue,
      label: entry.moodLabel,
      note: entry.note
    };
  });
  
  // Generate last 365 days (1 year of data)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const days = [];
  let currentDate = new Date(oneYearAgo);
  
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    days.push({
      date: new Date(currentDate),
      dateStr: dateStr,
      mood: moodMap[dateStr]
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Group by week for grid layout (53 weeks x 7 days)
  const weeks = [];
  let currentWeek = [];
  
  // Find first day of week (Sunday)
  const firstDay = new Date(days[0].date);
  const dayOfWeek = firstDay.getDay(); // 0 = Sunday
  for (let i = 0; i < dayOfWeek; i++) {
    currentWeek.push(null); // Empty cells for alignment
  }
  
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  // Add remaining days to last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }
  
  // Month labels for the heatmap
  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week.find(day => day !== null);
    if (firstDayOfWeek) {
      const month = firstDayOfWeek.date.getMonth();
      if (month !== lastMonth) {
        months.push({ month, weekIndex, monthName: firstDayOfWeek.date.toLocaleString('default', { month: 'short' }) });
        lastMonth = month;
      }
    }
  });
  
  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let streakCount = 0;
  
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].mood) {
      streakCount++;
      if (streakCount > longestStreak) longestStreak = streakCount;
    } else {
      currentStreak = streakCount;
      streakCount = 0;
    }
  }
  currentStreak = streakCount;
  
  // Calculate statistics
  const totalEntries = moodEntries.length;
  const averageMood = totalEntries > 0 
    ? (moodEntries.reduce((sum, e) => sum + e.moodValue, 0) / totalEntries).toFixed(1)
    : 0;
  
  const moodDistribution = {
    0: moodEntries.filter(e => e.moodValue === 0).length,
    1: moodEntries.filter(e => e.moodValue === 1).length,
    2: moodEntries.filter(e => e.moodValue === 2).length,
    3: moodEntries.filter(e => e.moodValue === 3).length,
    4: moodEntries.filter(e => e.moodValue === 4).length
  };
  
  const bestMonth = () => {
    const monthAvg = {};
    moodEntries.forEach(entry => {
      const month = new Date(entry.date).toLocaleString('default', { month: 'long' });
      if (!monthAvg[month]) {
        monthAvg[month] = { sum: 0, count: 0 };
      }
      monthAvg[month].sum += entry.moodValue;
      monthAvg[month].count += 1;
    });
    
    let bestMonthName = '';
    let bestAvg = 5;
    for (const [month, data] of Object.entries(monthAvg)) {
      const avg = data.sum / data.count;
      if (avg < bestAvg) {
        bestAvg = avg;
        bestMonthName = month;
      }
    }
    return bestMonthName;
  };
  
  return (
    <div className="mood-calendar-container">
      <h3>📅 Mood Calendar Heatmap</h3>
      <p className="heatmap-description">Track your mood patterns over the last 365 days</p>
      
      {/* Stats Cards */}
      <div className="heatmap-stats">
        <div className="stat-card">
          <div className="stat-value">{totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageMood}</div>
          <div className="stat-label">Avg Mood (0-4)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bestMonth() || '-'}</div>
          <div className="stat-label">Best Month</div>
        </div>
      </div>
      
      {/* Month Labels */}
      <div className="heatmap-months">
        {months.map((month, idx) => (
          <div 
            key={idx} 
            className="month-label"
            style={{ left: `${(month.weekIndex / weeks.length) * 100}%` }}
          >
            {month.monthName}
          </div>
        ))}
      </div>
      
      {/* Heatmap Grid */}
      <div className="heatmap-grid">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="heatmap-week">
            {week.map((day, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className="heatmap-day"
                style={{
                  backgroundColor: day?.mood ? getMoodColor(day.mood.value) : '#ebedf0'
                }}
                title={day ? `${day.dateStr}\nMood: ${getMoodLabel(day.mood?.value)}\n${day.mood?.note || 'No note'}` : 'No data'}
              >
                {day && (
                  <span className="heatmap-emoji">
                    {getMoodEmoji(day.mood?.value)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="heatmap-legend">
        <span className="legend-title">Mood Intensity:</span>
        <div className="legend-colors">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#216e39' }}></div>
            <span>Great</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#30a14e' }}></div>
            <span>Good</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#40c463' }}></div>
            <span>Okay</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#9be9a8' }}></div>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ebedf0' }}></div>
            <span>Very Low / No Data</span>
          </div>
        </div>
      </div>
      
      {/* Mood Distribution */}
      <div className="mood-distribution">
        <h4>📊 Mood Distribution</h4>
        <div className="distribution-bars">
          {Object.entries(moodDistribution).map(([mood, count]) => (
            <div key={mood} className="distribution-item">
              <span className="distribution-label">{getMoodEmoji(parseInt(mood))} {getMoodLabel(parseInt(mood))}</span>
              <div className="distribution-bar-container">
                <div 
                  className="distribution-bar"
                  style={{
                    width: `${(count / totalEntries) * 100}%`,
                    backgroundColor: getMoodColor(parseInt(mood))
                  }}
                />
                <span className="distribution-count">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodCalendar;
