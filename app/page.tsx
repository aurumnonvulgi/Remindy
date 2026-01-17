"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const MESSAGE = "EN PLAYGROUND";

const useScatterMap = () => {
  return useMemo(() => {
    return MESSAGE.split("").map((char, index) => {
      if (char === " ") {
        return { char, dx: 0, dy: 0, rot: 0, delay: index * 0.08 };
      }
      const angle = (index * 37) % 360;
      const radius = 180 + (index % 6) * 40;
      const dx = Math.round(Math.cos((angle * Math.PI) / 180) * radius);
      const dy = Math.round(Math.sin((angle * Math.PI) / 180) * radius);
      const rot = ((index * 31) % 90) - 45;
      return { char, dx, dy, rot, delay: index * 0.08 };
    });
  }, []);
};

export default function Home() {
  const [phase, setPhase] = useState<
    "reveal" | "hold" | "scatter" | "final"
  >("reveal");
  const scatterMap = useScatterMap();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const coinsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const revealDuration = MESSAGE.length * 80 + 600;
    const holdDuration = 5000;
    const scatterDuration = 3200;

    const holdTimer = window.setTimeout(() => {
      setPhase("hold");
    }, revealDuration);

    const scatterTimer = window.setTimeout(() => {
      setPhase("scatter");
    }, revealDuration + holdDuration);

    const finalTimer = window.setTimeout(() => {
      setPhase("final");
    }, revealDuration + holdDuration + scatterDuration);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(scatterTimer);
      window.clearTimeout(finalTimer);
    };
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      }
      if (!coinsRef.current) {
        return;
      }
      const coin = document.createElement("span");
      coin.className = "coin";
      coin.style.left = `${event.clientX + (Math.random() * 14 - 7)}px`;
      coin.style.top = `${event.clientY + (Math.random() * 14 - 7)}px`;
      coin.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
      coin.style.opacity = `${0.7 + Math.random() * 0.3}`;
      coinsRef.current.appendChild(coin);
      window.setTimeout(() => coin.remove(), 2000);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <main className="stage">
      <div ref={coinsRef} className="coin-field" />
      <div ref={cursorRef} className="btc-cursor" aria-hidden="true" />

      <section className={`intro ${phase}`} aria-live="polite">
        <div className="message">
          {scatterMap.map((item, index) => (
            <span
              key={`${item.char}-${index}`}
              className={`letter ${item.char === " " ? "space" : ""}`}
              style={
                {
                  "--delay": `${item.delay}s`,
                  "--dx": `${item.dx}px`,
                  "--dy": `${item.dy}px`,
                  "--rot": `${item.rot}deg`,
                } as CSSProperties
              }
            >
              {item.char}
            </span>
          ))}
        </div>
      </section>

      <section className={`finale ${phase}`}>
        <div className="triangle-wrap">
          <div className="triangle" />
          <div className="triangle glow" />
        </div>
        <div className="final-text">EN PLAYGROUND</div>
      </section>
      <style jsx global>{`
        :root {
          color-scheme: dark;
        }
        body {
          margin: 0;
          background: #050505;
        }
        .stage {
          min-height: 100vh;
          background: radial-gradient(circle at top, #111 0%, #050505 55%);
          color: #f8fafc;
          display: grid;
          place-items: center;
          overflow: hidden;
          position: relative;
          cursor: none;
          font-family: \"Space Grotesk\", \"Trebuchet MS\", sans-serif;
        }
        .intro {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          transition: opacity 1.2s ease;
        }
        .intro.final {
          opacity: 0;
          pointer-events: none;
        }
        .message {
          display: flex;
          gap: 0.2em;
          font-size: clamp(2.4rem, 6vw, 5rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .letter {
          opacity: 0;
          transform: translateY(20px);
          animation: reveal 0.6s ease forwards;
          animation-delay: var(--delay);
        }
        .intro.hold .letter {
          opacity: 1;
        }
        .intro.scatter .letter {
          animation: scatter 3.2s ease forwards;
          animation-delay: var(--delay);
        }
        .space {
          width: 0.6em;
        }
        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scatter {
          to {
            opacity: 0;
            transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--rot));
          }
        }
        .finale {
          opacity: 0;
          display: grid;
          gap: 2rem;
          place-items: center;
          transition: opacity 1.5s ease;
        }
        .finale.final {
          opacity: 1;
        }
        .triangle-wrap {
          position: relative;
          width: 240px;
          height: 240px;
        }
        .triangle {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 180px;
          height: 180px;
          background: conic-gradient(
            from 120deg,
            #d1a54b,
            #f8e5a1,
            #b88a2b,
            #f6d67b,
            #d1a54b
          );
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          filter: drop-shadow(0 0 24px rgba(248, 221, 140, 0.45));
          animation: spin 6s linear infinite;
          transform-style: preserve-3d;
        }
        .triangle.glow {
          transform: scale(1.1);
          opacity: 0.3;
          animation: spin 9s linear infinite reverse;
          filter: blur(18px);
        }
        @keyframes spin {
          from {
            transform: rotateY(0deg) rotateX(10deg);
          }
          to {
            transform: rotateY(360deg) rotateX(10deg);
          }
        }
        .final-text {
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-weight: 500;
          color: #f8fafc;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.15);
        }
        .btc-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffd166, #f7931a);
          box-shadow: 0 0 18px rgba(247, 147, 26, 0.6);
          transform: translate(-100px, -100px);
          pointer-events: none;
          z-index: 10;
        }
        .btc-cursor::after {
          content: \"₿\";
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-weight: 700;
          color: #1b1200;
          font-size: 16px;
        }
        .coin-field {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .coin {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff1a6, #f4b740);
          box-shadow: 0 0 10px rgba(244, 183, 64, 0.6);
          animation-name: coin-fall;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes coin-fall {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(90px) scale(0.7);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
