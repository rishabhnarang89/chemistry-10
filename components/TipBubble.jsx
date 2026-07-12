"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TipBubble({ emoji, children }) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="mb-5 flex items-start gap-3 rounded-3xl bg-white px-5 py-4 shadow-soft"
        >
          <span className="text-2xl shrink-0">{emoji}</span>
          <p className="flex-1 text-sm font-semibold leading-relaxed text-ink/75">
            {children}
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded-full bg-ink/5 px-3 py-2 text-[11px] font-extrabold text-ink/55 transition hover:bg-ink/10"
            aria-label="Dismiss tip"
          >
            Got it ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
