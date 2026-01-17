"use client";

const SLIDES = [
  {
    layout: "center",
    title: "Orquesta Típica del Estado",
    subtitle: "Orquesta Típica de Jalisco",
    body: [
      "Desde 1979, una tradición viva que lleva la música popular mexicana a cada rincón de Jalisco.",
      "La Orquesta Típica representa identidad, memoria colectiva y un repertorio que celebra a México.",
    ],
    image:
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    layout: "split-left",
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
    layout: "split-right",
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
    layout: "stack",
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
    layout: "quote",
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
    layout: "split-left",
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
    layout: "split-right",
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
    layout: "collage",
    title: "Instrumentos típicos",
    subtitle: "Timbre tradicional",
    body: [
      "El carácter típico lo aportan el salterio, bandolón, mandolinas, arpa, guitarra, vihuela y marimba.",
      "Son el sello sonoro que distingue a la orquesta en cada presentación.",
    ],
    images: [
      "https://img.freepik.com/free-vector/mexican-celebration-with-cactus-with-mustache-hat-as-icon-mexican-culture_24908-60784.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.freepik.com/premium-vector/hola-quote-with-sun-print_92289-2567.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.freepik.com/free-vector/mexican-map-with-cultural-elements_23-2147733686.jpg?semt=ais_hybrid&w=740&q=80",
    ],
  },
  {
    layout: "center",
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
    layout: "split-right",
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
    layout: "stack",
    title: "Vigencia",
    subtitle: "Orgullo jalisciense",
    body: [
      "La tradición de las Orquestas Típicas en México ha disminuido en los últimos 50 años.",
      "Jalisco conserva esta joya desde 1979 gracias al desempeño de sus integrantes y al amor por la música tradicional.",
    ],
    image:
      "https://img.freepik.com/premium-vector/mexican-culture-cartoon_24640-52898.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    layout: "center",
    title: "México en escena",
    subtitle: "Rescate y tradición",
    body: [
      "La Orquesta Típica mantiene vigente la música tradicional mexicana y la comparte con nuevas generaciones.",
    ],
    image:
      "https://img.freepik.com/free-vector/mexico-flat-icon_1284-12524.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export default function Home() {
  return (
    <main className="stage">
      <section className="intro">
        <div className="intro-strip" aria-hidden="true">
          {[
            "https://img.freepik.com/free-vector/mexican-celebration-with-cactus-with-mustache-hat-as-icon-mexican-culture_24908-60784.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/premium-vector/geometric-illustration-colorful-stylized-desert-scene-with-building-mountains-cactuses-sunset_150234-134770.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-vector/hand-drawn-postage-stam-set_23-2150517613.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-vector/flat-design-elements-collection-brazilian-festas-juninas-celebrations_23-2150382120.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/premium-vector/colorful-geometric-illustration-desert-landscape-with-cacti-flowers-pyramid_150234-134280.jpg?semt=ais_hybrid&w=740&q=80",
          ].map((src, index) => (
            <div className="strip-tile" key={`strip-${index}`}>
              <img src={src} alt="Motivo cultural" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="sombrero ride" aria-hidden="true">
          <span className="sombrero-top" />
          <span className="sombrero-brim" />
        </div>
        <div className="intro-text">
          <p>Orquesta Típica del Estado</p>
          <h1 className="intro-title">Orquesta Típica de Jalisco</h1>
        </div>
      </section>

      <section className="story">
        {SLIDES.map((slide) => (
          <section key={slide.title} className={`panel layout-${slide.layout}`}>
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
              {slide.images ? (
                slide.images.map((image, index) => (
                  <img
                    key={`${slide.title}-img-${index}`}
                    src={image}
                    alt={`${slide.title} ${index + 1}`}
                    loading="lazy"
                  />
                ))
              ) : (
                <img src={slide.image} alt={slide.title} loading="lazy" />
              )}
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
          background: linear-gradient(180deg, #4a2a18 0%, #6b3b1f 55%, #4a2a18 100%);
          z-index: 5;
          animation: intro-hide 0.8s ease forwards;
          animation-delay: 5s;
        }
        .intro-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20vh;
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(160px, 1fr);
          gap: 8px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
        }
        .strip-tile {
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
        }
        .strip-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sombrero {
          position: absolute;
          width: 120px;
          height: 60px;
          left: -10%;
          top: 25%;
          z-index: 2;
        }
        .sombrero.ride {
          animation: sombrero-sweep 3.4s ease-in-out forwards;
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
          top: 24%;
          text-align: center;
          color: #fef3c7;
          font-family: "Fraunces", serif;
          animation: intro-text 0.8s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }
        .intro-text h1 {
          margin: 6px 0 0;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
        }
        .intro-title {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid rgba(254, 243, 199, 0.9);
          width: 0;
          animation: type-title 3.2s steps(32, end) forwards;
        }
        .story {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          opacity: 0;
          animation: story-show 0.8s ease forwards;
          animation-delay: 5.2s;
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
        .layout-center {
          text-align: center;
          grid-template-columns: 1fr;
          justify-items: center;
        }
        .layout-center .content {
          text-align: center;
        }
        .layout-center .panel-media {
          max-width: 720px;
        }
        .layout-split-left .content {
          order: 1;
        }
        .layout-split-left .panel-media {
          order: 2;
        }
        .layout-split-right .content {
          order: 2;
        }
        .layout-split-right .panel-media {
          order: 1;
        }
        .layout-stack {
          grid-template-columns: 1fr;
        }
        .layout-stack .panel-media {
          max-width: 820px;
          justify-self: end;
        }
        .layout-quote .content {
          background: rgba(15, 23, 42, 0.68);
          border-left: 6px solid #f59e0b;
        }
        .layout-quote .body {
          font-size: 20px;
        }
        .layout-collage {
          grid-template-columns: 1fr;
        }
        .layout-collage .panel-media {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .layout-collage .panel-media img {
          height: 260px;
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
        @keyframes sombrero-sweep {
          0% {
            transform: translateX(-10%) rotate(-6deg);
          }
          100% {
            transform: translateX(120vw) rotate(6deg);
          }
        }
        @keyframes type-title {
          to {
            width: 100%;
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
          .intro-strip {
            grid-auto-columns: minmax(120px, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
