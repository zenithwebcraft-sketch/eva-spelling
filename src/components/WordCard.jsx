import { useEffect, useState } from "react";
import { speak, cancelSpeech } from "../utils/tts";

function parseSentence(sentence, word) {
  const regex = new RegExp(`(${word})`, "i");
  const parts = sentence.split(regex);
  return parts;
}

export default function WordCard({ word, onResult }) {
  const [speaking, setSpeaking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSpeaking(true);
    setRevealed(false);
    setAnswered(false);
    speak(word.word, word.sentence, word.grade, () => setSpeaking(false));
    return () => cancelSpeech();
  }, [word.id]);

  function handleResult(result) {
    if (answered) return;
    setAnswered(true);
    cancelSpeech();
    setTimeout(() => onResult(word.id, result), 300);
  }

  const sentenceParts = parseSentence(word.sentence, word.word);
  const wordFoundInSentence = sentenceParts.length === 3;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-7">

      {/* Grado + ID */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-widest text-indigo-300">
          {word.grade} Grade
        </span>
        <span className="text-sm font-mono font-bold bg-indigo-50 text-indigo-400 px-3 py-1 rounded-full">
          #{word.id}
        </span>
      </div>

      {/* Palabra tapada / revelada */}
      <div className="text-center min-h-[80px] flex items-center justify-center">
        {revealed ? (
          <h2 className="text-6xl font-black tracking-wide text-indigo-800">
            {word.word}
          </h2>
        ) : (
          <div className="w-full bg-gray-100 rounded-2xl py-6 flex items-center justify-center">
            <span className="text-gray-300 text-2xl tracking-[0.5em]">● ● ● ● ●</span>
          </div>
        )}
      </div>

      {/* Botón repetir */}
      <button
        onClick={() => {
          setSpeaking(true);
          speak(word.word, word.sentence, word.grade, () => setSpeaking(false));
        }}
        className="flex items-center justify-center gap-2 text-indigo-500 hover:text-indigo-700 transition-colors text-base font-semibold"
      >
        {speaking
          ? <span className="animate-pulse">🔊 Playing...</span>
          : <span>🔁 Repeat word</span>
        }
      </button>

      {/* Oración con palabra enmascarada */}
      <div className="bg-gray-50 rounded-2xl px-5 py-5">
        <span className="text-xs text-gray-300 uppercase tracking-widest block mb-3">
          Sentence
        </span>
        <p className="text-center text-gray-600 italic text-lg leading-relaxed">
          "
          {wordFoundInSentence ? (
            <>
              {sentenceParts[0]}
              {revealed ? (
                <span className="font-bold text-indigo-600 not-italic">
                  {sentenceParts[1]}
                </span>
              ) : (
                <span className="inline-block bg-gray-300 text-gray-300 rounded px-1 select-none">
                  {"_".repeat(sentenceParts[1].length)}
                </span>
              )}
              {sentenceParts[2]}
            </>
          ) : (
            word.sentence
          )}
          "
        </p>
      </div>

      {/* Spelling tapado / revelado */}
      <div className="min-h-[72px]">
        {revealed ? (
          <div className="bg-indigo-50 rounded-2xl px-5 py-4 text-center">
            <span className="text-xs text-indigo-300 uppercase tracking-widest block mb-2">
              Spelling
            </span>
            <span className="font-mono font-bold text-indigo-600 tracking-widest text-2xl">
              {word.spelling}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-300 text-base hover:border-indigo-300 hover:text-indigo-300 transition-colors"
          >
            👁 Reveal answer
          </button>
        )}
      </div>

      {/* Botones resultado */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleResult("struggling")}
          disabled={answered}
          className="py-5 rounded-2xl bg-red-50 hover:bg-red-100 active:scale-95 text-red-500 font-black text-xl transition-all disabled:opacity-40"
        >
          ❌ Review
        </button>
        <button
          onClick={() => handleResult("mastered")}
          disabled={answered}
          className="py-5 rounded-2xl bg-green-50 hover:bg-green-100 active:scale-95 text-green-600 font-black text-xl transition-all disabled:opacity-40"
        >
          ✅ Got it!
        </button>
      </div>

    </div>
  );
}
