"use client";

/**
 * Tiny WebAudio synth — no audio files needed. All sounds are soft and
 * rounded (sine/triangle waves, gentle envelopes) to match the app's vibe.
 */

let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isMuted() {
  try {
    return window.localStorage.getItem("cq-muted") === "1";
  } catch {
    return false;
  }
}

export function setMuted(m) {
  try {
    window.localStorage.setItem("cq-muted", m ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function tone(c, { freq, at = 0, dur = 0.15, type = "sine", vol = 0.12, glide = null }) {
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

const SOUNDS = {
  // small UI interaction (coefficient click, tab switch)
  pop: (c) => tone(c, { freq: 520, dur: 0.09, type: "triangle", vol: 0.08 }),
  // picking something up / attaching
  snap: (c) => {
    tone(c, { freq: 660, dur: 0.08, type: "triangle", vol: 0.1 });
    tone(c, { freq: 990, at: 0.06, dur: 0.1, type: "sine", vol: 0.08 });
  },
  // a single correct answer
  ding: (c) => {
    tone(c, { freq: 880, dur: 0.22, type: "sine", vol: 0.1 });
    tone(c, { freq: 1318, at: 0.02, dur: 0.28, type: "sine", vol: 0.06 });
  },
  // gentle "not quite" — a soft downward slide, never harsh
  oops: (c) => tone(c, { freq: 330, dur: 0.28, type: "sine", vol: 0.07, glide: 262 }),
  // balancing / completing a step: rising arpeggio
  success: (c) => {
    [523, 659, 784].forEach((f, i) =>
      tone(c, { freq: f, at: i * 0.09, dur: 0.2, type: "triangle", vol: 0.09 })
    );
  },
  // finishing a whole module: bigger arpeggio
  tada: (c) => {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      tone(c, { freq: f, at: i * 0.1, dur: i === 4 ? 0.5 : 0.18, type: "triangle", vol: 0.09 })
    );
  },
  // liquid dip
  splash: (c) => {
    tone(c, { freq: 300, dur: 0.18, type: "sine", vol: 0.09, glide: 520 });
    tone(c, { freq: 780, at: 0.1, dur: 0.14, type: "sine", vol: 0.05 });
  },
};

export function play(name) {
  if (isMuted()) return;
  const c = getCtx();
  if (!c) return;
  try {
    SOUNDS[name]?.(c);
  } catch {
    /* never let audio break the game */
  }
}
