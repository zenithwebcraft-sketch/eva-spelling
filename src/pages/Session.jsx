import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSpellingStore from "../store/useSpellingStore";
import WordCard from "../components/WordCard";

export default function Session() {
  const navigate      = useNavigate();
  const currentDeal   = useSpellingStore(s => s.currentDeal);
  const currentIndex  = useSpellingStore(s => s.currentIndex);
  const markWord      = useSpellingStore(s => s.markWord);
  const sessionNumber = useSpellingStore(s => s.sessionNumber);
  const words         = useSpellingStore(s => s.words); // ← fuente de verdad

  useEffect(() => {
    if (currentDeal.length === 0) navigate("/");
  }, []);

  const total    = currentDeal.length;
  const done     = currentIndex;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const current  = currentDeal[currentIndex];
  const finished = currentIndex >= total;

  if (finished) {
    // Leer status actualizado desde el store, no desde currentDeal
    const dealResults = currentDeal.map(dealWord => {
      const updated = words.find(w => w.id === dealWord.id);
      return updated || dealWord;
    });

    const masteredCount   = dealResults.filter(w => w.status === "mastered").length;
    const strugglingCount = dealResults.filter(w => w.status === "struggling").length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">

          {/* Header resumen */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-indigo-800">Round Complete!</h2>
            <p className="text-gray-400 text-sm mt-1">Session #{sessionNumber}</p>
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-green-600">{masteredCount}</p>
              <p className="text-xs text-green-400 font-semibold mt-1">Got it! ✅</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-red-400">{strugglingCount}</p>
              <p className="text-xs text-red-300 font-semibold mt-1">To Review ❌</p>
            </div>
          </div>

          {/* Lista de palabras */}
          <div className="space-y-2 mb-8 max-h-64 overflow-y-auto">
            {dealResults.map(w => (
              <div
                key={w.id}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                  w.status === "mastered"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-400"
                }`}
              >
                <span>{w.status === "mastered" ? "✅" : "❌"} {w.word}</span>
                <span className="font-mono text-xs opacity-50">#{w.id}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-4 rounded-2xl text-lg transition-all"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-indigo-300 hover:text-indigo-600 transition-colors text-sm"
          >
            ← Home
          </button>
          <span className="text-sm font-semibold text-indigo-400">
            {done + 1} / {total}
          </span>
        </div>

        {/* Barra de progreso sesión */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <WordCard
          key={current.id}
          word={current}
          onResult={markWord}
        />

      </div>
    </div>
  );
}
