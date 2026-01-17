import { NextResponse } from "next/server";

type Candle = {
  time: number;
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
  "1h": 3600,
  "4h": 14400,
  "6h": 21600,
  "1d": 86400,
};

const aggregateConfig: Record<string, { base: keyof typeof intervalMap; size: number }> = {
  "4h": { base: "1h", size: 4 },
};

const parseKlines = (rows: unknown[]): Candle[] =>
  rows
    .map((row) => {
      if (!Array.isArray(row)) {
        return null;
      }
      const time = Number(row[0]);
      const low = Number(row[1]);
      const high = Number(row[2]);
      const open = Number(row[3]);
      const close = Number(row[4]);
      if (![time, open, high, low, close].every((v) => Number.isFinite(v))) {
        return null;
      }
      return { time, open, high, low, close };
    })
    .filter((item): item is Candle => Boolean(item))
    .reverse();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") || "BTCUSD";
  const timeframe = searchParams.get("timeframe") || "1h";
  const anchor = searchParams.get("anchor");
  const symbol = assetMap[asset] || assetMap.BTCUSD;
  const aggregate = aggregateConfig[timeframe];
  const fetchTimeframe = aggregate ? aggregate.base : timeframe;

  if (!intervalMap[fetchTimeframe]) {
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

  const lookbackCount = aggregate ? 75 * aggregate.size : 300;
  const params = new URLSearchParams({
    granularity: String(intervalMap[fetchTimeframe]),
  });
  if (anchor) {
    const anchorSeconds = Number(anchor);
    if (Number.isFinite(anchorSeconds) && anchorSeconds > 0) {
      const anchorDate = new Date(anchorSeconds * 1000);
      const startDate = new Date(
        anchorDate.getTime() - intervalMap[fetchTimeframe] * lookbackCount * 1000
      );
      params.set("end", anchorDate.toISOString());
      params.set("start", startDate.toISOString());
    }
  }

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

  const parsedCandles = parseKlines(Array.isArray(payload) ? payload : []);
  const candles = aggregate
    ? (() => {
        const grouped: Candle[] = [];
        for (let i = 0; i < parsedCandles.length; i += aggregate.size) {
          const chunk = parsedCandles.slice(i, i + aggregate.size);
          if (chunk.length < aggregate.size) {
            continue;
          }
          grouped.push({
            time: chunk[0].time,
            open: chunk[0].open,
            high: Math.max(...chunk.map((c) => c.high)),
            low: Math.min(...chunk.map((c) => c.low)),
            close: chunk[chunk.length - 1].close,
          });
        }
        return grouped;
      })()
    : parsedCandles;
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
