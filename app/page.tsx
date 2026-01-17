"use client";

const SLIDES = [
  {
    title: "Orquesta Típica del Estado",
    subtitle: "Orquesta Típica de Jalisco",
    body: [
      "Desde 1979, una tradición viva que lleva la música popular mexicana a cada rincón de Jalisco.",
      "La Orquesta Típica representa identidad, memoria colectiva y un repertorio que celebra a México.",
    ],
    image:
      "https://img.freepik.com/premium-vector/colorful-illustration-guitar-sombrero-cacti-flowers-sun-yellow-background_150234-133870.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Origen en 1979",
    subtitle: "Convocatoria a músicos",
    body: [
      "En 1979, el departamento de Bellas Artes del gobierno del Estado de Jalisco lanzó una convocatoria para formar la Orquesta Típica de Guadalajara.",
      "El 14 de agosto comenzaron los ensayos en el Teatro Degollado; el 15 de septiembre se realizó el concierto inaugural en Palacio de Gobierno.",
    ],
    image:
      "https://img.freepik.com/free-vector/hand-drawn-latin-america-scene-illustration_52683-142374.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Fundación e impulso",
    subtitle: "Bellas Artes · Gobierno de Jalisco",
    body: [
      "Fue fundada por el departamento de Bellas Artes, con el Lic. Flavio Romero de Velasco como gobernador constitucional y principal impulsor.",
      "En ese periodo, el Lic. José López Portillo era Presidente de la República. El primer director fue el maestro Juan de la Peña y Flores.",
    ],
    image:
      "https://img.freepik.com/free-vector/hand-drawn-mexican-culture-illustration_52683-90594.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Nombre e identidad",
    subtitle: "De Guadalajara a Jalisco",
    body: [
      "Al inicio fue “de Guadalajara” para ser reconocida en cualquier parte del mundo.",
      "Se cambió a Orquesta Típica de Jalisco para difundir la cultura y tradiciones del estado que representa.",
    ],
    image:
      "https://img.freepik.com/free-vector/mexican-bunting-collection-theme_23-2148470253.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Tradición viva",
    subtitle: "Plaza de Armas",
    body: [
      "Por tradición, se presenta todos los miércoles y viernes a las 18:30 horas en el quiosco de la Plaza de Armas de Guadalajara.",
      "Interpreta 10 melodías y cierra con una fracción del son popular “Guadalajara”, de Pepe Guízar.",
    ],
    image:
      "https://img.freepik.com/premium-vector/colorful-illustration-desert-scene-with-guitar-cacti-sun-flowers-clouds_150234-134780.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Gira permanente",
    subtitle: "Jalisco y México",
    body: [
      "Es la agrupación que más viaja al interior del estado: ha recorrido todos los municipios con gran éxito y aceptación del público.",
      "También ha llevado la música y tradiciones mexicanas a otros estados de la República.",
    ],
    image:
      "https://img.freepik.com/premium-vector/geometric-illustration-colorful-stylized-desert-scene-with-building-mountains-cactuses-sunset_150234-134770.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Instrumentos clásicos",
    subtitle: "Base sinfónica",
    body: [
      "Violines, viola, violonchelos y contrabajos; alientos madera: flautas, oboes y clarinetes.",
      "Alientos metales: trompetas, trombones y percusiones como timbal y platillo.",
    ],
    image:
      "https://img.freepik.com/premium-vector/flat-design-colorful-mexican-background_135595-18349.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Instrumentos típicos",
    subtitle: "Timbre tradicional",
    body: [
      "El carácter típico lo aportan el salterio, bandolón, mandolinas, arpa, guitarra, vihuela y marimba.",
      "Son el sello sonoro que distingue a la orquesta en cada presentación.",
    ],
    image:
      "https://img.freepik.com/premium-vector/flat-design-colorful-mexican-background_135595-18353.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Repertorio",
    subtitle: "México, rescate y tradición",
    body: [
      "Sones, polkas, huapangos, pasosdobles, marchas, boleros, fantasías, mosaicos y popurríes.",
      "Valses, danzas, canciones rancheras y corridos llenan el escenario con identidad mexicana.",
    ],
    image:
      "https://img.freepik.com/premium-vector/colorful-geometric-illustration-mexican-landscape-with-cactuses-flowers-sombrero-building-with-striped-roof_150234-132898.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Directores",
    subtitle: "Legado musical",
    body: [
      "Juan de la Peña y Flores, Francisco Hernández García, Antonio Cordero, Martín Gordo López, Salvador Arreola N., Cirilo Santana Lomelí, Pedro Macías Limón, José Luis Núñez Melchor.",
      "Director actual: René Nuño.",
    ],
    image:
      "https://img.freepik.com/free-vector/flat-mexican-map-background-with-elements_23-2147750147.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Vigencia",
    subtitle: "Orgullo jalisciense",
    body: [
      "La tradición de las Orquestas Típicas en México ha disminuido en los últimos 50 años.",
      "Jalisco conserva esta joya desde 1979 gracias al desempeño de sus integrantes y al amor por la música tradicional.",
    ],
    image:
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export default function Home() {
  return (
    <main className="stage">
      <section className="intro">
        <div className="intro-map" aria-hidden="true">
          <span className="map-highlight" />
          <span className="map-highlight second" />
        </div>
        <div className="sombrero" aria-hidden="true">
          <span className="sombrero-top" />
          <span className="sombrero-brim" />
        </div>
        <div className="intro-text">
          <p>Orquesta Típica del Estado</p>
          <h1>Jalisco en movimiento</h1>
        </div>
      </section>

      <section className="story">
        {SLIDES.map((slide) => (
          <section key={slide.title} className="panel">
            <div className="overlay" />
            <div className="content">
              <p className="subtitle">{slide.subtitle}</p>
              <h1>{slide.title}</h1>
              <div className="body">
                {slide.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <span className="tag">Orquesta Típica del Estado</span>
            </div>
            <figure className="panel-media">
              <img src={slide.image} alt={slide.title} loading="lazy" />
              <figcaption>Orquesta Típica de Jalisco</figcaption>
            </figure>
          </section>
        ))}
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Manrope:wght@300;400;600&display=swap");
        :root {
          color-scheme: light;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: #050505;
          font-family: "Manrope", sans-serif;
        }
        .stage {
          min-height: 100vh;
          background: radial-gradient(circle at top, #ffe9c2 0%, #f7f2e8 40%, #e9f3ff 100%);
        }
        .intro {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at top, #ffd59a 0%, #f5f2ee 40%, #d5e9ff 100%);
          z-index: 5;
          animation: intro-hide 0.8s ease forwards;
          animation-delay: 3.4s;
        }
        .intro-map {
          width: min(320px, 70vw);
          height: min(420px, 80vh);
          border-radius: 48% 52% 50% 50%;
          background: linear-gradient(160deg, rgba(22, 101, 52, 0.2), rgba(21, 128, 61, 0.6));
          border: 2px solid rgba(16, 185, 129, 0.5);
          box-shadow: 0 30px 60px rgba(30, 64, 175, 0.2);
          position: relative;
        }
        .map-highlight {
          position: absolute;
          inset: 18% 30% 52% 34%;
          border-radius: 999px;
          background: rgba(251, 191, 36, 0.5);
          filter: blur(10px);
        }
        .map-highlight.second {
          inset: 52% 24% 22% 40%;
          background: rgba(244, 63, 94, 0.4);
        }
        .sombrero {
          position: absolute;
          width: 120px;
          height: 60px;
          left: calc(50% - 60px);
          top: -10%;
          animation: sombrero-travel 3.2s ease-in-out forwards;
        }
        .sombrero-top {
          position: absolute;
          width: 70px;
          height: 36px;
          background: linear-gradient(120deg, #f59e0b, #facc15);
          border-radius: 50% 50% 40% 40%;
          left: 25px;
          top: 6px;
          box-shadow: 0 10px 20px rgba(120, 53, 15, 0.35);
        }
        .sombrero-brim {
          position: absolute;
          width: 120px;
          height: 26px;
          background: linear-gradient(120deg, #f59e0b, #fbbf24);
          border-radius: 50%;
          top: 26px;
          left: 0;
          box-shadow: 0 8px 18px rgba(120, 53, 15, 0.35);
        }
        .intro-text {
          position: absolute;
          bottom: 12%;
          text-align: center;
          color: #1f2937;
          font-family: "Fraunces", serif;
          animation: intro-text 0.8s ease forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }
        .intro-text h1 {
          margin: 6px 0 0;
          font-size: clamp(2.2rem, 4vw, 3.4rem);
        }
        .story {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          opacity: 0;
          animation: story-show 0.8s ease forwards;
          animation-delay: 3.6s;
        }
        .panel {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          align-items: center;
          gap: 36px;
          padding: clamp(24px, 4vw, 80px);
          scroll-snap-align: start;
          isolation: isolate;
          animation: panel-rise 1.2s ease both;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255, 248, 235, 0.85), rgba(233, 244, 255, 0.75));
          mix-blend-mode: multiply;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          max-width: 720px;
          padding: clamp(24px, 4vw, 48px);
          border-radius: 28px;
          background: rgba(8, 8, 8, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          backdrop-filter: blur(10px);
          text-align: left;
          animation: float-in 1.4s ease both;
        }
        .panel-media {
          position: relative;
          z-index: 1;
          margin: 0;
          display: grid;
          gap: 12px;
        }
        .panel-media img {
          width: 100%;
          height: min(60vh, 520px);
          object-fit: cover;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
        }
        .panel-media figcaption {
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
        }
        h1 {
          font-family: "Fraunces", serif;
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          margin: 10px 0 14px;
        }
        .subtitle {
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 12px;
          color: #fbbf24;
          margin: 0;
        }
        .body {
          font-size: 18px;
          line-height: 1.7;
          color: #f8fafc;
        }
        .body p {
          margin: 0 0 16px;
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        @keyframes sombrero-travel {
          0% {
            transform: translateY(-20%) rotate(-8deg);
          }
          100% {
            transform: translateY(130vh) rotate(8deg);
          }
        }
        @keyframes intro-text {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(12px);
          }
        }
        @keyframes intro-hide {
          to {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
          }
        }
        @keyframes story-show {
          to {
            opacity: 1;
          }
        }
        @keyframes panel-rise {
          from {
            opacity: 0;
            transform: scale(1.02);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float-in {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 700px) {
          .content {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
