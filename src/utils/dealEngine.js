const DEAL_SIZE = 10;
const FIRST_DEAL = { pending: 10, mastered: 0, struggling: 0 };
const NORMAL_DEAL = { pending: 6, mastered: 2, struggling: 2 };

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function dealWords(words, isFirstDeal) {
  const pending    = words.filter(w => w.status === "pending");
  const mastered   = words.filter(w => w.status === "mastered");
  const struggling = words.filter(w => w.status === "struggling");

  if (isFirstDeal) {
    return pickRandom(pending, Math.min(DEAL_SIZE, pending.length));
  }

  const ratio = { ...NORMAL_DEAL };

  // Ajustar si alguna lista no tiene suficientes
  const shortfall = {
    struggling: Math.max(0, ratio.struggling - struggling.length),
    mastered:   Math.max(0, ratio.mastered   - mastered.length),
  };

  ratio.struggling -= shortfall.struggling;
  ratio.mastered   -= shortfall.mastered;
  ratio.pending    += shortfall.struggling + shortfall.mastered;

  const picked = [
    ...pickRandom(pending,    Math.min(ratio.pending,    pending.length)),
    ...pickRandom(mastered,   Math.min(ratio.mastered,   mastered.length)),
    ...pickRandom(struggling, Math.min(ratio.struggling, struggling.length)),
  ];

  // Si aun faltan por total, completar con lo que haya
  const total = picked.length;
  if (total < DEAL_SIZE) {
    const pickedIds = new Set(picked.map(w => w.id));
    const remaining = words.filter(w => !pickedIds.has(w.id));
    picked.push(...pickRandom(remaining, DEAL_SIZE - total));
  }

  return picked.sort(() => Math.random() - 0.5); // mezclar el orden final
}
