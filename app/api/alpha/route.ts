import { NextResponse } from "next/server";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

const API_BASE = "https://api.binance.com/api/v3/klines";
const CACHE_TTL_MS = 15 * 1000;
const cache = new Map<
  string,
  {
    timestamp: number;
    payload: { candles: Candle[]; source: string; symbol: string; interval: string };
  }
>();

const assetMap: Record<string, string> = {
  BTCUSD: "BTCUSDT",
  ETHUSD: "ETHUSDT",
  LTCUSD: "LTCUSDT",
};

const intervalMap: Record<string, string> = {
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1h": "1h",
  "4h": "4h",
};

const parseKlines = (rows: unknown[]): Candle[] =>
  rows
    .map((row) => {
      if (!Array.isArray(row)) {
        return null;
      }
      const open = Number(row[1]);
      const high = Number(row[2]);
      const low = Number(row[3]);
      const close = Number(row[4]);
      if (![open, high, low, close].every((v) => Number.isFinite(v))) {
        return null;
      }
      return { open, high, low, close };
    })
    .filter((item): item is Candle => Boolean(item));

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
    symbol,
    interval: intervalMap[timeframe],
    limit: "200",
  });

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
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
    source: "binance",
    symbol,
    interval: timeframe,
  };
  cache.set(cacheKey, { timestamp: Date.now(), payload: responsePayload });

  return NextResponse.json(responsePayload);
}
