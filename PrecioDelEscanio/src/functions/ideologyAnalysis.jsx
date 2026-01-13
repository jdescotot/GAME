import { FACTIONS } from '../data/constants';

// Calcula la distancia matemática entre los sliders y cada facción
export const determineClosestFaction = (currentX, currentY) => {
  let closestFaction = null;
  let minDistance = Infinity;

  FACTIONS.forEach(faction => {
    // Fórmula de distancia euclidiana: √((x2-x1)² + (y2-y1)²)
    const distance = Math.sqrt(
      Math.pow(faction.x - currentX, 2) + 
      Math.pow(faction.y - currentY, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestFaction = faction;
    }
  });

  return closestFaction; // Devuelve el objeto completo de la facción (nombre, color, desc, etc.)
};