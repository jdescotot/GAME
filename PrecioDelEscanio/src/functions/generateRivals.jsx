// src/functions/generateRivals.jsx
import { IDEOLOGIES } from "../data/partyData.jsx";

export const generateRivals = (playerSeats) => {
  const rivals = [];
  let remainingSeats = 100 - playerSeats;
  
  const numGiants = Math.random() > 0.5 ? 3 : 2;
  const giantIdeologies = ['RIGHT'];
  
  if (numGiants === 2) {
    giantIdeologies.push(Math.random() > 0.5 ? 'LEFT' : 'CENTER');
  } else {
    giantIdeologies.push('LEFT', 'CENTER');
  }

  const totalGiantSeats = Math.floor(remainingSeats * 0.7);
  let spentGiantSeats = 0;

  giantIdeologies.forEach((ideoKey, index) => {
    const ideoData = IDEOLOGIES[ideoKey];
    const name = ideoData.names[Math.floor(Math.random() * ideoData.names.length)];
    
    const seats = (index === giantIdeologies.length - 1) 
      ? totalGiantSeats - spentGiantSeats 
      : Math.floor(totalGiantSeats / giantIdeologies.length);
    
    spentGiantSeats += seats;

    rivals.push({
      name,
      seats,
      ideology: ideoKey,
      color: ideoData.color,
      bg: ideoData.bg,
      x: ideoKey === 'RIGHT' ? 70 + Math.random() * 20 : (ideoKey === 'LEFT' ? 10 + Math.random() * 20 : 40 + Math.random() * 20),
      y: 20 + Math.random() * 40
    });
  });

  remainingSeats -= spentGiantSeats;

  const numSmall = Math.floor(Math.random() * 8);
  const minorCategories = ['GREEN', 'MINOR', 'CENTER', 'LEFT', 'RIGHT'];

  for (let i = 0; i < numSmall; i++) {
    const randomCat = minorCategories[Math.floor(Math.random() * minorCategories.length)];
    const ideoData = IDEOLOGIES[randomCat];
    const name = ideoData.names[Math.floor(Math.random() * ideoData.names.length)];
    
    const seats = numSmall > 0 ? Math.floor(remainingSeats / (numSmall - i)) : 0;
    remainingSeats -= seats;

    if (seats > 0) {
      rivals.push({
        name,
        seats,
        ideology: randomCat,
        color: ideoData.color,
        bg: ideoData.bg,
        x: 10 + Math.random() * 80,
        y: 60 + Math.random() * 30 
      });
    }
  }
  return rivals;
};