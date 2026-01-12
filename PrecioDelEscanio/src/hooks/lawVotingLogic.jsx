// src/hooks/gameLogic/lawVotingLogic.js

const getPartySupportForLaw = (partyIdeology, lawFavor) => {
  if (!partyIdeology) return false;

  switch (partyIdeology) {
    case 'FAR_LEFT':
      return ['far-left', 'center-left'].includes(lawFavor);
    case 'LEFT':
      return ['center-left', 'green'].includes(lawFavor);
    case 'CENTER':
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor);
    case 'RIGHT':
      return ['center-right', 'neutral'].includes(lawFavor);
    case 'FAR_RIGHT':
      return ['far-right', 'center-right'].includes(lawFavor);
    case 'GREEN':
      return ['green', 'center-left'].includes(lawFavor);
    case 'MINOR':
    case 'POPULIST':
      if (['far-left', 'far-right'].includes(lawFavor)) return Math.random() > 0.3;
      return ['center-left', 'center-right', 'neutral', 'green'].includes(lawFavor) && Math.random() > 0.5;
    default:
      return lawFavor === 'neutral' || Math.random() > 0.6;
  }
};

export const calculateLawVoteOutcome = ({
  currentLaw,
  rivalParties,
  playerSeats,
  playerVote,
  economy,
  gdpBase
}) => {
  if (!currentLaw) {
    return { approved: false, error: "No law", messages: ["Error: No hay ley en curso."] };
  }

  let yesVotes = playerVote === 'yes' ? playerSeats : 0;

  rivalParties.forEach(party => {
    const supports = getPartySupportForLaw(party.ideology, currentLaw.favor);
    if (supports) yesVotes += party.seats;
  });

  const approved = yesVotes > 50;
  const messages = [];

  if (approved) {
    messages.push(`Ley "${currentLaw.title}" APROBADA.`);
    if (currentLaw.fiscalCost > 0) {
      messages.push(`El gasto público aumenta en $${currentLaw.fiscalCost}M`);
    } else if (currentLaw.fiscalCost < 0) {
      messages.push(`El estado ahorra $${Math.abs(currentLaw.fiscalCost)}M`);
    }
  } else {
    messages.push(`Ley RECHAZADA.`);
  }

  // Cálculo de deuda (solo proyección)
  const revenue = (economy.taxRate / 100) * gdpBase;
  const deficit = economy.annualSpending + (approved ? currentLaw.fiscalCost || 0 : 0) - revenue;
  const debtChange = deficit / 1000;
  const newDebt = Math.max(0, economy.debt + debtChange);

  return {
    approved,
    yesVotes,
    fiscalImpact: approved ? currentLaw.fiscalCost || 0 : 0,
    newAnnualSpending: economy.annualSpending + (approved ? currentLaw.fiscalCost || 0 : 0),
    newDebt,
    debtExceeds90: newDebt > 90 && economy.debt <= 90,
    messages
  };
};