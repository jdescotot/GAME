import React from 'react';

export const PowerHungerBar = ({ value, oratory }) => {
  const uncertainty = Math.floor((oratory / 100) * 40); 
  const min = Math.max(0, value - uncertainty);
  const max = Math.min(100, value + uncertainty);
  const isTransparent = oratory < 20;

  return (
    <div className="stat-bar-container">
      <div className="stat-bar-header" style={{ color: '#fca5a5' }}>
        <span>Hambre de Poder</span>
        <span>{isTransparent ? `${value}%` : `~${min}% - ${max}%`}</span>
      </div>
      <div className="stat-bar-bg">
        {!isTransparent && (
          <div className="stat-bar-uncertainty" style={{ left: `${min}%`, width: `${max - min}%` }} />
        )}
        <div 
          className="stat-bar-fill" 
          style={{ width: `${value}%`, backgroundColor: isTransparent ? '#ef4444' : 'transparent' }}
        ></div>
      </div>
      <p className="stat-bar-desc">
        {isTransparent ? "Es transparente." : "Su oratoria oculta sus intenciones."}
      </p>
    </div>
  );
};