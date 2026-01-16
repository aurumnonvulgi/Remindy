import { NextResponse } from "next/server";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

const API_BASE = "https://api.exchange.coinbase.com/products";
const CACHE_TTL_MS = 15 * 1000;
const cache = new Map<
  string,
  {
    timestamp: number;
    payload: { candles: Candle[]; source: string; symbol: string; interval: string };
  }
>();

const assetMap: Record<string, string> = {
  BTCUSD: "BTC-USD",
  ETHUSD: "ETH-USD",
  LTCUSD: "LTC-USD",
};

const intervalMap: Record<string, number> = {
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
};

const parseKlines = (rows: unknown[]): Candle[] =>
  rows
    .map((row) => {
      if (!Array.isArray(row)) {
        return null;
      }
      const low = Number(row[1]);
      const high = Number(row[2]);
      const open = Number(row[3]);
      const close = Number(row[4]);
      if (![open, high, low, close].every((v) => Number.isFinite(v))) {
        return null;
      }
      return { open, high, low, close };
    })
    .filter((item): item is Candle => Boolean(item))
    .reverse();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") || "BTCUSD";
  const timeframe = searchParams.get("timeframe") || "1h";
  const symbol = assetMap[asset] || assetMap.BTCUSD;

  if (!intervalMap[timeframe]) {
    return NextResponse.json(
      { error: "Timeframe not supported for crypto data." },
      { status: 400 }
    );
  }

  const cacheKey = `${symbol}-${timeframe}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload);
  }

  const params = new URLSearchParams({
    granularity: String(intervalMap[timeframe]),
  });

  const response = await fetch(`${API_BASE}/${symbol}/candles?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    if (cached) {
      return NextResponse.json(cached.payload);
    }
    return NextResponse.json({ error: "Failed to fetch crypto data." }, { status: 502 });
  }

  const candles = parseKlines(Array.isArray(payload) ? payload : []);
  if (!candles.length) {
    if (cached) {
      return NextResponse.json(cached.payload);
    }
    return NextResponse.json({ error: "No candles returned." }, { status: 502 });
  }

  const responsePayload = {
    candles,
    source: "coinbase",
    symbol,
    interval: timeframe,
  };
  cache.set(cacheKey, { timestamp: Date.now(), payload: responsePayload });

  return NextResponse.json(responsePayload);
}
