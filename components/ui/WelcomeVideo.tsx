"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { withBase } from "@/lib/format";

/*
 * The walkthrough of a prospect's demo, in a phone frame. Its captions (a .vtt file) show under the
 * phone rather than on it, so nothing on their site is covered. Starts on a tap, with no sound.
 */
export function WelcomeVideo({ src, poster, captions, label }: { src: string; poster: string; captions: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [line, setLine] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    const track = v?.textTracks[0];
    if (!v || !track) return;
    track.mode = "hidden"; // read the cues ourselves, show them under the phone
    const onCue = () => setLine((track.activeCues?.[0] as VTTCue | undefined)?.text ?? "");
    track.addEventListener("cuechange", onCue);
    return () => track.removeEventListener("cuechange", onCue);
  }, []);

  const play = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };

  return (
    <figure className="mx-auto grid w-full max-w-[340px] justify-items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-[44px] border-[10px] border-ink bg-ink shadow-2xl">
        <video
          ref={video}
          className="block aspect-[392/658] w-full bg-white"
          src={withBase(src)}
          poster={withBase(poster)}
          muted
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
          aria-label={label}
        >
          <track kind="captions" src={withBase(captions)} srcLang="en" label="English" default />
        </video>
        {!playing && (
          <button
            type="button"
            onClick={play}
            className="absolute inset-0 grid place-items-center bg-ink/25 text-white"
            aria-label={`Play: ${label}`}
          >
            <span className="grid size-20 place-items-center rounded-full bg-ink/80 shadow-xl">
              <Play size={34} className="translate-x-0.5" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="min-h-[3.2rem] text-center text-lg font-semibold leading-snug text-ink" aria-live="polite">
        {playing ? line : "A 30-second look, on a phone"}
      </figcaption>
    </figure>
  );
}
