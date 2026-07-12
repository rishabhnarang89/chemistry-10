"use client";

import { motion, AnimatePresence } from "framer-motion";

const PARTICLE_COLORS = [
  "#F49A9A",
  "#FFB98A",
  "#F7D96B",
  "#7FD8B0",
  "#84C1F2",
  "#A98BE3",
];

const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const angle = (i / 26) * Math.PI * 2;
  const distance = 90 + (i % 5) * 34;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 30,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: 8 + (i % 4) * 4,
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + (i % 5) * 60),
    shape: i % 3, // 0 = circle, 1 = square, 2 = star
  };
});

/**
 * A soft confetti burst with a gentle glow behind it. Render it absolutely
 * inside a `relative` parent and toggle `show` to fire it.
 */
export default function Celebration({ show, glow = "#A98BE3" }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 0.5, 0], scale: 1.4 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute h-64 w-64 rounded-full"
            style={{ background: `radial-gradient(circle, ${glow}66, transparent 70%)` }}
          />
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1.2, 1],
                rotate: p.rotate,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.shape === 2 ? "transparent" : p.color,
                borderRadius: p.shape === 0 ? "9999px" : "3px",
                fontSize: p.size + 4,
                lineHeight: 1,
              }}
            >
              {p.shape === 2 ? "✨" : ""}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
