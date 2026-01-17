const SLIDES = [
  {
    title: "Orquesta Típica del Estado",
    subtitle: "Orquesta Típica de Jalisco",
    body:
      "Desde 1979, una tradición viva que lleva la música popular mexicana a cada rincón de Jalisco.",
    image:
      "https://img.freepik.com/premium-vector/colorful-illustration-guitar-sombrero-cacti-flowers-sun-yellow-background_150234-133870.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Origen en 1979",
    subtitle: "Teatro Degollado · Palacio de Gobierno",
    body:
      "El 14 de agosto comenzaron los ensayos. El 15 de septiembre se realizó el concierto inaugural.",
    image:
      "https://img.freepik.com/premium-vector/colorful-geometric-illustration-mexican-landscape-with-cactuses-flowers-sombrero-building-with-striped-roof_150234-132898.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Tradición en la Plaza de Armas",
    subtitle: "Miércoles y viernes · 18:30 hrs",
    body:
      "Diez melodías por concierto y la rúbrica de “Guadalajara” para cerrar cada tarde.",
    image:
      "https://img.freepik.com/premium-vector/colorful-illustration-desert-scene-with-guitar-cacti-sun-flowers-clouds_150234-134780.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Instrumentos clásicos y típicos",
    subtitle: "Sinfónica + tradición",
    body:
      "Violines, alientos y percusiones se mezclan con salterio, bandolón, arpa, vihuela y marimba.",
    image:
      "https://img.freepik.com/free-vector/hand-drawn-mexican-culture-illustration_52683-90594.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Repertorio mexicano",
    subtitle: "México, rescate y tradición",
    body:
      "Sones, polkas, huapangos, pasosdobles, boleros, valses y corridos.",
    image:
      "https://img.freepik.com/free-vector/hand-drawn-latin-america-scene-illustration_52683-142374.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Vigencia y futuro",
    subtitle: "Director actual: René Nuño",
    body:
      "Una orquesta joven en esencia, heredera de la pasión de sus fundadores.",
    image:
      "https://img.freepik.com/premium-vector/colorful-geometric-illustration-desert-landscape-with-cacti-flowers-pyramid_150234-134280.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export default function Home() {
  return (
    <main className="story">
      {SLIDES.map((slide) => (
        <section
          key={slide.title}
          className="panel"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay" />
          <div className="content">
            <p className="subtitle">{slide.subtitle}</p>
            <h1>{slide.title}</h1>
            <p className="body">{slide.body}</p>
            <span className="tag">Orquesta Típica del Estado</span>
          </div>
        </section>
      ))}

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
        .story {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
        }
        .panel {
          position: relative;
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          scroll-snap-align: start;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            rgba(7, 7, 7, 0.7),
            rgba(7, 7, 7, 0.35)
          );
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
          margin: 0 0 20px;
          color: #f8fafc;
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
        @media (max-width: 700px) {
          .content {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
