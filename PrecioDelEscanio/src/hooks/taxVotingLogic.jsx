// src/hooks/gameLogic/taxVotingLogic.js

export const getPartySupportForTaxChange = (partyIdeology, isTaxHike) => {
  if (!partyIdeology) return false;

  if (['FAR_LEFT', 'LEFT', 'GREEN'].includes(partyIdeology)) return isTaxHike;
  if (['CENTER', 'RIGHT', 'FAR_RIGHT'].includes(partyIdeology)) return !isTaxHike;
  if (['MINOR', 'POPULIST'].includes(partyIdeology)) {
    return Math.random() > 0.4;
  }
  return Math.random() > 0.5;
};

export const calculateTaxVoteOutcome = ({
  taxProposal,
  currentTaxRate,
  rivalParties,
  playerSeats
}) => {
  if (taxProposal === currentTaxRate) {
    return { approved: false, error: "No change" };
  }

  const isTaxHike = taxProposal > currentTaxRate;
  let yesVotes = playerSeats;

  rivalParties.forEach(party => {
    const vote = getPartySupportForTaxChange(party.ideology, isTaxHike);
    if (vote) yesVotes += party.seats;
  });

  const approved = yesVotes > 50;
  const messages = [];
  let popularityDelta = 0;

  if (approved) {
    messages.push(`Reforma Fiscal APROBADA (${yesVotes} votos). Impuestos: ${taxProposal}%`);
    if (isTaxHike) {
      popularityDelta = -5;
      messages.push("La gente protesta por la subida de impuestos.");
    } else {
      popularityDelta = +3;
      messages.push("La bajada de impuestos alegra al mercado.");
    }
  } else {
    messages.push(`Reforma Fiscal RECHAZADA (${yesVotes} votos).`);
  }

  return {
    approved,
    yesVotes,
    newTaxRate: approved ? taxProposal : currentTaxRate,
    popularityDelta,
    messages
  };
};