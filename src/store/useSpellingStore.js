import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dealWords } from "../utils/dealEngine";

const useSpellingStore = create(
  persist(
    (set, get) => ({
      // --- Estado ---
      words: [],
      currentDeal: [],
      currentIndex: 0,
      sessionNumber: 0,
      sessionHistory: [],
      isFirstDeal: true,
      initialized: false,

      // --- Cargar palabras desde JSON (solo la primera vez) ---
      loadWords: async () => {
        if (get().initialized) return;
        const res  = await fetch("/words_clean.json");
        const data = await res.json();
        set({ words: data, initialized: true });
      },

      // --- Repartir 10 palabras ---
      deal: () => {
        const { words, isFirstDeal, sessionNumber } = get();
        const hand = dealWords(words, isFirstDeal);
        set({
          currentDeal: hand,
          currentIndex: 0,
          isFirstDeal: false,
          sessionNumber: sessionNumber + 1,
        });
      },

      // --- Marcar palabra como mastered o struggling ---
      markWord: (wordId, result) => {
        const now = new Date().toISOString();
        const { words, currentDeal, currentIndex, sessionNumber, sessionHistory } = get();

        const updatedWords = words.map(w => {
          if (w.id !== wordId) return w;
          const stats = { ...w.stats };
          stats.timesShown   += 1;
          stats.lastSeen      = now;
          if (!stats.firstSeen) stats.firstSeen = now;

          if (result === "mastered") {
            stats.timesCorrect += 1;
            stats.streak       += 1;
          } else {
            stats.timesWrong += 1;
            stats.streak      = 0;
          }

          stats.accuracy = Math.round((stats.timesCorrect / stats.timesShown) * 100);

          return { ...w, status: result, stats };
        });

        // Registrar en historial de sesión
        const updatedHistory = [...sessionHistory];
        const sessionIdx = updatedHistory.findIndex(s => s.sessionNumber === sessionNumber);
        const entry = { wordId, result, timestamp: now };

        if (sessionIdx === -1) {
          updatedHistory.push({ sessionNumber, date: now, results: [entry] });
        } else {
          updatedHistory[sessionIdx].results.push(entry);
        }

        set({
          words: updatedWords,
          currentIndex: currentIndex + 1,
          sessionHistory: updatedHistory,
        });
      },

      // --- Reset completo (por si quieren empezar de cero) ---
      resetAll: () => {
        set(state => ({
          words: state.words.map(w => ({
            ...w,
            status: "pending",
            stats: {
              timesShown: 0, timesCorrect: 0, timesWrong: 0,
              accuracy: 0, streak: 0, lastSeen: null, firstSeen: null,
            }
          })),
          currentDeal: [],
          currentIndex: 0,
          sessionNumber: 0,
          sessionHistory: [],
          isFirstDeal: true,
        }));
      },

      // --- Selectores de conveniencia ---
      getStats: () => {
        const { words, sessionHistory } = get();
        return {
          total:      words.length,
          pending:    words.filter(w => w.status === "pending").length,
          mastered:   words.filter(w => w.status === "mastered").length,
          struggling: words.filter(w => w.status === "struggling").length,
          sessions:   sessionHistory.length,
        };
      },
    }),
    {
      name: "eva-spelling-store", // clave en localStorage
    }
  )
);

export default useSpellingStore;
