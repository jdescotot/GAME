import { FACTIONS } from '../data/constants';

// Tu función original (Mantenida intacta)
export const determineClosestFaction = (currentX, currentY) => {
  let closestFaction = null;
  let minDistance = Infinity;

  FACTIONS.forEach(faction => {
    const distance = Math.sqrt(
      Math.pow(faction.x - currentX, 2) + 
      Math.pow(faction.y - currentY, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestFaction = faction;
    }
  });

  return closestFaction;
};

// --- NUEVA FUNCIÓN: Determinar Alineación con la Ley ---
// Compara la facción del jugador con la etiqueta de la ley ('left', 'right', 'center', etc.)
export const checkIdeologicalAlignment = (playerFaction, lawFavor) => {
    if (!playerFaction || !lawFavor) return 'neutral';

    // Normalizamos las etiquetas de tus Facciones a los términos de las Leyes
    // Asumo que tus Facciones tienen IDs como 'socialists', 'liberals', 'conservatives', etc.
    // Ajusta los strings del 'case' según tus IDs en constants.jsx
    let playerWing = 'center';
    
    switch (playerFaction.id) {
        case 'communists':
        case 'socialists':
        case 'progressives':
            playerWing = 'left';
            break;
        case 'conservatives':
        case 'nationalists':
        case 'fascists':
            playerWing = 'right';
            break;
        case 'liberals':
        case 'centrists':
            playerWing = 'center';
            break;
        default:
            playerWing = 'center';
    }

    // Comparar con la ley
    if (lawFavor === 'neutral') return 'neutral_law';
    if (playerWing === lawFavor) return 'match'; // Es MI ideología
    if (playerWing === 'left' && lawFavor === 'right') return 'opposing'; // Es el enemigo
    if (playerWing === 'right' && lawFavor === 'left') return 'opposing'; // Es el enemigo
    
    return 'neutral'; // No es mi lucha directa
};