let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08,
  when = 0
) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  pickup() {
    tone(520, 0.08, "triangle", 0.06);
    tone(780, 0.12, "triangle", 0.05, 0.06);
  },
  place() {
    tone(340, 0.1, "square", 0.04);
    tone(520, 0.18, "sine", 0.07, 0.08);
  },
  wrong() {
    tone(180, 0.2, "sawtooth", 0.05);
    tone(120, 0.25, "sawtooth", 0.04, 0.1);
  },
  spell() {
    tone(440, 0.1, "sine", 0.05);
    tone(660, 0.12, "sine", 0.05, 0.08);
    tone(880, 0.18, "triangle", 0.04, 0.16);
  },
  complete() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, "triangle", 0.06, i * 0.12));
  },
  victory() {
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) =>
      tone(f, 0.35, "triangle", 0.07, i * 0.14)
    );
  },
  click() {
    tone(700, 0.04, "square", 0.03);
  },
  step() {
    tone(90 + Math.random() * 30, 0.05, "triangle", 0.015);
  },
};
