import React, { useMemo } from 'react';

export function SeatsView({ 
  resources, 
  rivalParties = [],
  playerIdeologyX = 50,
  // Ahora el color por defecto es un HEX directo (Amarillo Oro)
  playerColor = '#eab308' 
}) {
  const playerSeats = resources?.seats || 0;
  
  const allSeats = useMemo(() => {
    let seats = [];

    // TUS ESCAÑOS
    for (let i = 0; i < playerSeats; i++) {
      seats.push({
        id: `player-${i}`,
        color: playerColor, // Usamos el hex directo
        isPlayer: true,
        ideologyX: playerIdeologyX
      });
    }

    // RIVALES
    rivalParties.forEach((rival, rIndex) => {
      // Usamos rival.hex. Si no existe por error, usamos gris.
      const rivalColor = rival.hex || '#94a3b8';
      const rivalIdeologyX = rival.x || 50;
      
      for (let i = 0; i < rival.seats; i++) {
        seats.push({
          id: `rival-${rIndex}-${i}`,
          color: rivalColor,
          isPlayer: false,
          ideologyX: rivalIdeologyX,
          partyName: rival.name
        });
      }
    });

    return seats.sort((a, b) => a.ideologyX - b.ideologyX);
  }, [playerSeats, playerColor, playerIdeologyX, rivalParties]);

  return (
    <div className="seats-view-content h-full flex flex-col">
      {/* HEMICICLO */}
      <div className="hemiciclo flex-1 bg-gray-900/50 rounded-lg p-4 mb-4 relative overflow-hidden flex flex-wrap gap-1 justify-center items-start content-start">
        {allSeats.map((seat) => (
          <div
            key={seat.id}
            className="seat rounded-full animate-pulse"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: seat.color, // CSS Directo
              boxShadow: seat.isPlayer ? `0 0 4px ${seat.color}` : 'none',
              border: seat.isPlayer ? '1px solid white' : 'none',
              animation: seat.isPlayer ? 'pulse 2s infinite' : 'none'
            }}
            title={seat.isPlayer ? 'Tu Partido' : `Oposición: ${seat.partyName || ''}`}
          />
        ))}
        
        {/* Espacios vacíos */}
        {[...Array(Math.max(0, 100 - allSeats.length))].map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="seat rounded-full bg-slate-600 opacity-30"
            style={{ width: '12px', height: '12px' }}
          />
        ))}
      </div>

      {/* LEYENDA */}
      <div className="seats-legend grid grid-cols-2 gap-2 text-xs border-t border-gray-700 pt-2">
        <div className="legend-item flex items-center gap-2">
          <div className="seat rounded-full" style={{ width: '10px', height: '10px', backgroundColor: playerColor }}></div>
          <span className="font-bold">TÚ ({playerSeats})</span>
        </div>
        
        {rivalParties.map((party, idx) => (
          <div key={idx} className="legend-item flex items-center gap-2">
            <div 
              className="seat rounded-full" 
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: party.hex || '#94a3b8' 
              }}
            ></div>
            <span>{party.name} ({party.seats})</span>
          </div>
        ))}
      </div>
    </div>
  );
}