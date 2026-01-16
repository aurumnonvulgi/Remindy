"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Phrase = {
  zh: string;
  pinyin: string;
  en: string;
};

type PinyinToken = {
  word: string;
  zh?: string;
};

type GameItem = Phrase & {
  id: string;
};

type PinyinOption = {
  id: string;
  cardId: string;
  pinyin: string;
  zh: string;
};

const seededShuffle = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

type CandleResponse = {
  candles: Candle[];
  source: string;
  symbol: string;
  interval: string;
};

const PHRASES: Phrase[] = [
  { zh: "你好", pinyin: "Nǐ hǎo", en: "Hello" },
  { zh: "谢谢", pinyin: "Xièxie", en: "Thank you" },
  { zh: "不客气", pinyin: "Bú kèqì", en: "You're welcome" },
  { zh: "对不起", pinyin: "Duìbuqǐ", en: "Sorry" },
  { zh: "没关系", pinyin: "Méi guānxi", en: "It's okay" },
  { zh: "请", pinyin: "Qǐng", en: "Please" },
  { zh: "再见", pinyin: "Zàijiàn", en: "Goodbye" },
  { zh: "我叫…", pinyin: "Wǒ jiào…", en: "My name is…" },
  { zh: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?", en: "What's your name?" },
  { zh: "很高兴认识你", pinyin: "Hěn gāoxìng rènshi nǐ", en: "Nice to meet you" },
  { zh: "你会说英语吗？", pinyin: "Nǐ huì shuō Yīngyǔ ma?", en: "Do you speak English?" },
  { zh: "我不懂", pinyin: "Wǒ bù dǒng", en: "I don't understand" },
  { zh: "请慢一点", pinyin: "Qǐng màn yìdiǎn", en: "Please speak slower" },
  { zh: "现在几点？", pinyin: "Xiànzài jǐ diǎn?", en: "What time is it?" },
  { zh: "多少钱？", pinyin: "Duōshǎo qián?", en: "How much is it?" },
  { zh: "我想要这个", pinyin: "Wǒ xiǎng yào zhège", en: "I want this" },
  { zh: "可以吗？", pinyin: "Kěyǐ ma?", en: "Is it okay?" },
  { zh: "没问题", pinyin: "Méi wèntí", en: "No problem" },
  { zh: "我饿了", pinyin: "Wǒ è le", en: "I'm hungry" },
  { zh: "我渴了", pinyin: "Wǒ kě le", en: "I'm thirsty" },
  { zh: "厕所在哪里？", pinyin: "Cèsuǒ zài nǎlǐ?", en: "Where is the restroom?" },
  { zh: "我迷路了", pinyin: "Wǒ mílù le", en: "I'm lost" },
  { zh: "可以帮我吗？", pinyin: "Kěyǐ bāng wǒ ma?", en: "Can you help me?" },
  { zh: "请给我菜单", pinyin: "Qǐng gěi wǒ càidān", en: "Menu, please" },
  { zh: "不要", pinyin: "Bú yào", en: "No, thanks" },
  { zh: "等等", pinyin: "Děng děng", en: "Wait a moment" },
  { zh: "我喜欢这个", pinyin: "Wǒ xǐhuan zhège", en: "I like this" },
  { zh: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?", en: "How's the weather?" },
  { zh: "我们走吧", pinyin: "Wǒmen zǒu ba", en: "Let's go" },
  { zh: "请再说一遍", pinyin: "Qǐng zài shuō yí biàn", en: "Please say it again" },
  { zh: "你在做什么？", pinyin: "Nǐ zài zuò shénme?", en: "What are you doing?" },
  { zh: "我在路上", pinyin: "Wǒ zài lùshàng", en: "I'm on the way" },
  { zh: "请坐", pinyin: "Qǐng zuò", en: "Please sit" },
  { zh: "我明白了", pinyin: "Wǒ míngbái le", en: "I understand" },
  { zh: "我不知道", pinyin: "Wǒ bù zhīdào", en: "I don't know" },
  { zh: "可以便宜一点吗？", pinyin: "Kěyǐ piányi yìdiǎn ma?", en: "Can it be cheaper?" },
  { zh: "你住哪儿？", pinyin: "Nǐ zhù nǎr?", en: "Where do you live?" },
  { zh: "我住在这里", pinyin: "Wǒ zhù zài zhèlǐ", en: "I live here" },
  { zh: "今天很忙", pinyin: "Jīntiān hěn máng", en: "I'm busy today" },
  { zh: "你有时间吗？", pinyin: "Nǐ yǒu shíjiān ma?", en: "Do you have time?" },
  { zh: "请帮我拍张照", pinyin: "Qǐng bāng wǒ pāi zhāng zhào", en: "Please take a photo for me" },
  { zh: "我们去哪儿？", pinyin: "Wǒmen qù nǎr?", en: "Where are we going?" },
  { zh: "我累了", pinyin: "Wǒ lèi le", en: "I'm tired" },
  { zh: "我想休息", pinyin: "Wǒ xiǎng xiūxi", en: "I want to rest" },
  { zh: "这很重要", pinyin: "Zhè hěn zhòngyào", en: "This is important" },
  { zh: "祝你好运", pinyin: "Zhù nǐ hǎo yùn", en: "Good luck" },
  { zh: "生日快乐", pinyin: "Shēngrì kuàilè", en: "Happy birthday" },
  { zh: "我爱你", pinyin: "Wǒ ài nǐ", en: "I love you" },
  { zh: "我想你", pinyin: "Wǒ xiǎng nǐ", en: "I miss you" },
  { zh: "你很可爱", pinyin: "Nǐ hěn kě’ài", en: "You're very cute" },
  { zh: "你真漂亮", pinyin: "Nǐ zhēn piàoliang", en: "You are beautiful" },
  { zh: "你真帅", pinyin: "Nǐ zhēn shuài", en: "You are handsome" },
  { zh: "我喜欢你", pinyin: "Wǒ xǐhuan nǐ", en: "I like you" },
  { zh: "想和你在一起", pinyin: "Xiǎng hé nǐ zài yìqǐ", en: "I want to be with you" },
  { zh: "你是我的", pinyin: "Nǐ shì wǒ de", en: "You are mine" },
  { zh: "晚安", pinyin: "Wǎn’ān", en: "Good night" },
  { zh: "早安", pinyin: "Zǎo’ān", en: "Good morning" },
  { zh: "我们去约会吧", pinyin: "Wǒmen qù yuēhuì ba", en: "Let's go on a date" },
  { zh: "我心动了", pinyin: "Wǒ xīndòng le", en: "My heart is moved" },
  { zh: "你让我安心", pinyin: "Nǐ ràng wǒ ān xīn", en: "You make me feel safe" },
];

const ACCENTS = ["#ff7a59", "#ffc53d", "#5eead4", "#60a5fa"];

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [revealLevel, setRevealLevel] = useState(4);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [replaySeed, setReplaySeed] = useState(0);
  const [gameSeed, setGameSeed] = useState(0);
  const [pinyinAssignments, setPinyinAssignments] = useState<
    Record<string, string>
  >({});
  const [mismatchCardId, setMismatchCardId] = useState<string | null>(null);
  const [successCardId, setSuccessCardId] = useState<string | null>(null);
  const lastSpokenRef = useRef<string>("");
  const speakLockRef = useRef(false);
  const autoSpokenIndexRef = useRef<number | null>(null);

  const [tradeAsset, setTradeAsset] = useState("BTCUSD");
  const [tradeTimeframe, setTradeTimeframe] = useState("1h");
  const [tradeSeed, setTradeSeed] = useState(1);
  const [tradeSelection, setTradeSelection] = useState<
    "long" | "short" | null
  >(null);
  const [tradeRevealed, setTradeRevealed] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<
    Array<{
      id: string;
      asset: string;
      timeframe: string;
      direction: "long" | "short";
      entry: number;
      exit: number;
      result: "win" | "loss";
    }>
  >([]);
  const [liveCandles, setLiveCandles] = useState<Candle[]>([]);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);

  const phrase = PHRASES[phraseIndex];
  const accent = useMemo(
    () => ACCENTS[phraseIndex % ACCENTS.length],
    [phraseIndex]
  );
  const revealDelay = useMemo(() => {
    const delays = [70, 130, 220, 360, 550, 800];
    return delays[Math.min(Math.max(revealLevel - 1, 0), delays.length - 1)];
  }, [revealLevel]);

  const availableVoices = useMemo(
    () =>
      voices.filter(
        (voice) =>
          voice.lang.startsWith("zh") && !voice.lang.toLowerCase().includes("hk")
      ),
    [voices]
  );

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (!available.length) {
        return;
      }
      setVoices(available);
      const preferred = available.find((voice) =>
        voice.lang.startsWith("zh")
      );
      setVoiceUri((current) => current || preferred?.voiceURI || "");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    setTypedCount(0);
    autoSpokenIndexRef.current = null;
    if (!phrase) {
      return;
    }
    const interval = window.setInterval(() => {
      setTypedCount((current) => {
        if (current >= phrase.zh.length) {
          window.clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, revealDelay);
    return () => window.clearInterval(interval);
  }, [phraseIndex, phrase?.zh, revealDelay, replaySeed]);

  const speakText = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setTtsError("Speech is not supported on this device.");
      return;
    }
    setTtsError(null);
    if (speakLockRef.current && lastSpokenRef.current === text) {
      return;
    }
    speakLockRef.current = true;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selected = voiceUri
      ? voices.find((voice) => voice.voiceURI === voiceUri)
      : undefined;
    utterance.lang = selected?.lang || "zh-CN";
    utterance.rate = Number(speechRate.toFixed(2));
    if (selected) {
      utterance.voice = selected;
    }
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      speakLockRef.current = false;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      speakLockRef.current = false;
    };
    lastSpokenRef.current = text;
    window.speechSynthesis.speak(utterance);
  }, [speechRate, voiceUri, voices]);

  const speakPhrase = useCallback(() => {
    speakText(phrase.zh);
  }, [phrase?.zh, speakText]);

  useEffect(() => {
    if (
      autoSpeak &&
      typedCount >= phrase.zh.length &&
      autoSpokenIndexRef.current !== phraseIndex
    ) {
      autoSpokenIndexRef.current = phraseIndex;
      speakPhrase();
    }
  }, [autoSpeak, typedCount, phrase?.zh, speakPhrase, phraseIndex]);

  const handleNext = useCallback(() => {
    setPhraseIndex((current) => (current + 1) % PHRASES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setPhraseIndex((current) =>
      current === 0 ? PHRASES.length - 1 : current - 1
    );
  }, []);

  const revealInstantly = useCallback(() => {
    setTypedCount(phrase.zh.length);
  }, [phrase?.zh]);

  const replayReveal = useCallback(() => {
    setTypedCount(0);
    setReplaySeed((current) => current + 1);
  }, []);

  const isComplete = typedCount >= phrase.zh.length;
  const pinyinWords = useMemo(
    () => phrase.pinyin.split(" ").filter(Boolean),
    [phrase.pinyin]
  );
  const pinyinTokens = useMemo<PinyinToken[]>(() => {
    const hanChars = Array.from(
      phrase.zh.replace(/[^\p{Script=Han}…]/gu, "")
    );
    if (pinyinWords.length === hanChars.length) {
      return pinyinWords.map((word, index) => ({
        word,
        zh: hanChars[index],
      }));
    }
    return pinyinWords.map((word) => ({ word }));
  }, [phrase.zh, pinyinWords]);

  const gameItems = useMemo<GameItem[]>(() => {
    return seededShuffle(PHRASES, gameSeed)
      .slice(0, 4)
      .map((item, index) => ({
        id: `${index}-${item.zh}`,
        ...item,
      }));
  }, [gameSeed]);

  const pinyinOptions = useMemo<PinyinOption[]>(() => {
    const options = gameItems.map((item) => ({
      id: `${item.id}-pinyin`,
      cardId: item.id,
      pinyin: item.pinyin,
      zh: item.zh,
    }));
    return seededShuffle(options, gameSeed + 101);
  }, [gameItems, gameSeed]);

  useEffect(() => {
    setPinyinAssignments({});
    setMismatchCardId(null);
    setSuccessCardId(null);
  }, [gameSeed]);

  const assignedPinyinIds = useMemo(
    () => new Set(Object.values(pinyinAssignments)),
    [pinyinAssignments]
  );

  const handleAssignPinyin = useCallback(
    (cardId: string, optionId: string) => {
      const selected = pinyinOptions.find((option) => option.id === optionId);
      if (!selected) {
        return;
      }
      if (selected.cardId !== cardId) {
        setMismatchCardId(cardId);
        window.setTimeout(() => setMismatchCardId(null), 650);
        return;
      }
      setPinyinAssignments((current) => ({
        ...current,
        [cardId]: selected.id,
      }));
      setSuccessCardId(cardId);
      window.setTimeout(() => setSuccessCardId(null), 900);
    },
    [pinyinOptions]
  );

  const tradeConfigKey = useMemo(
    () => `${tradeAsset}-${tradeTimeframe}-${tradeSeed}`,
    [tradeAsset, tradeTimeframe, tradeSeed]
  );
  const candles = liveCandles;
  const hasEnoughCandles = candles.length >= 75;
  const entryCandle = candles[49];
  const exitCandle = candles[74];
  const entryPrice = entryCandle?.close ?? 0;
  const exitPrice = exitCandle?.close ?? 0;
  const tradeOutcome =
    tradeSelection && tradeRevealed
      ? tradeSelection === "long"
        ? exitPrice >= entryPrice
          ? "win"
          : "loss"
        : exitPrice <= entryPrice
        ? "win"
        : "loss"
      : null;

  const visibleCandles = tradeRevealed
    ? candles.slice(0, 75)
    : candles.slice(0, 50);
  const candleRange = useMemo(() => {
    if (!visibleCandles.length) {
      return { high: 1, low: 0 };
    }
    const highs = visibleCandles.map((candle) => candle.high);
    const lows = visibleCandles.map((candle) => candle.low);
    return {
      high: Math.max(...highs, 1),
      low: Math.min(...lows, 0),
    };
  }, [visibleCandles]);

  const handleTradeSelect = useCallback(
    (direction: "long" | "short") => {
      if (!entryCandle || !exitCandle) {
        return;
      }
      setTradeSelection(direction);
      setTradeRevealed(true);
      const result =
        direction === "long"
          ? exitPrice >= entryPrice
            ? "win"
            : "loss"
          : exitPrice <= entryPrice
          ? "win"
          : "loss";
      setTradeHistory((current) => [
        {
          id: `${tradeConfigKey}-${direction}`,
          asset: tradeAsset,
          timeframe: tradeTimeframe,
          direction,
          entry: entryPrice,
          exit: exitPrice,
          result,
        },
        ...current,
      ]);
    },
    [entryCandle, entryPrice, exitPrice, tradeAsset, tradeConfigKey, tradeTimeframe]
  );

  useEffect(() => {
    setTradeSelection(null);
    setTradeRevealed(false);
  }, [tradeAsset, tradeTimeframe, tradeSeed]);

  useEffect(() => {
    let isActive = true;
    const fetchCandles = async () => {
      setTradeLoading(true);
      setTradeError(null);
      try {
        const params = new URLSearchParams({
          asset: tradeAsset,
          timeframe: tradeTimeframe,
        });
        const response = await fetch(`/api/alpha?${params.toString()}`);
        const payload = (await response.json()) as CandleResponse & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload?.error || "Failed to load market data.");
        }
        if (!payload.candles?.length) {
          throw new Error("No candles returned for that selection.");
        }
        if (isActive) {
          setLiveCandles(payload.candles.slice(0, 75));
        }
      } catch (error) {
        if (isActive) {
          setTradeError(
            error instanceof Error ? error.message : "Unable to load candles."
          );
          setLiveCandles([]);
        }
      } finally {
        if (isActive) {
          setTradeLoading(false);
        }
      }
    };
    fetchCandles();
    return () => {
      isActive = false;
    };
  }, [tradeAsset, tradeTimeframe, tradeSeed]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6_0%,_#ffe6ef_35%,_#d8f3ff_70%,_#f6f7ff_100%)] px-6 py-10 text-slate-900">
      <details className="mx-auto w-full max-w-5xl rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[22px] bg-white/80 px-6 py-4 text-xl font-semibold text-slate-900 shadow-sm transition hover:bg-white">
          Mandarin Flashcards
          <span className="text-sm text-slate-400 transition group-open:rotate-180">
            ▼
          </span>
        </summary>
        <div className="mt-6 flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-xl shadow-sm">
              🐼
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Daily Mandarin
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Mandarin by EN
              </h1>
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
            <div
              className="absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-40"
              style={{ background: accent }}
            />
            <div className="absolute bottom-[-80px] left-[-40px] h-40 w-40 rounded-full bg-slate-100/70" />

            <div className="relative flex flex-col gap-8">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Card {phraseIndex + 1} of {PHRASES.length}
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                  {autoSpeak ? "Auto-speak on" : "Auto-speak off"}
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={revealInstantly}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    revealInstantly();
                  }
                }}
                className="group flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center transition hover:border-slate-300 hover:bg-white"
              >
                <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Phrase
                </span>
                <span className="flex flex-wrap items-center justify-center gap-1 text-5xl font-semibold text-slate-900 sm:text-6xl">
                  {Array.from(phrase.zh).map((char, index) => {
                    const isVisible = index < typedCount;
                    const isNew = index === typedCount - 1;
                    return (
                      <span
                        key={`${char}-${index}-${replaySeed}`}
                        className={`inline-block ${
                          isVisible ? "opacity-100" : "opacity-0"
                        } ${isNew ? "animate-reveal-burst" : ""}`}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {!isComplete && (
                    <span className="ml-2 inline-block h-8 w-[2px] animate-pulse bg-slate-400" />
                  )}
                </span>
                <span className="text-xs text-slate-500">
                  Tap to reveal instantly
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    replayReveal();
                  }}
                  className="mt-1 inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white px-4 py-1 text-[11px] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                >
                  Replay strokes
                </button>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[18px] bg-slate-900 px-5 py-4 text-left text-white">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                      Pinyin
                    </p>
                    <button
                      type="button"
                      onClick={speakPhrase}
                      className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/25"
                    >
                      Play phrase
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {isComplete
                      ? pinyinTokens.map((token, index) => (
                          <button
                            key={`${token.word}-${index}`}
                            type="button"
                            onClick={() =>
                              speakText(token.zh ? token.zh : phrase.zh)
                            }
                            className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/20"
                          >
                            {token.word}
                          </button>
                        ))
                      : "…"}
                  </div>
                  <p className="mt-2 text-xs text-white/70">
                    Tap a word to hear it
                  </p>
                </div>
                <div className="rounded-[18px] bg-white px-5 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    English
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {isComplete ? phrase.en : "Revealing…"}
                  </p>
                </div>
              </div>

              {ttsError ? (
                <p className="text-sm text-rose-600">{ttsError}</p>
              ) : null}

              <div className="grid w-full gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-full rounded-2xl bg-rose-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={speakPhrase}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  style={{ background: accent }}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                    {isSpeaking ? "⏺" : "▶"}
                  </span>
                  {isSpeaking ? "Speaking" : "Play audio"}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-500"
                >
                  Next
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPhraseIndex(Math.floor(Math.random() * PHRASES.length))
                }
                className="mt-2 w-full rounded-2xl bg-amber-300 px-6 py-4 text-base font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Surprise me
              </button>
            </div>
          </section>
          <details className="group rounded-[26px] bg-white/80 p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-slate-900">
              Controls
              <span className="text-sm text-slate-400 transition group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 flex flex-col gap-4 text-sm text-slate-600">
              <label className="flex items-center justify-between gap-3">
                Reveal speed
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={revealLevel}
                  onChange={(event) => setRevealLevel(Number(event.target.value))}
                  className="w-36 accent-slate-900"
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                Speech speed
                <input
                  type="range"
                  min={0.4}
                  max={1.6}
                  step={0.1}
                  value={speechRate}
                  onChange={(event) => setSpeechRate(Number(event.target.value))}
                  className="w-36 accent-slate-900"
                />
              </label>
              <p className="text-xs text-slate-500">
                Some voices ignore speed changes. Try another Chinese voice if
                you don&apos;t hear a difference.
              </p>
              <label className="flex items-center justify-between gap-3">
                Auto-speak
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(event) => setAutoSpeak(event.target.checked)}
                  className="h-5 w-5 accent-slate-900"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Voice
                <select
                  value={voiceUri}
                  onChange={(event) => setVoiceUri(event.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                {availableVoices.length === 0 ? (
                  <span className="text-xs text-rose-500">
                    No Chinese voices available on this device.
                  </span>
                ) : null}
              </label>
            </div>
          </details>
          <section className="rounded-[26px] border border-white/70 bg-white/80 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Match the phrase
              </h2>
              <button
                type="button"
                onClick={() => {
                  setGameSeed((current) => current + 1);
                }}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                New round
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Match by listening and reading. No symbols shown.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {pinyinOptions
                .filter((option) => !assignedPinyinIds.has(option.id))
                .map((option) => {
                  return (
                    <button
                      key={option.id}
                      type="button"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", option.id);
                      }}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
                    >
                      {option.pinyin}
                    </button>
                  );
                })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {gameItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition ${
                    mismatchCardId === item.id
                      ? "border-rose-500 ring-4 ring-rose-300 animate-error-flash"
                      : successCardId === item.id
                      ? "border-emerald-500 ring-4 ring-emerald-300 animate-success-burst"
                      : ""
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    English
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {item.en}
                  </p>
                  <button
                    type="button"
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const optionId = event.dataTransfer.getData("text/plain");
                      if (optionId) {
                        handleAssignPinyin(item.id, optionId);
                      }
                    }}
                    className="mt-4 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {pinyinAssignments[item.id]
                      ? pinyinOptions.find(
                          (option) => option.id === pinyinAssignments[item.id]
                        )?.pinyin
                      : "Drag Pinyin here"}
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(item.zh)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    🔊 Play audio
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
        </div>
      </details>
      <section className="mx-auto mt-8 w-full max-w-5xl rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Trading Charts Game
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Candle Quest
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setTradeSeed((current) => current + 1)}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            New round
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {tradeAsset}
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                {tradeTimeframe}
              </span>
            </div>
            <div className="mt-4 flex h-56 items-end gap-1 overflow-hidden rounded-2xl bg-slate-900/5 p-3">
              {tradeLoading ? (
                <p className="text-sm text-slate-500">Loading candles…</p>
              ) : tradeError ? (
                <p className="text-sm text-rose-600">{tradeError}</p>
              ) : !hasEnoughCandles ? (
                <p className="text-sm text-slate-500">
                  Not enough candles returned for this selection.
                </p>
              ) : (
                visibleCandles.map((candle, index) => {
                  const range = candleRange.high - candleRange.low || 1;
                  const highPos =
                    ((candleRange.high - candle.high) / range) * 100;
                  const lowPos =
                    ((candleRange.high - candle.low) / range) * 100;
                  const openPos =
                    ((candleRange.high - candle.open) / range) * 100;
                  const closePos =
                    ((candleRange.high - candle.close) / range) * 100;
                  const bodyTop = Math.min(openPos, closePos);
                  const bodyBottom = Math.max(openPos, closePos);
                  const isUp = candle.close >= candle.open;
                  return (
                    <div
                      key={`${tradeConfigKey}-${index}`}
                      className="relative h-full flex-1"
                    >
                      <div
                        className="absolute left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-slate-400"
                        style={{
                          top: `${highPos}%`,
                          height: `${Math.max(4, lowPos - highPos)}%`,
                        }}
                      />
                      <div
                        className={`absolute left-1/2 w-[10px] -translate-x-1/2 rounded-md ${
                          isUp ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                        style={{
                          top: `${bodyTop}%`,
                          height: `${Math.max(6, bodyBottom - bodyTop)}%`,
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Showing {visibleCandles.length} candles. Choose long or short to
              reveal the next 25.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Asset
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { id: "BTCUSD", label: "Bitcoin" },
                  { id: "ETHUSD", label: "Ethereum" },
                  { id: "AAPL", label: "Apple" },
                  { id: "SP500", label: "S&P 500" },
                  { id: "TSLA", label: "Tesla" },
                ].map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setTradeAsset(asset.id)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      tradeAsset === asset.id
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {asset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Timeframe
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["5m", "15m", "30m", "1h", "4h", "1d", "1w"].map((frame) => (
                  <button
                    key={frame}
                    type="button"
                    onClick={() => setTradeTimeframe(frame)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      tradeTimeframe === frame
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Position
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={tradeRevealed || tradeLoading || !hasEnoughCandles}
                  onClick={() => handleTradeSelect("long")}
                  className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200"
                >
                  Go Long
                </button>
                <button
                  type="button"
                  disabled={tradeRevealed || tradeLoading || !hasEnoughCandles}
                  onClick={() => handleTradeSelect("short")}
                  className="rounded-2xl bg-rose-400 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-200"
                >
                  Go Short
                </button>
              </div>
              {tradeRevealed && tradeOutcome ? (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    tradeOutcome === "win"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  Result: {tradeOutcome.toUpperCase()} — Entry {entryPrice.toFixed(2)} → Exit{" "}
                  {exitPrice.toFixed(2)}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Trade Log
            </p>
            <span className="text-xs text-slate-500">
              {tradeHistory.length} total
            </span>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {tradeHistory.length === 0 ? (
              <p className="text-slate-500">No trades yet.</p>
            ) : (
              tradeHistory.slice(0, 6).map((trade) => (
                <div
                  key={trade.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="font-semibold text-slate-900">
                    {trade.asset} · {trade.timeframe}
                  </span>
                  <span className="text-slate-500">{trade.direction}</span>
                  <span
                    className={`font-semibold ${
                      trade.result === "win"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {trade.result.toUpperCase()}
                  </span>
                  <span className="text-slate-500">
                    {trade.entry.toFixed(2)} → {trade.exit.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <footer className="pt-6 text-center text-sm font-semibold tracking-[0.5em] text-slate-400 sm:text-base">
        4AM4E
      </footer>
      <style jsx global>{`
        @keyframes success-burst {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
            background-color: #ffffff;
          }
          45% {
            transform: scale(1.03);
            box-shadow: 0 0 0 16px rgba(16, 185, 129, 0.25);
            background-color: #ecfdf5;
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            background-color: #ffffff;
          }
        }
        @keyframes error-flash {
          0% {
            transform: translateX(0);
            box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.5);
            background-color: #ffffff;
          }
          30% {
            transform: translateX(-6px);
            box-shadow: 0 0 0 16px rgba(244, 63, 94, 0.2);
            background-color: #fff1f2;
          }
          60% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(0);
            box-shadow: 0 0 0 0 rgba(244, 63, 94, 0);
            background-color: #ffffff;
          }
        }
        .animate-success-burst {
          animation: success-burst 0.8s ease-out;
        }
        .animate-error-flash {
          animation: error-flash 0.7s ease-in-out;
        }
      `}</style>
    </div>
  );
}
