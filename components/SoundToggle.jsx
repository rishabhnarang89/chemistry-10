"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isMuted, setMuted, play } from "@/lib/sound";

export default function SoundToggle({ className = "" }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) play("pop");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label={muted ? "Turn sounds on" : "Turn sounds off"}
      title={muted ? "Sounds off" : "Sounds on"}
      className={`grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg shadow-soft transition hover:bg-lav-100 ${className}`}
    >
      {muted ? "🔇" : "🔊"}
    </motion.button>
  );
}
