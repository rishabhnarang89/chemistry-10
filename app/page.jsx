"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeBalancer from "@/components/RecipeBalancer";
import LitmusLab from "@/components/LitmusLab";
import MaterialSorter from "@/components/MaterialSorter";
import CarbonClub from "@/components/CarbonClub";
import ElementAcademy from "@/components/ElementAcademy";
import Mascot from "@/components/Mascot";
import ProgressRing from "@/components/ProgressRing";
import SoundToggle from "@/components/SoundToggle";
import { useStoredState } from "@/lib/storage";

const CHAPTERS = [
  {
    id: "balancer",
    number: 1,
    title: "The Recipe Balancer",
    subtitle: "Chemical Reactions & Equations",
    colorMain: "#F49A9A",
    colorSoft: "#FDE8E8",
    colorDeep: "#EE7B7B",
    component: RecipeBalancer,
  },
  {
    id: "litmus",
    number: 2,
    title: "The Litmus Color Lab",
    subtitle: "Acids, Bases & Salts",
    colorMain: "#84C1F2",
    colorSoft: "#E7F3FD",
    colorDeep: "#3E8FD4",
    component: LitmusLab,
  },
  {
    id: "sorter",
    number: 3,
    title: "The Material Sorting Game",
    subtitle: "Metals & Non-Metals",
    colorMain: "#7FD8B0",
    colorSoft: "#E6F7EF",
    colorDeep: "#33A874",
    component: MaterialSorter,
  },
  {
    id: "carbon",
    number: 4,
    title: "Carbon's Hand-Holding Club",
    subtitle: "Carbon & its Compounds",
    colorMain: "#A98BE3",
    colorSoft: "#F1ECFB",
    colorDeep: "#7554B8",
    component: CarbonClub,
  },
  {
    id: "elements",
    number: 5,
    label: "Bonus",
    title: "Element Academy",
    subtitle: "Periodic Table · Masses & Valencies",
    colorMain: "#F7D96B",
    colorSoft: "#FFF8DC",
    colorDeep: "#B8892B",
    component: ElementAcademy,
  },
];

const WORLD_BG = {
  balancer: "from-cream to-blush-100/40",
  litmus: "from-cream to-sky-100/40",
  sorter: "from-cream to-mint-100/40",
  carbon: "from-cream to-lav-100/40",
  elements: "from-cream to-butter-100/50",
};

export default function Home() {
  const [activeId, setActiveId] = useState("balancer");
  const [progress, setProgress] = useStoredState("cq-progress", {
    balancer: 0,
    litmus: 0,
    sorter: 0,
    carbon: 0,
    elements: 0,
  });

  const active = CHAPTERS.find((c) => c.id === activeId);
  const ActiveComponent = active.component;

  const setChapterProgress = (id, value) => {
    setProgress((prev) => (prev[id] === value ? prev : { ...prev, [id]: value }));
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-cream md:flex-row">
      {/* Ambient floating blobs */}
      <div className="pointer-events-none fixed -right-24 -top-28 z-0 h-80 w-80 rounded-full bg-lav-100/60 blur-2xl animate-cq-float" />
      <div className="pointer-events-none fixed -left-20 -bottom-32 z-0 h-72 w-72 rounded-full bg-sky-100/60 blur-2xl animate-cq-float-rev" />

      {/* ───────────────── Sidebar (level-select) ───────────────── */}
      <aside className="sticky top-0 z-20 order-2 flex shrink-0 items-center justify-around gap-1 border-t-2 border-lav-100 bg-white/90 px-2 py-2 backdrop-blur md:order-1 md:min-h-screen md:w-72 md:flex-col md:items-stretch md:justify-start md:border-t-0 md:border-r-2 md:px-4 md:py-6">
        <div className="hidden items-center gap-3 px-2 pb-6 md:flex">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-lav-400 to-lav-500 shadow-pop"
          >
            <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">
              <path d="M19 4h10v11.5l8.5 15.7c2.6 4.8-0.9 10.8-6.4 10.8H16.9c-5.5 0-9-6-6.4-10.8L19 15.5V4z" fill="#fff" opacity="0.35" />
              <path d="M19 4h10v11.5l8.5 15.7c2.6 4.8-0.9 10.8-6.4 10.8H16.9c-5.5 0-9-6-6.4-10.8L19 15.5V4z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="24" cy="33" r="4.2" fill="#fff" />
            </svg>
          </motion.div>
          <div>
            <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
              ChemQuest <span className="text-lav-500">10</span>
            </h1>
            <p className="text-xs font-semibold text-ink/50">
              Chemistry, one game at a time
            </p>
          </div>
        </div>

        <nav className="flex w-full items-center justify-around gap-1 md:flex-col md:items-stretch md:gap-2">
          {CHAPTERS.map((ch) => {
            const isActive = ch.id === activeId;
            const frac = progress[ch.id] || 0;
            return (
              <motion.button
                key={ch.id}
                onClick={() => setActiveId(ch.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex min-h-[52px] flex-col items-center gap-1 rounded-2xl px-2 py-2 text-left transition-colors md:min-h-[64px] md:w-full md:flex-row md:gap-3 md:px-3 md:py-3 ${
                  isActive ? "shadow-soft" : "hover:bg-ink/[0.03]"
                }`}
                style={{ background: isActive ? ch.colorSoft : "transparent" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 hidden h-8 w-1.5 -translate-y-1/2 rounded-r-full md:block"
                    style={{ background: ch.colorDeep }}
                  />
                )}
                <ProgressRing size={44} progress={frac} color={ch.colorDeep}>
                  <Mascot size={20} bg={ch.colorMain} mood={frac >= 1 ? "excited" : "neutral"} />
                </ProgressRing>
                <span className="hidden min-w-0 flex-col md:flex">
                  <span className="block text-[11px] font-bold uppercase tracking-wide text-ink/40">
                    {ch.label || `Chapter ${ch.number}`}
                  </span>
                  <span
                    className={`block truncate text-sm font-bold leading-tight ${
                      isActive ? "text-ink" : "text-ink/70"
                    }`}
                  >
                    {ch.title}
                  </span>
                  <span className="block truncate text-[11px] font-semibold text-ink/45">
                    {ch.subtitle}
                  </span>
                </span>
                <span className="block text-[10px] font-bold leading-tight text-ink/55 md:hidden">
                  {ch.number}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <SoundToggle className="md:hidden" />
        <div className="hidden px-2 pt-6 md:block">
          <div className="mb-3 flex items-center gap-3">
            <SoundToggle />
            <span className="text-xs font-bold text-ink/45">Game sounds</span>
          </div>
          <div className="flex items-start gap-2 rounded-2xl bg-butter-100 px-4 py-3 text-xs font-semibold leading-relaxed text-ink/60">
            <span className="shrink-0">✦</span>
            <span><span className="font-extrabold">Tip:</span> there are no wrong answers here — every try teaches you something. Take your time!</span>
          </div>
        </div>
      </aside>

      {/* ───────────────── Main stage ───────────────── */}
      <main className={`relative z-10 order-1 min-w-0 flex-1 bg-gradient-to-b p-4 pb-6 sm:p-6 md:order-2 lg:p-8 ${WORLD_BG[activeId]}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <motion.span
                  animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="grid h-14 w-14 place-items-center rounded-2xl shadow-soft"
                  style={{ background: active.colorSoft }}
                >
                  <Mascot size={34} bg={active.colorMain} mood="happy" />
                </motion.span>
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                    {active.title}
                  </h2>
                  <p className="text-sm font-bold text-ink/50">
                    {active.label || `Chapter ${active.number}`} · {active.subtitle}
                  </p>
                </div>
              </div>
            </header>
            <ActiveComponent onProgress={(v) => setChapterProgress(active.id, v)} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
