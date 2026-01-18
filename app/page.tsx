"use client";

import { useMemo, useState } from "react";

const TABS = ["Home", "My Facility", "Estimate", "Supplies", "Account"] as const;

const FACILITY_TYPES = [
  "Office",
  "Medical / Dental",
  "School / Daycare",
  "Retail",
  "Warehouse / Industrial",
  "Gym / Fitness",
  "Restaurant / Food Facility",
  "Apartment / HOA",
  "Other",
];

const FREQUENCIES = ["Daily", "2x Week", "Weekly", "Monthly"];

const AREA_TEMPLATES = [
  "Bathrooms",
  "Kitchens / Break Rooms",
  "Offices / Cubicles",
  "Conference Rooms",
  "Lobby / Reception",
  "Hallways",
  "Stairs / Elevators",
  "Storage Rooms",
  "Classrooms",
  "Exam Rooms",
  "Showers / Locker Rooms",
  "Loading Dock",
  "Floor Care Zones",
];

const TASK_LIBRARY = {
  Bathrooms: [
    "Restock toilet paper",
    "Restock paper towels",
    "Refill soap",
    "Clean mirrors",
    "Disinfect sinks",
    "Disinfect toilets/urinals",
    "Mop floor",
    "Empty trash",
    "Detail edges/corners",
  ],
  "Kitchens / Break Rooms": [
    "Wipe counters",
    "Clean sink",
    "Clean outside of appliances",
    "Replace liners",
    "Sweep + mop",
  ],
  "Offices / Cubicles": [
    "Dust surfaces",
    "Vacuum",
    "Empty trash",
    "Spot clean glass",
  ],
  Default: [
    "Dust surfaces",
    "Sweep + mop",
    "Empty trash",
    "Wipe high-touch points",
  ],
} as const;

type Area = {
  id: string;
  name: string;
  type: string;
  size: string;
  frequency: string;
  notes: string;
  photo: string;
  tasks: readonly string[];
};

const SUPPLIES = [
  {
    name: "Toilet Paper",
    details: "Jumbo rolls · Case of 12",
    price: "$64 / case",
  },
  {
    name: "Paper Towels",
    details: "Multifold · Case of 16",
    price: "$52 / case",
  },
  {
    name: "Trash Liners",
    details: "33 gal · Box of 100",
    price: "$38 / box",
  },
  {
    name: "Hand Soap",
    details: "1 gal refills · Case of 4",
    price: "$44 / case",
  },
  {
    name: "Disinfectant",
    details: "Concentrate · 5L",
    price: "$29 / unit",
  },
  {
    name: "Gloves",
    details: "Nitrile · Box of 100",
    price: "$18 / box",
  },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
];

const initialAreas: Area[] = [
  {
    id: "area-1",
    name: "Bathroom #1 - Front Office",
    type: "Bathrooms",
    size: "Medium",
    frequency: "Daily",
    notes: "High traffic, focus on mirrors and counters.",
    photo: SAMPLE_IMAGES[0],
    tasks: TASK_LIBRARY.Bathrooms,
  },
  {
    id: "area-2",
    name: "Break Room",
    type: "Kitchens / Break Rooms",
    size: "Small",
    frequency: "Weekly",
    notes: "Wipe appliances and sanitize sink.",
    photo: SAMPLE_IMAGES[1],
    tasks: TASK_LIBRARY["Kitchens / Break Rooms"],
  },
  {
    id: "area-3",
    name: "Open Office",
    type: "Offices / Cubicles",
    size: "Large",
    frequency: "Daily",
    notes: "Vacuum carpets and empty trash.",
    photo: SAMPLE_IMAGES[2],
    tasks: TASK_LIBRARY["Offices / Cubicles"],
  },
];

export default function Home() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Home");
  const [facilityType, setFacilityType] = useState(FACILITY_TYPES[0]);
  const [sqft, setSqft] = useState(12000);
  const [floors, setFloors] = useState("Multi-story");
  const [traffic, setTraffic] = useState("Medium");
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [selectedArea, setSelectedArea] = useState(initialAreas[0]);
  const [supplies, setSupplies] = useState<string[]>([]);

  const estimate = useMemo(() => {
    const base = sqft * 0.08;
    const trafficMultiplier = traffic === "High" ? 1.3 : traffic === "Low" ? 0.9 : 1;
    const areaFactor = areas.length * 150;
    const low = Math.round((base + areaFactor) * trafficMultiplier);
    const high = Math.round(low * 1.25 + 250);
    return { low, high };
  }, [sqft, traffic, areas.length]);

  const addArea = (type: string) => {
    const tasks = TASK_LIBRARY[type as keyof typeof TASK_LIBRARY] ?? TASK_LIBRARY.Default;
    const newArea = {
      id: `area-${areas.length + 1}`,
      name: `${type} #${areas.length + 1}`,
      type,
      size: "Medium",
      frequency: "Weekly",
      notes: "",
      photo: SAMPLE_IMAGES[areas.length % SAMPLE_IMAGES.length],
      tasks,
    };
    setAreas((prev) => [...prev, newArea]);
    setSelectedArea(newArea);
  };

  const toggleSupply = (item: string) => {
    setSupplies((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Janitorial Facility Builder</p>
          <h1>Instant estimates + supplies, all in one request.</h1>
          <p className="lead">
            Build a digital twin of your facility, attach photos per area, select
            tasks, and request a quote in minutes.
          </p>
        </div>
        <div className="hero-card">
          <h2>Say Yes Travel Agency</h2>
          <p>Customer-facing MVP · Janitorial Services</p>
          <button>Request a Quote</button>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {tab === "Home" && (
        <section className="grid">
          <div className="panel">
            <h3>Getting started</h3>
            <ol>
              <li>Choose facility type + size.</li>
              <li>Add rooms/areas and attach photos.</li>
              <li>Select tasks and frequency.</li>
              <li>Receive instant estimate range.</li>
            </ol>
          </div>
          <div className="panel">
            <h3>Supplies included</h3>
            <p>
              Bundle recurring consumables like toilet paper, paper towels, trash
              liners, soaps and disinfectants directly into your plan.
            </p>
          </div>
          <div className="panel">
            <h3>Admin-ready pipeline</h3>
            <p>
              Structured data: facility summary, area breakdown, photos, checklists
              and supply needs.
            </p>
          </div>
        </section>
      )}

      {tab === "My Facility" && (
        <section className="facility">
          <div className="panel">
            <h3>Facility Details</h3>
            <label>
              Facility type
              <select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
                {FACILITY_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Square footage
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
              />
              <span>{sqft.toLocaleString()} sq ft</span>
            </label>
            <label>
              Floors
              <select value={floors} onChange={(e) => setFloors(e.target.value)}>
                <option>Single story</option>
                <option>Multi-story</option>
              </select>
            </label>
            <label>
              Foot traffic
              <select value={traffic} onChange={(e) => setTraffic(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <div className="panel">
            <h3>Areas & Zones</h3>
            <div className="template-grid">
              {AREA_TEMPLATES.map((template) => (
                <button key={template} onClick={() => addArea(template)}>
                  + {template}
                </button>
              ))}
            </div>
            <div className="area-list">
              {areas.map((area) => (
                <button
                  key={area.id}
                  className={selectedArea.id === area.id ? "active" : ""}
                  onClick={() => setSelectedArea(area)}
                >
                  <span>{area.name}</span>
                  <small>{area.frequency}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="panel detail">
            <h3>{selectedArea.name}</h3>
            <p className="meta">
              {selectedArea.type} · {selectedArea.size} · {selectedArea.frequency}
            </p>
            <img src={selectedArea.photo} alt={selectedArea.name} />
            <h4>What needs to be done here?</h4>
            <ul>
              {selectedArea.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
            <label>
              Notes / problem areas
              <textarea value={selectedArea.notes} readOnly rows={3}></textarea>
            </label>
          </div>
        </section>
      )}

      {tab === "Estimate" && (
        <section className="estimate">
          <div className="panel">
            <h3>Instant Estimate</h3>
            <p>
              Facility: {facilityType} · {sqft.toLocaleString()} sq ft · {floors}
            </p>
            <p>Areas: {areas.length}</p>
            <p>Traffic: {traffic}</p>
            <div className="price-range">
              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
            </div>
            <button>Request Final Quote</button>
          </div>
          <div className="panel">
            <h3>What we receive</h3>
            <ul>
              <li>Facility summary + operating hours</li>
              <li>Area breakdown with photos + checklists</li>
              <li>Supplies request + recurring schedule</li>
              <li>Preferred start date + access notes</li>
            </ul>
          </div>
        </section>
      )}

      {tab === "Supplies" && (
        <section className="supplies">
          <div className="panel">
            <h3>Consumables Catalog</h3>
            <p>Toggle items to include in your recurring restock plan.</p>
            <div className="supply-grid">
              {SUPPLIES.map((item) => (
                <button
                  key={item.name}
                  className={supplies.includes(item.name) ? "active" : ""}
                  onClick={() => toggleSupply(item.name)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.details}</span>
                  <em>{item.price}</em>
                </button>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3>Supply Needs Calculator</h3>
            <p>
              Example: 25 employees · 2 bathrooms · High traffic → Suggested 4
              cases of paper towels per month.
            </p>
          </div>
        </section>
      )}

      {tab === "Account" && (
        <section className="grid">
          <div className="panel">
            <h3>Contact</h3>
            <p>Phone: 510-329-8786</p>
            <p>Email: sayyes@gmail.com</p>
          </div>
          <div className="panel">
            <h3>Service Schedule</h3>
            <p>Coming soon: manage recurring visits and staff assignments.</p>
          </div>
        </section>
      )}

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: "Inter", system-ui, sans-serif;
          background: #f8fafc;
          color: #0f172a;
        }
        .page {
          padding: 48px clamp(24px, 6vw, 80px) 72px;
          display: grid;
          gap: 32px;
        }
        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          align-items: center;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 12px;
          color: #0ea5e9;
          margin: 0 0 12px;
        }
        h1 {
          font-size: clamp(2rem, 3vw, 3rem);
          margin: 0 0 12px;
        }
        .lead {
          font-size: 18px;
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }
        .hero-card {
          background: #0f172a;
          color: #f8fafc;
          padding: 24px;
          border-radius: 20px;
          display: grid;
          gap: 12px;
        }
        .hero-card button {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
        }
        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tabs button {
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
        }
        .tabs button.active {
          background: #0ea5e9;
          color: #fff;
          border-color: transparent;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .panel {
          background: #fff;
          padding: 20px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          display: grid;
          gap: 12px;
        }
        .panel h3 {
          margin: 0;
        }
        .panel label {
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: #475569;
        }
        .panel input,
        .panel select,
        .panel textarea {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 10px;
          font-size: 14px;
        }
        .facility {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .template-grid {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }
        .template-grid button {
          background: #e0f2fe;
          border: none;
          padding: 8px 10px;
          border-radius: 10px;
          cursor: pointer;
        }
        .area-list {
          display: grid;
          gap: 8px;
        }
        .area-list button {
          display: flex;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          padding: 10px;
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
        }
        .area-list button.active {
          border-color: #0ea5e9;
          box-shadow: 0 8px 18px rgba(14, 165, 233, 0.2);
        }
        .detail img {
          width: 100%;
          border-radius: 14px;
          height: 180px;
          object-fit: cover;
        }
        .detail h4 {
          margin: 0;
        }
        .detail ul {
          margin: 0;
          padding-left: 18px;
          color: #475569;
        }
        .estimate {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .price-range {
          font-size: 28px;
          font-weight: 700;
          color: #0ea5e9;
        }
        .estimate button {
          border: none;
          background: #0ea5e9;
          color: #fff;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
        }
        .supplies {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .supply-grid {
          display: grid;
          gap: 10px;
        }
        .supply-grid button {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          text-align: left;
          background: #fff;
          display: grid;
          gap: 6px;
          cursor: pointer;
        }
        .supply-grid button.active {
          border-color: #22c55e;
          background: #f0fdf4;
        }
        @media (max-width: 640px) {
          .hero-card {
            order: -1;
          }
        }
      `}</style>
    </main>
  );
}
