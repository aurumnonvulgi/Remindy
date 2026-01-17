"use client";

import { useMemo, useRef, useState } from "react";

const AGENCY = {
  name: "Say Yes Travel Agency",
  phone: "510-329-8786",
  email: "sayyes@gmail.com",
};

const COUNTRIES = [
  {
    id: "japan",
    name: "Japón",
    color: "#f97316",
    packages: [
      {
        title: "Disney Cruise Asia — Todo Incluido",
        subtitle: "Tokyo · Osaka · Yokohama",
        summary:
          "Crucero Disney, vuelos, hoteles 4★, traslados y entradas a parques.",
        includes: [
          "Vuelos ida y vuelta",
          "Crucero Disney",
          "Hoteles 4★",
          "Traslados privados",
          "Parques incluidos",
        ],
      },
      {
        title: "Ruta Imperial de Japón",
        subtitle: "Kyoto · Nara · Tokyo",
        summary:
          "Templos, tren bala, hoteles boutique y experiencias culturales.",
        includes: [
          "Tren bala JR",
          "Guías locales",
          "Cena kaiseki",
          "Hospedaje boutique",
          "Pases culturales",
        ],
      },
    ],
  },
  {
    id: "greece",
    name: "Grecia",
    color: "#38bdf8",
    packages: [
      {
        title: "Santorini & Atenas romántico",
        subtitle: "Santorini · Atenas",
        summary:
          "Hoteles frente al mar, ferries rápidos y tours privados.",
        includes: [
          "Vuelos internacionales",
          "Hotel con vista",
          "Ferry rápido",
          "Tour privado",
          "Traslados",
        ],
      },
    ],
  },
  {
    id: "uae",
    name: "Emiratos Árabes",
    color: "#facc15",
    packages: [
      {
        title: "Safari & Dubai",
        subtitle: "Dubai · Abu Dhabi",
        summary:
          "Desierto, rascacielos, lujo y experiencias exclusivas.",
        includes: [
          "Hotel 5★",
          "Safari en el desierto",
          "City pass",
          "Cena espectáculo",
          "Traslados",
        ],
      },
    ],
  },
  {
    id: "mexico",
    name: "México",
    color: "#22c55e",
    packages: [
      {
        title: "Aventura Maya Premium",
        subtitle: "Cancún · Tulum · Chichén Itzá",
        summary:
          "Resort todo incluido, tours arqueológicos y cenotes privados.",
        includes: [
          "Resort 5★",
          "Tours arqueológicos",
          "Cenotes privados",
          "Traslados VIP",
          "Seguro de viaje",
        ],
      },
    ],
  },
  {
    id: "thailand",
    name: "Tailandia",
    color: "#ec4899",
    packages: [
      {
        title: "Templos del Sudeste Asiático",
        subtitle: "Bangkok · Ayutthaya",
        summary:
          "Templos legendarios, hoteles con encanto y guías expertos.",
        includes: [
          "Tours de templos",
          "Guía bilingüe",
          "Hoteles boutique",
          "Experiencia gastronómica",
          "Traslados internos",
        ],
      },
    ],
  },
  {
    id: "cambodia",
    name: "Camboya",
    color: "#a855f7",
    packages: [
      {
        title: "Angkor & Cultura Khmer",
        subtitle: "Siem Reap · Angkor",
        summary:
          "Templos sagrados, experiencias locales y alojamientos premium.",
        includes: [
          "Amanecer en Angkor",
          "Tour gastronómico",
          "Hotel boutique",
          "Traslados",
          "Guía cultural",
        ],
      },
    ],
  },
];

const COUNTRY_LOOKUP = Object.fromEntries(
  COUNTRIES.map((country) => [country.id, country])
);

type ViewState = {
  x: number;
  y: number;
  scale: number;
};

export default function Home() {
  const [activeId, setActiveId] = useState("japan");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const activeCountry = COUNTRY_LOOKUP[activeId];

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setView((prev) => {
      const nextScale = Math.min(
        2.2,
        Math.max(0.7, prev.scale - event.deltaY * 0.001)
      );
      return { ...prev, scale: nextScale };
    });
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    dragRef.current = {
      x: event.clientX - view.x,
      y: event.clientY - view.y,
    };
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!dragRef.current) return;
    setView((prev) => ({
      ...prev,
      x: event.clientX - dragRef.current!.x,
      y: event.clientY - dragRef.current!.y,
    }));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const resetView = () => {
    setView({ x: 0, y: 0, scale: 1 });
  };

  const selectedLabel = useMemo(() => {
    if (hoveredId && COUNTRY_LOOKUP[hoveredId]) {
      return COUNTRY_LOOKUP[hoveredId].name;
    }
    return activeCountry.name;
  }, [hoveredId, activeCountry.name]);

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">{AGENCY.name}</p>
          <h1>Viajes curados por expertos en destinos inolvidables</h1>
          <p className="lead">
            Explora el mapa, elige un país y descubre paquetes completos con vuelos,
            hoteles, transporte y experiencias.
          </p>
        </div>
        <div className="contact">
          <span>📞 {AGENCY.phone}</span>
          <span>✉️ {AGENCY.email}</span>
        </div>
      </header>

      <section className="experience">
        <div className="map-panel">
          <div className="map-header">
            <div>
              <p className="eyebrow">Mapa interactivo</p>
              <h2>Ruta musical del mundo</h2>
              <p className="hint">
                Arrastra para mover y usa scroll para acercar o alejar.
              </p>
            </div>
            <div className="map-actions">
              <span className="active">{selectedLabel}</span>
              <button onClick={resetView}>Reiniciar vista</button>
            </div>
          </div>

          <div
            className="map-frame"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div
              className="map-canvas"
              style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
              }}
            >
              <svg viewBox="0 0 1000 520" role="img" aria-label="Mapa del mundo">
                <rect width="1000" height="520" fill="#eef2f7" rx="40" />
                <path
                  d="M60 140 Q180 70 320 140 L360 230 L280 300 L150 280 L90 220 Z"
                  fill="#d9e5f2"
                />
                <path
                  d="M380 130 L620 120 L760 200 L700 310 L480 330 L360 250 Z"
                  fill="#d9e5f2"
                />
                <path
                  d="M660 110 L920 120 L960 220 L880 320 L700 300 L640 200 Z"
                  fill="#d9e5f2"
                />
                <path
                  d="M520 330 L700 360 L740 460 L520 470 L460 380 Z"
                  fill="#d9e5f2"
                />

                <g
                  className={`country ${activeId === "mexico" ? "selected" : ""}`}
                  onClick={() => setActiveId("mexico")}
                  onMouseEnter={() => setHoveredId("mexico")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <path
                    d="M200 260 L260 250 L300 280 L280 320 L220 320 L190 290 Z"
                    fill={COUNTRY_LOOKUP.mexico.color}
                  />
                </g>
                <g
                  className={`country ${activeId === "japan" ? "selected" : ""}`}
                  onClick={() => setActiveId("japan")}
                  onMouseEnter={() => setHoveredId("japan")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <circle
                    cx="820"
                    cy="210"
                    r="22"
                    fill={COUNTRY_LOOKUP.japan.color}
                  />
                </g>
                <g
                  className={`country ${activeId === "greece" ? "selected" : ""}`}
                  onClick={() => setActiveId("greece")}
                  onMouseEnter={() => setHoveredId("greece")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <path
                    d="M560 240 L590 230 L610 250 L590 270 L560 260 Z"
                    fill={COUNTRY_LOOKUP.greece.color}
                  />
                </g>
                <g
                  className={`country ${activeId === "uae" ? "selected" : ""}`}
                  onClick={() => setActiveId("uae")}
                  onMouseEnter={() => setHoveredId("uae")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <circle cx="630" cy="290" r="16" fill={COUNTRY_LOOKUP.uae.color} />
                </g>
                <g
                  className={`country ${activeId === "thailand" ? "selected" : ""}`}
                  onClick={() => setActiveId("thailand")}
                  onMouseEnter={() => setHoveredId("thailand")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <path
                    d="M740 300 L770 310 L770 350 L740 340 Z"
                    fill={COUNTRY_LOOKUP.thailand.color}
                  />
                </g>
                <g
                  className={`country ${activeId === "cambodia" ? "selected" : ""}`}
                  onClick={() => setActiveId("cambodia")}
                  onMouseEnter={() => setHoveredId("cambodia")}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <circle
                    cx="780"
                    cy="330"
                    r="14"
                    fill={COUNTRY_LOOKUP.cambodia.color}
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <aside className="details">
          <div className="details-header">
            <h3>{activeCountry.name}</h3>
            <span className="pill">{activeCountry.packages.length} paquetes</span>
          </div>
          <p className="details-lead">
            Paquetes diseñados para viajar sin estrés, con todo incluido y atención
            personalizada.
          </p>

          <div className="package-list">
            {activeCountry.packages.map((pkg) => (
              <article key={pkg.title} className="package-card">
                <div>
                  <p className="package-subtitle">{pkg.subtitle}</p>
                  <h4>{pkg.title}</h4>
                  <p className="package-summary">{pkg.summary}</p>
                </div>
                <ul>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <footer className="footer">
        <div>
          <strong>{AGENCY.name}</strong>
          <p>Viaja con paquetes completos y asesoría experta.</p>
        </div>
        <div>
          <p>📞 {AGENCY.phone}</p>
          <p>✉️ {AGENCY.email}</p>
        </div>
      </footer>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: "Playfair Display", "Georgia", serif;
          background: #f8f5f0;
          color: #1f2933;
        }
        .page {
          padding: 56px clamp(24px, 6vw, 90px) 72px;
          display: grid;
          gap: 48px;
        }
        .header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          color: #a16207;
          margin: 0 0 12px;
        }
        h1 {
          font-size: clamp(2.3rem, 4vw, 3.4rem);
          margin: 0 0 16px;
        }
        .lead {
          font-size: 18px;
          line-height: 1.7;
          margin: 0;
          color: #4b5563;
          max-width: 620px;
        }
        .contact {
          display: grid;
          gap: 8px;
          font-weight: 600;
          background: #ffffff;
          padding: 16px 22px;
          border-radius: 16px;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
        }
        .experience {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 32px;
        }
        .map-panel {
          background: #fffdf8;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
        }
        .map-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          margin-bottom: 16px;
        }
        h2 {
          margin: 8px 0 4px;
          font-size: 24px;
        }
        .hint {
          margin: 0;
          color: #6b7280;
        }
        .map-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .map-actions button {
          border: none;
          background: #1f2933;
          color: #fff7ed;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
        }
        .map-actions .active {
          padding: 6px 12px;
          border-radius: 999px;
          background: #fef3c7;
          color: #a16207;
          font-weight: 600;
        }
        .map-frame {
          background: #f1f5f9;
          border-radius: 22px;
          height: 420px;
          overflow: hidden;
          position: relative;
          touch-action: none;
        }
        .map-canvas {
          width: 100%;
          height: 100%;
          transform-origin: center;
          display: grid;
          place-items: center;
        }
        svg {
          width: 100%;
          height: 100%;
        }
        .country {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .country:hover {
          transform: scale(1.04);
        }
        .country.selected {
          filter: drop-shadow(0 6px 10px rgba(15, 23, 42, 0.35));
        }
        .details {
          background: #ffffff;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
          display: grid;
          gap: 18px;
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        h3 {
          margin: 0;
          font-size: 24px;
        }
        .pill {
          background: #fef3c7;
          color: #a16207;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .details-lead {
          margin: 0;
          color: #6b7280;
          line-height: 1.6;
        }
        .package-list {
          display: grid;
          gap: 16px;
        }
        .package-card {
          border: 1px solid #f1f5f9;
          border-radius: 18px;
          padding: 16px;
          display: grid;
          gap: 12px;
          background: #fffaf2;
        }
        .package-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 11px;
          color: #a16207;
          margin: 0 0 4px;
        }
        h4 {
          margin: 0;
          font-size: 18px;
        }
        .package-summary {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }
        ul {
          margin: 0;
          padding-left: 18px;
          color: #4b5563;
          display: grid;
          gap: 6px;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 14px;
          color: #4b5563;
        }
        .footer strong {
          color: #1f2933;
        }
        @media (max-width: 920px) {
          .experience {
            grid-template-columns: 1fr;
          }
          .map-frame {
            height: 360px;
          }
        }
        @media (max-width: 640px) {
          .page {
            padding: 40px 20px 56px;
          }
          .map-frame {
            height: 320px;
          }
        }
      `}</style>
    </main>
  );
}
