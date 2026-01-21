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
// Compara la facción del jugador con la etiqueta de la ley (ahora UPPERCASE keys o arrays)
export const checkIdeologicalAlignment = (playerFaction, lawFavor) => {
    if (!playerFaction || !lawFavor) return 'neutral';

    // Normalizar lawFavor a array
    const favorArr = Array.isArray(lawFavor) ? lawFavor : [lawFavor];

    // Mapear faction.id a categorías de ala política
    const leftIds = ['far_left', 'com', 'anarchist'];
    const rightIds = ['cap', 'conserv', 'far_right'];
    const greenIds = ['green'];
    const centerIds = ['lib', 'pop'];

    let playerWing = 'CENTER';
    const fid = playerFaction.id;

    if (leftIds.includes(fid)) playerWing = 'LEFT';
    else if (rightIds.includes(fid)) playerWing = 'RIGHT';
    else if (greenIds.includes(fid)) playerWing = 'GREEN';
    else if (centerIds.includes(fid)) playerWing = 'CENTER';

    // Determinar alineación
    // Match: la ley favorece mi ala o una compatible
    const matchMap = {
      'LEFT': ['LEFT', 'FAR_LEFT', 'GREEN'],
      'RIGHT': ['RIGHT', 'FAR_RIGHT'],
      'GREEN': ['GREEN', 'LEFT'],
      'CENTER': ['CENTER', 'LEFT', 'RIGHT', 'GREEN']
    };
    const opposingMap = {
      'LEFT': ['RIGHT', 'FAR_RIGHT'],
      'RIGHT': ['LEFT', 'FAR_LEFT'],
      'GREEN': ['FAR_RIGHT'],
      'CENTER': ['FAR_LEFT', 'FAR_RIGHT']
    };

    const myMatches = matchMap[playerWing] || ['CENTER'];
    const myOpposing = opposingMap[playerWing] || [];

    if (favorArr.some(f => myMatches.includes(f))) return 'match';
    if (favorArr.some(f => myOpposing.includes(f))) return 'opposing';
    
    return 'neutral';
};