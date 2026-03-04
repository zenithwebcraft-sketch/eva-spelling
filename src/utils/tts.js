export function speak(word, sentence, grade, onEnd) {
  const synth = window.speechSynthesis;
  synth.cancel(); // cancela cualquier cosa que esté sonando

  const voices = synth.getVoices();
  const preferred = voices.find(v =>
    v.lang === "en-US" && v.name.includes("Samantha")
  ) || voices.find(v => v.lang === "en-US") || voices[0];

  function makeUtterance(text, rate = 0.95) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = "en-US";
    u.rate  = rate;
    if (preferred) u.voice = preferred;
    return u;
  }

  const u1 = makeUtterance(`${grade} grade`, 0.9);
  const u2 = makeUtterance(word, 0.75);          // palabra clara y lenta
  const u3 = makeUtterance(sentence, 1.0);        // oración normal
  const u4 = makeUtterance(word, 0.75);           // repite la palabra
  u4.onend = onEnd;

  synth.speak(u1);
  synth.speak(u2);
  synth.speak(u3);
  synth.speak(u4);
}

export function cancelSpeech() {
  window.speechSynthesis.cancel();
}
