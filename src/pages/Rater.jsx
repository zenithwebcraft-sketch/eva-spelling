import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Rater() {
  const navigate = useNavigate();
  const [words, setWords]   = useState([]);
  const [input, setInput]   = useState("");

  useEffect(() => {
    fetch("/words_clean.json")
      .then(r => r.json())
      .then(setWords);
  }, []);

  const id     = parseInt(input);
  const found  = words.find(w => w.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-indigo-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-white font-bold text-xl">🔍 Rater</h2>
        </div>

        {/* Input */}
        <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="_ _ _"
        value={input}
        onChange={e => {
            const val = e.target.value.replace(/\D/g, ""); // solo dígitos
            setInput(val);
        }}
        autoFocus
        className="w-full text-center text-5xl font-black bg-white/10 text-white placeholder-white/20 rounded-2xl py-5 px-4 outline-none focus:ring-2 focus:ring-indigo-400 mb-8 tracking-widest"
        />


        {/* Resultado */}
        {found ? (
          <div className="bg-white/10 rounded-3xl p-8 text-center space-y-5">
            <span className="text-indigo-300 text-xs uppercase tracking-widest">
              #{found.id} · {found.grade} Grade
            </span>
            <h1 className="text-5xl font-black text-white tracking-wide">
              {found.word}
            </h1>
            <div className="border-t border-white/10 pt-5">
              <span className="text-indigo-300 text-xs uppercase tracking-widest block mb-2">
                Spelling
              </span>
              <p className="font-mono font-bold text-indigo-300 tracking-widest text-xl">
                {found.spelling}
              </p>
            </div>
          </div>
        ) : input.length > 0 ? (
          <div className="text-center text-white/30 text-lg">
            No word found with ID {input}
          </div>
        ) : (
          <div className="text-center text-white/20 text-sm">
            Enter the ID shown on Eva's screen
          </div>
        )}

      </div>
    </div>
  );
}
