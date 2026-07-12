"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "./Celebration";
import TipBubble from "./TipBubble";
import Mascot from "./Mascot";
import { useStoredState } from "@/lib/storage";
import { play } from "@/lib/sound";

/* ─────────────────────────── Data ─────────────────────────── */

const ELEMENT_STYLE = {
  H: { bg: "bg-sky-200", ring: "ring-sky-400", text: "text-sky-600" },
  O: { bg: "bg-blush-200", ring: "ring-blush-400", text: "text-blush-500" },
  Mg: { bg: "bg-mint-200", ring: "ring-mint-400", text: "text-mint-600" },
  Zn: { bg: "bg-lav-200", ring: "ring-lav-400", text: "text-lav-600" },
  Cl: { bg: "bg-butter-200", ring: "ring-butter-400", text: "text-ink/70" },
  C: { bg: "bg-peach-200", ring: "ring-peach-400", text: "text-peach-500" },
  Al: { bg: "bg-sky-100", ring: "ring-sky-500", text: "text-sky-600" },
  Cu: { bg: "bg-peach-100", ring: "ring-peach-500", text: "text-peach-500" },
  Fe: { bg: "bg-butter-100", ring: "ring-peach-400", text: "text-ink/70" },
  Na: { bg: "bg-lav-100", ring: "ring-lav-500", text: "text-lav-600" },
  Ba: { bg: "bg-mint-100", ring: "ring-mint-500", text: "text-mint-600" },
  "SO₄": { bg: "bg-blush-100", ring: "ring-blush-500", text: "text-blush-500" },
};

const REACTION_TYPES = [
  {
    id: "combination",
    label: "Combination",
    desc: "Two or more substances join to form ONE new product (A + B → AB).",
  },
  {
    id: "decomposition",
    label: "Decomposition",
    desc: "ONE substance breaks apart into two or more simpler ones (AB → A + B).",
  },
  {
    id: "displacement",
    label: "Displacement",
    desc: "A more reactive element pushes a less reactive one out of its compound.",
  },
  {
    id: "double",
    label: "Double Displacement",
    desc: "Two compounds swap partners with each other (AB + CD → AD + CB).",
  },
  {
    id: "oxidation",
    label: "Oxidation (Burning)",
    desc: "A substance gains oxygen — like fuels burning in air.",
  },
];

const EQUATIONS = [
  {
    id: "water",
    name: "Making Water",
    story: "Hydrogen and oxygen team up to make water — the most famous recipe in chemistry!",
    reactants: [
      { formula: "H₂", atoms: { H: 2 } },
      { formula: "O₂", atoms: { O: 2 } },
    ],
    products: [{ formula: "H₂O", atoms: { H: 2, O: 1 } }],
    solution: "2 H₂ + O₂ → 2 H₂O",
    hint: "Oxygen arrives in pairs (O₂), but each water only uses ONE oxygen. Try making two waters!",
    type: "combination",
    typeHint: "Two ingredients became ONE product. What do we call that?",
  },
  {
    id: "mgo",
    name: "The Dazzling Ribbon",
    story: "Magnesium ribbon burns with a dazzling white flame and becomes magnesium oxide (the NCERT classic!).",
    reactants: [
      { formula: "Mg", atoms: { Mg: 1 } },
      { formula: "O₂", atoms: { O: 2 } },
    ],
    products: [{ formula: "MgO", atoms: { Mg: 1, O: 1 } }],
    solution: "2 Mg + O₂ → 2 MgO",
    hint: "One O₂ brings two oxygens — enough for TWO MgO. So how many Mg will you need?",
    type: "combination",
    typeHint: "Mg and O₂ joined into a single product, MgO. Two became one…",
  },
  {
    id: "electrolysis",
    name: "Splitting Water",
    story: "Pass electricity through water and it splits back into hydrogen and oxygen gas — the reverse of making it!",
    reactants: [{ formula: "H₂O", atoms: { H: 2, O: 1 } }],
    products: [
      { formula: "H₂", atoms: { H: 2 } },
      { formula: "O₂", atoms: { O: 2 } },
    ],
    solution: "2 H₂O → 2 H₂ + O₂",
    hint: "One O₂ needs two oxygens — so you'll need TWO waters. Then count your hydrogens!",
    type: "decomposition",
    typeHint: "ONE substance broke apart into two simpler ones. That's the opposite of combination…",
  },
  {
    id: "zinc",
    name: "The Fizzy Metal",
    story: "Zinc dropped into hydrochloric acid fizzes as hydrogen gas bubbles out.",
    reactants: [
      { formula: "Zn", atoms: { Zn: 1 } },
      { formula: "HCl", atoms: { H: 1, Cl: 1 } },
    ],
    products: [
      { formula: "ZnCl₂", atoms: { Zn: 1, Cl: 2 } },
      { formula: "H₂", atoms: { H: 2 } },
    ],
    solution: "Zn + 2 HCl → ZnCl₂ + H₂",
    hint: "ZnCl₂ needs two chlorines and H₂ needs two hydrogens — one HCl won't be enough!",
    type: "displacement",
    typeHint: "Zinc pushed hydrogen out of its compound and took its place. Who displaced whom?",
  },
  {
    id: "alcucl",
    name: "The Metal Takeover",
    story: "Aluminium is more reactive than copper — drop it into copper chloride and it kicks the copper out!",
    reactants: [
      { formula: "Al", atoms: { Al: 1 } },
      { formula: "CuCl₂", atoms: { Cu: 1, Cl: 2 } },
    ],
    products: [
      { formula: "AlCl₃", atoms: { Al: 1, Cl: 3 } },
      { formula: "Cu", atoms: { Cu: 1 } },
    ],
    solution: "2 Al + 3 CuCl₂ → 2 AlCl₃ + 3 Cu",
    hint: "Tricky one! Chlorine comes in 2s but leaves in 3s. Find a number both 2 and 3 fit into… 6! Aim for 6 chlorines on each side.",
    type: "displacement",
    typeHint: "Aluminium shoved copper out of its compound. One element replacing another is called…",
  },
  {
    id: "barium",
    name: "The Partner Swap",
    story: "Mix sodium sulphate and barium chloride solutions — they instantly swap partners and a white solid (BaSO₄) appears!",
    reactants: [
      { formula: "Na₂SO₄", atoms: { Na: 2, "SO₄": 1 } },
      { formula: "BaCl₂", atoms: { Ba: 1, Cl: 2 } },
    ],
    products: [
      { formula: "BaSO₄", atoms: { Ba: 1, "SO₄": 1 } },
      { formula: "NaCl", atoms: { Na: 1, Cl: 1 } },
    ],
    solution: "Na₂SO₄ + BaCl₂ → BaSO₄ + 2 NaCl",
    hint: "The pink SO₄ chip travels as one group! Two sodiums walk in, so you'll need two NaCl on the way out.",
    type: "double",
    typeHint: "BOTH compounds swapped their partners with each other. A double swap is called…",
  },
  {
    id: "methane",
    name: "The Kitchen Flame",
    story: "Methane (natural gas) burns on your stove: it grabs oxygen and makes carbon dioxide and water.",
    reactants: [
      { formula: "CH₄", atoms: { C: 1, H: 4 } },
      { formula: "O₂", atoms: { O: 2 } },
    ],
    products: [
      { formula: "CO₂", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } },
    ],
    solution: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    hint: "Four hydrogens need TWO waters. Now count your oxygens on the right… you'll need 2 O₂!",
    type: "oxidation",
    typeHint: "Methane gained oxygen as it burned. Gaining oxygen has a special name…",
  },
  {
    id: "ironsteam",
    name: "BOSS LEVEL: Iron vs Steam",
    story: "Red-hot iron + steam makes iron oxide (Fe₃O₄) and hydrogen. The trickiest balance in Chapter 1 — you've got this!",
    reactants: [
      { formula: "Fe", atoms: { Fe: 1 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } },
    ],
    products: [
      { formula: "Fe₃O₄", atoms: { Fe: 3, O: 4 } },
      { formula: "H₂", atoms: { H: 2 } },
    ],
    solution: "3 Fe + 4 H₂O → Fe₃O₄ + 4 H₂",
    hint: "Start from the product: Fe₃O₄ needs 3 irons and 4 oxygens. 4 oxygens = 4 waters. And 4 waters bring 8 hydrogens = 4 H₂!",
    type: "displacement",
    typeHint: "Iron pushed the hydrogen out of water (H₂O) and took the oxygen. Sounds like a…",
  },
];

/* ─────────────────────── Helper functions ─────────────────────── */

function countAtoms(molecules, coeffs) {
  const totals = {};
  molecules.forEach((mol, i) => {
    Object.entries(mol.atoms).forEach(([el, n]) => {
      totals[el] = (totals[el] || 0) + n * coeffs[i];
    });
  });
  return totals;
}

function totalWeight(counts) {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

/* ─────────────────────── Sub-components ─────────────────────── */

function AtomChip({ element, small = false }) {
  const s = ELEMENT_STYLE[element] || ELEMENT_STYLE.C;
  return (
    <motion.span
      layout
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`grid place-items-center rounded-full font-extrabold ring-2 ${s.bg} ${s.ring} ${s.text} ${
        small ? "h-6 min-w-[24px] px-0.5 text-[9px]" : "h-8 min-w-[32px] px-1 text-xs"
      }`}
    >
      {element}
    </motion.span>
  );
}

function MoleculeCard({ molecule, coeff, onChange, disabled }) {
  const step = (v) => {
    play("pop");
    onChange(v);
  };
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
      <div className="flex max-w-[150px] flex-wrap items-center justify-center gap-1">
        {Object.entries(molecule.atoms).flatMap(([el, n]) =>
          Array.from({ length: n }, (_, i) => (
            <AtomChip key={`${el}-${i}`} element={el} small />
          ))
        )}
      </div>
      <p className="font-display text-lg font-bold text-ink">{molecule.formula}</p>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.85 }}
          disabled={disabled || coeff <= 1}
          onClick={() => step(coeff - 1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-lav-100 text-lg font-bold text-lav-600 transition disabled:opacity-30"
          aria-label={`decrease ${molecule.formula}`}
        >
          −
        </motion.button>
        <motion.span
          key={coeff}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          className="w-8 text-center font-display text-2xl font-bold text-lav-600"
        >
          {coeff}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          disabled={disabled || coeff >= 6}
          onClick={() => step(coeff + 1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-lav-100 text-lg font-bold text-lav-600 transition disabled:opacity-30"
          aria-label={`increase ${molecule.formula}`}
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

function Pan({ counts, label, mood }) {
  const chips = Object.entries(counts).flatMap(([el, n]) =>
    Array.from({ length: n }, (_, i) => ({ key: `${el}-${i}`, el }))
  );
  return (
    <div className="flex w-32 flex-col items-center sm:w-40">
      <Mascot size={26} bg="#E2D8F7" mood={mood} className="mb-1" />
      <div className="flex min-h-[64px] w-full flex-wrap items-end justify-center gap-1 rounded-t-xl border-x-4 border-t-4 border-lav-300 bg-lav-100/60 p-2">
        <AnimatePresence>
          {chips.map((c) => (
            <AtomChip key={c.key} element={c.el} small />
          ))}
        </AnimatePresence>
      </div>
      <div className="h-2 w-full rounded-b-md bg-lav-400" />
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/50">
        {label} · {chips.length} atoms
      </p>
    </div>
  );
}

/* ─────────── Step 2: reaction-type quiz (after balancing) ─────────── */

function TypeQuiz({ eq, onCorrect }) {
  const [wrongId, setWrongId] = useState(null);
  const [answered, setAnswered] = useState(false);

  const pick = (typeId) => {
    if (answered) return;
    if (typeId === eq.type) {
      setAnswered(true);
      play("tada");
      onCorrect();
    } else {
      setWrongId(typeId);
      play("oops");
    }
  };

  const correctType = REACTION_TYPES.find((t) => t.id === eq.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl bg-lav-100 px-5 py-4"
    >
      {!answered ? (
        <>
          <p className="mb-3 text-center font-display text-base font-bold text-lav-600">
            ⭐ Exam step: what TYPE of reaction is this?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {REACTION_TYPES.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                animate={wrongId === t.id ? { x: [0, -7, 7, -4, 4, 0] } : {}}
                onClick={() => pick(t.id)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-bold shadow-soft transition-colors ${
                  wrongId === t.id
                    ? "bg-butter-200 text-ink/60"
                    : "bg-white text-ink/70 hover:bg-lav-200"
                }`}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {wrongId && (
              <motion.p
                key={wrongId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 text-center text-sm font-semibold text-ink/60"
              >
                💭 {eq.typeHint}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="font-display text-base font-bold text-mint-600">
            ✅ Yes! It's a {correctType.label} reaction!
          </p>
          <p className="mt-1 text-sm font-semibold text-ink/60">
            {correctType.desc}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

const STUCK_MS = 45000;

export default function RecipeBalancer({ onProgress }) {
  const [eqIndex, setEqIndex] = useState(0);
  const [coeffs, setCoeffs] = useState(() => {
    const eq = EQUATIONS[0];
    return Array(eq.reactants.length + eq.products.length).fill(1);
  });
  const [showHint, setShowHint] = useState(false);
  const [autoHint, setAutoHint] = useState(false);
  const [typeCorrect, setTypeCorrect] = useState(false);
  const [solvedIds, setSolvedIds] = useStoredState("cq-balancer-solved", []);
  const stuckTimer = useRef(null);
  const prevBalanced = useRef(false);

  const eq = EQUATIONS[eqIndex];
  const rCoeffs = coeffs.slice(0, eq.reactants.length);
  const pCoeffs = coeffs.slice(eq.reactants.length);

  const left = useMemo(() => countAtoms(eq.reactants, rCoeffs), [eq, coeffs]);
  const right = useMemo(() => countAtoms(eq.products, pCoeffs), [eq, coeffs]);

  const elements = useMemo(
    () => Array.from(new Set([...Object.keys(left), ...Object.keys(right)])),
    [left, right]
  );
  const balanced =
    elements.every((el) => (left[el] || 0) === (right[el] || 0)) &&
    // Splitting water starts balanced-looking? No — but guard trivial all-1 solutions being instantly "solved" is fine; they still teach.
    elements.length > 0;

  const leftW = totalWeight(left);
  const rightW = totalWeight(right);
  const tilt = balanced ? 0 : Math.max(-10, Math.min(10, (rightW - leftW) * 3));

  const setCoeff = (index, value) => {
    setCoeffs((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const loadEquation = (index) => {
    const next = EQUATIONS[index];
    play("pop");
    setEqIndex(index);
    setCoeffs(Array(next.reactants.length + next.products.length).fill(1));
    setShowHint(false);
    setAutoHint(false);
    setTypeCorrect(false);
  };

  /* Balanced sound (fires once per balance) */
  useEffect(() => {
    if (balanced && !prevBalanced.current) play("success");
    prevBalanced.current = balanced;
  }, [balanced]);

  /* Solved = balanced + reaction type identified */
  useEffect(() => {
    if (balanced && typeCorrect) {
      setSolvedIds((prev) => (prev.includes(eq.id) ? prev : [...prev, eq.id]));
    }
  }, [balanced, typeCorrect, eq.id, setSolvedIds]);

  useEffect(() => {
    onProgress?.(solvedIds.length / EQUATIONS.length);
  }, [solvedIds, onProgress]);

  /* Adaptive hint: if she's stuck (no balance) for 45s, Bally offers help */
  useEffect(() => {
    clearTimeout(stuckTimer.current);
    if (!balanced && !showHint) {
      stuckTimer.current = setTimeout(() => {
        setAutoHint(true);
        setShowHint(true);
      }, STUCK_MS);
    }
    return () => clearTimeout(stuckTimer.current);
  }, [coeffs, eqIndex, balanced, showHint]);

  const solvedCount = solvedIds.length;

  return (
    <div className="space-y-5">
      <TipBubble emoji="⚖️">
        Hi, I'm Bally the Beam! Add or remove molecules with the − and +
        buttons until both pans weigh the exact same amount. Then name the
        reaction type to earn your star — just like in the exam!
      </TipBubble>

      {/* Recipe picker */}
      <div className="flex flex-wrap items-center gap-2">
        {EQUATIONS.map((e, i) => (
          <motion.button
            key={e.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadEquation(i)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              i === eqIndex
                ? "bg-blush-400 text-white shadow-pop"
                : "bg-white text-ink/60 shadow-soft hover:bg-blush-100"
            }`}
          >
            {solvedIds.includes(e.id) ? "⭐ " : ""}
            {e.name}
          </motion.button>
        ))}
        <span className="ml-auto rounded-full bg-white px-4 py-2 text-sm font-extrabold text-blush-500 shadow-soft">
          ⭐ {solvedCount}/{EQUATIONS.length}
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        {/* ── Left column: the recipe workbench ── */}
        <div className="relative overflow-hidden rounded-blob bg-white/70 p-5 shadow-floaty sm:p-6">
          <Celebration show={balanced} glow="#F49A9A" />

          <p className="mb-5 rounded-2xl bg-peach-100 px-4 py-3 text-sm font-semibold leading-relaxed text-ink/70">
            📖 {eq.story}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {eq.reactants.map((mol, i) => (
              <div key={mol.formula} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-2xl font-extrabold text-ink/30">+</span>
                )}
                <MoleculeCard
                  molecule={mol}
                  coeff={rCoeffs[i]}
                  onChange={(v) => setCoeff(i, v)}
                  disabled={balanced && typeCorrect}
                />
              </div>
            ))}

            <motion.span
              animate={
                balanced ? { scale: [1, 1.4, 1], rotate: [0, 8, 0] } : { scale: 1 }
              }
              transition={{ duration: 0.6 }}
              className={`text-3xl font-extrabold ${
                balanced ? "text-mint-500" : "text-ink/30"
              }`}
            >
              →
            </motion.span>

            {eq.products.map((mol, i) => (
              <div key={mol.formula} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-2xl font-extrabold text-ink/30">+</span>
                )}
                <MoleculeCard
                  molecule={mol}
                  coeff={pCoeffs[i]}
                  onChange={(v) => setCoeff(eq.reactants.length + i, v)}
                  disabled={balanced && typeCorrect}
                />
              </div>
            ))}
          </div>

          {/* ── The scale ── */}
          <div className="mt-8 flex flex-col items-center">
            <motion.div
              animate={{ rotate: tilt }}
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
              className="flex items-end justify-center gap-8 sm:gap-16"
              style={{ transformOrigin: "center bottom" }}
            >
              <Pan counts={left} label="Ingredients" mood={balanced ? "excited" : "neutral"} />
              <Pan counts={right} label="Result" mood={balanced ? "excited" : "neutral"} />
            </motion.div>
            {/* Beam stand */}
            <div className="h-10 w-3 rounded-b-full bg-lav-400" />
            <div className="h-3 w-40 rounded-full bg-lav-300" />

            <AnimatePresence mode="wait">
              {balanced ? (
                <motion.div
                  key="won"
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 w-full max-w-xl"
                >
                  <div className="rounded-2xl bg-mint-100 px-5 py-3 text-center">
                    <p className="font-display text-lg font-bold text-mint-600">
                      🎉 Perfectly balanced! {eq.solution}
                    </p>
                    <p className="text-sm font-semibold text-ink/60">
                      Every atom on the left found a home on the right — the Law
                      of Conservation of Mass!
                    </p>
                  </div>

                  {/* Step 2 — name the reaction type */}
                  {!typeCorrect ? (
                    <TypeQuiz eq={eq} onCorrect={() => setTypeCorrect(true)} />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-center"
                    >
                      {eqIndex < EQUATIONS.length - 1 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => loadEquation(eqIndex + 1)}
                          className="min-h-[44px] rounded-full bg-mint-500 px-6 py-2 font-bold text-white shadow-pop"
                        >
                          Next recipe →
                        </motion.button>
                      ) : (
                        <p className="font-display text-base font-bold text-mint-600">
                          🏆 You beat the boss level — Chapter 1 champion!
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="hint-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm font-bold text-ink/50"
                >
                  {leftW === rightW
                    ? "So close — the totals match, but check each atom type!"
                    : leftW > rightW
                    ? "The ingredients side is heavier — add more to the result side ➡️"
                    : "The result side is heavier — add more ingredients ⬅️"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right column: atom checklist + hint ── */}
        <div className="space-y-4">
          <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-ink/50">
              Atom check-list
            </h3>
            <div className="space-y-2">
              {elements.map((el) => {
                const ok = (left[el] || 0) === (right[el] || 0);
                return (
                  <motion.div
                    key={el}
                    layout
                    className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                      ok ? "bg-mint-100" : "bg-butter-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AtomChip element={el} />
                      <span className="text-sm font-bold text-ink/70">
                        {left[el] || 0} left · {right[el] || 0} right
                      </span>
                    </div>
                    <motion.span
                      key={`${el}-${ok}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg"
                    >
                      {ok ? "✅" : "🤔"}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="rounded-blob bg-white/70 p-5 shadow-floaty">
            <AnimatePresence>
              {autoHint && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 flex items-center gap-2 rounded-2xl bg-lav-100 px-3 py-2"
                >
                  <Mascot size={24} bg="#A98BE3" mood="happy" />
                  <p className="text-xs font-bold text-lav-600">
                    Bally noticed you're thinking hard — here's a little nudge!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                setShowHint((s) => !s);
                setAutoHint(false);
              }}
              className="min-h-[44px] w-full rounded-full bg-butter-200 px-4 py-2 text-sm font-bold text-ink/70 transition hover:bg-butter-400/60"
            >
              {showHint ? "Hide hint 🙈" : "Need a hint? 💡"}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-3 text-sm font-semibold leading-relaxed text-ink/60"
                >
                  {eq.hint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-blob bg-lav-100 p-5">
            <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-lav-600">
              The 5 reaction types
            </h3>
            <ul className="space-y-2 text-sm font-semibold leading-relaxed text-ink/65">
              {REACTION_TYPES.map((t) => (
                <li key={t.id}>
                  <b className="text-lav-600">{t.label}:</b> {t.desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
