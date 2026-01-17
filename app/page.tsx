"use client";

const PACKAGES = [
  {
    title: "Disney Cruise Asia — Todo Incluido",
    destination: "Tokyo · Osaka · Yokohama",
    highlight:
      "Crucero Disney, vuelos internacionales, hoteles 4★, traslados privados y entradas a parques.",
    includes: [
      "Vuelos ida y vuelta",
      "Crucero Disney (cabina familiar)",
      "Hoteles 4★ con desayuno",
      "Transporte terrestre",
      "Entradas a parques",
    ],
    price: "Desde $4,890 USD",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Ruta Imperial de Japón",
    destination: "Kyoto · Nara · Tokyo",
    highlight:
      "Templos, jardines, tren bala, hospedaje boutique y experiencias culturales.",
    includes: [
      "Tren bala JR",
      "Guías locales",
      "Hoteles boutique",
      "Tour de templos",
      "Cena kaiseki",
    ],
    price: "Desde $3,250 USD",
    image:
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Santorini & Atenas romántico",
    destination: "Santorini · Atenas",
    highlight:
      "Hoteles frente al mar, vuelos, ferries y experiencias privadas.",
    includes: [
      "Vuelos internacionales",
      "Ferry rápido",
      "Hotel con vista al mar",
      "Tour privado",
      "Traslados",
    ],
    price: "Desde $2,980 USD",
    image:
      "https://images.unsplash.com/photo-1505739771-468b4f4d8b69?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Aventura Maya Premium",
    destination: "Cancún · Tulum · Chichén Itzá",
    highlight:
      "Resort todo incluido, tours arqueológicos y traslados VIP.",
    includes: [
      "Resort 5★",
      "Tours arqueológicos",
      "Traslados VIP",
      "Cenotes privados",
      "Seguro de viaje",
    ],
    price: "Desde $1,750 USD",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Safari & Dubai",
    destination: "Dubai · Abu Dhabi",
    highlight:
      "Desierto, rascacielos, hoteles de lujo y experiencias exclusivas.",
    includes: [
      "Hotel 5★",
      "Safari en el desierto",
      "City pass",
      "Traslados",
      "Cena espectáculo",
    ],
    price: "Desde $3,600 USD",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Templos del Sudeste Asiático",
    destination: "Bangkok · Ayutthaya · Siem Reap",
    highlight:
      "Templos legendarios, hoteles con encanto y guías expertos.",
    includes: [
      "Tours de templos",
      "Hoteles boutique",
      "Traslados internos",
      "Guía bilingüe",
      "Experiencia gastronómica",
    ],
    price: "Desde $2,140 USD",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  return (
    <main className="page">
      <header className="hero">
        <div className="hero-text">
          <p className="eyebrow">Say Yes Travel Agency</p>
          <h1>Paquetes listos para viajar sin preocupaciones</h1>
          <p className="lead">
            Todo incluido: vuelos, hoteles, transporte, entradas y experiencias.
            Elige tu destino, nosotros hacemos el resto.
          </p>
          <div className="cta-row">
            <a className="cta" href="tel:510-329-8786">
              Llama ahora: 510-329-8786
            </a>
            <a className="cta ghost" href="mailto:sayyes@gmail.com">
              sayyes@gmail.com
            </a>
          </div>
        </div>
        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
            alt="Destino destacado"
          />
          <div className="hero-badge">Click one. Travel the world.</div>
        </div>
      </header>

      <section className="grid">
        {PACKAGES.map((pkg) => (
          <article className="card" key={pkg.title}>
            <div className="card-media">
              <img src={pkg.image} alt={pkg.title} />
            </div>
            <div className="card-body">
              <div>
                <p className="card-destination">{pkg.destination}</p>
                <h2>{pkg.title}</h2>
                <p className="card-highlight">{pkg.highlight}</p>
              </div>
              <ul>
                {pkg.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="card-footer">
                <span className="price">{pkg.price}</span>
                <button className="book">Reservar</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="footer">
        <div>
          <strong>Say Yes Travel Agency</strong>
          <p>
            Viajes personalizados y paquetes completos alrededor del mundo.
          </p>
        </div>
        <div>
          <p>📞 510-329-8786</p>
          <p>✉️ sayyes@gmail.com</p>
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
        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 36px;
          align-items: center;
          background: linear-gradient(120deg, #fdf6e7, #f2efe8);
          border-radius: 36px;
          padding: clamp(28px, 4vw, 44px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          color: #a16207;
          margin: 0 0 10px;
        }
        h1 {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          margin: 0 0 16px;
        }
        .lead {
          font-size: 18px;
          line-height: 1.7;
          margin: 0 0 24px;
          color: #4b5563;
        }
        .cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .cta {
          background: #a16207;
          color: #fff7ed;
          padding: 12px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
        }
        .cta.ghost {
          background: transparent;
          border: 1px solid #a16207;
          color: #a16207;
        }
        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
        }
        .hero-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hero-badge {
          position: absolute;
          bottom: 18px;
          left: 18px;
          background: rgba(17, 24, 39, 0.8);
          color: #fff7ed;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .card {
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          display: grid;
        }
        .card-media img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .card-body {
          padding: 22px;
          display: grid;
          gap: 16px;
        }
        .card-destination {
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: 11px;
          color: #a16207;
          margin: 0 0 8px;
        }
        h2 {
          margin: 0 0 8px;
          font-size: 22px;
        }
        .card-highlight {
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
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .price {
          font-weight: 700;
          color: #a16207;
        }
        .book {
          border: none;
          background: #1f2933;
          color: #fff7ed;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
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
        @media (max-width: 720px) {
          .hero {
            padding: 24px;
          }
          .card-media img {
            height: 200px;
          }
          .cta-row {
            flex-direction: column;
          }
          .cta,
          .cta.ghost {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
