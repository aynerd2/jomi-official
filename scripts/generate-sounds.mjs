// Synthesises the Shepherd widget's UI sounds into public/sounds/.
// Generated rather than downloaded, so there is no licence to track.
// Run: node scripts/generate-sounds.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 22050;

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) =>
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2),
  );
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// A soft two-note "ding": a short attack, then an exponential fade.
function chime() {
  const duration = 0.32;
  const out = [];
  for (let i = 0; i < RATE * duration; i++) {
    const t = i / RATE;
    const attack = Math.min(t / 0.006, 1);
    const note = (start, freq, decay) => {
      if (t < start) return 0;
      const u = t - start;
      const env = Math.exp(-u / decay);
      // Fundamental plus a quiet octave for a little shimmer.
      return env * (Math.sin(2 * Math.PI * freq * u) + 0.25 * Math.sin(4 * Math.PI * freq * u));
    };
    const s = note(0, 784, 0.07) * 0.55 + note(0.07, 1046.5, 0.09) * 0.5; // G5 -> C6
    out.push(s * attack * 0.6);
  }
  return out;
}

mkdirSync("public/sounds", { recursive: true });
writeFileSync("public/sounds/message-received.wav", wav(chime()));
console.log("wrote public/sounds/message-received.wav");
