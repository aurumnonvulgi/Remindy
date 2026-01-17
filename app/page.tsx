"use client";

import { useMemo, useState } from "react";

const IMAGE_POOL = [
  "https://img.freepik.com/premium-vector/mexican-pueblo-watercolor-paint-ilustration_791234-6850.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/premium-vector/vibrant-postcard-celebrating-beauty-mexico_886588-27991.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/free-vector/hand-drawn-latin-america-scene-illustration_52683-142374.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/free-vector/mexican-map-with-cultural-elements_23-2147733686.jpg?semt=ais_hybrid&w=740&q=80",
];

const QUIZ_QUESTIONS = [
  {
    state: "Jalisco",
    question: "¿Qué género musical es emblemático de Jalisco?",
    options: ["Mariachi", "Son jarocho", "Cumbia", "Danzón"],
    answer: 0,
    blurb:
      "Jalisco es hogar del mariachi y de sones que reflejan orgullo regional y fiesta popular.",
    orchestraTie:
      "La Orquesta Típica de Jalisco lleva repertorio tradicional a escuelas primarias, secundarias y preparatorias, conectando a estudiantes con la música de su región.",
  },
  {
    state: "Veracruz",
    question: "¿Qué estilo tradicional está ligado a Veracruz?",
    options: ["Son jarocho", "Banda", "Norteño", "Bolero ranchero"],
    answer: 0,
    blurb:
      "Veracruz es cuna del son jarocho, con jarana y requinto que invitan al zapateado.",
    orchestraTie:
      "La Orquesta Típica de Jalisco ha sido invitada a escenarios internacionales para difundir la música mexicana y a sus compositores ante nuevas audiencias.",
  },
  {
    state: "Sinaloa",
    question: "¿Qué género representa a Sinaloa?",
    options: ["Banda", "Huapango", "Son huasteco", "Trova"],
    answer: 0,
    blurb:
      "Sinaloa es reconocido por sus bandas y la fuerza de sus metales.",
    orchestraTie:
      "La Orquesta Típica de Jalisco preserva sones y ritmos regionales para que las nuevas generaciones los reconozcan y los mantengan vivos.",
  },
  {
    state: "Nuevo León",
    question: "¿Qué estilo se asocia con el norte del país?",
    options: ["Norteño", "Son jarocho", "Danzón", "Jarana yucateca"],
    answer: 0,
    blurb:
      "En el norte destacan el acordeón y los corridos del estilo norteño.",
    orchestraTie:
      "La Orquesta Típica de Jalisco fortalece la identidad cultural en comunidades rurales y urbanas mediante conciertos gratuitos y accesibles.",
  },
  {
    state: "Oaxaca",
    question: "¿Qué música tradicional suele vincularse a Oaxaca?",
    options: ["Son istmeño", "Banda sinaloense", "Huapango", "Cumbia"],
    answer: 0,
    blurb:
      "Oaxaca resguarda sones y danzas del Istmo con gran riqueza melódica.",
    orchestraTie:
      "La Orquesta Típica de Jalisco colabora con instituciones educativas para acercar la música típica al aula y despertar curiosidad artística.",
  },
  {
    state: "Chiapas",
    question: "¿Qué instrumento es símbolo musical de Chiapas?",
    options: ["Marimba", "Acordeón", "Saxofón", "Jarana"],
    answer: 0,
    blurb:
      "La marimba es emblema chiapaneco y acompaña celebraciones tradicionales.",
    orchestraTie:
      "La Orquesta Típica de Jalisco diseña arreglos didácticos que explican la historia de cada región musical y su contexto social.",
  },
  {
    state: "Yucatán",
    question: "¿Qué género romántico es típico de Yucatán?",
    options: ["Trova yucateca", "Banda", "Son huasteco", "Norteño"],
    answer: 0,
    blurb:
      "Yucatán es conocido por su trova íntima y melodías suaves.",
    orchestraTie:
      "La Orquesta Típica de Jalisco representa a Jalisco en festivales nacionales como embajadora cultural y símbolo de tradición.",
  },
  {
    state: "Guerrero",
    question: "¿Qué tradición musical destaca en Guerrero?",
    options: ["Chilena", "Danzón", "Son jarocho", "Banda"],
    answer: 0,
    blurb:
      "Las chilenas guerrerenses mezclan ritmos costeños con alegría comunitaria.",
    orchestraTie:
      "La Orquesta Típica de Jalisco difunde el patrimonio musical mexicano mediante giras que conectan distintos estados del país.",
  },
  {
    state: "Michoacán",
    question: "¿Qué música tradicional es conocida en Michoacán?",
    options: ["Pirekua", "Banda", "Norteño", "Cumbia"],
    answer: 0,
    blurb:
      "La pirekua es un canto tradicional purépecha con profunda carga emotiva.",
    orchestraTie:
      "La Orquesta Típica de Jalisco impulsa talleres y actividades formativas que vinculan a jóvenes músicos con tradiciones ancestrales.",
  },
  {
    state: "Puebla",
    question: "¿Qué danza festiva es típica de Puebla?",
    options: ["Huapango", "Danzón", "Son istmeño", "Chilena"],
    answer: 0,
    blurb:
      "Puebla conserva huapangos que dialogan con voces y cuerdas.",
    orchestraTie:
      "La Orquesta Típica de Jalisco comparte relatos sobre los orígenes de los géneros regionales para dar sentido a cada interpretación.",
  },
  {
    state: "Hidalgo",
    question: "¿Qué región se asocia al son huasteco?",
    options: ["La Huasteca", "La Mixteca", "La Tarahumara", "El Istmo"],
    answer: 0,
    blurb:
      "Hidalgo forma parte de la Huasteca, donde florece el son huasteco.",
    orchestraTie:
      "La Orquesta Típica de Jalisco mantiene vivo el repertorio popular con arreglos actuales y respetuosos del legado tradicional.",
  },
  {
    state: "Coahuila",
    question: "¿Qué instrumento es clave en la música del norte?",
    options: ["Acordeón", "Arpa", "Ocarina", "Marimba"],
    answer: 0,
    blurb:
      "En el norte, el acordeón guía polkas y corridos fronterizos.",
    orchestraTie:
      "La Orquesta Típica de Jalisco ofrece conciertos en plazas públicas para fortalecer el tejido social y el orgullo comunitario.",
  },
  {
    state: "Tabasco",
    question: "¿Qué ritmo suele escucharse en el sureste?",
    options: ["Cumbia", "Huapango", "Norteño", "Banda"],
    answer: 0,
    blurb:
      "Tabasco vibra con cumbias y ritmos tropicales que invitan a bailar.",
    orchestraTie:
      "La Orquesta Típica de Jalisco destaca la diversidad sonora del país en un solo escenario, celebrando la riqueza regional.",
  },
  {
    state: "Baja California",
    question: "¿Qué influencia musical es común en la frontera?",
    options: ["Fusión norteña", "Danzón", "Trova", "Son istmeño"],
    answer: 0,
    blurb:
      "La frontera mezcla sonidos norteños con nuevas fusiones urbanas.",
    orchestraTie:
      "La Orquesta Típica de Jalisco rinde homenaje a compositores locales de cada región que visita, reconociendo su aporte histórico.",
  },
  {
    state: "Tamaulipas",
    question: "¿Qué ritmo es representativo del noreste?",
    options: ["Polka", "Son jarocho", "Chilena", "Trova"],
    answer: 0,
    blurb:
      "Las polkas han inspirado a generaciones en el noreste mexicano.",
    orchestraTie:
      "La Orquesta Típica de Jalisco acompaña actos cívicos y celebraciones para impulsar el orgullo por la música mexicana.",
  },
  {
    state: "Querétaro",
    question: "¿Qué género es común en el centro del país?",
    options: ["Danzón", "Banda", "Norteño", "Chilena"],
    answer: 0,
    blurb:
      "En el centro se disfrutan danzones y bailes de salón con elegancia.",
    orchestraTie:
      "La Orquesta Típica de Jalisco participa en encuentros culturales que unen tradición y nuevas audiencias en distintas ciudades.",
  },
  {
    state: "Ciudad de México",
    question: "¿Qué estilo musical destaca en plazas y salones capitalinos?",
    options: ["Danzón", "Banda", "Son istmeño", "Huapango"],
    answer: 0,
    blurb:
      "El danzón sigue vivo en la capital, acompañando tardes y noches de baile.",
    orchestraTie:
      "La Orquesta Típica de Jalisco preserva instrumentos típicos en diálogo con cuerdas y alientos clásicos para un sonido único.",
  },
  {
    state: "Nayarit",
    question: "¿Qué ritmo tradicional se baila en la costa del Pacífico?",
    options: ["Cumbia", "Trova", "Norteño", "Pirekua"],
    answer: 0,
    blurb:
      "Nayarit comparte sonidos costeños que celebran la vida junto al mar.",
    orchestraTie:
      "La Orquesta Típica de Jalisco motiva a las juventudes a conocer su herencia musical con programas escolares y conciertos guiados.",
  },
  {
    state: "Chihuahua",
    question: "¿Qué instrumento suele acompañar corridos del norte?",
    options: ["Acordeón", "Arpa", "Clavecín", "Flauta"],
    answer: 0,
    blurb:
      "En Chihuahua los corridos y polkas del norte son parte esencial del paisaje.",
    orchestraTie:
      "La Orquesta Típica de Jalisco crea puentes culturales al compartir repertorio de distintos estados en un mismo programa.",
  },
  {
    state: "Sonora",
    question: "¿Qué música describe mejor el espíritu sonorense?",
    options: ["Norteña", "Trova yucateca", "Son jarocho", "Danzón"],
    answer: 0,
    blurb:
      "Sonora vibra con ritmos norteños y letras que narran la vida del desierto.",
    orchestraTie:
      "La Orquesta Típica de Jalisco visita organizaciones privadas y comunitarias para llevar música tradicional a nuevos espacios.",
  },
  {
    state: "Morelos",
    question: "¿Qué ritmo social suele bailarse en Morelos?",
    options: ["Danzón", "Banda", "Norteño", "Chilena"],
    answer: 0,
    blurb:
      "Morelos es tierra de fiestas con danzón y música de salón.",
    orchestraTie:
      "La Orquesta Típica de Jalisco sostiene la continuidad de las tradiciones en ferias y festivales con presentaciones memorables.",
  },
  {
    state: "Zacatecas",
    question: "¿Qué estilo es frecuente en las bandas del centro-norte?",
    options: ["Banda", "Trova", "Son jarocho", "Pirekua"],
    answer: 0,
    blurb:
      "Zacatecas tiene tradición de bandas que acompañan celebraciones locales.",
    orchestraTie:
      "La Orquesta Típica de Jalisco impulsa el reconocimiento de las raíces mexicanas a través del sonido típico y la memoria colectiva.",
  },
  {
    state: "San Luis Potosí",
    question: "¿Qué región influye en su música tradicional?",
    options: ["La Huasteca", "El Istmo", "La Península", "La Tarahumara"],
    answer: 0,
    blurb:
      "San Luis Potosí comparte la riqueza del son huasteco.",
    orchestraTie:
      "La Orquesta Típica de Jalisco invita a conocer la riqueza musical de México con repertorios que cruzan regiones y estilos.",
  },
  {
    state: "Campeche",
    question: "¿Qué ambiente define sus celebraciones?",
    options: ["Costero y festivo", "Desértico", "Montañoso", "Nevado"],
    answer: 0,
    blurb:
      "Campeche combina herencias mayas con celebraciones de sabor costeño.",
    orchestraTie:
      "La Orquesta Típica de Jalisco ha llevado la cultura mexicana a foros internacionales con orgullo, disciplina y excelencia artística.",
  },
  {
    state: "Durango",
    question: "¿Qué ritmo norteño puede escucharse en Durango?",
    options: ["Polka", "Trova", "Son istmeño", "Danzón"],
    answer: 0,
    blurb:
      "Durango conserva polkas y corridos que cuentan historias regionales.",
    orchestraTie:
      "La Orquesta Típica de Jalisco demuestra que la música típica sigue viva, dialogando con el presente sin perder su esencia.",
  },
];

const createRng = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = Math.imul(value ^ (value >>> 15), value | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleOptions = (options: string[], seed: number, answer: number) => {
  const entries = options.map((option, idx) => ({ option, idx }));
  const rng = createRng(seed);
  for (let i = entries.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  const answerIndex = entries.findIndex((entry) => entry.idx === answer);
  return {
    options: entries.map((entry) => entry.option),
    answerIndex,
  };
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000_000));

  const current = QUIZ_QUESTIONS[index];
  const isLast = index === QUIZ_QUESTIONS.length - 1;

  const image = useMemo(
    () => IMAGE_POOL[index % IMAGE_POOL.length],
    [index]
  );
  const shuffled = useMemo(
    () => shuffleOptions(current.options, seed + index, current.answer),
    [current, index, seed]
  );
  const correctOption = current.options[current.answer];
  const explanation = `La Orquesta Típica de Jalisco explica que la respuesta correcta es "${correctOption}". ${current.blurb} Con este contexto, la orquesta refuerza el conocimiento de los estilos regionales y su difusión en México y el mundo.`;

  const handleAnswer = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    const correct = option === shuffled.answerIndex;
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const nextStep = () => {
    if (isLast) {
      setIndex(0);
      setSelected(null);
      setScore(0);
      setShowFeedback(false);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Orquesta Típica de Jalisco</p>
          <h1>Ruta musical de México</h1>
          <p className="lead">
            Un recorrido por los estados, sus géneros tradicionales y la manera en
            que la orquesta comparte estas músicas con el país y con el mundo.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="https://blob.udgtv.com/images/2024/05/24/orquesta-tipica-de-jalisco--5.jpg"
            alt="Orquesta Típica de Jalisco"
          />
        </div>
      </header>

      <section className="quiz">
        <div className="quiz-card">
          <div className="quiz-header">
            <div>
              <span className="label">Pregunta</span>
              <h2>
                {index + 1} de {QUIZ_QUESTIONS.length}
              </h2>
            </div>
            <div className="score">
              <span className="label">Puntaje</span>
              <strong>
                {score} / {QUIZ_QUESTIONS.length}
              </strong>
            </div>
          </div>

          <div className="quiz-body">
            <div className="question">
              <span className="state">{current.state}</span>
              <h3>{current.question}</h3>
              <p className="blurb">{current.blurb}</p>
            </div>
            <div className="visual">
              <img src={image} alt={`Ilustración de ${current.state}`} />
              <div className="caption">{current.state}</div>
            </div>
          </div>

          <div className="options">
            {shuffled.options.map((option, idx) => {
              const isCorrect =
                selected !== null && idx === shuffled.answerIndex;
              const isWrong = selected === idx && idx !== shuffled.answerIndex;
              return (
                <button
                  key={`${option}-${idx}`}
                  className={`option ${isCorrect ? "correct" : ""} ${
                    isWrong ? "wrong" : ""
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {showFeedback && (
        <div className="feedback-overlay" role="dialog" aria-modal="true">
          <div className="feedback-modal">
            <div className={selected === shuffled.answerIndex ? "good" : "bad"}>
              {selected === shuffled.answerIndex
                ? "¡Respuesta correcta!"
                : "Ups, esta vez no."}
            </div>
            <p>
              {selected === shuffled.answerIndex ? current.orchestraTie : explanation}
            </p>
            <button className="next" onClick={nextStep}>
              {isLast ? "Reiniciar" : "Siguiente"}
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Orquesta Típica de Jalisco · México, rescate y tradición</span>
        <span>4AM4E</span>
      </footer>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: "Fraunces", "Libre Baskerville", serif;
          background: #fff7ed;
          color: #2f1f14;
        }
        .page {
          min-height: 100vh;
          padding: 48px clamp(24px, 6vw, 90px) 64px;
          display: grid;
          gap: 40px;
        }
        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
          align-items: center;
          background: #fef3c7;
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
        }
        .eyebrow {
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-size: 12px;
          color: #b45309;
          margin: 0 0 8px;
        }
        h1 {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          margin: 0 0 16px;
          color: #3b2614;
        }
        .lead {
          font-size: 18px;
          line-height: 1.7;
          margin: 0;
          color: #4b5563;
        }
        .hero-image img {
          width: 100%;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.2);
        }
        .quiz {
          display: flex;
          justify-content: center;
        }
        .quiz-card {
          width: min(980px, 100%);
          background: #fffaf2;
          border-radius: 32px;
          padding: clamp(24px, 4vw, 40px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
          border: 1px solid rgba(244, 211, 94, 0.4);
        }
        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .quiz-header h2 {
          margin: 4px 0 0;
          font-size: 22px;
          color: #4a2a18;
        }
        .label {
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #9a3412;
        }
        .score {
          background: #fef3c7;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 14px;
          color: #92400e;
        }
        .quiz-body {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          align-items: center;
        }
        .state {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 12px;
          color: #b45309;
        }
        .question h3 {
          margin: 8px 0 12px;
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          color: #3b2614;
        }
        .blurb {
          margin: 0;
          color: #4b5563;
          line-height: 1.7;
        }
        .visual {
          position: relative;
        }
        .visual img {
          width: 100%;
          max-height: 260px;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.2);
        }
        .caption {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(59, 38, 20, 0.85);
          color: #fff7ed;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .options {
          margin-top: 24px;
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .option {
          border: 1px solid rgba(217, 119, 6, 0.3);
          border-radius: 18px;
          padding: 14px 18px;
          background: #fff7ed;
          text-align: left;
          cursor: pointer;
          font-weight: 600;
          font-family: inherit;
          color: #2f1f14;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .option:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        }
        .option.correct {
          background: #dcfce7;
          border-color: #22c55e;
        }
        .option.wrong {
          background: #fee2e2;
          border-color: #ef4444;
        }
        .feedback-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          display: grid;
          place-items: center;
          z-index: 10;
          padding: 24px;
        }
        .feedback-modal {
          background: #fffaf2;
          border-radius: 24px;
          padding: clamp(20px, 3vw, 28px);
          max-width: 560px;
          width: 100%;
          display: grid;
          gap: 12px;
          box-shadow: 0 26px 50px rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(244, 211, 94, 0.5);
        }
        .feedback-modal .good {
          font-weight: 700;
          color: #15803d;
        }
        .feedback-modal .bad {
          font-weight: 700;
          color: #b91c1c;
        }
        .feedback-modal p {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }
        .next {
          justify-self: start;
          border: none;
          border-radius: 999px;
          padding: 10px 18px;
          background: #92400e;
          color: #fff7ed;
          font-weight: 700;
          cursor: pointer;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #9a3412;
        }
        @media (max-width: 680px) {
          .page {
            padding: 32px 20px 48px;
          }
          .hero {
            padding: 24px;
          }
          .quiz-card {
            padding: 24px;
          }
          .quiz-body {
            grid-template-columns: 1fr;
          }
          .visual img {
            max-height: 200px;
          }
          .caption {
            font-size: 10px;
            letter-spacing: 0.18em;
          }
          .question h3 {
            font-size: 1.5rem;
          }
          .blurb {
            font-size: 0.95rem;
          }
          .quiz-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .next {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
