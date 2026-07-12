"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "./Celebration";
import TipBubble from "./TipBubble";
import { useStoredState } from "@/lib/storage";
import { play } from "@/lib/sound";

/* ─────────────────────── Methane builder ─────────────────────── */

// Hand positions around the carbon (percentage offsets inside the stage)
const HANDS = [
  { id: 0, x: "50%", y: "12%", label: "top" },
  { id: 1, x: "82%", y: "48%", label: "right" },
  { id: 2, x: "50%", y: "84%", label: "bottom" },
  { id: 3, x: "18%", y: "48%", label: "left" },
];

// Line endpoints for the SVG bond layer (viewBox 100x100)
const BOND_LINES = [
  { x1: 50, y1: 38, x2: 50, y2: 20 },
  { x1: 60, y1: 48, x2: 76, y2: 48 },
  { x1: 50, y1: 58, x2: 50, y2: 76 },
  { x1: 40, y1: 48, x2: 24, y2: 48 },
];

function MethaneBuilder({ onProgress }) {
  const [attached, setAttached] = useState([false, false, false, false]);
  const count = attached.filter(Boolean).length;
  const complete = count === 4;

  useEffect(() => {
    onProgress?.(count / 4);
  }, [count, onProgress]);

  useEffect(() => {
    if (complete) play("success");
  }, [complete]);

  const attachNext = () => {
    play("snap");
    setAttached((prev) => {
      const i = prev.indexOf(false);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const detach = (i) => {
    play("pop");
    setAttached((prev) => prev.map((v, j) => (j === i ? false : v)));
  };

  const reset = () => setAttached([false, false, false, false]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Stage */}
      <div className="relative overflow-hidden rounded-blob bg-white/70 p-4 shadow-floaty">
        <Celebration show={complete} glow="#A98BE3" />

        <div className="relative mx-auto aspect-square max-w-[440px]">
          {/* Bond lines */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {BOND_LINES.map((l, i) => (
              <motion.line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="#A98BE3"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: attached[i] ? 1 : 0, opacity: attached[i] ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Carbon character */}
          <motion.div
            animate={
              complete
                ? { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }
                : { scale: [1, 1.03, 1] }
            }
            transition={
              complete
                ? { duration: 0.9 }
                : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            }
            className="absolute left-1/2 top-[48%] z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-peach-200 shadow-pop ring-4 ring-peach-400/60"
          >
            <span className="text-2xl">{complete ? "🥳" : "😊"}</span>
            <span className="font-display text-lg font-bold text-peach-500">C</span>
          </motion.div>

          {/* Hands / hydrogens */}
          {HANDS.map((hand, i) => (
            <div
              key={hand.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: hand.x, top: hand.y }}
            >
              <AnimatePresence mode="wait">
                {attached[i] ? (
                  <motion.button
                    key="h"
                    initial={{ scale: 0, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => detach(i)}
                    title="Click to let go"
                    className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-sky-200 shadow-soft ring-4 ring-sky-400/60"
                  >
                    <span className="text-xs">🤝</span>
                    <span className="font-display text-sm font-bold text-sky-600">H</span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.15, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: i * 0.2 }}
                    className="grid h-12 w-12 place-items-center rounded-full border-4 border-dashed border-peach-400/50 bg-peach-100/60 text-lg"
                    title="An empty hand, waiting for a friend"
                  >
                    🖐️
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Status line */}
        <div className="mt-2 text-center">
          <AnimatePresence mode="wait">
            {complete ? (
              <motion.div
                key="win"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-mint-100 px-5 py-3"
              >
                <p className="font-display text-lg font-bold text-mint-600">
                  🎉 You built METHANE — CH₄!
                </p>
                <p className="text-sm font-semibold text-ink/60">
                  All 4 hands full! Carbon shares one electron pair with each
                  hydrogen — four single covalent bonds.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  className="mt-2 min-h-[44px] rounded-full bg-mint-500 px-6 py-2 text-sm font-bold text-white shadow-pop"
                >
                  Build it again 🔄
                </motion.button>
              </motion.div>
            ) : (
              <motion.p
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold text-ink/55"
              >
                {count === 0
                  ? "Carbon has 4 empty hands (valency = 4). Send in some hydrogen friends!"
                  : `${count} hand${count > 1 ? "s" : ""} held, ${4 - count} to go…`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        <div className="rounded-blob bg-white/70 p-5 text-center shadow-floaty">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/50">
            Hydrogen waiting room
          </h3>
          <div className="flex justify-center gap-2">
            {Array.from({ length: 4 - count }, (_, i) => (
              <motion.button
                key={i}
                layout
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={attachNext}
                className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-sky-200 shadow-soft ring-2 ring-sky-400/50"
              >
                <span className="text-sm font-extrabold text-sky-600">H</span>
                <span className="text-[9px] font-bold text-sky-600/70">1 hand</span>
              </motion.button>
            ))}
            {count === 4 && (
              <p className="text-sm font-semibold text-ink/45">
                Everyone found a hand to hold! 🥰
              </p>
            )}
          </div>
          {count < 4 && (
            <p className="mt-3 text-xs font-semibold text-ink/50">
              Tap a hydrogen to send it to Carbon's next free hand. Tap an
              attached H to let go.
            </p>
          )}
        </div>

        <div className="rounded-blob bg-lav-100 p-5">
          <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-lav-600">
            What's happening?
          </h3>
          <p className="text-sm font-semibold leading-relaxed text-ink/65">
            A <b>covalent bond</b> is like holding hands: each atom shares one
            electron, making a shared pair. Carbon has 4 hands (4 valence
            electrons to share) and hydrogen has just 1 — so exactly{" "}
            <b>four</b> hydrogens complete the club. No electrons are given
            away or stolen — only shared!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Bond types explorer ─────────────────────── */

const BOND_TYPES = [
  {
    id: "single",
    bonds: 1,
    name: "Single Bond",
    molecule: "Ethane (C₂H₆)",
    hands: "Each carbon holds ONE of the other's hands",
    story:
      "The two carbons share one pair of electrons, leaving 3 free hands each for hydrogens. Single bonds are relaxed and flexible — like a gentle handshake.",
    hPerCarbon: 3,
  },
  {
    id: "double",
    bonds: 2,
    name: "Double Bond",
    molecule: "Ethene (C₂H₄)",
    hands: "Each carbon holds TWO of the other's hands",
    story:
      "Two shared pairs! A stronger, tighter grip — but now each carbon only has 2 hands left for hydrogens. Ethene ripens fruits — that's why bananas ripen faster in a paper bag!",
    hPerCarbon: 2,
  },
  {
    id: "triple",
    bonds: 3,
    name: "Triple Bond",
    molecule: "Ethyne (C₂H₂)",
    hands: "Each carbon holds THREE of the other's hands",
    story:
      "Three shared pairs — the strongest hug in chemistry class! Only 1 hand left each for hydrogen. Ethyne (acetylene) burns so hot it's used to weld metal.",
    hPerCarbon: 1,
  },
];

function BondDiagram({ type }) {
  const cx1 = 150;
  const cx2 = 330;
  const cy = 120;
  const offsets =
    type.bonds === 1 ? [0] : type.bonds === 2 ? [-8, 8] : [-14, 0, 14];

  // Hydrogen positions per carbon depending on how many H each carbon has
  const hPositions = (cx, mirror) => {
    if (type.hPerCarbon === 3)
      return [
        { x: cx - mirror * 55, y: cy },
        { x: cx - mirror * 20, y: cy - 62 },
        { x: cx - mirror * 20, y: cy + 62 },
      ];
    if (type.hPerCarbon === 2)
      return [
        { x: cx - mirror * 35, y: cy - 58 },
        { x: cx - mirror * 35, y: cy + 58 },
      ];
    return [{ x: cx - mirror * 58, y: cy }];
  };

  const leftH = hPositions(cx1, 1);
  const rightH = hPositions(cx2, -1);

  return (
    <svg viewBox="0 0 480 240" className="w-full max-w-[560px]">
      {/* C–H bonds */}
      {[...leftH.map((h) => ({ h, cx: cx1 })), ...rightH.map((h) => ({ h, cx: cx2 }))].map(
        ({ h, cx }, i) => (
          <motion.line
            key={`${type.id}-h-${i}`}
            x1={cx}
            y1={cy}
            x2={h.x}
            y2={h.y}
            stroke="#84C1F2"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
          />
        )
      )}

      {/* C–C bond lines */}
      {offsets.map((off, i) => (
        <motion.line
          key={`${type.id}-cc-${i}`}
          x1={cx1 + 26}
          y1={cy + off}
          x2={cx2 - 26}
          y2={cy + off}
          stroke="#F79C5C"
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: i * 0.18 }}
        />
      ))}

      {/* Shared electron pairs travelling along the C–C bond */}
      {offsets.map((off, i) => (
        <motion.circle
          key={`${type.id}-e-${i}`}
          r="5"
          fill="#8E6AD1"
          initial={{ cx: cx1 + 30, cy: cy + off, opacity: 0 }}
          animate={{ cx: [cx1 + 30, cx2 - 30, cx1 + 30], opacity: 1 }}
          transition={{
            cx: { repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: i * 0.3 },
            opacity: { duration: 0.3, delay: 0.8 },
          }}
        />
      ))}

      {/* Carbon atoms */}
      {[cx1, cx2].map((cx, i) => (
        <motion.g
          key={`${type.id}-c-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: i * 0.1 }}
        >
          <circle cx={cx} cy={cy} r="30" fill="#FFDFC7" stroke="#FFB98A" strokeWidth="4" />
          <text
            x={cx}
            y={cy + 7}
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="#F79C5C"
          >
            C
          </text>
        </motion.g>
      ))}

      {/* Hydrogen atoms */}
      {[...leftH, ...rightH].map((h, i) => (
        <motion.g
          key={`${type.id}-hatom-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
        >
          <circle cx={h.x} cy={h.y} r="18" fill="#CBE5FA" stroke="#84C1F2" strokeWidth="3" />
          <text
            x={h.x}
            y={h.y + 5}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#3E8FD4"
          >
            H
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function BondExplorer() {
  const [typeId, setTypeId] = useState("single");
  const type = BOND_TYPES.find((t) => t.id === typeId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {BOND_TYPES.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTypeId(t.id)}
            className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              t.id === typeId
                ? "bg-lav-500 text-white shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-lav-100"
            }`}
          >
            {"—".repeat(t.bonds)} {t.name}
          </motion.button>
        ))}
      </div>

      <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
        <AnimatePresence mode="wait">
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center"
          >
            <p className="mb-1 font-display text-lg font-bold text-ink">
              {type.molecule}
            </p>
            <p className="mb-2 text-sm font-bold text-lav-600">
              🤝 {type.hands}
            </p>
            <BondDiagram type={type} />
            <p className="mt-3 max-w-xl rounded-2xl bg-butter-100 px-5 py-3 text-center text-sm font-semibold leading-relaxed text-ink/65">
              {type.story}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="rounded-blob bg-lav-100 p-5">
        <p className="text-sm font-semibold leading-relaxed text-ink/65">
          💜 <b>The purple dots</b> are the shared electron pairs zooming
          between the carbons — more bonds means more shared pairs and a
          stronger grip. This hand-holding trick (catenation + valency 4) is
          why carbon can build millions of compounds — including you!
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

/* ─────────────── Name that Compound (tab 3) ─────────────── */

const COMPOUNDS = [
  { id: "ch4", formula: "CH₄", name: "Methane", fact: "1 carbon — the gas on your kitchen stove." },
  { id: "c2h6", formula: "C₂H₆", name: "Ethane", fact: "2 carbons, all single bonds — an alkane." },
  { id: "c3h8", formula: "C₃H₈", name: "Propane", fact: "3 carbons — found in LPG cylinders!" },
  { id: "c2h4", formula: "C₂H₄", name: "Ethene", fact: "Has a DOUBLE bond — it ripens fruit." },
  { id: "c2h2", formula: "C₂H₂", name: "Ethyne", fact: "Has a TRIPLE bond — welders burn it." },
  { id: "c2h5oh", formula: "C₂H₅OH", name: "Ethanol", fact: "The –OH group makes it an alcohol." },
  { id: "ch3cooh", formula: "CH₃COOH", name: "Ethanoic Acid", fact: "The –COOH group — this is vinegar's acid!" },
];

function shufflePairs(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function NameMatch({ onFraction, matchDone, setMatchDone }) {
  const [formulas] = useState(() => shufflePairs(COMPOUNDS));
  const [names] = useState(() => shufflePairs(COMPOUNDS));
  const [pickedFormula, setPickedFormula] = useState(null);
  const [matched, setMatched] = useState([]); // ids
  const [wobble, setWobble] = useState(null);
  const [lastFact, setLastFact] = useState(null);

  const complete = matched.length === COMPOUNDS.length;

  useEffect(() => {
    onFraction?.(matchDone ? 1 : matched.length / COMPOUNDS.length);
    if (complete && !matchDone) {
      setMatchDone(true);
      play("tada");
    }
  }, [matched, complete, matchDone, setMatchDone, onFraction]);

  const pickName = (compound) => {
    if (!pickedFormula || matched.includes(compound.id)) return;
    if (compound.id === pickedFormula) {
      play("ding");
      setMatched((prev) => [...prev, compound.id]);
      setLastFact(compound);
      setPickedFormula(null);
      setWobble(null);
    } else {
      play("oops");
      setWobble(compound.id);
      setTimeout(() => setWobble(null), 600);
    }
  };

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-peach-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
        🏷️ Exam skill: naming carbon compounds! Tap a <b>formula</b>, then tap
        its <b>name</b>. Notice the pattern: meth = 1 carbon, eth = 2, prop = 3
        — each family member differs by just CH₂ (a homologous series!).
      </p>

      <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        <Celebration show={complete} glow="#A98BE3" />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Formulas */}
          <div>
            <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-ink/50">
              Formulas
            </h3>
            <div className="flex flex-col gap-2">
              {formulas.map((c) => {
                const isMatched = matched.includes(c.id);
                const isPicked = pickedFormula === c.id;
                return (
                  <motion.button
                    key={c.id}
                    whileHover={!isMatched ? { scale: 1.03 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    disabled={isMatched}
                    onClick={() => {
                      play("pop");
                      setPickedFormula((prev) => (prev === c.id ? null : c.id));
                    }}
                    className={`min-h-[48px] rounded-2xl px-4 py-2.5 font-display text-base font-bold transition ${
                      isMatched
                        ? "bg-mint-100 text-mint-600"
                        : isPicked
                        ? "bg-peach-500 text-white shadow-pop"
                        : "bg-white text-ink/75 shadow-soft hover:bg-peach-100"
                    }`}
                  >
                    {isMatched ? "✅ " : ""}
                    {c.formula}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Names */}
          <div>
            <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-ink/50">
              Names
            </h3>
            <div className="flex flex-col gap-2">
              {names.map((c) => {
                const isMatched = matched.includes(c.id);
                return (
                  <motion.button
                    key={c.id}
                    whileHover={!isMatched ? { scale: 1.03 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    animate={wobble === c.id ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    disabled={isMatched}
                    onClick={() => pickName(c)}
                    className={`min-h-[48px] rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                      isMatched
                        ? "bg-mint-100 text-mint-600"
                        : "bg-white text-ink/75 shadow-soft hover:bg-lav-100"
                    }`}
                  >
                    {isMatched ? "✅ " : ""}
                    {c.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {!pickedFormula && !complete && (
          <p className="mt-4 text-center text-sm font-semibold text-ink/45">
            👆 Pick a formula first, then find its name
          </p>
        )}

        <AnimatePresence mode="wait">
          {lastFact && !complete && (
            <motion.div
              key={lastFact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-4 max-w-md rounded-2xl bg-butter-100 px-4 py-3 text-center"
            >
              <p className="text-sm font-bold text-ink/75">
                {lastFact.formula} = {lastFact.name}
              </p>
              <p className="text-sm font-semibold text-ink/60">{lastFact.fact}</p>
            </motion.div>
          )}
          {complete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-4 max-w-md rounded-2xl bg-mint-100 px-4 py-3 text-center"
            >
              <p className="font-display font-bold text-mint-600">
                🏆 All 7 named — you speak fluent Carbon!
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/60">
                Meth-1, Eth-2, Prop-3… same family, each one CH₂ bigger than the
                last. That's a homologous series — a guaranteed exam question!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

export default function CarbonClub({ onProgress }) {
  const [tab, setTab] = useState("build");
  const [matchDone, setMatchDone] = useStoredState("cq-carbon-match-done", false);
  const [fractions, setFractions] = useState({ build: 0, match: 0 });

  useEffect(() => {
    const matchFrac = Math.max(fractions.match, matchDone ? 1 : 0);
    onProgress?.((fractions.build + matchFrac) / 2);
  }, [fractions, matchDone, onProgress]);

  const setFraction = (key) => (v) =>
    setFractions((prev) => (prev[key] === v ? prev : { ...prev, [key]: v }));

  return (
    <div className="space-y-5">
      <TipBubble emoji="🤝">
        Hi, I'm Carbon! I have 4 hands to hold. Build methane with me, explore
        double &amp; triple bonds, then prove you can <b>name my whole family</b>!
      </TipBubble>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "build", label: "🏗️ Build Methane" },
          { id: "bonds", label: "🔗 Single, Double & Triple Bonds" },
          { id: "names", label: `🏷️ Name that Compound ${matchDone ? "⭐" : ""}` },
        ].map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              play("pop");
              setTab(t.id);
            }}
            className={`relative min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              tab === t.id
                ? "bg-peach-500 text-white shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-peach-100"
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
          {tab === "build" ? (
            <MethaneBuilder onProgress={setFraction("build")} />
          ) : tab === "bonds" ? (
            <BondExplorer />
          ) : (
            <NameMatch
              onFraction={setFraction("match")}
              matchDone={matchDone}
              setMatchDone={setMatchDone}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
