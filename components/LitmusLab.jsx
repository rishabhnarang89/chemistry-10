"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "./Celebration";
import TipBubble from "./TipBubble";
import Mascot from "./Mascot";
import { useStoredState } from "@/lib/storage";
import { play } from "@/lib/sound";

/* ─────────────────────────── Data ─────────────────────────── */

const SUBSTANCES = [
  {
    id: "gastric",
    name: "Stomach Acid",
    color: "#F7D9C4",
    ph: 1,
    kind: "acid",
    blurb:
      "Your stomach makes hydrochloric acid (HCl) to digest food! Too much of it = acidity, which is why antacids exist.",
    everyday: "The strongest acid in this lab lives inside you!",
  },
  {
    id: "lemon",
    name: "Lemon Juice",
    color: "#F9E24A",
    ph: 2,
    kind: "acid",
    blurb:
      "Lemon is an ACID — that's why it tastes so sour! Its citric acid turns blue litmus red.",
    everyday: "Sour taste = acid alert!",
  },
  {
    id: "vinegar",
    name: "Vinegar",
    color: "#EFE6D6",
    ph: 3,
    kind: "acid",
    blurb:
      "Vinegar contains acetic acid. A gentle kitchen acid — great on salads, tough on blue litmus!",
    everyday: "That sharp smell is the acid escaping.",
  },
  {
    id: "water",
    name: "Pure Water",
    color: "#BFE3F7",
    ph: 7,
    kind: "neutral",
    blurb:
      "Pure water is NEUTRAL — perfectly balanced at pH 7. Litmus paper doesn't change colour at all.",
    everyday: "Not sour, not slippery — right in the middle.",
  },
  {
    id: "salt",
    name: "Salt Solution",
    color: "#EDEDED",
    ph: 7,
    kind: "neutral",
    blurb:
      "Common salt (NaCl) comes from a strong acid + strong base, so its solution is NEUTRAL.",
    everyday: "A perfectly peaceful pH 7.",
  },
  {
    id: "baking",
    name: "Baking Soda",
    color: "#F6F1E4",
    ph: 9,
    kind: "base",
    blurb:
      "Baking soda (sodium hydrogencarbonate) is a mild BASE. It helps cakes rise and calms acidity in your tummy!",
    everyday: "Mild base — kitchen superhero.",
  },
  {
    id: "milkmag",
    name: "Milk of Magnesia",
    color: "#F2F2FB",
    ph: 10,
    kind: "base",
    blurb:
      "Milk of magnesia (magnesium hydroxide) is the antacid — a mild base that neutralises extra stomach acid. Acid + base cancel out!",
    everyday: "The base that rescues upset tummies.",
  },
  {
    id: "soap",
    name: "Soap Water",
    color: "#D9EFEA",
    ph: 12,
    kind: "base",
    blurb:
      "Soap is a BASE — it feels slippery and turns red litmus blue! Bases are the opposites of acids.",
    everyday: "Slippery feel = base vibes.",
  },
];

/* ── Salt Factory data ── */

const ACIDS = [
  { id: "hcl", formula: "HCl", name: "Hydrochloric Acid", color: "#F7C4C4" },
  { id: "h2so4", formula: "H₂SO₄", name: "Sulphuric Acid", color: "#F7DCC4" },
];

const BASES = [
  { id: "naoh", formula: "NaOH", name: "Sodium Hydroxide", color: "#C4D9F7" },
  { id: "koh", formula: "KOH", name: "Potassium Hydroxide", color: "#D5C4F7" },
];

const SALTS = {
  "hcl+naoh": {
    salt: "NaCl",
    name: "Sodium Chloride — common table salt!",
    eq: "HCl + NaOH → NaCl + H₂O",
    fact: "This exact salt is on your dinner table. From it we also make baking soda, washing soda, and bleaching powder!",
  },
  "hcl+koh": {
    salt: "KCl",
    name: "Potassium Chloride",
    eq: "HCl + KOH → KCl + H₂O",
    fact: "Potassium chloride is used in fertilisers to help plants grow strong.",
  },
  "h2so4+naoh": {
    salt: "Na₂SO₄",
    name: "Sodium Sulphate",
    eq: "H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O",
    fact: "Notice the 2s! Sulphuric acid has TWO hydrogens to neutralise, so it needs two NaOH.",
  },
  "h2so4+koh": {
    salt: "K₂SO₄",
    name: "Potassium Sulphate",
    eq: "H₂SO₄ + 2 KOH → K₂SO₄ + 2 H₂O",
    fact: "Another fertiliser salt — plants love potassium and sulphur!",
  },
};

const TOTAL_ITEMS = SUBSTANCES.length + Object.keys(SALTS).length;

/* pH → strip colour (soft, friendly tones) */
function phColor(ph) {
  if (ph <= 2) return "#F27E7E";
  if (ph <= 4) return "#F7A46C";
  if (ph <= 6) return "#F5D06B";
  if (ph === 7) return "#7FD8B0";
  if (ph <= 9) return "#6EC6D9";
  if (ph <= 11) return "#6FA3E8";
  return "#8E6AD1";
}

function phLabel(kind) {
  if (kind === "acid") return { text: "ACID", color: "text-blush-500", bg: "bg-blush-100" };
  if (kind === "base") return { text: "BASE", color: "text-lav-600", bg: "bg-lav-100" };
  return { text: "NEUTRAL", color: "text-mint-600", bg: "bg-mint-100" };
}

/* ─────────────────────── Bottle character ─────────────────────── */

function Bottle({ color, size = 34 }) {
  return (
    <svg viewBox="0 0 40 52" width={size} height={(size * 52) / 40} aria-hidden="true">
      <path
        d="M15 4h10v9l7 13.5c2.4 4.4 -0.8 9.7 -5.8 9.7H13.8c-5 0 -8.2 -5.3 -5.8 -9.7L15 13V4z"
        fill={color}
      />
      <rect x="15" y="2" width="10" height="4" rx="1.4" fill="#8a8298" />
      <circle cx="16.6" cy="30" r="1.6" fill="#453f52" />
      <circle cx="23.4" cy="30" r="1.6" fill="#453f52" />
      <path d="M17 35 Q20 37.5 23 35" stroke="#453f52" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────── pH Gauge (SVG) ─────────────────────── */

function PhGauge({ ph }) {
  const angle = (ph / 14) * 180 - 90;
  const stops = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="w-full max-w-[280px]">
        {stops.slice(0, 14).map((i) => {
          const a1 = (i / 14) * Math.PI;
          const a2 = ((i + 1) / 14) * Math.PI;
          const r = 90;
          const cx = 110;
          const cy = 115;
          const x1 = cx - r * Math.cos(a1);
          const y1 = cy - r * Math.sin(a1);
          const x2 = cx - r * Math.cos(a2);
          const y2 = cy - r * Math.sin(a2);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              stroke={phColor(i + 0.5)}
              strokeWidth="18"
              fill="none"
              strokeLinecap="butt"
            />
          );
        })}
        <text x="20" y="128" fontSize="11" fontWeight="800" fill="#EE7B7B">
          0 acid
        </text>
        <text x="97" y="14" fontSize="11" fontWeight="800" fill="#33A874">
          7
        </text>
        <text x="160" y="128" fontSize="11" fontWeight="800" fill="#7554B8">
          14 base
        </text>
        <motion.line
          x1="110"
          y1="115"
          stroke="#4A4458"
          strokeWidth="5"
          strokeLinecap="round"
          animate={{
            x2: 110 + 75 * Math.sin((angle * Math.PI) / 180),
            y2: 115 - 75 * Math.cos((angle * Math.PI) / 180),
          }}
          transition={{ type: "spring", stiffness: 60, damping: 11 }}
        />
        <circle cx="110" cy="115" r="9" fill="#4A4458" />
      </svg>
      <motion.p
        key={ph}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="font-display text-xl font-bold text-ink"
      >
        pH ≈ {ph}
      </motion.p>
    </div>
  );
}

/* ─────────────────────── Testing lab (tab 1) ─────────────────────── */

function TestingLab({ testedIds, setTestedIds }) {
  const dropRef = useRef(null);
  const [tested, setTested] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [justDropped, setJustDropped] = useState(false);

  const runTest = (substance) => {
    setTested(substance);
    setSelectedId(null);
    setJustDropped(true);
    play("splash");
    setTestedIds((prev) =>
      prev.includes(substance.id) ? prev : [...prev, substance.id]
    );
    setTimeout(() => setJustDropped(false), 1600);
  };

  const handleDragEnd = (substance, event) => {
    const zone = dropRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      runTest(substance);
    }
  };

  const selected = SUBSTANCES.find((s) => s.id === selectedId);
  const stripColor = tested ? phColor(tested.ph) : "#C9B6EF";
  const label = tested ? phLabel(tested.kind) : null;
  const allDone = testedIds.length === SUBSTANCES.length;

  useEffect(() => {
    if (allDone) play("tada");
  }, [allDone]);

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* ── Shelf of substances ── */}
      <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/50">
          The testing shelf{" "}
          <span className="font-semibold normal-case">
            ({testedIds.length}/{SUBSTANCES.length} tested)
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-2">
          {SUBSTANCES.map((s) => (
            <motion.div
              key={s.id}
              drag
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.15, zIndex: 50, cursor: "grabbing" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onDragEnd={(event) => handleDragEnd(s, event)}
              onClick={() =>
                setSelectedId((prev) => (prev === s.id ? null : s.id))
              }
              className={`relative flex min-h-[44px] cursor-grab flex-col items-center gap-1 rounded-2xl p-3 text-center transition-colors ${
                selectedId === s.id
                  ? "bg-sky-200 ring-2 ring-sky-400"
                  : "bg-sky-100/60 hover:bg-sky-100"
              }`}
            >
              {testedIds.includes(s.id) && (
                <span className="absolute -right-1 -top-1 text-sm">⭐</span>
              )}
              <Bottle color={s.color} />
              <span className="text-[11px] font-bold leading-tight text-ink/70">
                {s.name}
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => runTest(selected)}
              className="mt-4 min-h-[44px] w-full rounded-full bg-sky-500 px-4 py-3 font-bold text-white shadow-pop"
            >
              Dip {selected.name} into the tester!
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Testing bench ── */}
      <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        <Celebration show={justDropped} glow="#84C1F2" />

        <div className="grid gap-6 md:grid-cols-2">
          <div
            ref={dropRef}
            className="flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-lav-200 bg-lav-100/40 p-6"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink/40">
              Drop zone — universal litmus strip
            </p>
            <motion.div
              animate={{
                backgroundColor: stripColor,
                scale: justDropped ? [1, 1.08, 1] : 1,
              }}
              transition={{ duration: 0.8 }}
              className="flex h-44 w-24 items-center justify-center rounded-xl shadow-soft"
              style={{ backgroundColor: stripColor }}
            >
              <Mascot size={26} bg="transparent" eyeColor="rgba(69,63,82,0.55)" mood={tested ? "happy" : "neutral"} />
            </motion.div>
            <AnimatePresence mode="wait">
              {label ? (
                <motion.span
                  key={tested.id}
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`mt-4 rounded-full px-5 py-1.5 text-sm font-extrabold ${label.bg} ${label.color}`}
                >
                  {label.text}
                </motion.span>
              ) : (
                <motion.span
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm font-semibold text-ink/40"
                >
                  Waiting for a sample…
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <PhGauge ph={tested ? tested.ph : 7} />
            <AnimatePresence mode="wait">
              <motion.div
                key={tested ? tested.id : "intro"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full rounded-2xl bg-butter-100 px-4 py-3"
              >
                {tested ? (
                  <>
                    <p className="text-sm font-bold text-ink/80">
                      {tested.name} — {tested.everyday}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-ink/65">
                      {tested.blurb}
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold leading-relaxed text-ink/65">
                    The pH scale runs from 0 to 14. Below 7 = acid, exactly 7 =
                    neutral, above 7 = base. The further from 7, the stronger it
                    is!
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl bg-mint-100 px-5 py-3 text-center"
            >
              <p className="font-extrabold text-mint-600">
                🏆 Lab complete! Now visit the Salt Factory to make some salts!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────── Salt Factory (tab 2) ─────────────────────── */

function SaltFactory({ saltsMade, setSaltsMade }) {
  const [acidId, setAcidId] = useState(null);
  const [baseId, setBaseId] = useState(null);
  const [result, setResult] = useState(null);
  const [mixing, setMixing] = useState(false);

  const acid = ACIDS.find((a) => a.id === acidId);
  const base = BASES.find((b) => b.id === baseId);
  const canMix = acid && base && !mixing;

  const mix = () => {
    if (!canMix) return;
    const key = `${acid.id}+${base.id}`;
    setMixing(true);
    setResult(null);
    play("splash");
    setTimeout(() => {
      setMixing(false);
      setResult(SALTS[key]);
      play("success");
      setSaltsMade((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }, 1100);
  };

  const resetPick = () => {
    setAcidId(null);
    setBaseId(null);
    setResult(null);
  };

  const allSalts = saltsMade.length === Object.keys(SALTS).length;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
        <Celebration show={!!result} glow="#7FD8B0" />

        <p className="mb-5 rounded-2xl bg-mint-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
          🧂 The exam-favourite rule: <b>Acid + Base → Salt + Water</b>. This is
          called <b>neutralisation</b> — they cancel each other out! Pick one of
          each and press MIX. ({saltsMade.length}/{Object.keys(SALTS).length}{" "}
          salts made)
        </p>

        <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
          {/* Acid shelf */}
          <div className="rounded-2xl bg-blush-100/70 p-4">
            <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-blush-500">
              Pick an acid 🍋
            </h3>
            <div className="flex justify-center gap-3">
              {ACIDS.map((a) => (
                <motion.button
                  key={a.id}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    play("pop");
                    setAcidId(a.id);
                    setResult(null);
                  }}
                  className={`flex min-h-[44px] flex-col items-center gap-1 rounded-2xl px-4 py-3 transition ${
                    acidId === a.id
                      ? "bg-white shadow-pop ring-2 ring-blush-400"
                      : "bg-white/60 shadow-soft hover:bg-white"
                  }`}
                >
                  <Bottle color={a.color} size={30} />
                  <span className="font-display text-sm font-bold text-ink">
                    {a.formula}
                  </span>
                  <span className="text-[10px] font-bold text-ink/50">{a.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mixer */}
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={
                mixing
                  ? { rotate: [0, -12, 12, -12, 12, 0], scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 1 }}
              className="grid h-24 w-24 place-items-center rounded-full bg-lav-100 text-4xl shadow-soft"
            >
              {mixing ? "🌀" : result ? "✨" : "🫙"}
            </motion.div>
            <motion.button
              whileHover={canMix ? { scale: 1.07 } : {}}
              whileTap={canMix ? { scale: 0.93 } : {}}
              onClick={mix}
              disabled={!canMix}
              className="min-h-[44px] rounded-full bg-mint-500 px-8 py-2.5 font-display font-bold text-white shadow-pop transition disabled:opacity-30"
            >
              MIX!
            </motion.button>
          </div>

          {/* Base shelf */}
          <div className="rounded-2xl bg-lav-100/70 p-4">
            <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-lav-600">
              Pick a base 🧼
            </h3>
            <div className="flex justify-center gap-3">
              {BASES.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    play("pop");
                    setBaseId(b.id);
                    setResult(null);
                  }}
                  className={`flex min-h-[44px] flex-col items-center gap-1 rounded-2xl px-4 py-3 transition ${
                    baseId === b.id
                      ? "bg-white shadow-pop ring-2 ring-lav-400"
                      : "bg-white/60 shadow-soft hover:bg-white"
                  }`}
                >
                  <Bottle color={b.color} size={30} />
                  <span className="font-display text-sm font-bold text-ink">
                    {b.formula}
                  </span>
                  <span className="text-[10px] font-bold text-ink/50">{b.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Result card */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.salt}
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="mx-auto mt-6 max-w-lg rounded-2xl bg-mint-100 px-5 py-4 text-center"
            >
              <p className="font-display text-xl font-bold text-mint-600">
                You made {result.salt}! 🧂
              </p>
              <p className="text-sm font-bold text-ink/70">{result.name}</p>
              <p className="mt-1 font-display text-base font-bold text-ink/80">
                {result.eq}
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/60">
                {result.fact}
              </p>
              <button
                onClick={resetPick}
                className="mt-3 min-h-[44px] rounded-full bg-white px-6 py-2 text-sm font-bold text-mint-600 shadow-soft transition hover:bg-mint-200/50"
              >
                Make another salt →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {allSalts && !result && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 text-center font-extrabold text-mint-600"
            >
              🏆 All 4 salts made — you're a neutralisation master!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-blob bg-lav-100 p-5">
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-lav-600">
          Why this matters in real life
        </h3>
        <p className="text-sm font-semibold leading-relaxed text-ink/65">
          Neutralisation is everywhere: an <b>antacid</b> (base) calms your acidic
          stomach, <b>toothpaste</b> (base) fights mouth acid that causes
          cavities, and farmers add <b>lime</b> (base) to acidic soil. When an
          acid meets a base, they trade danger for a peaceful salt + water!
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

export default function LitmusLab({ onProgress }) {
  const [tab, setTab] = useState("test");
  const [testedIds, setTestedIds] = useStoredState("cq-litmus-tested", []);
  const [saltsMade, setSaltsMade] = useStoredState("cq-litmus-salts", []);

  useEffect(() => {
    onProgress?.((testedIds.length + saltsMade.length) / TOTAL_ITEMS);
  }, [testedIds, saltsMade, onProgress]);

  return (
    <div className="space-y-5">
      <TipBubble emoji="🧪">
        Hi, I'm Fizzle! First test every bottle on the litmus strip, then head
        to my <b>Salt Factory</b> to mix acids and bases into brand-new salts!
      </TipBubble>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "test", label: `🧻 Litmus Testing (${testedIds.length}/${SUBSTANCES.length})` },
          { id: "salts", label: `🧂 Salt Factory (${saltsMade.length}/${Object.keys(SALTS).length})` },
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
                ? "bg-sky-500 text-white shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-sky-100"
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
          {tab === "test" ? (
            <TestingLab testedIds={testedIds} setTestedIds={setTestedIds} />
          ) : (
            <SaltFactory saltsMade={saltsMade} setSaltsMade={setSaltsMade} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cheat-sheet strip */}
      <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/50">
          Remember it like this
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-blush-100 px-4 py-3">
            <p className="font-display font-bold text-blush-500">Acids</p>
            <p className="text-sm font-semibold text-ink/65">
              Sour taste · turn blue litmus <b>red</b> · pH below 7
            </p>
          </div>
          <div className="rounded-2xl bg-mint-100 px-4 py-3">
            <p className="font-display font-bold text-mint-600">Neutral</p>
            <p className="text-sm font-semibold text-ink/65">
              No colour change · pH exactly 7 · perfectly balanced
            </p>
          </div>
          <div className="rounded-2xl bg-lav-100 px-4 py-3">
            <p className="font-display font-bold text-lav-600">Bases</p>
            <p className="text-sm font-semibold text-ink/65">
              Slippery feel · turn red litmus <b>blue</b> · pH above 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
