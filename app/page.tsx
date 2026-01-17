"use client";

import { useMemo, useState } from "react";

const PAGES = [
  {
    title: "Portada",
    subtitle: "Orquesta Típica de Jalisco",
    body: [
      "Orquesta Típica del Estado",
      "Un recorrido por la historia, tradición y repertorio de una agrupación que mantiene viva la música popular mexicana desde 1979.",
    ],
  },
  {
    title: "Origen",
    subtitle: "Convocatoria y primeros ensayos",
    body: [
      "En 1979, el departamento de Bellas Artes del gobierno del Estado de Jalisco lanzó una convocatoria a músicos ejecutantes de diversos instrumentos para formar la Orquesta Típica de Guadalajara.",
      "De inmediato, el 14 de agosto de 1979 la nueva orquesta comenzó a ensayar en el Teatro Degollado y el 15 de septiembre de ese mismo año, con el Palacio de Gobierno como escenario, se efectuó el concierto inaugural.",
    ],
  },
  {
    title: "Fundación",
    subtitle: "Impulso institucional",
    body: [
      "Fue fundada por el entonces departamento de Bellas Artes del gobierno del Estado de Jalisco, siendo Gobernador Constitucional el Lic. Flavio Romero de Velasco, quien fuera su principal promotor e impulsor.",
      "En ese mismo periodo fungía como Presidente de la República Mexicana el Lic. José López Portillo. Su primer director fue el maestro Juan de la Peña y Flores.",
    ],
  },
  {
    title: "Identidad",
    subtitle: "De Guadalajara a Jalisco",
    body: [
      "En sus orígenes fue nombrada “de Guadalajara” con la intención de que fuera reconocida en cualquier parte del mundo.",
      "Sin embargo se cambió el título por Orquesta Típica de Jalisco para dar mayor difusión a la cultura y tradiciones del estado que representa esta importante agrupación.",
    ],
  },
  {
    title: "Tradición viva",
    subtitle: "Plaza de Armas",
    body: [
      "La Orquesta Típica de Jalisco, por tradición desde su fundación, se presenta todos los miércoles y viernes a las 18:30 horas en el quiosco de la Plaza de Armas de Guadalajara, donde interpreta 10 melodías, y como rúbrica, una fracción del son popular “Guadalajara”, de Pepe Guízar, para deleitar al público.",
    ],
  },
  {
    title: "Gira permanente",
    subtitle: "Todo Jalisco",
    body: [
      "Es la agrupación que más viaja al interior del estado, ha recorrido todos los municipios con gran éxito y aceptación del público, llevando la música y tradiciones mexicanas a cada rincón de Jalisco, así como a otros estados de la República Mexicana.",
    ],
  },
  {
    title: "Instrumentos clásicos",
    subtitle: "Base sinfónica",
    body: [
      "En sus bases tiene los mismos instrumentos clásicos que una orquesta sinfónica, como son: violines, viola, violonchelos y contrabajos, alientos madera: flautas, oboes y clarinetes; alientos metales: trompetas, trombones y percusiones como el timbal, platillo.",
    ],
  },
  {
    title: "Instrumentos típicos",
    subtitle: "Timbre tradicional",
    body: [
      "Lo que le da el carácter o timbre de típica son los instrumentos tradicionales como son: el salterio, bandolón, mandolinas, arpa, guitarra, vihuela y marimba.",
    ],
  },
  {
    title: "Repertorio",
    subtitle: "México, rescate y tradición",
    body: [
      "El repertorio de la Orquesta Típica está conformado principalmente por música popular mexicana, bajo el lema “México, rescate y tradición” e incluye sones, polkas, huapangos, pasosdobles, marchas, boleros, fantasías, mosaicos, popurríes, valses, danzas, canciones rancheras y corridos.",
    ],
  },
  {
    title: "Directores",
    subtitle: "Legado musical",
    body: [
      "Entre los directores que han participado y aportado grandes joyas a la Orquesta se encuentran Juan de la Peña y Flores, Francisco Hernández García, Antonio Cordero, Martín Gordo López, Salvador Arreola N., Cirilo Santana Lomelí, Pedro Macías Limón, José Luis Núñez Melchor, y actualmente el maestro, J. Ramón Becerra Caro.",
    ],
  },
  {
    title: "Vigencia",
    subtitle: "Orgullo jalisciense",
    body: [
      "La tradición de las Orquestas Típicas en la República Mexicana ha disminuido notablemente en los últimos 50 años.",
      "Afortunadamente, nuestro estado cuenta con la Orquesta Típica de Jalisco, que está vigente desde 1979, y que, gracias al desempeño de sus integrantes, nos permite disfrutar de la belleza de nuestra música tradicional mexicana.",
      "Aunque la agrupación está integrada actualmente casi en su totalidad por jóvenes, siguen manteniendo el amor y la pasión en cada nota, heredados por los propios fundadores de la Orquesta Típica.",
    ],
  },
];

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  const page = PAGES[pageIndex];
  const progress = useMemo(
    () => ((pageIndex + 1) / PAGES.length) * 100,
    [pageIndex]
  );

  return (
    <main className="library">
      <div className="ambient glow-one" aria-hidden="true" />
      <div className="ambient glow-two" aria-hidden="true" />

      <header className="hero">
        <div>
          <p className="eyebrow">Libro interactivo</p>
          <h1>Orquesta Típica del Estado</h1>
          <p className="subtitle">Orquesta Típica de Jalisco</p>
        </div>
        <div className="progress">
          <span>Página {pageIndex + 1} de {PAGES.length}</span>
          <div className="progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <section className="book">
        <aside className="toc">
          <h2>Capítulos</h2>
          <ol>
            {PAGES.map((entry, index) => (
              <li key={entry.title}>
                <button
                  type="button"
                  onClick={() => setPageIndex(index)}
                  className={index === pageIndex ? "active" : ""}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{entry.title}</strong>
                    <em>{entry.subtitle}</em>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <article className="page">
          <div className="page-header">
            <p className="page-number">Capítulo {pageIndex + 1}</p>
            <h2>{page.title}</h2>
            <p className="page-subtitle">{page.subtitle}</p>
          </div>

          <div className="page-body">
            {page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="page-footer">
            <button
              type="button"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
            >
              ← Página anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setPageIndex((prev) => Math.min(prev + 1, PAGES.length - 1))
              }
              disabled={pageIndex === PAGES.length - 1}
            >
              Página siguiente →
            </button>
          </div>
        </article>
      </section>

      <section className="gallery">
        <div className="gallery-header">
          <h3>Galería visual</h3>
          <p>Espacios reservados para imágenes de la orquesta.</p>
        </div>
        <div className="gallery-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="gallery-card" key={`gallery-${index}`}>
              <span>Imagen {index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>
          Libro interactivo de la Orquesta Típica del Estado. Diseñado para
          compartir tradición, historia y música mexicana.
        </p>
        <span>Actualizado · 2026</span>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600&display=swap");
        :root {
          color-scheme: light;
        }
        body {
          margin: 0;
          background: #f6efe4;
          color: #1f2937;
          font-family: "Manrope", sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        .library {
          min-height: 100vh;
          padding: 40px clamp(20px, 4vw, 80px) 60px;
          position: relative;
          overflow: hidden;
        }
        .ambient {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.4;
          z-index: 0;
        }
        .glow-one {
          width: 320px;
          height: 320px;
          background: rgba(239, 68, 68, 0.2);
          top: -80px;
          left: -60px;
        }
        .glow-two {
          width: 420px;
          height: 420px;
          background: rgba(59, 130, 246, 0.15);
          bottom: -140px;
          right: -100px;
        }
        .hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          position: relative;
          z-index: 1;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          color: #b45309;
          margin: 0;
        }
        h1 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.6rem, 4vw, 4rem);
          margin: 8px 0 6px;
        }
        .subtitle {
          font-size: 18px;
          margin: 0;
          color: #6b7280;
        }
        .progress {
          text-align: right;
          font-size: 14px;
          color: #6b7280;
          min-width: 180px;
        }
        .progress-bar {
          margin-top: 8px;
          background: #e5e7eb;
          border-radius: 999px;
          height: 6px;
          overflow: hidden;
        }
        .progress-bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #b45309, #f59e0b);
        }
        .book {
          margin-top: 40px;
          display: grid;
          grid-template-columns: minmax(220px, 1fr) minmax(320px, 2.3fr);
          gap: 28px;
          position: relative;
          z-index: 1;
        }
        .toc {
          background: #fdf7ed;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #f1e2c8;
          box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
        }
        .toc h2 {
          margin-top: 0;
          font-family: "Cormorant Garamond", serif;
        }
        .toc ol {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
          display: grid;
          gap: 10px;
        }
        .toc button {
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          display: flex;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .toc button span {
          font-weight: 600;
          color: #b45309;
        }
        .toc button em {
          display: block;
          font-style: normal;
          font-size: 12px;
          color: #9ca3af;
        }
        .toc button.active,
        .toc button:hover {
          background: rgba(251, 191, 36, 0.18);
        }
        .page {
          background: #fffaf2;
          border-radius: 26px;
          padding: 32px;
          border: 1px solid #f1e2c8;
          box-shadow: 0 24px 40px rgba(15, 23, 42, 0.1);
          display: flex;
          flex-direction: column;
          min-height: 420px;
        }
        .page-header h2 {
          font-family: "Cormorant Garamond", serif;
          font-size: 32px;
          margin: 6px 0;
        }
        .page-number {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 12px;
          color: #b45309;
          margin: 0;
        }
        .page-subtitle {
          margin: 0;
          color: #6b7280;
        }
        .page-body {
          margin-top: 20px;
          display: grid;
          gap: 16px;
          font-size: 17px;
          line-height: 1.7;
        }
        .page-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .page-footer button {
          border-radius: 999px;
          padding: 10px 18px;
          border: 1px solid #e7d3aa;
          background: #fff4dd;
          cursor: pointer;
          font-weight: 600;
          color: #92400e;
        }
        .page-footer button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .gallery {
          margin-top: 50px;
          position: relative;
          z-index: 1;
        }
        .gallery-header h3 {
          font-family: "Cormorant Garamond", serif;
          margin: 0 0 6px;
          font-size: 26px;
        }
        .gallery-header p {
          margin: 0;
          color: #6b7280;
        }
        .gallery-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .gallery-card {
          border-radius: 18px;
          padding: 22px;
          border: 1px dashed #e2ccb0;
          background: #fff9ef;
          text-align: center;
          color: #9a3412;
          font-weight: 600;
        }
        .footer {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          color: #6b7280;
          font-size: 13px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .book {
            grid-template-columns: 1fr;
          }
          .progress {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}
