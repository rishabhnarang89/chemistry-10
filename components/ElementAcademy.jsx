"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "./Celebration";
import TipBubble from "./TipBubble";
import Mascot from "./Mascot";
import { useStoredState } from "@/lib/storage";
import { play } from "@/lib/sound";
import { ELEMENTS, MNEMONIC_CHUNKS, FULL_MNEMONIC } from "@/lib/elements";

/* ─────────────────────── Shared helpers ─────────────────────── */

const GROUP_STYLE = {
  metal: { bg: "#CBE5FA", ring: "#3E8FD4", text: "#3E8FD4", label: "Metal" },
  nonmetal: { bg: "#FBD5D5", ring: "#EE7B7B", text: "#EE7B7B", label: "Non-metal" },
  metalloid: { bg: "#FFDFC7", ring: "#F79C5C", text: "#F79C5C", label: "Metalloid" },
  noble: { bg: "#E2D8F7", ring: "#7554B8", text: "#7554B8", label: "Noble gas" },
};

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ElementTile({ el, size = "md", onClick, dim = false, highlight = false }) {
  const s = GROUP_STYLE[el.group];
  const isSm = size === "sm";
  return (
    <motion.button
      whileHover={onClick ? { scale: 1.07, y: -3 } : {}}
      whileTap={onClick ? { scale: 0.94 } : {}}
      onClick={onClick}
      disabled={!onClick}
      animate={highlight ? { scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center rounded-2xl transition ${
        isSm ? "min-h-[56px] px-1 py-1.5" : "min-h-[76px] px-2 py-2"
      } ${dim ? "opacity-25" : ""}`}
      style={{
        background: s.bg,
        boxShadow: highlight ? `0 0 0 3px ${s.ring}` : "none",
      }}
    >
      <span
        className={`font-bold leading-none ${isSm ? "text-[8px]" : "text-[9px]"}`}
        style={{ color: s.text, opacity: 0.7 }}
      >
        {el.z}
      </span>
      <span
        className={`font-display font-bold leading-tight ${isSm ? "text-sm" : "text-lg"}`}
        style={{ color: s.text }}
      >
        {el.symbol}
      </span>
      {!isSm && (
        <span className="text-[9px] font-bold leading-tight text-ink/50">
          {el.name}
        </span>
      )}
    </motion.button>
  );
}

/* ═══════════════════ MODE 1: Mnemonic Trainer ═══════════════════ */

function MnemonicTrainer({ learnedChunks, setLearnedChunks }) {
  const [chunkIndex, setChunkIndex] = useState(0);
  const [revealed, setRevealed] = useState(0); // how many words revealed
  const [testing, setTesting] = useState(false);
  const [testInput, setTestInput] = useState([]);
  const [wobble, setWobble] = useState(null);

  const chunk = MNEMONIC_CHUNKS[chunkIndex];
  const chunkLearned = learnedChunks.includes(chunk.id);
  const allLearned = learnedChunks.length === MNEMONIC_CHUNKS.length;

  const chunkElements = chunk.symbols.map((sym) =>
    ELEMENTS.find((e) => e.symbol === sym)
  );

  /* Test mode: tap the symbols in the right order */
  const testPool = useMemo(
    () => (testing ? shuffle(chunk.symbols) : []),
    [testing, chunk.symbols]
  );
  const testComplete = testInput.length === chunk.symbols.length;

  const tapSymbol = (sym) => {
    const expected = chunk.symbols[testInput.length];
    if (sym === expected) {
      play("ding");
      const next = [...testInput, sym];
      setTestInput(next);
      setWobble(null);
      if (next.length === chunk.symbols.length) {
        play("tada");
        setLearnedChunks((prev) =>
          prev.includes(chunk.id) ? prev : [...prev, chunk.id]
        );
      }
    } else {
      play("oops");
      setWobble(sym);
      setTimeout(() => setWobble(null), 600);
    }
  };

  const goToChunk = (i) => {
    play("pop");
    setChunkIndex(i);
    setRevealed(0);
    setTesting(false);
    setTestInput([]);
  };

  const startTest = () => {
    play("pop");
    setTesting(true);
    setTestInput([]);
  };

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-butter-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
        🧠 20 elements is a lot to memorise at once — so we'll learn them{" "}
        <b>5 at a time</b> using a silly story. Silly sticks better than serious!
      </p>

      {/* Chunk picker */}
      <div className="flex flex-wrap gap-2">
        {MNEMONIC_CHUNKS.map((c, i) => (
          <motion.button
            key={c.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToChunk(i)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              i === chunkIndex
                ? "bg-butter-400 text-ink shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-butter-100"
            }`}
          >
            {learnedChunks.includes(c.id) ? "⭐ " : ""}
            {c.range}
          </motion.button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        <Celebration show={testComplete} glow="#F7D96B" />

        {/* The mnemonic line */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {chunk.words.map((word, i) => {
            const el = chunkElements[i];
            const isShown = revealed > i || chunkLearned || testing;
            const s = GROUP_STYLE[el.group];
            return (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-display text-lg font-bold text-ink sm:text-xl">
                  <span style={{ color: s.text }}>
                    {word.slice(0, chunk.cues[i])}
                  </span>
                  {word.slice(chunk.cues[i])}
                </span>
                <AnimatePresence>
                  {isShown && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="rounded-lg px-2 py-0.5 font-display text-sm font-bold"
                      style={{ background: s.bg, color: s.text }}
                    >
                      {el.symbol}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mx-auto mb-5 max-w-lg rounded-2xl bg-lav-100 px-4 py-3 text-center text-sm font-semibold leading-relaxed text-ink/65">
          💭 {chunk.story}
        </p>

        {!testing ? (
          <>
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {chunkElements.map((el, i) => (
                <div
                  key={el.symbol}
                  className={
                    revealed > i || chunkLearned ? "" : "opacity-30 grayscale"
                  }
                >
                  <ElementTile el={el} />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {revealed < chunk.words.length && !chunkLearned ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    play("snap");
                    setRevealed((r) => r + 1);
                  }}
                  className="min-h-[44px] rounded-full bg-butter-400 px-7 py-2.5 font-bold text-ink shadow-pop"
                >
                  Reveal next element ✨ ({revealed}/{chunk.words.length})
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="min-h-[44px] rounded-full bg-mint-500 px-7 py-2.5 font-bold text-white shadow-pop"
                >
                  {chunkLearned ? "Practise again 🔄" : "Test yourself! 🎯"}
                </motion.button>
              )}
            </div>
          </>
        ) : (
          /* ── Test mode ── */
          <div className="space-y-4">
            <p className="text-center text-sm font-bold text-ink/60">
              Tap the symbols in the order of the story:
            </p>

            {/* Slots */}
            <div className="flex flex-wrap justify-center gap-2">
              {chunk.symbols.map((sym, i) => {
                const filled = testInput[i];
                const el = filled ? ELEMENTS.find((e) => e.symbol === filled) : null;
                return (
                  <div
                    key={i}
                    className={`grid h-14 w-14 place-items-center rounded-2xl border-2 ${
                      filled
                        ? "border-mint-400 bg-mint-100"
                        : "border-dashed border-lav-200 bg-lav-100/30"
                    }`}
                  >
                    {el ? (
                      <motion.span
                        initial={{ scale: 0.4 }}
                        animate={{ scale: 1 }}
                        className="font-display text-lg font-bold text-mint-600"
                      >
                        {el.symbol}
                      </motion.span>
                    ) : (
                      <span className="text-xs font-bold text-ink/25">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pool */}
            {!testComplete && (
              <div className="flex flex-wrap justify-center gap-2">
                {testPool
                  .filter((sym) => !testInput.includes(sym))
                  .map((sym) => {
                    const el = ELEMENTS.find((e) => e.symbol === sym);
                    return (
                      <motion.div
                        key={sym}
                        animate={wobble === sym ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <ElementTile el={el} onClick={() => tapSymbol(sym)} />
                      </motion.div>
                    );
                  })}
              </div>
            )}

            <AnimatePresence>
              {wobble && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm font-semibold text-ink/55"
                >
                  💭 Not that one — say the story in your head: "{chunk.line}"
                </motion.p>
              )}
              {testComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-mint-100 px-5 py-3 text-center"
                >
                  <p className="font-display text-lg font-bold text-mint-600">
                    🎉 Perfect! You've locked in {chunk.range}!
                  </p>
                  {chunkIndex < MNEMONIC_CHUNKS.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToChunk(chunkIndex + 1)}
                      className="mt-2 min-h-[44px] rounded-full bg-mint-500 px-6 py-2 font-bold text-white shadow-pop"
                    >
                      Next 5 elements →
                    </motion.button>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-ink/60">
                      That's all 20! Try the Flashcards next.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Full sentence */}
      <AnimatePresence>
        {allLearned && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-blob bg-butter-100 p-5 text-center"
          >
            <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink/50">
              🏆 The whole sentence — all 20 elements
            </h3>
            <p className="font-display text-lg font-bold leading-relaxed text-ink/80">
              "{FULL_MNEMONIC}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════ MODE 2: Flashcards ═══════════════════ */

function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const el = ELEMENTS[index];
  const s = GROUP_STYLE[el.group];

  const go = (delta) => {
    play("pop");
    setFlipped(false);
    setIndex((i) => (i + delta + ELEMENTS.length) % ELEMENTS.length);
  };

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-butter-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
        🃏 Study mode — no pressure, no scoring. Tap the card to flip it and see
        the atomic mass, valency, and <i>why</i> the valency is what it is.
      </p>

      <div className="rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        {/* Card */}
        <div className="mx-auto max-w-sm">
          <motion.button
            onClick={() => {
              play("snap");
              setFlipped((f) => !f);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative block min-h-[290px] w-full rounded-3xl p-6 text-left shadow-pop"
            style={{ background: s.bg }}
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key="front"
                  initial={{ opacity: 0, rotateY: -60 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 60 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col items-center justify-center gap-2"
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: s.text, opacity: 0.7 }}
                  >
                    Atomic number {el.z}
                  </span>
                  <span
                    className="font-display text-7xl font-bold leading-none"
                    style={{ color: s.text }}
                  >
                    {el.symbol}
                  </span>
                  <span className="font-display text-2xl font-bold text-ink/80">
                    {el.name}
                  </span>
                  <span className="mt-3 rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold text-ink/50">
                    Tap to reveal mass &amp; valency 👆
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ opacity: 0, rotateY: 60 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -60 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col justify-center gap-3"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-display text-4xl font-bold"
                      style={{ color: s.text }}
                    >
                      {el.symbol}
                    </span>
                    <span className="font-display text-lg font-bold text-ink/70">
                      {el.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/45">
                        Atomic mass
                      </p>
                      <p className="font-display text-2xl font-bold text-ink">
                        {el.mass}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/45">
                        Valency
                      </p>
                      <p className="font-display text-2xl font-bold text-ink">
                        {el.valency}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/45">
                      Electron arrangement
                    </p>
                    <p className="font-display text-lg font-bold text-ink">
                      {el.shells}
                    </p>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-ink/65">
                    {el.note}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Nav */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => go(-1)}
              className="min-h-[44px] rounded-full bg-white px-6 py-2 font-bold text-ink/60 shadow-soft"
            >
              ← Prev
            </motion.button>
            <span className="text-sm font-bold text-ink/45">
              {index + 1} / {ELEMENTS.length}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => go(1)}
              className="min-h-[44px] rounded-full bg-white px-6 py-2 font-bold text-ink/60 shadow-soft"
            >
              Next →
            </motion.button>
          </div>
        </div>

        {/* Jump grid */}
        <div className="mt-6">
          <h3 className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-ink/40">
            Jump to any element
          </h3>
          <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1.5 sm:grid-cols-10">
            {ELEMENTS.map((e, i) => (
              <ElementTile
                key={e.symbol}
                el={e}
                size="sm"
                highlight={i === index}
                onClick={() => {
                  play("pop");
                  setFlipped(false);
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MODE 3: Quiz Drill ═══════════════════ */

const QUIZ_LENGTH = 10;

function buildQuestion() {
  const el = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  const kinds = ["mass", "valency", "symbol"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];

  if (kind === "symbol") {
    const wrong = shuffle(ELEMENTS.filter((e) => e.symbol !== el.symbol))
      .slice(0, 3)
      .map((e) => e.symbol);
    return {
      key: `${el.symbol}-symbol-${Math.random()}`,
      prompt: `What is the symbol for ${el.name}?`,
      answer: el.symbol,
      options: shuffle([el.symbol, ...wrong]),
      explain: `${el.name} is ${el.symbol}, atomic number ${el.z}.`,
      el,
    };
  }

  if (kind === "mass") {
    const wrong = shuffle(
      Array.from(new Set(ELEMENTS.map((e) => e.mass))).filter((m) => m !== el.mass)
    )
      .slice(0, 3)
      .map(String);
    return {
      key: `${el.symbol}-mass-${Math.random()}`,
      prompt: `What is the atomic mass of ${el.name} (${el.symbol})?`,
      answer: String(el.mass),
      options: shuffle([String(el.mass), ...wrong]),
      explain: `${el.symbol} has atomic mass ${el.mass}. ${el.note}`,
      el,
    };
  }

  const wrong = shuffle([0, 1, 2, 3, 4].filter((v) => v !== el.valency))
    .slice(0, 3)
    .map(String);
  return {
    key: `${el.symbol}-valency-${Math.random()}`,
    prompt: `What is the valency of ${el.name} (${el.symbol})?`,
    answer: String(el.valency),
    options: shuffle([String(el.valency), ...wrong]),
    explain: `${el.symbol} has valency ${el.valency}. Electrons: ${el.shells}. ${el.note}`,
    el,
  };
}

function QuizDrill({ bestScore, setBestScore }) {
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: QUIZ_LENGTH }, buildQuestion)
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  const pick = (option) => {
    if (picked) return;
    setPicked(option);
    const correct = option === q.answer;
    if (correct) {
      play("ding");
      setScore((s) => s + 1);
    } else {
      play("oops");
      setMissed((m) => [...m, q]);
    }
    setTimeout(() => {
      if (index + 1 >= QUIZ_LENGTH) {
        const finalScore = score + (correct ? 1 : 0);
        setFinished(true);
        play(finalScore === QUIZ_LENGTH ? "tada" : "success");
        setBestScore((prev) => Math.max(prev, finalScore));
      } else {
        setIndex((i) => i + 1);
        setPicked(null);
      }
    }, 2100);
  };

  const restart = () => {
    play("pop");
    setQuestions(Array.from({ length: QUIZ_LENGTH }, buildQuestion));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setMissed([]);
    setFinished(false);
  };

  if (finished) {
    const stars = score === QUIZ_LENGTH ? 3 : score >= 8 ? 2 : score >= 5 ? 1 : 0;
    return (
      <div className="relative overflow-hidden rounded-blob bg-white/70 p-8 text-center shadow-floaty">
        <Celebration show glow="#F7D96B" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <p className="text-6xl">{score >= 8 ? "🏆" : "🌱"}</p>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink">
            {score} out of {QUIZ_LENGTH} correct!
          </h3>
          <div className="mt-3 flex justify-center gap-2 text-3xl">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.25, type: "spring" }}
                className={i < stars ? "" : "opacity-20 grayscale"}
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className="mt-2 text-sm font-bold text-ink/50">
            Personal best: {Math.max(bestScore, score)}/{QUIZ_LENGTH}
          </p>

          {missed.length > 0 && (
            <div className="mx-auto mt-5 max-w-md rounded-2xl bg-butter-100 px-5 py-4 text-left">
              <p className="mb-2 text-center text-sm font-extrabold text-ink/60">
                Worth another look:
              </p>
              <ul className="space-y-1.5">
                {missed.map((m, i) => (
                  <li key={i} className="text-sm font-semibold text-ink/65">
                    • {m.explain}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
            className="mt-5 min-h-[44px] rounded-full bg-mint-500 px-8 py-3 font-bold text-white shadow-pop"
          >
            New round 🔄
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-2xl bg-butter-100 px-4 py-2 text-sm font-semibold text-ink/70">
          🎯 10 quick questions on symbols, masses, and valencies.
        </p>
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-soft">
          <span className="text-sm font-bold text-ink/50">
            Q{index + 1}/{QUIZ_LENGTH}
          </span>
          <span className="text-sm font-extrabold text-mint-600">⭐ {score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white">
        <motion.div
          className="h-full rounded-full bg-butter-400"
          animate={{ width: `${(index / QUIZ_LENGTH) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="rounded-blob bg-white/70 p-6 shadow-floaty">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <Mascot size={34} bg="#F7D96B" mood={picked ? "excited" : "neutral"} />
              <p className="font-display text-xl font-bold text-ink">{q.prompt}</p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isAnswer = opt === q.answer;
                const isPicked = picked === opt;
                let cls = "bg-white text-ink/75 hover:bg-butter-100";
                if (picked) {
                  if (isAnswer) cls = "bg-mint-100 text-mint-600 ring-2 ring-mint-400";
                  else if (isPicked) cls = "bg-butter-200 text-ink/55";
                  else cls = "bg-white text-ink/30";
                }
                return (
                  <motion.button
                    key={opt}
                    whileHover={!picked ? { scale: 1.04 } : {}}
                    whileTap={!picked ? { scale: 0.95 } : {}}
                    animate={
                      picked && isPicked && !isAnswer
                        ? { x: [0, -8, 8, -5, 5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    onClick={() => pick(opt)}
                    className={`min-h-[56px] rounded-2xl px-4 py-3 font-display text-lg font-bold shadow-soft transition ${cls}`}
                  >
                    {picked && isAnswer ? "✅ " : ""}
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {picked && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto mt-5 max-w-md rounded-2xl bg-lav-100 px-4 py-3 text-center text-sm font-semibold leading-relaxed text-ink/65"
                >
                  {picked === q.answer ? "🎉 Correct! " : "💭 "}
                  {q.explain}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════ Main component ═══════════════════ */

export default function ElementAcademy({ onProgress }) {
  const [tab, setTab] = useState("mnemonic");
  const [learnedChunks, setLearnedChunks] = useStoredState("cq-mnemonic-chunks", []);
  const [bestScore, setBestScore] = useStoredState("cq-element-best", 0);

  useEffect(() => {
    const mnemonicFrac = learnedChunks.length / MNEMONIC_CHUNKS.length;
    const quizFrac = bestScore / QUIZ_LENGTH;
    onProgress?.((mnemonicFrac + quizFrac) / 2);
  }, [learnedChunks, bestScore, onProgress]);

  return (
    <div className="space-y-5">
      <TipBubble emoji="🔬">
        Hi, I'm Ellie! I'll help you memorise the first 20 elements with a silly
        story, then drill their <b>atomic masses</b> and <b>valencies</b> until
        they're automatic.
      </TipBubble>

      <div className="flex flex-wrap gap-2">
        {[
          {
            id: "mnemonic",
            label: `🧠 Memory Story (${learnedChunks.length}/${MNEMONIC_CHUNKS.length})`,
          },
          { id: "cards", label: "🃏 Flashcards" },
          { id: "quiz", label: `🎯 Quiz Drill (best ${bestScore}/${QUIZ_LENGTH})` },
        ].map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              play("pop");
              setTab(t.id);
            }}
            className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              tab === t.id
                ? "bg-butter-400 text-ink shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-butter-100"
            }`}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "mnemonic" ? (
            <MnemonicTrainer
              learnedChunks={learnedChunks}
              setLearnedChunks={setLearnedChunks}
            />
          ) : tab === "cards" ? (
            <Flashcards />
          ) : (
            <QuizDrill bestScore={bestScore} setBestScore={setBestScore} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Valency pattern cheat sheet */}
      <div className="rounded-blob bg-lav-100 p-5">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-lav-600">
          The valency shortcut — never memorise blindly
        </h3>
        <p className="mb-3 text-sm font-semibold leading-relaxed text-ink/65">
          Count the electrons in the outermost shell. If it's <b>1, 2, or 3</b>,
          the atom <i>gives them away</i> — valency = that number. If it's{" "}
          <b>5, 6, or 7</b>, the atom <i>needs more</i> — valency = 8 minus that
          number. If the shell is <b>full</b> (2 or 8), valency = 0.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <p className="font-display font-bold text-sky-600">Gives away</p>
            <p className="text-sm font-semibold text-ink/60">
              Na has 1 outer → valency <b>1</b>. Mg has 2 → valency <b>2</b>.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <p className="font-display font-bold text-blush-500">Needs more</p>
            <p className="text-sm font-semibold text-ink/60">
              O has 6 outer → 8−6 = valency <b>2</b>. Cl has 7 → valency <b>1</b>.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 px-4 py-3">
            <p className="font-display font-bold text-lav-600">Already happy</p>
            <p className="text-sm font-semibold text-ink/60">
              Ne and Ar have full shells → valency <b>0</b>. They never bond!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
