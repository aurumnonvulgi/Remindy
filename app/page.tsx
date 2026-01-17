"use client";

import { useMemo, useState } from "react";

const IMAGE_POOL = [
  "https://blob.udgtv.com/images/2024/05/24/orquesta-tipica-de-jalisco--5.jpg",
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
      "La Orquesta Típica de Jalisco lleva repertorio tradicional a escuelas primarias, secundarias y preparatorias.",
  },
  {
    state: "Veracruz",
    question: "¿Qué estilo tradicional está ligado a Veracruz?",
    options: ["Son jarocho", "Banda", "Norteño", "Bolero ranchero"],
    answer: 0,
    blurb:
      "Veracruz es cuna del son jarocho, con jarana y requinto que invitan al zapateado.",
    orchestraTie:
      "Ha sido invitada a escenarios internacionales para difundir la música mexicana y a sus compositores.",
  },
  {
    state: "Sinaloa",
    question: "¿Qué género representa a Sinaloa?",
    options: ["Banda", "Huapango", "Son huasteco", "Trova"],
    answer: 0,
    blurb:
      "Sinaloa es reconocido por sus bandas y la fuerza de sus metales.",
    orchestraTie:
      "Su misión incluye preservar sones y ritmos regionales para nuevas generaciones.",
  },
  {
    state: "Nuevo León",
    question: "¿Qué estilo se asocia con el norte del país?",
    options: ["Norteño", "Son jarocho", "Danzón", "Jarana yucateca"],
    answer: 0,
    blurb:
      "En el norte destacan el acordeón y los corridos del estilo norteño.",
    orchestraTie:
      "Promueve la identidad cultural en comunidades rurales y urbanas con conciertos gratuitos.",
  },
  {
    state: "Oaxaca",
    question: "¿Qué música tradicional suele vincularse a Oaxaca?",
    options: ["Son istmeño", "Banda sinaloense", "Huapango", "Cumbia"],
    answer: 0,
    blurb:
      "Oaxaca resguarda sones y danzas del Istmo con gran riqueza melódica.",
    orchestraTie:
      "Colabora con instituciones educativas para acercar la música típica al aula.",
  },
  {
    state: "Chiapas",
    question: "¿Qué instrumento es símbolo musical de Chiapas?",
    options: ["Marimba", "Acordeón", "Saxofón", "Jarana"],
    answer: 0,
    blurb:
      "La marimba es emblema chiapaneco y acompaña celebraciones tradicionales.",
    orchestraTie:
      "Integra arreglos didácticos que explican la historia de cada región musical.",
  },
  {
    state: "Yucatán",
    question: "¿Qué género romántico es típico de Yucatán?",
    options: ["Trova yucateca", "Banda", "Son huasteco", "Norteño"],
    answer: 0,
    blurb:
      "Yucatán es conocido por su trova íntima y melodías suaves.",
    orchestraTie:
      "Representa a Jalisco en festivales nacionales como embajadora cultural.",
  },
  {
    state: "Guerrero",
    question: "¿Qué tradición musical destaca en Guerrero?",
    options: ["Chilena", "Danzón", "Son jarocho", "Banda"],
    answer: 0,
    blurb:
      "Las chilenas guerrerenses mezclan ritmos costeños con alegría comunitaria.",
    orchestraTie:
      "Difunde el patrimonio musical mexicano mediante giras por distintos estados.",
  },
  {
    state: "Michoacán",
    question: "¿Qué música tradicional es conocida en Michoacán?",
    options: ["Pirekua", "Banda", "Norteño", "Cumbia"],
    answer: 0,
    blurb:
      "La pirekua es un canto tradicional purépecha con profunda carga emotiva.",
    orchestraTie:
      "Conecta a jóvenes músicos con tradiciones ancestrales a través de talleres.",
  },
  {
    state: "Puebla",
    question: "¿Qué danza festiva es típica de Puebla?",
    options: ["Huapango", "Danzón", "Son istmeño", "Chilena"],
    answer: 0,
    blurb:
      "Puebla conserva huapangos que dialogan con voces y cuerdas.",
    orchestraTie:
      "En cada presentación comparte relatos sobre los orígenes de los géneros regionales.",
  },
  {
    state: "Hidalgo",
    question: "¿Qué región se asocia al son huasteco?",
    options: ["La Huasteca", "La Mixteca", "La Tarahumara", "El Istmo"],
    answer: 0,
    blurb:
      "Hidalgo forma parte de la Huasteca, donde florece el son huasteco.",
    orchestraTie:
      "Mantiene vivo el repertorio popular con arreglos actuales y respetuosos.",
  },
  {
    state: "Coahuila",
    question: "¿Qué instrumento es clave en la música del norte?",
    options: ["Acordeón", "Arpa", "Ocarina", "Marimba"],
    answer: 0,
    blurb:
      "En el norte, el acordeón guía polkas y corridos fronterizos.",
    orchestraTie:
      "Lleva conciertos a plazas públicas para fortalecer el tejido social.",
  },
  {
    state: "Tabasco",
    question: "¿Qué ritmo suele escucharse en el sureste?",
    options: ["Cumbia", "Huapango", "Norteño", "Banda"],
    answer: 0,
    blurb:
      "Tabasco vibra con cumbias y ritmos tropicales que invitan a bailar.",
    orchestraTie:
      "Su trabajo destaca la diversidad sonora del país en un solo escenario.",
  },
  {
    state: "Baja California",
    question: "¿Qué influencia musical es común en la frontera?",
    options: ["Fusión norteña", "Danzón", "Trova", "Son istmeño"],
    answer: 0,
    blurb:
      "La frontera mezcla sonidos norteños con nuevas fusiones urbanas.",
    orchestraTie:
      "Rinde homenaje a compositores locales de cada región que visita.",
  },
  {
    state: "Tamaulipas",
    question: "¿Qué ritmo es representativo del noreste?",
    options: ["Polka", "Son jarocho", "Chilena", "Trova"],
    answer: 0,
    blurb:
      "Las polkas han inspirado a generaciones en el noreste mexicano.",
    orchestraTie:
      "Ha acompañado celebraciones cívicas impulsando el orgullo por la música mexicana.",
  },
  {
    state: "Querétaro",
    question: "¿Qué género es común en el centro del país?",
    options: ["Danzón", "Banda", "Norteño", "Chilena"],
    answer: 0,
    blurb:
      "En el centro se disfrutan danzones y bailes de salón con elegancia.",
    orchestraTie:
      "Participa en encuentros culturales que unen tradición y nuevas audiencias.",
  },
  {
    state: "Ciudad de México",
    question: "¿Qué estilo musical destaca en plazas y salones capitalinos?",
    options: ["Danzón", "Banda", "Son istmeño", "Huapango"],
    answer: 0,
    blurb:
      "El danzón sigue vivo en la capital, acompañando tardes y noches de baile.",
    orchestraTie:
      "Conserva instrumentos típicos en diálogo con cuerdas y alientos clásicos.",
  },
  {
    state: "Nayarit",
    question: "¿Qué ritmo tradicional se baila en la costa del Pacífico?",
    options: ["Cumbia", "Trova", "Norteño", "Pirekua"],
    answer: 0,
    blurb:
      "Nayarit comparte sonidos costeños que celebran la vida junto al mar.",
    orchestraTie:
      "Motiva a las juventudes a conocer su herencia musical con programas escolares.",
  },
  {
    state: "Chihuahua",
    question: "¿Qué instrumento suele acompañar corridos del norte?",
    options: ["Acordeón", "Arpa", "Clavecín", "Flauta"],
    answer: 0,
    blurb:
      "En Chihuahua los corridos y polkas del norte son parte esencial del paisaje.",
    orchestraTie:
      "Comparte repertorio de distintos estados para crear puentes culturales.",
  },
  {
    state: "Sonora",
    question: "¿Qué música describe mejor el espíritu sonorense?",
    options: ["Norteña", "Trova yucateca", "Son jarocho", "Danzón"],
    answer: 0,
    blurb:
      "Sonora vibra con ritmos norteños y letras que narran la vida del desierto.",
    orchestraTie:
      "Difunde música tradicional en eventos comunitarios y organizaciones privadas.",
  },
  {
    state: "Morelos",
    question: "¿Qué ritmo social suele bailarse en Morelos?",
    options: ["Danzón", "Banda", "Norteño", "Chilena"],
    answer: 0,
    blurb:
      "Morelos es tierra de fiestas con danzón y música de salón.",
    orchestraTie:
      "Su presencia en ferias y festivales refuerza la continuidad de las tradiciones.",
  },
  {
    state: "Zacatecas",
    question: "¿Qué estilo es frecuente en las bandas del centro-norte?",
    options: ["Banda", "Trova", "Son jarocho", "Pirekua"],
    answer: 0,
    blurb:
      "Zacatecas tiene tradición de bandas que acompañan celebraciones locales.",
    orchestraTie:
      "Impulsa el reconocimiento de las raíces mexicanas a través del sonido típico.",
  },
  {
    state: "San Luis Potosí",
    question: "¿Qué región influye en su música tradicional?",
    options: ["La Huasteca", "El Istmo", "La Península", "La Tarahumara"],
    answer: 0,
    blurb:
      "San Luis Potosí comparte la riqueza del son huasteco.",
    orchestraTie:
      "Cada concierto es una invitación a conocer la riqueza musical de México.",
  },
  {
    state: "Campeche",
    question: "¿Qué ambiente define sus celebraciones?",
    options: ["Costero y festivo", "Desértico", "Montañoso", "Nevado"],
    answer: 0,
    blurb:
      "Campeche combina herencias mayas con celebraciones de sabor costeño.",
    orchestraTie:
      "Ha llevado la cultura mexicana a foros internacionales con orgullo y disciplina.",
  },
  {
    state: "Durango",
    question: "¿Qué ritmo norteño puede escucharse en Durango?",
    options: ["Polka", "Trova", "Son istmeño", "Danzón"],
    answer: 0,
    blurb:
      "Durango conserva polkas y corridos que cuentan historias regionales.",
    orchestraTie:
      "Su labor demuestra que la música típica sigue viva y en constante evolución.",
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
          <img src={IMAGE_POOL[0]} alt="Orquesta Típica de Jalisco" />
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

          {showFeedback && (
            <div className="feedback">
              <div className={selected === current.answer ? "good" : "bad"}>
                {selected === current.answer
                  ? "¡Respuesta correcta!"
                  : "Ups, esta vez no."}
              </div>
              <p>{current.orchestraTie}</p>
              <button className="next" onClick={nextStep}>
                {isLast ? "Reiniciar" : "Siguiente"}
              </button>
            </div>
          )}
        </div>
      </section>

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
        .feedback {
          margin-top: 24px;
          padding: 20px;
          border-radius: 20px;
          background: #fef3c7;
          display: grid;
          gap: 12px;
        }
        .feedback .good {
          font-weight: 700;
          color: #15803d;
        }
        .feedback .bad {
          font-weight: 700;
          color: #b91c1c;
        }
        .feedback p {
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
