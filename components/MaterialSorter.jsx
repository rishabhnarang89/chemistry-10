"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "./Celebration";
import TipBubble from "./TipBubble";
import { useStoredState } from "@/lib/storage";
import { play } from "@/lib/sound";

/* ─────────────────────────── Data ─────────────────────────── */

const CARDS = [
  {
    id: "copper",
    label: "Copper Wire",
    emoji: "🔌",
    team: "metal",
    why: "Copper is a metal — it conducts electricity so well we make wires from it!",
    nudge: "Think: what are electrical wires made of, and why?",
  },
  {
    id: "lustrous",
    label: "Shiny / Lustrous",
    emoji: "✨",
    team: "metal",
    why: "That mirror-like shine (lustre) is a classic metal property. Think of gold and silver!",
    nudge: "Which team loves to sparkle like jewellery?",
  },
  {
    id: "coal",
    label: "Coal",
    emoji: "🪨",
    team: "nonmetal",
    why: "Coal is mostly carbon — a non-metal. It's dull, brittle, and doesn't conduct heat well.",
    nudge: "Is coal shiny and bendy… or dull and crumbly?",
  },
  {
    id: "brittle",
    label: "Breaks Easily / Brittle",
    emoji: "💔",
    team: "nonmetal",
    why: "Non-metals are brittle — they snap or crumble instead of bending like metals do.",
    nudge: "Metals bend; the other team snaps. Whose habit is breaking?",
  },
  {
    id: "sonorous",
    label: "Rings Like a Bell",
    emoji: "🔔",
    team: "metal",
    why: "Metals are sonorous — they make a ringing sound when struck. That's why bells are metal!",
    nudge: "What are temple bells made of?",
  },
  {
    id: "sulphur",
    label: "Sulphur Powder",
    emoji: "💛",
    team: "nonmetal",
    why: "Sulphur is a yellow, dull, brittle non-metal. No shine, no ring, no bending!",
    nudge: "A dull yellow powder… does that sound metallic?",
  },
  {
    id: "ductile",
    label: "Can Be Pulled Into Wires",
    emoji: "🧵",
    team: "metal",
    why: "Being ductile (stretchable into wires) is a metal superpower. 1 g of gold can make a 2 km wire!",
    nudge: "Which team stretches without snapping?",
  },
  {
    id: "oxygen",
    label: "Oxygen Gas",
    emoji: "💨",
    team: "nonmetal",
    why: "Oxygen is a non-metal gas — most non-metals are gases or soft solids at room temperature.",
    nudge: "Almost all gases belong to one team…",
  },
  {
    id: "iron",
    label: "Iron Nail",
    emoji: "🔩",
    team: "metal",
    why: "Iron is a strong, hard metal — perfect for nails, gates, and bridges.",
    nudge: "Hard, strong, magnetic… sounds like which team?",
  },
  {
    id: "insulator",
    label: "Blocks Electricity",
    emoji: "🚫⚡",
    team: "nonmetal",
    why: "Most non-metals are insulators — they block electricity. That's why plug covers are plastic-coated!",
    nudge: "Metals let current flow. Who stops it?",
  },
  {
    id: "malleable",
    label: "Can Be Hammered Into Sheets",
    emoji: "🔨",
    team: "metal",
    why: "Metals are malleable — hammer them into thin sheets, like aluminium foil in your kitchen!",
    nudge: "Kitchen foil is hammered super thin. What is it made of?",
  },
  {
    id: "dull",
    label: "Dull, No Shine",
    emoji: "🌫️",
    team: "nonmetal",
    why: "Non-metals look dull — light doesn't bounce off them the way it gleams off metals.",
    nudge: "The opposite of lustrous… which team is that?",
  },
  {
    id: "graphite",
    label: "Graphite Rod (conducts!)",
    emoji: "✏️",
    team: "nonmetal",
    why: "Tricky one — and an exam favourite! Graphite is a NON-METAL (a form of carbon) that conducts electricity. The famous exception!",
    nudge: "It conducts… but it's a form of carbon, like your pencil lead. Exceptions exist!",
  },
  {
    id: "mercury",
    label: "Mercury (liquid!)",
    emoji: "🌡️",
    team: "metal",
    why: "Another exam favourite! Mercury is the only METAL that's liquid at room temperature — old thermometers used it.",
    nudge: "It's liquid, yes — but it's shiny and conducts. Exceptions exist!",
  },
];

const CHEERS = [
  "Brilliant sorting! 🌟",
  "You're a natural chemist! 🧪",
  "Nailed it! 🎯",
  "Superb! Keep the belt moving! 🏭",
  "Exactly right! 💪",
  "Wow, that was fast! ⚡",
];

/* ── Reactivity ladder (most → least reactive) ── */

const REACTIVITY = [
  { id: "K", name: "Potassium", fact: "So reactive it catches fire the moment it touches water!" },
  { id: "Na", name: "Sodium", fact: "Stored under kerosene so it can't sneak a reaction with air." },
  { id: "Mg", name: "Magnesium", fact: "Burns with the dazzling white flame from Chapter 1!" },
  { id: "Zn", name: "Zinc", fact: "Coats iron to protect it from rust — that's galvanisation." },
  { id: "Fe", name: "Iron", fact: "Reacts slowly — that slow reaction with air and water is rust." },
  { id: "Cu", name: "Copper", fact: "So unreactive it stays shiny for years — perfect for coins and wires." },
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Basket({ colorTop, colorBody, mood }) {
  return (
    <svg viewBox="0 0 60 46" width="52" height="40" aria-hidden="true">
      <path d="M6 16h48l-5 24a5 5 0 0 1-5 4H16a5 5 0 0 1-5-4z" fill={colorBody} />
      <rect x="4" y="10" width="52" height="8" rx="4" fill={colorTop} />
      <circle cx="24" cy="26" r="1.8" fill="#fff" />
      <circle cx="36" cy="26" r="1.8" fill="#fff" />
      {mood === "happy" ? (
        <path d="M23 31 Q30 35 37 31" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M23.5 32 Q30 33.2 36.5 32" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* ─────────────────────── Sorting belt (tab 1) ─────────────────────── */

function SortingBelt({ sortDone, setSortDone, onFraction }) {
  const [deck, setDeck] = useState(() => shuffle(CARDS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [firstTry, setFirstTry] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [locked, setLocked] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const metalRef = useRef(null);
  const nonMetalRef = useRef(null);

  const card = deck[index];
  const done = index >= deck.length;
  const stars = useMemo(() => {
    if (!done) return 0;
    const ratio = score / deck.length;
    return ratio === 1 ? 3 : ratio >= 0.75 ? 2 : 1;
  }, [done, score, deck.length]);

  useEffect(() => {
    onFraction?.(sortDone ? 1 : index / deck.length);
    if (done && !sortDone) {
      setSortDone(true);
      play("tada");
    }
  }, [index, done, deck.length, sortDone, setSortDone, onFraction]);

  const answer = (team) => {
    if (!card || locked) return;
    if (team === card.team) {
      setLocked(true);
      if (firstTry) setScore((s) => s + 1);
      play(firstTry ? "ding" : "snap");
      setFeedback({
        type: "yay",
        text: `${CHEERS[index % CHEERS.length]} ${card.why}`,
      });
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1500);
      setTimeout(() => {
        setIndex((i) => i + 1);
        setFirstTry(true);
        setFeedback(null);
        setLocked(false);
      }, 2600);
    } else {
      setFirstTry(false);
      setShakeKey((k) => k + 1);
      play("oops");
      setFeedback({
        type: "nudge",
        text: `Almost! ${card.nudge}`,
      });
    }
  };

  const handleDragEnd = (event) => {
    const point = { x: event.clientX, y: event.clientY };
    const inZone = (ref) => {
      if (!ref.current) return false;
      const r = ref.current.getBoundingClientRect();
      return (
        point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom
      );
    };
    if (inZone(metalRef)) answer("metal");
    else if (inZone(nonMetalRef)) answer("nonmetal");
  };

  const restart = () => {
    setDeck(shuffle(CARDS));
    setIndex(0);
    setScore(0);
    setFirstTry(true);
    setFeedback(null);
    setLocked(false);
    setShakeKey(0);
  };

  /* ── Finished screen ── */
  if (done) {
    return (
      <div className="relative overflow-hidden rounded-blob bg-white/70 p-10 text-center shadow-floaty">
        <Celebration show glow="#7FD8B0" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <p className="text-6xl">🏆</p>
          <h3 className="mt-3 font-display text-2xl font-bold text-ink">
            Conveyor belt cleared!
          </h3>
          <p className="mt-1 font-bold text-ink/60">
            {score} of {deck.length} sorted correctly on the first try
          </p>
          <div className="mt-4 flex justify-center gap-2 text-4xl">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.3, type: "spring" }}
                className={i < stars ? "" : "opacity-20 grayscale"}
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-ink/55">
            {stars === 3
              ? "Perfect score — you know your metals from your non-metals!"
              : "Every sort taught you something. Run the belt again to earn all 3 stars!"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
            className="mt-5 min-h-[44px] rounded-full bg-mint-500 px-8 py-3 font-bold text-white shadow-pop"
          >
            Run the belt again 🔄
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ── Game screen ── */
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-2xl bg-mint-100 px-4 py-2 text-sm font-semibold text-ink/70">
          🏭 Drag the item on the belt into the right basket — or tap a basket
          button. No penalties, just gentle nudges!
        </p>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft">
          <span className="text-sm font-bold text-ink/50">
            Item {index + 1}/{deck.length}
          </span>
          <span className="text-sm font-extrabold text-mint-600">
            ⭐ {score}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        <Celebration show={celebrate} glow="#7FD8B0" />

        {/* Conveyor belt */}
        <div className="relative mb-6 rounded-2xl p-4">
          <div className="conveyor-belt absolute inset-x-0 bottom-0 h-6 rounded-full opacity-70 animate-belt-move" />
          <div className="flex justify-center pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={card.id}
                initial={{ x: 260, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <motion.div
                  key={shakeKey}
                  drag={!locked}
                  dragSnapToOrigin
                  dragElastic={0.5}
                  whileDrag={{ scale: 1.12, zIndex: 50, cursor: "grabbing" }}
                  onDragEnd={handleDragEnd}
                  animate={
                    shakeKey > 0 && feedback?.type === "nudge"
                      ? { x: [0, -10, 10, -6, 6, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.45 }}
                  className="flex cursor-grab flex-col items-center gap-2 rounded-2xl bg-white px-8 py-5 shadow-pop ring-2 ring-lav-200"
                >
                  <span className="text-5xl">{card.emoji}</span>
                  <span className="max-w-[180px] text-center text-sm font-extrabold leading-tight text-ink">
                    {card.label}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/35">
                    drag me!
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Baskets */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <motion.div
            ref={metalRef}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center gap-2 rounded-2xl border-4 border-dashed border-sky-200 bg-sky-100/50 p-5"
          >
            <Basket colorTop="#3E8FD4" colorBody="#5AA9E8" mood="happy" />
            <p className="font-display text-lg font-bold text-sky-600">Team Metals</p>
            <p className="text-center text-xs font-semibold text-ink/50">
              Shiny · bendy · conducts · rings
            </p>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => answer("metal")}
              className="mt-1 min-h-[44px] rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white shadow-soft"
            >
              It belongs here!
            </motion.button>
          </motion.div>

          <motion.div
            ref={nonMetalRef}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center gap-2 rounded-2xl border-4 border-dashed border-peach-200 bg-peach-100/60 p-5"
          >
            <Basket colorTop="#F79C5C" colorBody="#F79C5C" mood="neutral" />
            <p className="font-display text-lg font-bold text-peach-500">
              Team Non-Metals
            </p>
            <p className="text-center text-xs font-semibold text-ink/50">
              Dull · brittle · insulates · quiet
            </p>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => answer("nonmetal")}
              className="mt-1 min-h-[44px] rounded-full bg-peach-500 px-5 py-2 text-sm font-bold text-white shadow-soft"
            >
              It belongs here!
            </motion.button>
          </motion.div>
        </div>

        {/* Feedback banner */}
        <div className="mt-5 min-h-[64px]">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.text}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`rounded-2xl px-5 py-3 text-center text-sm font-semibold leading-relaxed ${
                  feedback.type === "yay"
                    ? "bg-mint-100 text-mint-600"
                    : "bg-butter-100 text-ink/70"
                }`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reactivity ladder (tab 2) ─────────────── */

function ReactivityLadder({ ladderDone, setLadderDone, onFraction }) {
  const [placed, setPlaced] = useState([]); // metal ids, most reactive first
  const [pool, setPool] = useState(() => shuffle(REACTIVITY.map((m) => m.id)));
  const [wobbleId, setWobbleId] = useState(null);
  const [lastFact, setLastFact] = useState(null);

  const complete = placed.length === REACTIVITY.length;

  useEffect(() => {
    onFraction?.(ladderDone ? 1 : placed.length / REACTIVITY.length);
    if (complete && !ladderDone) {
      setLadderDone(true);
      play("tada");
    }
  }, [placed, complete, ladderDone, setLadderDone, onFraction]);

  const nextCorrect = REACTIVITY.map((m) => m.id).filter(
    (id) => !placed.includes(id)
  )[0];

  const pick = (id) => {
    if (complete) return;
    if (id === nextCorrect) {
      play("ding");
      setPlaced((prev) => [...prev, id]);
      setPool((prev) => prev.filter((p) => p !== id));
      setLastFact(REACTIVITY.find((m) => m.id === id));
      setWobbleId(null);
    } else {
      play("oops");
      setWobbleId(id);
      setTimeout(() => setWobbleId(null), 600);
    }
  };

  const restart = () => {
    setPlaced([]);
    setPool(shuffle(REACTIVITY.map((m) => m.id)));
    setLastFact(null);
  };

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-mint-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
        🪜 Exam essential: the <b>reactivity series</b>! Build the ladder by
        tapping the <b>most reactive metal left</b> in the pool — it climbs to
        the next rung. Wrong guesses just wobble, never hurt.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {/* The ladder */}
        <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty">
          <Celebration show={complete} glow="#7FD8B0" />
          <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-ink/50">
            Most reactive at the top ⬆️
          </h3>
          <div className="mx-auto flex max-w-[280px] flex-col gap-2">
            {REACTIVITY.map((m, i) => {
              const placedHere = placed[i];
              const metal = placedHere
                ? REACTIVITY.find((x) => x.id === placedHere)
                : null;
              return (
                <div
                  key={m.id}
                  className={`flex min-h-[48px] items-center justify-center rounded-xl border-2 ${
                    metal
                      ? "border-mint-400 bg-mint-100"
                      : "border-dashed border-lav-200 bg-lav-100/30"
                  }`}
                >
                  {metal ? (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="font-display text-base font-bold text-mint-600"
                    >
                      {metal.id} · {metal.name}
                    </motion.span>
                  ) : (
                    <span className="text-xs font-bold text-ink/30">
                      Rung {i + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-mint-100 px-4 py-3 text-center"
              >
                <p className="font-display font-bold text-mint-600">
                  🏆 Ladder complete! K &gt; Na &gt; Mg &gt; Zn &gt; Fe &gt; Cu
                </p>
                <p className="mt-1 text-sm font-semibold text-ink/60">
                  This is why zinc could kick hydrogen out in Chapter 1 — a
                  metal higher on the ladder displaces anything below it!
                </p>
                <button
                  onClick={restart}
                  className="mt-2 min-h-[44px] rounded-full bg-white px-6 py-2 text-sm font-bold text-mint-600 shadow-soft"
                >
                  Build it again 🔄
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The pool + facts */}
        <div className="space-y-4">
          <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/50">
              Metal pool — who's the most reactive left?
            </h3>
            <div className="flex flex-wrap gap-2">
              {pool.length === 0 && (
                <p className="text-sm font-semibold text-ink/45">
                  Everyone found their rung! 🥰
                </p>
              )}
              {pool.map((id) => {
                const m = REACTIVITY.find((x) => x.id === id);
                return (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    animate={wobbleId === id ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    onClick={() => pick(id)}
                    className="flex min-h-[44px] flex-col items-center rounded-2xl bg-sky-100 px-5 py-2.5 shadow-soft transition hover:bg-sky-200"
                  >
                    <span className="font-display text-lg font-bold text-sky-600">
                      {m.id}
                    </span>
                    <span className="text-[10px] font-bold text-ink/50">
                      {m.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {wobbleId && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-3 text-sm font-semibold text-ink/60"
                >
                  💭 Hmm — one of the other metals is even more reactive than
                  that one!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {lastFact && (
              <motion.div
                key={lastFact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-blob bg-butter-100 p-5"
              >
                <p className="text-sm font-bold text-ink/75">
                  {lastFact.name} ({lastFact.id})
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-ink/60">
                  {lastFact.fact}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-blob bg-lav-100 p-5">
            <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-lav-600">
              Memory trick
            </h3>
            <p className="text-sm font-semibold leading-relaxed text-ink/65">
              <b>"K</b>ind <b>Na</b>ni <b>M</b>akes <b>Z</b>esty <b>F</b>resh{" "}
              <b>C</b>hai" — K, Na, Mg, Zn, Fe, Cu, from most to least reactive.
              A metal higher up can displace any metal below it from its salt
              solution!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

export default function MaterialSorter({ onProgress }) {
  const [tab, setTab] = useState("sort");
  const [sortDone, setSortDone] = useStoredState("cq-sorter-done", false);
  const [ladderDone, setLadderDone] = useStoredState("cq-ladder-done", false);
  const [fractions, setFractions] = useState({ sort: 0, ladder: 0 });

  useEffect(() => {
    const sortFrac = Math.max(fractions.sort, sortDone ? 1 : 0);
    const ladderFrac = Math.max(fractions.ladder, ladderDone ? 1 : 0);
    onProgress?.((sortFrac + ladderFrac) / 2);
  }, [fractions, sortDone, ladderDone, onProgress]);

  const setFraction = (key) => (v) =>
    setFractions((prev) => (prev[key] === v ? prev : { ...prev, [key]: v }));

  return (
    <div className="space-y-5">
      <TipBubble emoji="🏭">
        Hi, I'm Belter! Sort the items on my conveyor belt, then climb the{" "}
        <b>Reactivity Ladder</b> — examiners love asking about it!
      </TipBubble>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "sort", label: `🧺 Sorting Belt ${sortDone ? "⭐" : ""}` },
          { id: "ladder", label: `🪜 Reactivity Ladder ${ladderDone ? "⭐" : ""}` },
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
                ? "bg-mint-500 text-white shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-mint-100"
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
          {tab === "sort" ? (
            <SortingBelt
              sortDone={sortDone}
              setSortDone={setSortDone}
              onFraction={setFraction("sort")}
            />
          ) : (
            <ReactivityLadder
              ladderDone={ladderDone}
              setLadderDone={setLadderDone}
              onFraction={setFraction("ladder")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
