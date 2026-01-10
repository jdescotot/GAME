import React from 'react';

export const StatBar = ({ label, value, max = 100, color = "bg-blue", showValue = true }) => (
  <div className="stat-bar-container">
    <div className="stat-bar-header">
      <span>{label}</span>
      {showValue && <span>{Math.round(value)}/{max}</span>}
    </div>
    <div className="stat-bar-bg">
      <div className={`stat-bar-fill ${color}`} style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}></div>
    </div>
  </div>
);