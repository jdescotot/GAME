import React from 'react';
import { FACTIONS } from '../data/constants';

export function PoliticalMap({
  ideologyX,
  ideologyY,
  rivalParties,
}) {
  return (
    <div className="map-view-content">
      <div className="map-axis-h">
        <div />
      </div>
      <div className="map-axis-v">
        <div />
      </div>

      <span
        className="map-label"
        style={{
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        IZQUIERDA
      </span>

      <span
        className="map-label"
        style={{
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        DERECHA
      </span>

      {FACTIONS.map(f => (
        <div
          key={f.id}
          className="faction-node"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          <div
            className={`faction-dot ${f.color}`}
            title={f.desc}
          ></div>
          <span className="faction-name">{f.name}</span>
        </div>
      ))}

      <div
        className="player-token"
        style={{
          left: `${ideologyX}%`,
          top: `${ideologyY}%`,
        }}
      >
        <div className="player-diamond"></div>
        <span className="player-label">TÚ</span>
      </div>

      {rivalParties.map((p, idx) => (
        <div
          key={idx}
          className={`rival-token ${p.bg}`}
          title={p.name}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid white',
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
      ))}
    </div>
  );
}
