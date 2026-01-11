import React from 'react';

export function SeatsView({ resources, rivalParties }) {
  return (
    <div className="seats-view-content">
      <div className="hemiciclo">
        {[...Array(resources.seats)].map((_, i) => (
          <div
            key={`p-${i}`}
            className="seat bg-yellow animate-pulse"
          ></div>
        ))}

        {rivalParties.flatMap(p =>
          [...Array(p.seats)].map((_, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`seat ${p.bg}`}
            ></div>
          ))
        )}
      </div>

      <div className="seats-legend grid-cols-2">
        <div className="legend-item">
          <div className="seat bg-yellow"></div>
          <span>TÚ: {resources.seats}</span>
        </div>

        {rivalParties.map(p => (
          <div key={p.name} className="legend-item">
            <div className={`seat ${p.bg}`}></div>
            <span>
              {p.name}: {p.seats}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
