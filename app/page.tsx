"use client";

import { useEffect, useState } from "react";

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
      "https://blob.udgtv.com/images/2024/05/24/orquesta-tipica-de-jalisco--5.jpg",
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
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/free-vector/mexican-map-with-cultural-elements_23-2147733686.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/free-vector/hand-drawn-latin-america-scene-illustration_52683-142374.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/free-vector/mexican-map-with-cultural-elements_23-2147733686.jpg?semt=ais_hybrid&w=740&q=80",
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
      "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    layout: "center",
    title: "México en escena",
    subtitle: "Rescate y tradición",
    body: [
      "La Orquesta Típica mantiene vigente la música tradicional mexicana y la comparte con nuevas generaciones.",
    ],
    image:
      "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

const MENU_GROUPS = [
  {
    title: "Historia",
    links: [
      { label: "Origen en 1979", href: "#section-1" },
      { label: "Fundación e impulso", href: "#section-2" },
      { label: "Nombre e identidad", href: "#section-3" },
    ],
  },
  {
    title: "Tradición",
    links: [
      { label: "Plaza de Armas", href: "#section-4" },
      { label: "Gira permanente", href: "#section-5" },
    ],
  },
  {
    title: "Música",
    links: [
      { label: "Instrumentos clásicos", href: "#section-6" },
      { label: "Instrumentos típicos", href: "#section-7" },
      { label: "Repertorio", href: "#section-8" },
    ],
  },
  {
    title: "Dirección",
    links: [
      { label: "Directores", href: "#section-9" },
      { label: "Vigencia", href: "#section-10" },
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "¿Cuál de estos pueblos es reconocido por su alfarería y artesanías?",
    options: ["Tlaquepaque", "Mazamitla", "Tequila", "Tapalpa"],
    answer: 0,
  },
  {
    question: "¿Qué pueblo es famoso por la bebida que lleva su nombre?",
    options: ["Lagos de Moreno", "Tequila", "Mascota", "Chapala"],
    answer: 1,
  },
  {
    question: "¿Dónde encuentras bosques de pino y arquitectura de montaña?",
    options: ["Mazamitla", "Puerto Vallarta", "Ameca", "Ocotlán"],
    answer: 0,
  },
  {
    question: "¿Qué pueblo es conocido por su laguna y malecón?",
    options: ["Chapala", "Arandas", "Zapotlán el Grande", "Colotlán"],
    answer: 0,
  },
  {
    question: "¿Cuál es famoso por su basílica y peregrinaciones?",
    options: ["San Juan de los Lagos", "Teuchitlán", "Cocula", "Sayula"],
    answer: 0,
  },
  {
    question: "¿Dónde puedes visitar los Guachimontones?",
    options: ["Teuchitlán", "Talpa de Allende", "Autlán", "Etzatlán"],
    answer: 0,
  },
  {
    question: "¿Qué pueblo destaca por romerías y tradiciones religiosas?",
    options: ["Talpa de Allende", "Jalostotitlán", "Zacoalco", "Atemajac"],
    answer: 0,
  },
  {
    question: "¿Cuál es un pueblo mágico conocido por sus calles empedradas?",
    options: ["Tapalpa", "El Salto", "Zapotiltic", "Degollado"],
    answer: 0,
  },
  {
    question: "¿Qué pueblo resalta por su arquitectura colonial en Los Altos?",
    options: ["Lagos de Moreno", "Jocotepec", "Amatitán", "Tonila"],
    answer: 0,
  },
  {
    question: "¿Dónde hay paisajes serranos y cascadas cercanas?",
    options: ["Mascota", "Zapotlanejo", "Acatlán", "Atoyac"],
    answer: 0,
  },
];

export default function Home() {
  const [barVisible, setBarVisible] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBarVisible(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  const current = QUIZ_QUESTIONS[quizIndex];
  const handleAnswer = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === current.answer) {
      setScore((prev) => prev + 1);
    }
    window.setTimeout(() => {
      if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
        setQuizIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 650);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <main className="stage">
      <section className="intro">
        <div className="intro-strip" aria-hidden="true">
          {[
            "https://blob.udgtv.com/images/2024/05/24/orquesta-tipica-de-jalisco--5.jpg",
            "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-vector/hand-drawn-latin-america-scene-illustration_52683-142374.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-vector/mexican-map-with-cultural-elements_23-2147733686.jpg?semt=ais_hybrid&w=740&q=80",
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

      <div className="site">
        <header className="site-header">
          <div className="brand">
            <span>OTJ</span>
            <div>
              <strong>Orquesta Típica de Jalisco</strong>
              <em>Orquesta Típica del Estado</em>
            </div>
          </div>
          <nav className="menu">
            <div className="menu-item">
              <button type="button" className="menu-trigger">
                Explorar
              </button>
              <div className="mega">
                {MENU_GROUPS.map((group) => (
                  <div key={group.title} className="mega-group">
                    <span>{group.title}</span>
                    {group.links.map((link) => (
                      <a key={link.label} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <a className="menu-link" href="#section-4">
              Tradición
            </a>
            <a className="menu-link" href="#section-8">
              Repertorio
            </a>
            <a className="menu-link" href="#section-10">
              Vigencia
            </a>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">México · Rescate y tradición</p>
            <h1>Orquesta Típica del Estado</h1>
            <p className="lead">
              Una institución cultural que lleva la música popular mexicana
              desde 1979. Tradición, identidad y repertorio vivo en cada
              presentación.
            </p>
            <div className="hero-actions">
              <a className="cta" href="#section-0">
                Explorar historia
              </a>
              <a className="cta ghost" href="#section-4">
                Ver tradiciones
              </a>
            </div>
          </div>
            <div className="hero-card">
            <img
              src="https://blob.udgtv.com/images/2024/05/24/orquesta-tipica-de-jalisco--5.jpg"
              alt="Escena cultural mexicana"
              loading="lazy"
            />
          </div>
        </section>

        {SLIDES.map((slide, index) => (
          <section
            key={slide.title}
            id={`section-${index}`}
            className={`content-section ${
              index % 2 === 1 ? "reverse" : ""
            }`}
          >
            <div className="section-text">
              <p className="section-subtitle">{slide.subtitle}</p>
              <h2>{slide.title}</h2>
              {slide.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <span className="section-tag">
                Orquesta Típica del Estado
              </span>
            </div>
            <div className="section-media">
              {slide.images ? (
                <div className="media-grid">
                  {slide.images.map((image, imageIndex) => (
                    <img
                      key={`${slide.title}-grid-${imageIndex}`}
                      src={image}
                      alt={`${slide.title} ${imageIndex + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : (
                <img src={slide.image} alt={slide.title} loading="lazy" />
              )}
            </div>
          </section>
        ))}

        <footer className="footer">
          <div>
            <strong>Orquesta Típica de Jalisco</strong>
            <p>
              Tradición viva desde 1979. Miércoles y viernes 18:30 hrs, Plaza de
              Armas, Guadalajara.
            </p>
          </div>
          <span>Actualizado · 2026</span>
        </footer>
      </div>

      <div className={`quiz-bar ${barVisible ? "show" : ""}`}>
        <p>Que tanto conoces los pueblos de Jalisco? Tomo un corto examen!</p>
        <button
          type="button"
          onClick={() => {
            setQuizOpen(true);
            resetQuiz();
          }}
        >
          Iniciar quiz
        </button>
      </div>

      {quizOpen && (
        <div className="quiz-overlay" role="dialog" aria-modal="true">
          <div className="quiz-card">
            <button
              type="button"
              className="quiz-close"
              onClick={() => setQuizOpen(false)}
            >
              Cerrar
            </button>
            {!showResult ? (
              <>
                <span className="quiz-step">
                  Pregunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
                </span>
                <h3>{current.question}</h3>
                <div className="quiz-options">
                  {current.options.map((option, index) => {
                    const isCorrect = selected === index && index === current.answer;
                    const isWrong = selected === index && index !== current.answer;
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => handleAnswer(index)}
                        className={`quiz-option ${isCorrect ? "correct" : ""} ${
                          isWrong ? "wrong" : ""
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <h3>Resultado final</h3>
                <p>
                  Obtuviste {score} de {QUIZ_QUESTIONS.length} respuestas
                  correctas.
                </p>
                <button type="button" onClick={resetQuiz}>
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
        .site {
          opacity: 0;
          animation: story-show 0.8s ease forwards;
          animation-delay: 5.2s;
          background: radial-gradient(circle at top, #fff3d6 0%, #f7f2e8 45%, #e9f3ff 100%);
          padding: 40px clamp(20px, 4vw, 80px) 80px;
        }
        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          position: sticky;
          top: 0;
          padding: 16px 0;
          background: rgba(255, 244, 221, 0.9);
          backdrop-filter: blur(10px);
          z-index: 3;
        }
        .brand {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .brand span {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #f59e0b;
          color: #4a2a18;
          font-weight: 700;
        }
        .brand em {
          display: block;
          font-style: normal;
          font-size: 12px;
          color: #92400e;
        }
        .menu {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          align-items: center;
          position: relative;
        }
        .menu a,
        .menu-trigger {
          color: #92400e;
          text-decoration: none;
        }
        .menu-trigger {
          background: transparent;
          border: 1px solid rgba(217, 119, 6, 0.35);
          border-radius: 999px;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.2em;
        }
        .menu-item {
          position: relative;
        }
        .mega {
          position: absolute;
          top: 120%;
          right: 0;
          background: rgba(255, 248, 235, 0.98);
          border: 1px solid rgba(217, 119, 6, 0.2);
          border-radius: 18px;
          padding: 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(180px, 1fr));
          gap: 16px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 10;
        }
        .menu-item:hover .mega,
        .menu-item:focus-within .mega {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .mega-group span {
          display: block;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 6px;
        }
        .mega-group a {
          display: block;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: none;
          color: #4b5563;
          margin: 6px 0;
        }
        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
          align-items: center;
          margin-top: 40px;
        }
        .hero h1 {
          font-family: "Fraunces", serif;
          font-size: clamp(2.6rem, 4vw, 3.6rem);
          margin: 10px 0 12px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 12px;
          color: #b45309;
          margin: 0;
        }
        .lead {
          font-size: 18px;
          line-height: 1.7;
          color: #6b7280;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .cta {
          padding: 10px 18px;
          border-radius: 999px;
          background: #92400e;
          color: #fff7ed;
          text-decoration: none;
          font-size: 14px;
        }
        .cta.ghost {
          background: transparent;
          border: 1px solid #d97706;
          color: #92400e;
        }
        .hero-card img {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
        }
        .content-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
          align-items: center;
          padding: 48px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
        .content-section.reverse .section-text {
          order: 2;
        }
        .section-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 12px;
          color: #b45309;
          margin: 0;
        }
        .section-text h2 {
          font-family: "Fraunces", serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          margin: 10px 0 14px;
        }
        .section-text p {
          margin: 0 0 14px;
          line-height: 1.7;
          color: #4b5563;
        }
        .section-tag {
          display: inline-flex;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(217, 119, 6, 0.4);
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #92400e;
        }
        .section-media img {
          width: 100%;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.2);
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 32px;
          font-size: 14px;
          color: #6b7280;
        }
        .quiz-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: -30%;
          height: 22vh;
          background: rgba(74, 42, 24, 0.96);
          color: #fff7ed;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px clamp(20px, 4vw, 80px);
          transition: transform 0.6s ease;
          transform: translateY(0);
          z-index: 4;
        }
        .quiz-bar.show {
          transform: translateY(-22vh);
        }
        .quiz-bar p {
          font-size: clamp(1rem, 2vw, 1.4rem);
          margin: 0;
          max-width: 70%;
        }
        .quiz-bar button {
          background: #fbbf24;
          border: none;
          border-radius: 999px;
          padding: 12px 20px;
          font-weight: 700;
          cursor: pointer;
        }
        .quiz-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          display: grid;
          place-items: center;
          z-index: 6;
        }
        .quiz-card {
          background: #fffaf2;
          border-radius: 24px;
          padding: 28px;
          width: min(520px, 92vw);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
          position: relative;
        }
        .quiz-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }
        .quiz-step {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 12px;
          color: #b45309;
        }
        .quiz-options {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }
        .quiz-option {
          border: 1px solid rgba(217, 119, 6, 0.3);
          border-radius: 14px;
          padding: 12px 16px;
          background: #fff7ed;
          text-align: left;
          cursor: pointer;
          font-weight: 600;
        }
        .quiz-option.correct {
          background: #dcfce7;
          border-color: #22c55e;
        }
        .quiz-option.wrong {
          background: #fee2e2;
          border-color: #ef4444;
        }
        .quiz-result h3 {
          margin-top: 0;
        }
        .quiz-result button {
          margin-top: 14px;
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          background: #92400e;
          color: #fff7ed;
          cursor: pointer;
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
          .intro-strip {
            grid-auto-columns: minmax(120px, 1fr);
          }
          .hero-actions {
            flex-direction: column;
          }
          .menu {
            display: none;
          }
          .quiz-bar {
            flex-direction: column;
            align-items: flex-start;
            height: auto;
            bottom: -40%;
          }
          .quiz-bar.show {
            transform: translateY(-40%);
          }
        }
      `}</style>
    </main>
  );
}
