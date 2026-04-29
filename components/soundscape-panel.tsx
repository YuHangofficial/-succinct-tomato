"use client";

import { Headphones, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";
import type { AppLanguage, FocusSettings } from "@/lib/types";

type Preset = FocusSettings["ambientSound"];

function createNoiseBuffer(
  context: AudioContext,
  color: "white" | "brown"
) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);

  if (color === "brown") {
    let lastOut = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
  } else {
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  return buffer;
}

function buildAmbientGraph(context: AudioContext, preset: Preset, gainValue: number) {
  const masterGain = context.createGain();
  masterGain.gain.value = gainValue;
  masterGain.connect(context.destination);

  const source = context.createBufferSource();
  source.loop = true;

  if (preset === "brown") {
    source.buffer = createNoiseBuffer(context, "brown");
    source.connect(masterGain);
  } else {
    source.buffer = createNoiseBuffer(context, "white");
    const filter = context.createBiquadFilter();
    filter.type = preset === "rain" ? "highpass" : "lowpass";
    filter.frequency.value = preset === "rain" ? 1600 : 520;

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = preset === "rain" ? 0.2 : 0.08;
    lfoGain.gain.value = preset === "rain" ? 500 : 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(masterGain);
    lfo.start();

    return {
      source,
      masterGain,
      cleanup: () => {
        lfo.stop();
        lfo.disconnect();
        lfoGain.disconnect();
        filter.disconnect();
      }
    };
  }

  return {
    source,
    masterGain,
    cleanup: () => {}
  };
}

export function SoundscapePanel({
  settings,
  onUpdate,
  language
}: {
  settings: FocusSettings;
  onUpdate: (patch: Partial<FocusSettings>) => void;
  language: AppLanguage;
}) {
  const t = getMessages(language);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentRef = useRef<{
    source: AudioBufferSourceNode;
    masterGain: GainNode;
    cleanup: () => void;
  } | null>(null);

  useEffect(() => {
    if (!isPlaying || settings.ambientSound === "off") return;

    const current = currentRef.current;
    if (current) {
      current.masterGain.gain.value = settings.ambientVolume / 1000;
    }
  }, [isPlaying, settings.ambientVolume, settings.ambientSound]);

  useEffect(() => {
    return () => {
      const current = currentRef.current;
      if (current) {
        current.source.stop();
        current.source.disconnect();
        current.masterGain.disconnect();
        current.cleanup();
      }
      void audioContextRef.current?.close();
    };
  }, []);

  const stop = () => {
    const current = currentRef.current;
    if (!current) return;

    current.source.stop();
    current.source.disconnect();
    current.masterGain.disconnect();
    current.cleanup();
    currentRef.current = null;
    setIsPlaying(false);
  };

  const start = async () => {
    if (settings.ambientSound === "off") return;

    stop();
    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;
    await context.resume();

    const graph = buildAmbientGraph(context, settings.ambientSound, settings.ambientVolume / 1000);
    graph.source.start();
    currentRef.current = graph;
    setIsPlaying(true);
  };

  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t.soundscape}</p>
          <h2 className="mt-1 text-lg font-semibold">{t.ambientLayer}</h2>
        </div>
        <Button variant="subtle" size="icon" onClick={() => (isPlaying ? stop() : void start())}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <Button
          variant={settings.ambientSound === "off" ? "default" : "subtle"}
          className="justify-start"
          onClick={() => {
            onUpdate({ ambientSound: "off" });
            stop();
          }}
        >
          {t.off}
        </Button>
        {(["rain", "brown", "stream"] as const).map((preset) => (
          <Button
            key={preset}
            variant={settings.ambientSound === preset ? "default" : "subtle"}
            className="justify-start"
            onClick={() => onUpdate({ ambientSound: preset })}
          >
            <Headphones className="mr-2 h-4 w-4" />
            {t.presets[preset]}
          </Button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.volume}</span>
          <span>{settings.ambientVolume}%</span>
        </div>
        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={100}
            value={settings.ambientVolume}
            className="w-full accent-[hsl(var(--accent))]"
            onChange={(event) => onUpdate({ ambientVolume: Number(event.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
