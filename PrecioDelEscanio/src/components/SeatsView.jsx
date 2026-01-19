import React, { useMemo } from 'react';

export function SeatsView({ 
  resources, 
  rivalParties = [],
  playerIdeologyX = 50,
  playerColor = '#eab308' 
}) {
  const playerSeats = resources?.seats || 0;
  
  // === MISMA LÓGICA DE DATOS ===
  const allSeats = useMemo(() => {
    let seats = [];

    for (let i = 0; i < playerSeats; i++) {
      seats.push({
        id: `player-${i}`,
        color: playerColor,
        isPlayer: true,
        ideologyX: playerIdeologyX,
        partyName: 'Tu Partido'
      });
    }

    rivalParties.forEach((rival, rIndex) => {
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

  const TOTAL_SEATS = 100;

  // --- GENERAR POSICIONES EN ORDEN IZQUIERDA → DERECHA CON PREVENCIÓN DE OVERLAPS ---
  const seatPositions = useMemo(() => {
    const rows = [7, 11, 14, 17, 21, 30]; // 100 total
    const positions = [];
    const minDistance = 16; // Distancia mínima entre centros de escaños (radio*2 + gap)

    // Primero: generar todas las posiciones en orden de izquierda a derecha
    for (let r = 0; r < rows.length; r++) {
      const radius = 70 + r * 25;
      const count = rows[r];
      const startAngle = Math.PI * 0.9;   // izquierda
      const endAngle = Math.PI * 0.1;     // derecha
      const angleStep = (startAngle - endAngle) / (count - 1 || 1);

      for (let i = 0; i < count; i++) {
        const angle = startAngle - i * angleStep;
        const x = radius * Math.cos(angle);
        const y = -radius * Math.sin(angle);
        positions.push({ x, y });
      }
    }

    // Segundo: ordenar por X y aplicar correcciones de overlap
    const sortedPositions = positions.sort((a, b) => a.x - b.x);
    
    // Tercero: detectar y corregir overlaps
    for (let i = 0; i < sortedPositions.length; i++) {
      for (let j = i + 1; j < sortedPositions.length; j++) {
        const pos1 = sortedPositions[i];
        const pos2 = sortedPositions[j];
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          // Hay overlap, separar vertically
          const overlap = minDistance - distance;
          pos2.y -= overlap / 2;
          pos1.y += overlap / 2;
        }
      }
    }

    return sortedPositions;
  }, []);

  const assignedSeats = useMemo(() => {
    const assignments = [...allSeats];
    while (assignments.length < TOTAL_SEATS) {
      assignments.push({
        id: `empty-${assignments.length}`,
        color: '#334155',
        isPlayer: false,
        isEmpty: true,
        partyName: 'Vacante'
      });
    }
    return assignments.slice(0, TOTAL_SEATS);
  }, [allSeats]);

  return (
    <>
      <style jsx>{`
        .seats-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          font-family: sans-serif;
        }

        .hemiciclo {
          flex: 1;
          background-color: rgba(15, 23, 42, 0.5);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .seat-legend {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 12px;
          border-top: 1px solid #334155;
          padding-top: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      `}</style>

      <div className="seats-container">
        {/* HEMICICLE CON SVG */}
        <div className="hemiciclo">
          <svg
            viewBox="-200 -200 400 300"  // ⬅️ Más espacio en Y, centrado
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              aspectRatio: '400/300'
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Podium — ahora en Y = 160 (abajo del SVG) */}
            <path d="M -40 160 L 40 160 L 50 180 L -50 180 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
            <text x="0" y="175" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">MESA</text>

            {assignedSeats.map((seat, idx) => {
              const pos = seatPositions[idx];
              if (!pos) return null;

              const isPlayer = seat.isPlayer && !seat.isEmpty;
              const r = isPlayer ? 8 : 7;
              const stroke = isPlayer ? 'white' : 'none';
              const strokeWidth = isPlayer ? 1.5 : 0;

              const handleMouseEnter = (e) => {
                e.target.setAttribute('r', isPlayer ? 12 : 10);
              };

              const handleMouseLeave = (e) => {
                e.target.setAttribute('r', isPlayer ? 8 : 7);
              };

              return (
                <g key={seat.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={seat.color}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{
                      filter: isPlayer ? `drop-shadow(0 0 4px ${seat.color})` : 'none',
                      animation: isPlayer ? 'pulse 2s infinite' : 'none',
                      cursor: 'pointer',
                      transition: 'r 0.15s ease-in-out'
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                  <title>
                    {seat.isEmpty ? 'Asiento vacío' : seat.partyName}
                  </title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* LEYENDA */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: playerColor }}></div>
            <span><strong>TÚ ({playerSeats})</strong></span>
          </div>
          
          {rivalParties.map((party, idx) => (
            <div key={idx} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: party.hex || '#94a3b8' }}
              ></div>
              <span>{party.name} ({party.seats})</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}