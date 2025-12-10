"use client";

import { useState } from "react";
import { useJjjUser } from "@/providers/UserProvider";
import LoginPrompt from "@/components/LoginPrompt";
import { useToast } from "@/components/ToastProvider";
import { ImageSkeleton } from "@/components/LoadingSkeleton";

type GeneratedImage = {
  id: string;
  dataUrl: string;
  prompt: string;
  style?: string;
  createdAt: string;
};

const STYLE_PRESETS = [
  "Realistic",
  "Cinematic",
  "Anime",
  "3D render",
  "Digital art",
  "Logo / Branding",
];

export default function TextToImagePage() {
  const { user, loading: userLoading } = useJjjUser();
  
  // Show login prompt if user is not logged in
  if (!userLoading && (!user || !user.email)) {
    return <LoginPrompt title="Sign in to use Text-to-Image" message="Please sign in with your email to generate images from text." />;
  }

  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<"square" | "wide" | "tall">("square");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first.");
      setError("Please enter a prompt first.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size,
          style: selectedStyle || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate image.");
      }

      const data = await res.json();
      const base64 = data.imageBase64 as string;
      const dataUrl = `data:image/png;base64,${base64}`;

      const img: GeneratedImage = {
        id: Date.now().toString(),
        dataUrl,
        prompt,
        style: selectedStyle || undefined,
        createdAt: new Date().toLocaleTimeString(),
      };

      setImages((prev) => [img, ...prev]);
      toast.success("Image generated successfully!");
      setPrompt(""); // Clear prompt after success
    } catch (err: any) {
      console.error("Generate image error:", err);
      const errorMsg = err.message || "Something went wrong.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(img: GeneratedImage) {
    try {
      const a = document.createElement("a");
      a.href = img.dataUrl;
      a.download = `jjjai-image-${img.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (err) {
      toast.error("Failed to download image.");
    }
  }

  const mainImage = images[0];

  return (
    <main className="container-canvas max-w-mobile-canvas md:max-w-tablet-canvas lg:max-w-desktop-canvas mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] md:gap-6">
        {/* LEFT: Controls - Full width on mobile, fixed width on desktop */}
        <section className="w-full rounded-2xl border border-[#1a1a1a] bg-[#020617] p-6 flex flex-col gap-4 md:h-auto overflow-y-auto">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl text-white">Text to Image</h1>
            <p className="mt-1 text-sm text-slate-300 md:text-base">
              Type a prompt, pick a style and let JJJ AI create images for you.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs md:text-sm font-medium text-gray-300">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full max-w-full rounded-xl border border-[#262626] bg-[#020617] px-3 py-2 text-xs md:text-sm text-gray-100 outline-none ring-0 focus:border-sky-500"
              placeholder="Example: ultra realistic cyberpunk city at night with neon signs and rain reflections..."
            />
            <p className="mt-1 text-[10px] md:text-xs text-gray-500">
              Tip: Add lighting, mood and camera angle for more cinematic images.
            </p>
          </div>

          {/* Style presets */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium text-gray-300">
                Style presets
              </span>
              {selectedStyle && (
                <button
                  className="text-[10px] md:text-xs text-gray-400 hover:text-sky-400"
                  onClick={() => setSelectedStyle(null)}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STYLE_PRESETS.map((preset) => {
                const active = selectedStyle === preset;
                return (
                  <button
                    key={preset}
                    onClick={() =>
                      setSelectedStyle(
                        active ? null : preset
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-[11px] transition ${
                      active
                        ? "border-sky-500 bg-sky-500/10 text-sky-300"
                        : "border-[#262626] bg-[#020617] text-gray-300 hover:border-sky-500/70 hover:text-sky-200"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <span className="text-xs md:text-sm font-medium text-gray-300">Aspect ratio</span>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setSize("square")}
                className={`flex flex-1 flex-col items-center rounded-xl border px-2 py-2 text-[11px] ${
                  size === "square"
                    ? "border-sky-500 bg-sky-500/10 text-sky-200"
                    : "border-[#262626] bg-[#020617] text-gray-300 hover:border-sky-500/60"
                }`}
              >
                <div className="mb-1 h-8 w-8 rounded-md border border-gray-600" />
                Square
              </button>
              <button
                onClick={() => setSize("wide")}
                className={`flex flex-1 flex-col items-center rounded-xl border px-2 py-2 text-[11px] ${
                  size === "wide"
                    ? "border-sky-500 bg-sky-500/10 text-sky-200"
                    : "border-[#262626] bg-[#020617] text-gray-300 hover:border-sky-500/60"
                }`}
              >
                <div className="mb-1 h-6 w-10 rounded-md border border-gray-600" />
                Wide
              </button>
              <button
                onClick={() => setSize("tall")}
                className={`flex flex-1 flex-col items-center rounded-xl border px-2 py-2 text-[11px] ${
                  size === "tall"
                    ? "border-sky-500 bg-sky-500/10 text-sky-200"
                    : "border-[#262626] bg-[#020617] text-gray-300 hover:border-sky-500/60"
                }`}
              >
                <div className="mb-1 h-10 w-6 rounded-md border border-gray-600" />
                Tall
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 md:mt-auto flex items-center justify-center rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-black hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#020617] transition-all"
            aria-label={loading ? "Generating image, please wait" : "Generate image"}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <div className="h-3 w-3 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                Generating…
              </>
            ) : (
              "Generate image"
            )}
          </button>
        </section>

        {/* RIGHT: Preview + history - Full width on mobile, below controls */}
        <section className="w-full rounded-2xl border border-[#1a1a1a] bg-[#020617] p-4 sm:p-5 md:p-6 flex flex-col gap-4 overflow-y-auto pb-20 md:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Canvas
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                Latest image on top. Click download to save and share.
              </p>
            </div>
          </div>

          {/* Main preview */}
          <div className="flex flex-col md:flex-row flex-1 gap-4 overflow-hidden">
            <div className="flex-1 rounded-2xl border border-[#1f2933] bg-black/60 p-3 min-h-[300px] md:min-h-0">
              {mainImage ? (
                <div className="flex h-full flex-col">
                  <div className="relative flex-1 overflow-hidden rounded-xl bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainImage.dataUrl}
                      alt={mainImage.prompt}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex-1 text-[11px] text-gray-400">
                      <div className="line-clamp-2 text-gray-200">
                        {mainImage.prompt}
                      </div>
                      {mainImage.style && (
                        <div className="mt-1 text-[10px] text-sky-300">
                          Style: {mainImage.style}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDownload(mainImage)}
                      className="rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-200 hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black transition-all"
                      aria-label={`Download image: ${mainImage.prompt}`}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-500">
                  No image yet. Enter a prompt and generate your first JJJ AI image.
                </div>
              )}
            </div>

            {/* History thumbnails - Full width on mobile, fixed width on desktop */}
            <div className="w-full md:w-52 space-y-2 overflow-y-auto rounded-2xl border border-[#1f2933] bg-black/60 p-3 text-[11px] max-h-[200px] md:max-h-none">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-gray-200">
                  History
                </span>
                <span className="text-[10px] text-gray-500">
                  {images.length} images
                </span>
              </div>
              {images.length === 0 && (
                <p className="text-[11px] text-gray-500">
                  Generated images will appear here.
                </p>
              )}
              {images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() =>
                    setImages((prev) => {
                      const idx = prev.findIndex((p) => p.id === img.id);
                      if (idx <= 0) return prev;
                      const copy = [...prev];
                      const [item] = copy.splice(idx, 1);
                      copy.unshift(item);
                      return copy;
                    })
                  }
                  className="flex w-full gap-2 rounded-lg border border-transparent bg-[#020617] p-1.5 text-left hover:border-sky-500/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt={img.prompt}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="line-clamp-2 text-[10px] text-gray-200">
                      {img.prompt}
                    </div>
                    <div className="mt-0.5 text-[9px] text-gray-500">
                      {img.createdAt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

