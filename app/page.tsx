"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Phrase = {
  zh: string;
  pinyin: string;
  en: string;
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

export default function Home() {
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [gameSeed, setGameSeed] = useState(0);
  const [pinyinAssignments, setPinyinAssignments] = useState<
    Record<string, string>
  >({});
  const [mismatchCardId, setMismatchCardId] = useState<string | null>(null);
  const [successCardId, setSuccessCardId] = useState<string | null>(null);
  const lastSpokenRef = useRef<string>("");
  const speakLockRef = useRef(false);

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
    utterance.onend = () => {
      speakLockRef.current = false;
    };
    utterance.onerror = () => {
      speakLockRef.current = false;
    };
    lastSpokenRef.current = text;
    window.speechSynthesis.speak(utterance);
  }, [speechRate, voiceUri, voices]);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7d6_0%,_#ffe6ef_35%,_#d8f3ff_70%,_#f6f7ff_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
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
          <details className="group rounded-[26px] bg-white/80 p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-slate-900">
              Controls
              <span className="text-sm text-slate-400 transition group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 flex flex-col gap-4 text-sm text-slate-600">
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
            {ttsError ? (
              <p className="mt-3 text-sm text-rose-600">{ttsError}</p>
            ) : null}

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
                      ? "border-rose-500 ring-4 ring-rose-200"
                      : successCardId === item.id
                      ? "border-emerald-500 ring-4 ring-emerald-200"
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
        <footer className="pt-4 text-center text-sm font-semibold tracking-[0.5em] text-slate-400 sm:text-base">
          4AM4E
        </footer>
      </div>
    </div>
  );
}
