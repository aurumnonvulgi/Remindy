import { NextResponse } from "next/server";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

const API_BASE = "https://www.alphavantage.co/query";

const assetMap: Record<string, { symbol: string; type: "crypto" }> = {
  BTCUSD: { symbol: "BTC", type: "crypto" },
  ETHUSD: { symbol: "ETH", type: "crypto" },
  LTCUSD: { symbol: "LTC", type: "crypto" },
};

const intervalMap: Record<string, string> = {
  "5m": "5min",
  "15m": "15min",
  "30m": "30min",
  "1h": "60min",
};

const resampleCandles = (candles: Candle[], groupSize: number): Candle[] => {
  if (groupSize <= 1) {
    return candles;
  }
  const result: Candle[] = [];
  for (let i = 0; i < candles.length; i += groupSize) {
    const slice = candles.slice(i, i + groupSize);
    if (!slice.length) {
      continue;
    }
    const open = slice[0].open;
    const close = slice[slice.length - 1].close;
    const high = Math.max(...slice.map((c) => c.high));
    const low = Math.min(...slice.map((c) => c.low));
    result.push({ open, close, high, low });
  }
  return result;
};

const pickValue = (values: Record<string, string>, keys: string[]) => {
  for (const key of keys) {
    if (key in values) {
      return Number(values[key]);
    }
  }
  return NaN;
};

const parseSeries = (payload: Record<string, unknown>): Candle[] => {
  const seriesKey = Object.keys(payload).find((key) =>
    key.toLowerCase().includes("time series")
  );
  if (!seriesKey) {
    return [];
  }
  const series = payload[seriesKey] as Record<string, Record<string, string>>;
  const entries = Object.entries(series).map(([timestamp, values]) => {
    const open = pickValue(values, ["1. open", "1a. open (USD)"]);
    const high = pickValue(values, ["2. high", "2a. high (USD)"]);
    const low = pickValue(values, ["3. low", "3a. low (USD)"]);
    const close = pickValue(values, ["4. close", "4a. close (USD)"]);
    return {
      timestamp,
      candle: { open, high, low, close },
    };
  });
  entries.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  return entries.map((entry) => entry.candle).filter((c) =>
    [c.open, c.high, c.low, c.close].every((v) => Number.isFinite(v))
  );
};

export async function GET(request: Request) {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ALPHAVANTAGE_API_KEY." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const asset = searchParams.get("asset") || "BTCUSD";
  const timeframe = searchParams.get("timeframe") || "1h";
  const assetInfo = assetMap[asset] || assetMap.BTCUSD;

  const params = new URLSearchParams({ apikey: apiKey });
  let resampleSize = 1;

  if (["5m", "15m", "30m", "1h", "4h"].includes(timeframe)) {
    params.set("function", "CRYPTO_INTRADAY");
    params.set("symbol", assetInfo.symbol);
    params.set("market", "USD");
    params.set("interval", intervalMap[timeframe] || "60min");
    params.set("outputsize", "compact");
    if (timeframe === "4h") {
      resampleSize = 4;
    }
  } else {
    params.set("function", "DIGITAL_CURRENCY_DAILY");
    params.set("symbol", assetInfo.symbol);
    params.set("market", "USD");
    if (timeframe === "1w") {
      resampleSize = 5;
    }
  }

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    next: { revalidate: 60 },
  });
  const payload = (await response.json()) as Record<string, unknown>;

  if (payload["Error Message"] || payload["Note"] || payload["Information"]) {
    return NextResponse.json(
      { error: payload["Error Message"] || payload["Note"] || payload["Information"] },
      { status: 502 }
    );
  }

  let candles = parseSeries(payload);
  if (resampleSize > 1) {
    candles = resampleCandles(candles, resampleSize);
  }

  return NextResponse.json({
    candles,
    source: "alpha-vantage",
    symbol: assetInfo.symbol,
    interval: timeframe,
  });
}
