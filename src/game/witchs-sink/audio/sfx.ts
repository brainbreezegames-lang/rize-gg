/** Lightweight Web Audio SFX — no external assets required */

type Tone = { freq: number; dur: number; type?: OscillatorType; gain?: number };

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  return ctx;
}

function playTones(tones: Tone[]) {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
  const now = ac.currentTime;
  tones.forEach((t, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = t.type ?? "sine";
    osc.frequency.value = t.freq;
    const g = t.gain ?? 0.08;
    const start = now + i * 0.02;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(g, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + t.dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(start);
    osc.stop(start + t.dur + 0.02);
  });
}

export const sfx = {
  pickup: () => playTones([{ freq: 420, dur: 0.08, type: "triangle" }, { freq: 560, dur: 0.1 }]),
  washOk: () =>
    playTones([
      { freq: 520, dur: 0.12, type: "sine", gain: 0.1 },
      { freq: 660, dur: 0.14, type: "sine", gain: 0.09 },
      { freq: 880, dur: 0.18, type: "triangle", gain: 0.07 },
    ]),
  washBad: () =>
    playTones([
      { freq: 180, dur: 0.2, type: "sawtooth", gain: 0.06 },
      { freq: 120, dur: 0.25, type: "square", gain: 0.05 },
    ]),
  place: () =>
    playTones([
      { freq: 300, dur: 0.08, type: "triangle" },
      { freq: 450, dur: 0.12, type: "sine", gain: 0.09 },
    ]),
  unlock: () =>
    playTones([
      { freq: 440, dur: 0.1 },
      { freq: 554, dur: 0.1 },
      { freq: 659, dur: 0.15 },
      { freq: 880, dur: 0.25, gain: 0.1 },
    ]),
  victory: () =>
    playTones([
      { freq: 523, dur: 0.15 },
      { freq: 659, dur: 0.15 },
      { freq: 784, dur: 0.15 },
      { freq: 1046, dur: 0.35, gain: 0.12 },
    ]),
  chaos: () =>
    playTones([
      { freq: 200, dur: 0.15, type: "sawtooth", gain: 0.07 },
      { freq: 160, dur: 0.2, type: "square", gain: 0.06 },
      { freq: 90, dur: 0.4, type: "sawtooth", gain: 0.08 },
    ]),
  click: () => playTones([{ freq: 700, dur: 0.04, type: "square", gain: 0.04 }]),
  scent: () =>
    playTones([
      { freq: 600, dur: 0.2, type: "sine", gain: 0.05 },
      { freq: 900, dur: 0.3, type: "triangle", gain: 0.04 },
    ]),
};
