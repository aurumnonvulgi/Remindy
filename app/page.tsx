"use client";

import { useEffect, useMemo, useState } from "react";

const WORDS = [
  "WONDERLAND",
  "MIDNIGHT",
  "SILVER",
  "NEBULA",
  "HORIZON",
  "FIRESTORM",
  "OBSIDIAN",
  "THUNDER",
  "ECLIPSE",
  "PHANTOM",
  "RAPTURE",
  "VOYAGER",
  "DREADNOUGHT",
  "CATALYST",
  "SPECTRUM",
  "WHISPER",
  "HUNTRESS",
  "TITANIUM",
  "VALKYRIE",
  "FORGE",
  "DOMINION",
  "STARDUST",
  "NOCTURNE",
  "RAVEN",
  "WILDFIRE",
  "SABOTAGE",
  "FRONTIER",
  "SANCTUM",
  "TRIUMPH",
  "VANGUARD",
];

const LIMBS = [
  "head",
  "torso",
  "leftArm",
  "rightArm",
  "leftLeg",
  "rightLeg",
];

const PUNISHMENTS = [
  {
    id: "explosion",
    label: "Exploding",
    description: "Shockwave + heat flash",
  },
  {
    id: "acid",
    label: "Acid",
    description: "Corrosive drip",
  },
  {
    id: "bomb",
    label: "Bomb",
    description: "Impact pulse",
  },
  {
    id: "pulling",
    label: "Pulling",
    description: "Violent yank",
  },
];

const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const getRandomWord = () =>
  WORDS[Math.floor(Math.random() * WORDS.length)];

export default function Home() {
  const [word, setWord] = useState(() => getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [punishment, setPunishment] = useState("explosion");
  const [status, setStatus] = useState("Choose a punishment and begin.");
  const [effect, setEffect] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const wrongGuesses = guesses.filter((letter) => !word.includes(letter));
  const correctGuesses = guesses.filter((letter) => word.includes(letter));
  const maxMistakes = LIMBS.length;
  const isWin = word.split("").every((letter) => correctGuesses.includes(letter));
  const isLose = mistakes >= maxMistakes;

  const maskedWord = useMemo(
    () =>
      word
        .split("")
        .map((letter) => (correctGuesses.includes(letter) ? letter : "_"))
        .join(" "),
    [word, correctGuesses]
  );

  const handleGuess = (letter: string) => {
    if (!started || isWin || isLose) return;
    if (guesses.includes(letter)) return;

    const nextGuesses = [...guesses, letter];
    setGuesses(nextGuesses);

    if (word.includes(letter)) {
      setStatus("Correct. Keep going.");
    } else {
      setMistakes((prev) => prev + 1);
      setStatus("Wrong. The punishment advances.");
    }
  };

  const startGame = () => {
    setStarted(true);
    setStatus("Guess the word before the final limb drops.");
  };

  const resetGame = () => {
    setWord(getRandomWord());
    setGuesses([]);
    setMistakes(0);
    setStatus("New target locked.");
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    if (mistakes === 0) return;
    setEffect(punishment);
    const timer = window.setTimeout(() => setEffect(null), 700);
    return () => window.clearTimeout(timer);
  }, [mistakes, punishment, started]);

  useEffect(() => {
    if (isWin) {
      setStatus("Victory. You cracked the code.");
    }
  }, [isWin]);

  useEffect(() => {
    if (isLose) {
      setStatus(`Failure. The word was ${word}.`);
    }
  }, [isLose, word]);

  return (
    <main className="arena">
      <header className="hero">
        <p className="eyebrow">Hangman Execution Lab</p>
        <h1>Choose the punishment. Save the word.</h1>
        <p className="lead">
          Intensive mode: every mistake removes a limb and triggers your selected
          effect. One wrong move too many and it’s over.
        </p>
      </header>

      <section className="layout">
        <div className="left-panel">
          <div className="stage">
            <div className={`effect ${effect ?? ""}`}></div>
            <div className={`shock ${effect ? "active" : ""}`}></div>
            <div className="gallows">
              <div className="beam"></div>
              <div className="post"></div>
              <div className="base"></div>
              <div className="rope"></div>
              <div className="figure">
                <div className={`head ${mistakes > 0 ? "on" : ""}`}></div>
                <div className={`torso ${mistakes > 1 ? "on" : ""}`}></div>
                <div className={`arm left ${mistakes > 2 ? "on" : ""}`}></div>
                <div className={`arm right ${mistakes > 3 ? "on" : ""}`}></div>
                <div className={`leg left ${mistakes > 4 ? "on" : ""}`}></div>
                <div className={`leg right ${mistakes > 5 ? "on" : ""}`}></div>
              </div>
            </div>
          </div>

          <div className="status-card">
            <div className="status-row">
              <span>Wrong</span>
              <strong>
                {wrongGuesses.length} / {maxMistakes}
              </strong>
            </div>
            <div className="status-row">
              <span>Effect</span>
              <strong>{punishment.toUpperCase()}</strong>
            </div>
            <p className="status">{status}</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="punishments">
            <h2>Pick your punishment</h2>
            <div className="punish-grid">
              {PUNISHMENTS.map((item) => (
                <button
                  key={item.id}
                  className={`punish-card ${
                    punishment === item.id ? "active" : ""
                  }`}
                  onClick={() => setPunishment(item.id)}
                  disabled={started}
                >
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
            {!started ? (
              <button className="primary" onClick={startGame}>
                Start
              </button>
            ) : (
              <button className="primary" onClick={resetGame}>
                New Word
              </button>
            )}
          </div>

          <div className="word-card">
            <h2>Target</h2>
            <div className={`word ${isLose ? "failed" : ""}`}>{maskedWord}</div>
            <div className="guesses">
              {guesses.length === 0
                ? "No guesses yet."
                : `Guessed: ${guesses.join(", ")}`}
            </div>
          </div>

          <div className="keyboard">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={!started || guesses.includes(letter) || isWin || isLose}
                className={guesses.includes(letter) ? "used" : ""}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: "Bebas Neue", "Oswald", sans-serif;
          background: #0b0f1a;
          color: #f8fafc;
        }
        .arena {
          min-height: 100vh;
          padding: 48px clamp(24px, 6vw, 90px) 64px;
          display: grid;
          gap: 32px;
        }
        .hero {
          display: grid;
          gap: 12px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          color: #f97316;
          margin: 0;
        }
        h1 {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          margin: 0;
        }
        .lead {
          margin: 0;
          font-size: 18px;
          color: #cbd5f5;
          max-width: 700px;
          line-height: 1.7;
        }
        .layout {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr);
          gap: 32px;
          align-items: start;
        }
        .left-panel {
          display: grid;
          gap: 24px;
        }
        .stage {
          position: relative;
          border-radius: 28px;
          background: radial-gradient(circle at top, #1f2937, #0b0f1a 65%);
          height: 420px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .gallows {
          position: absolute;
          inset: 0;
        }
        .beam {
          position: absolute;
          width: 240px;
          height: 12px;
          background: #374151;
          top: 80px;
          left: 120px;
          border-radius: 6px;
        }
        .post {
          position: absolute;
          width: 14px;
          height: 240px;
          background: #374151;
          top: 80px;
          left: 120px;
          border-radius: 6px;
        }
        .base {
          position: absolute;
          width: 200px;
          height: 16px;
          background: #1f2937;
          bottom: 90px;
          left: 80px;
          border-radius: 8px;
        }
        .rope {
          position: absolute;
          width: 4px;
          height: 80px;
          background: #cbd5f5;
          top: 92px;
          left: 350px;
        }
        .figure {
          position: absolute;
          top: 160px;
          left: 320px;
          width: 140px;
          height: 220px;
        }
        .head {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 4px solid #f97316;
          top: 0;
          left: 40px;
          opacity: 0.1;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }
        .head.on {
          opacity: 1;
          transform: scale(1);
        }
        .torso {
          position: absolute;
          width: 8px;
          height: 90px;
          background: #f97316;
          top: 64px;
          left: 66px;
          opacity: 0.1;
          transition: opacity 0.3s ease;
        }
        .torso.on {
          opacity: 1;
        }
        .arm,
        .leg {
          position: absolute;
          width: 70px;
          height: 8px;
          background: #f97316;
          opacity: 0.1;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .arm.left {
          top: 90px;
          left: 0;
          transform: rotate(-25deg);
        }
        .arm.right {
          top: 90px;
          left: 66px;
          transform: rotate(25deg);
        }
        .leg.left {
          top: 150px;
          left: 6px;
          transform: rotate(25deg);
        }
        .leg.right {
          top: 150px;
          left: 66px;
          transform: rotate(-25deg);
        }
        .arm.on,
        .leg.on {
          opacity: 1;
        }
        .effect {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .effect.explosion {
          background: radial-gradient(circle at center, #f97316, transparent 70%);
          animation: blast 0.6s ease;
          opacity: 1;
        }
        .effect.acid {
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.8), transparent);
          animation: drip 0.6s ease;
          opacity: 1;
        }
        .effect.bomb {
          background: radial-gradient(circle at center, #facc15, transparent 70%);
          animation: shock 0.6s ease;
          opacity: 1;
        }
        .effect.pulling {
          background: linear-gradient(90deg, rgba(244, 63, 94, 0.8), transparent);
          animation: yank 0.6s ease;
          opacity: 1;
        }
        .shock {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(248, 250, 252, 0.4);
          opacity: 0;
        }
        .shock.active {
          animation: pulse 0.6s ease;
          opacity: 1;
        }
        .status-card {
          border-radius: 20px;
          padding: 18px 20px;
          background: #111827;
          border: 1px solid rgba(148, 163, 184, 0.2);
          display: grid;
          gap: 10px;
        }
        .status-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #94a3b8;
        }
        .status {
          margin: 0;
          color: #f8fafc;
          font-size: 16px;
          letter-spacing: 0.05em;
        }
        .right-panel {
          display: grid;
          gap: 24px;
        }
        .punishments {
          background: #111827;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          display: grid;
          gap: 16px;
        }
        .punish-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        .punish-card {
          background: #0b0f1a;
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 14px;
          padding: 12px;
          text-align: left;
          color: inherit;
          cursor: pointer;
        }
        .punish-card.active {
          border-color: #f97316;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
        }
        .punish-card h3 {
          margin: 0 0 6px;
          font-size: 16px;
        }
        .punish-card p {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
        }
        .primary {
          background: #f97316;
          border: none;
          color: #0b0f1a;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .word-card {
          background: #111827;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          display: grid;
          gap: 12px;
        }
        .word {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          letter-spacing: 0.3em;
          color: #f8fafc;
        }
        .word.failed {
          color: #f43f5e;
        }
        .guesses {
          color: #94a3b8;
          font-size: 14px;
        }
        .keyboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
          gap: 8px;
        }
        .keyboard button {
          background: #111827;
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #f8fafc;
          padding: 10px 0;
          border-radius: 10px;
          cursor: pointer;
        }
        .keyboard button.used {
          opacity: 0.4;
          cursor: not-allowed;
        }
        @keyframes blast {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        @keyframes drip {
          0% {
            transform: translateY(-40px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(40px);
            opacity: 0;
          }
        }
        @keyframes shock {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        @keyframes yank {
          0% {
            transform: translateX(-20px);
            opacity: 0.9;
          }
          100% {
            transform: translateX(40px);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .stage {
            height: 360px;
          }
        }
      `}</style>
    </main>
  );
}
