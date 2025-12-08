"use client";

import { useState, useRef } from "react";
import { useJjjUser } from "@/providers/UserProvider";
import LoginPrompt from "@/components/LoginPrompt";

type Status = "idle" | "uploading" | "transcribing";

export default function SpeechToTextPage() {
  const { user, loading: userLoading } = useJjjUser();
  
  // Show login prompt if user is not logged in
  if (!userLoading && (!user || !user.email)) {
    return <LoginPrompt title="Sign in to use Speech-to-Text" message="Please sign in with your email to transcribe audio files." />;
  }

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [lang, setLang] = useState("auto");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setTranscript("");
    setFileName(file.name);
    setStatus("uploading");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      setStatus("transcribing");

      const res = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: file.type || "audio/webm",
          languageCode: lang === "auto" ? undefined : lang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to transcribe.");
      }

      const data = await res.json();
      setTranscript(data.transcript || "");
      setStatus("idle");

      // playback ke liye local URL
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
    } catch (err: any) {
      console.error("STT error:", err);
      setError(err.message || "Something went wrong.");
      setStatus("idle");
    }
  }

  const busy = status !== "idle";

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-black text-gray-100">
      <div className="flex flex-1 gap-6 px-6 pb-6 pt-4">
        {/* LEFT: Controls */}
        <section className="flex w-[380px] flex-col gap-4 rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4">
          <div>
            <h1 className="text-lg font-semibold text-white">Speech to Text</h1>
            <p className="mt-1 text-xs text-gray-400">
              Upload a voice note, reel audio, podcast clip or any speech file
              — JJJ AI will convert it into clean text.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Upload audio file
            </label>
            <input
              type="file"
              accept="audio/*,video/mp4,video/mpeg"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-[#262626] bg-[#020617] px-3 py-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-1 file:text-xs file:font-medium file:text-white hover:file:bg-sky-500"
            />
            <p className="text-[11px] text-gray-500">
              Supported: most audio formats (mp3, m4a, wav, webm) and video
              files with speech.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300">
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#262626] bg-[#020617] px-3 py-2 text-xs text-gray-100"
            >
              <option value="auto">Auto detect</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bangla</option>
            </select>
          </div>

          {fileName && (
            <p className="truncate text-[11px] text-gray-400">
              Selected: <span className="text-gray-200">{fileName}</span>
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </p>
          )}

          <div className="mt-auto text-[11px] text-gray-500">
            Tip: For best results, use clear speech with minimal background
            noise.
          </div>
        </section>

        {/* RIGHT: Transcript + player */}
        <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-[#1a1a1a] bg-[#020617] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Transcript</h2>
              <p className="text-[11px] text-gray-400">
                {busy
                  ? "Transcribing audio with JJJ AI…"
                  : "Edit, copy or export this text."}
              </p>
            </div>
            {transcript && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(transcript);
                }}
                className="rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-200 hover:bg-sky-500/20"
              >
                Copy text
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-[#1f2933] bg-black/60 p-3">
            {busy ? (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                {status === "uploading"
                  ? "Uploading audio…"
                  : "Transcribing with Gemini…"}
              </div>
            ) : transcript ? (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="h-full w-full resize-none rounded-xl border-none bg-transparent text-sm text-gray-100 outline-none"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                Upload an audio file to see the transcript here.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#1f2933] bg-black/70 px-3 py-2">
            <div className="text-[11px] text-gray-400">
              <div className="text-gray-200">Preview audio</div>
              <div className="text-[10px]">
                Listen to the original file while reading the transcript.
              </div>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-64 text-xs [&>::-webkit-media-controls-panel]:bg-black"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
