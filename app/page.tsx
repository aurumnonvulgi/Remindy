"use client";

export default function Home() {
  return (
    <main className="page">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />
      <header className="topbar fade-in">
        <div className="logo">
          <span className="logo-mark">WZ</span>
          <span className="logo-text">Wazxn1 Trading Hub</span>
        </div>
        <nav className="nav">
          <a href="#listings">Listings</a>
          <a href="#rates">Rates</a>
          <a href="#safety">Safety</a>
          <button className="cta ghost">Start Trading</button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow fade-in">Murder Mystery 2 • Trading Hub</p>
          <h1 className="fade-in">
            Swap, value, and trade your MM2 items with confidence.
          </h1>
          <p className="lead fade-in">
            A sleek marketplace for MM2 collectors. Track live values, match
            offers instantly, and trade through verified escrow.
          </p>
          <div className="hero-actions fade-in">
            <button className="cta">Browse Swaps</button>
            <button className="cta ghost">Post a Trade</button>
          </div>
          <div className="stats fade-in">
            <div>
              <span>24,581</span>
              <p>Live swaps today</p>
            </div>
            <div>
              <span>1m 12s</span>
              <p>Average match time</p>
            </div>
            <div>
              <span>98.4%</span>
              <p>Verified success rate</p>
            </div>
          </div>
        </div>
        <div className="hero-panel fade-in">
          <div className="panel-card">
            <div className="panel-header">
              <h3>Featured Vault</h3>
              <span className="badge">Ultra Rare</span>
            </div>
            <div className="panel-body">
              <div className="item-row">
                <div className="item-pill emerald">Chroma Luger</div>
                <div className="item-pill gold">Corrupt</div>
              </div>
              <div className="item-row">
                <div className="item-pill crimson">Candleflame</div>
                <div className="item-pill azure">Harvester</div>
              </div>
              <div className="panel-meta">
                <p>Instant escrow • 0.5% fee</p>
                <button className="cta small">Swap Now</button>
              </div>
            </div>
          </div>
          <div className="pulse-card">
            <h4>Price Pulse</h4>
            <div className="pulse-bar">
              <span className="pulse-fill" />
            </div>
            <p>MM2 market up 4.2% this week</p>
          </div>
        </div>
      </section>

      <section id="listings" className="section">
        <div className="section-header fade-in">
          <h2>Hot Listings</h2>
          <p>Fresh trades dropping every minute.</p>
        </div>
        <div className="listings">
          {[
            ["Ice Piercer", "Godly", "4.5k offers"],
            ["Traveler Axe", "Ancient", "1.2k offers"],
            ["Gingermint", "Godly", "2.1k offers"],
            ["Waves", "Chroma", "980 offers"],
            ["Sakura", "Vintage", "750 offers"],
            ["Swirly Blade", "Godly", "1.6k offers"],
          ].map(([name, rarity, offers]) => (
            <article className="listing-card fade-in" key={name}>
              <div className="listing-top">
                <span className="chip">{rarity}</span>
                <span className="offers">{offers}</span>
              </div>
              <h3>{name}</h3>
              <p>Auto-match enabled • Escrow ready</p>
              <button className="cta ghost small">View swap</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section split">
        <div className="split-copy fade-in">
          <h2>Trade flow built for speed.</h2>
          <p>
            Post your item, set your target, and get matched with verified
            traders in seconds. Every swap is tracked with transparent logs and
            instant value checks.
          </p>
          <ul>
            <li>Live MM2 value engine</li>
            <li>Verified escrow & dispute support</li>
            <li>Trade alerts for wishlists</li>
          </ul>
        </div>
        <div className="flow-grid">
          {[
            ["01", "List your item", "Choose value + desired trade."],
            ["02", "Match instantly", "Auto or manual matching."],
            ["03", "Verify + swap", "Escrow ensures safe delivery."],
          ].map(([step, title, copy]) => (
            <div className="flow-card fade-in" key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="rates" className="section rates">
        <div className="section-header fade-in">
          <h2>MM2 Value Exchange</h2>
          <p>Transparent pricing across every swap.</p>
        </div>
        <div className="rate-grid">
          {[
            ["Godly", "1.02x", "Most active tier"],
            ["Ancient", "1.15x", "High demand"],
            ["Chroma", "1.34x", "Limited supply"],
            ["Vintage", "0.92x", "Collector niche"],
          ].map(([tier, multiplier, note]) => (
            <div className="rate-card fade-in" key={tier}>
              <h3>{tier}</h3>
              <span>{multiplier}</span>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="safety" className="section safety">
        <div className="section-header fade-in">
          <h2>Built for trust.</h2>
          <p>Escrow-backed trading with full transparency.</p>
        </div>
        <div className="safety-grid">
          {[
            ["Verified traders", "Multi-step verification + trust scores."],
            ["Escrow protection", "Items held until both sides confirm."],
            ["Live moderation", "24/7 human review for disputes."],
          ].map(([title, copy]) => (
            <div className="safety-card fade-in" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-strip fade-in">
        <div>
          <h2>Ready to trade your next legendary?</h2>
          <p>Join the fastest MM2 exchange and secure your next upgrade.</p>
        </div>
        <button className="cta">Open the Vault</button>
      </section>

      <footer className="footer">
        <p>Not affiliated with Roblox or Murder Mystery 2. Fan-made exchange.</p>
        <span>© 2026 Wazxn1 Trading Hub</span>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cinzel:wght@500;600&display=swap");
        :root {
          color-scheme: dark;
          --bg: #050507;
          --surface: #0f1117;
          --surface-2: #151826;
          --ink: #f8fafc;
          --muted: #9aa4b2;
          --accent: #22c55e;
          --accent-2: #f59e0b;
          --accent-3: #38bdf8;
          --stroke: rgba(148, 163, 184, 0.18);
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: var(--bg);
          font-family: "Outfit", sans-serif;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          color: var(--ink);
          padding: 32px clamp(20px, 6vw, 80px) 60px;
        }
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              circle at top left,
              rgba(56, 189, 248, 0.08),
              transparent 45%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(34, 197, 94, 0.1),
              transparent 50%
            ),
            linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.02),
              transparent 40%
            );
          z-index: 0;
        }
        .bg-orb {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.4;
          z-index: 0;
        }
        .orb-one {
          top: -120px;
          left: -120px;
          background: rgba(34, 197, 94, 0.35);
        }
        .orb-two {
          bottom: -180px;
          right: -160px;
          background: rgba(245, 158, 11, 0.35);
        }
        .topbar {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-mark {
          font-family: "Cinzel", serif;
          font-size: 18px;
          letter-spacing: 0.2em;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(15, 17, 23, 0.6);
        }
        .logo-text {
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 14px;
          color: var(--muted);
        }
        .nav a:hover {
          color: var(--ink);
        }
        .cta {
          border: none;
          border-radius: 999px;
          padding: 12px 22px;
          background: linear-gradient(120deg, #22c55e, #10b981);
          color: #04120a;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
        }
        .cta.small {
          padding: 8px 14px;
          font-size: 13px;
        }
        .cta.ghost {
          background: transparent;
          border: 1px solid var(--stroke);
          color: var(--ink);
          box-shadow: none;
        }
        .hero {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 48px;
          padding: 70px 0 60px;
        }
        .hero-copy h1 {
          font-family: "Cinzel", serif;
          font-size: clamp(2.6rem, 4vw, 4.2rem);
          margin: 12px 0 16px;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          color: var(--accent-2);
        }
        .lead {
          color: var(--muted);
          font-size: 18px;
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin: 26px 0;
          flex-wrap: wrap;
        }
        .stats {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          margin-top: 20px;
        }
        .stats span {
          font-size: 22px;
          font-weight: 600;
        }
        .stats p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 14px;
        }
        .hero-panel {
          display: grid;
          gap: 18px;
        }
        .panel-card {
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--stroke);
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .panel-header h3 {
          margin: 0;
        }
        .badge {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .panel-body {
          margin-top: 20px;
          display: grid;
          gap: 14px;
        }
        .item-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .item-pill {
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 14px;
          background: var(--surface-2);
          border: 1px solid var(--stroke);
        }
        .item-pill.emerald {
          border-color: rgba(34, 197, 94, 0.4);
          color: #86efac;
        }
        .item-pill.gold {
          border-color: rgba(245, 158, 11, 0.4);
          color: #fcd34d;
        }
        .item-pill.crimson {
          border-color: rgba(248, 113, 113, 0.45);
          color: #fecaca;
        }
        .item-pill.azure {
          border-color: rgba(56, 189, 248, 0.4);
          color: #7dd3fc;
        }
        .panel-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--muted);
          font-size: 14px;
        }
        .pulse-card {
          background: var(--surface-2);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid var(--stroke);
        }
        .pulse-bar {
          width: 100%;
          height: 8px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 999px;
          margin: 12px 0;
          overflow: hidden;
        }
        .pulse-fill {
          display: block;
          width: 65%;
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #22c55e);
          animation: pulse 3s ease-in-out infinite;
        }
        .section {
          position: relative;
          z-index: 2;
          margin: 40px 0 80px;
        }
        .section-header h2 {
          font-family: "Cinzel", serif;
          margin: 0 0 10px;
        }
        .section-header p {
          color: var(--muted);
          margin: 0;
        }
        .listings {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }
        .listing-card {
          background: rgba(15, 17, 23, 0.8);
          border: 1px solid var(--stroke);
          border-radius: 20px;
          padding: 18px;
          display: grid;
          gap: 10px;
          min-height: 170px;
        }
        .listing-top {
          display: flex;
          justify-content: space-between;
          color: var(--muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        .chip {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.14);
          color: #7dd3fc;
        }
        .offers {
          color: #34d399;
        }
        .split {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
        }
        .split-copy ul {
          margin: 20px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
          color: var(--muted);
        }
        .flow-grid {
          display: grid;
          gap: 16px;
        }
        .flow-card {
          background: var(--surface-2);
          border-radius: 20px;
          border: 1px solid var(--stroke);
          padding: 20px;
        }
        .flow-card span {
          font-size: 12px;
          letter-spacing: 0.3em;
          color: var(--accent-2);
        }
        .rates .rate-grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .rate-card {
          background: var(--surface);
          border-radius: 20px;
          border: 1px solid var(--stroke);
          padding: 18px;
          display: grid;
          gap: 8px;
        }
        .rate-card span {
          font-size: 24px;
          color: var(--accent);
        }
        .safety-grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }
        .safety-card {
          background: var(--surface-2);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid var(--stroke);
        }
        .cta-strip {
          margin: 80px 0 40px;
          padding: 28px;
          background: linear-gradient(
            120deg,
            rgba(34, 197, 94, 0.16),
            rgba(56, 189, 248, 0.12)
          );
          border-radius: 24px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          color: var(--muted);
          border-top: 1px solid var(--stroke);
          padding-top: 20px;
          font-size: 13px;
        }
        .fade-in {
          opacity: 0;
          animation: fadeUp 0.9s ease forwards;
        }
        .fade-in:nth-child(2) {
          animation-delay: 0.1s;
        }
        .fade-in:nth-child(3) {
          animation-delay: 0.2s;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(16px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(8%);
          }
        }
        @media (max-width: 860px) {
          .nav {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
