import React, { useEffect, useMemo, useRef, useState } from "react";

// dB utilities
const dbToGain = (db: number) => Math.pow(10, db / 20);

export default function DbABPlayer() {
  const [dbA, setDbA] = useState(53);
  const [dbB, setDbB] = useState(60);
  const [active, setActive] = useState<"A" | "B">("A");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Create (or recreate) the noise source
  const createNoiseSource = () => {
    const audioCtx = audioCtxRef.current!;
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    // White noise
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  };

  // Compute relative gains so the louder value is 1.0 (prevents clipping)
  const { gainA, gainB } = useMemo(() => {
    const maxDb = Math.max(dbA, dbB);
    const ref = dbToGain(maxDb) || 1;
    return { gainA: dbToGain(dbA) / ref, gainB: dbToGain(dbB) / ref };
  }, [dbA, dbB]);

  // Keep gain updated when switching A/B or changing values
  useEffect(() => {
    if (!gainRef.current) return;
    const target = active === "A" ? gainA : gainB;
    // Smooth transition
    try {
      const g = gainRef.current.gain;
      const now = audioCtxRef.current?.currentTime ?? 0;
      g.cancelScheduledValues(now);
      g.setTargetAtTime(target, now, 0.02);
    } catch {}
  }, [active, gainA, gainB]);

  const start = async () => {
    if (isPlaying) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === "suspended") await audioCtx.resume();

    const gain = audioCtx.createGain();
    gain.gain.value = active === "A" ? gainA : gainB;
    gainRef.current = gain;

    const src = createNoiseSource();
    sourceRef.current = src;

    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
    setIsPlaying(true);
  };

  const stop = () => {
    try {
      sourceRef.current?.stop();
    } catch {}
    sourceRef.current?.disconnect();
    gainRef.current?.disconnect();
    sourceRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  };

  const delta = Math.abs(dbA - dbB);
  const ratio = Math.pow(10, delta / 20);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl grid gap-6">
        <h1 className="text-2xl font-semibold">Comparador de Ruído (dB) – A/B</h1>
        <p className="text-neutral-400 text-sm">Digite dois valores de dB, aperte Play e alterne entre A e B para <span className="font-medium text-neutral-200">ouvir</span> a diferença. É um comparativo relativo (o mais alto fica como referência).</p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card label="A (dB)" value={dbA} setValue={setDbA} />
          <Card label="B (dB)" value={dbB} setValue={setDbB} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setActive("A")} className={`px-4 py-2 rounded-2xl border ${active === "A" ? "bg-white text-black" : "border-neutral-700"}`}>A</button>
          <button onClick={() => setActive("B")} className={`px-4 py-2 rounded-2xl border ${active === "B" ? "bg-white text-black" : "border-neutral-700"}`}>B</button>
          <div className="ml-auto flex items-center gap-3">
            {!isPlaying ? (
              <button onClick={start} className="px-4 py-2 rounded-2xl bg-emerald-500 text-black font-medium">Play</button>
            ) : (
              <button onClick={stop} className="px-4 py-2 rounded-2xl bg-rose-500 text-black font-medium">Stop</button>
            )}
          </div>
        </div>

        <div className="text-sm text-neutral-400">
          <span>Δ {delta.toFixed(1)} dB</span>
          <span className="mx-2">•</span>
          <span>{ratio.toFixed(2)}×</span>
          <span className="mx-2">•</span>
          <span>Ganho A: {gainA.toFixed(3)}</span>
          <span className="mx-2">•</span>
          <span>Ganho B: {gainB.toFixed(3)}</span>
        </div>

        <p className="text-xs text-neutral-500">Dica: para simular 53 dB → 60 dB, coloque A=53 e B=60 e alterne os botões A/B enquanto toca.</p>
      </div>
    </div>
  );
}

function Card({ label, value, setValue }: { label: string; value: number; setValue: (v: number) => void }) {
  return (
    <div className="rounded-2xl p-4 border border-neutral-800 bg-neutral-900">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-400">{label}</span>
        <input
          type="number"
          step={0.1}
          min={20}
          max={90}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-28 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1 text-right"
        />
      </div>
      <input
        type="range"
        min={20}
        max={90}
        step={0.1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
