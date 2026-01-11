import React, { useMemo } from 'react';

// Mapeo de clases Tailwind a colores HEX para el renderizado
const tailwindColorToHex = (colorClass) => {
  if (!colorClass) return '#94a3b8';
  // Extraemos solo el nombre del color (ej: 'text-yellow-500' → 'yellow-500')
  const match = colorClass.match(/text-(\w+-\d+)/);
  const key = match ? match[1] : null;
  
  const map = {
    'yellow-500': '#eab308',
    'red-600': '#dc2626',
    'red-800': '#991b1b',
    'blue-600': '#2563eb',
    'emerald-500': '#10b981',
    'purple-500': '#a855f7',
    'black': '#000000',
    'gray-900': '#111827'
  };
  return map[key] || '#94a3b8';
};

export function SeatsView({ 
  resources, 
  rivalParties = [],
  playerIdeologyX = 50,
  playerColorClass = 'text-yellow-500', // Prop para compatibilidad con clases Tailwind
  partyColor // Prop opcional directa en HEX (de la corrección)
}) {
  // DATOS DEL JUGADOR - Combinando ambos enfoques
  const playerSeats = resources?.seats || 0;
  
  // PRIORIDAD: partyColor (HEX directo) > playerColorClass (Tailwind) > color por defecto
  const playerColor = partyColor || tailwindColorToHex(playerColorClass) || '#eab308';

  // Construcción de todos los escaños con posicionamiento ideológico (mantenido de original)
  const allSeats = useMemo(() => {
    let seats = [];

    // Escaños del jugador
    for (let i = 0; i < playerSeats; i++) {
      seats.push({
        id: `player-${i}`,
        color: playerColor,
        isPlayer: true,
        ideologyX: playerIdeologyX
      });
    }

    // Escaños de rivales
    rivalParties.forEach((rival, rIndex) => {
      // Para rivales: usar color de Tailwind si viene en rival.color, o bg si no
      const rivalColor = rival.color ? tailwindColorToHex(rival.color) : 
                        (rival.bg ? tailwindColorToHex(rival.bg) : '#94a3b8');
      const rivalIdeologyX = rival.x || 50; // Si no tiene posición, va al centro
      
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

    // Ordenar de izquierda (0) a derecha (100)
    return seats.sort((a, b) => a.ideologyX - b.ideologyX);
  }, [playerSeats, playerColor, playerIdeologyX, rivalParties]);

  return (
    <div className="seats-view-content h-full flex flex-col">
      {/* Visualización del Hemiciclo - Combinando ambos estilos */}
      <div className="hemiciclo flex-1 bg-gray-900/50 rounded-lg p-4 mb-4 relative overflow-hidden flex flex-wrap gap-1 justify-center items-start content-start">
        {allSeats.map((seat) => (
          <div
            key={seat.id}
            className="seat rounded-full animate-pulse"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: seat.color,
              boxShadow: seat.isPlayer ? `0 0 4px ${seat.color}` : 'none',
              border: seat.isPlayer ? '1px solid white' : 'none',
              animation: seat.isPlayer ? 'pulse 2s infinite' : 'none'
            }}
            title={seat.isPlayer ? 'Tu Partido' : `Oposición: ${seat.partyName || ''}`}
          />
        ))}
        
        {/* Espacios vacíos para completar 100 escaños - Mantenido de original */}
        {[...Array(Math.max(0, 100 - allSeats.length))].map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="seat rounded-full bg-slate-600 opacity-30"
            style={{ width: '12px', height: '12px' }}
          />
        ))}
      </div>

      {/* Leyenda Dinámica - Combinando ambos estilos */}
      <div className="seats-legend grid grid-cols-2 gap-2 text-xs border-t border-gray-700 pt-2">
        {/* Leyenda del jugador - Usando partyColor directamente */}
        <div className="legend-item flex items-center gap-2">
          <div 
            className="seat rounded-full" 
            style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: playerColor 
            }}
          ></div>
          <span className="font-bold">TÚ ({playerSeats})</span>
        </div>
        
        {/* Leyenda de rivales */}
        {rivalParties.map((party, idx) => {
          const rivalColor = party.color ? tailwindColorToHex(party.color) : 
                           (party.bg ? tailwindColorToHex(party.bg) : '#94a3b8');
          
          return (
            <div key={idx} className="legend-item flex items-center gap-2">
              <div 
                className="seat rounded-full" 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: rivalColor 
                }}
              ></div>
              <span>{party.name} ({party.seats})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}