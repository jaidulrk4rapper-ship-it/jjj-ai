"use client";

import { useState, useRef, useEffect } from "react";
import { useJjjUser } from "@/providers/UserProvider";
import LoginPrompt from "@/components/LoginPrompt";
import { Mic, MicOff, Upload, Square, Play, Pause } from "lucide-react";

type Status = "idle" | "uploading" | "transcribing" | "recording";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldContinueRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Initialize Web Speech API with advanced settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        
        // Advanced settings for faster, more responsive transcription
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1; // Faster processing with single alternative
        recognition.lang = lang === "auto" ? "en-US" : lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-BD" : "en-US";
        
        // Use faster service if available
        if ((recognition as any).serviceURI) {
          // Some browsers support custom service URI for faster processing
        }

        let lastFinalIndex = 0;

        recognition.onresult = (event: any) => {
          let interim = "";
          let final = "";
          let hasNewFinal = false;

          // Process only new results for better performance
          for (let i = Math.max(event.resultIndex, lastFinalIndex); i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
              final += transcript;
              hasNewFinal = true;
              lastFinalIndex = i + 1;
            } else {
              // Show interim results immediately for faster feedback
              interim += transcript;
            }
          }

          // Update interim results immediately for real-time feel
          if (interim) {
            setInterimTranscript(interim);
          }

          // Update final transcript immediately when available
          if (hasNewFinal && final) {
            const trimmedFinal = final.trim();
            if (trimmedFinal) {
              // Add space if needed
              setLiveTranscript((prev) => {
                const newText = prev + (prev && !prev.endsWith(" ") ? " " : "") + trimmedFinal + " ";
                setTranscript(newText);
                
                // Auto-scroll to bottom for better UX
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                  }
                }, 0);
                
                return newText;
              });
              // Clear interim after final is added
              setInterimTranscript("");
            }
          }
          
          // Auto-scroll for interim results too
          if (interim && textareaRef.current) {
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
              }
            }, 0);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            // Ignore no-speech errors, they're common during pauses
            return;
          }
          if (event.error === "aborted") {
            // Ignore aborted errors when stopping manually
            return;
          }
          if (event.error === "network") {
            setError("Network error. Please check your connection.");
            setIsLiveTranscribing(false);
            shouldContinueRef.current = false;
            return;
          }
          setError(`Speech recognition error: ${event.error}`);
          setIsLiveTranscribing(false);
          shouldContinueRef.current = false;
        };

        recognition.onstart = () => {
          lastFinalIndex = 0;
          setError(null);
        };

        recognition.onend = () => {
          // Restart if still supposed to be transcribing
          if (shouldContinueRef.current) {
            // Minimal delay for faster restart
            setTimeout(() => {
              if (shouldContinueRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e: any) {
                  // Ignore errors if already started or stopped
                  if (e.name !== "InvalidStateError") {
                    console.log("Recognition restart:", e);
                  }
                }
              }
            }, 50); // Reduced from 100ms to 50ms for faster restart
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  // Update recognition language when lang changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === "auto" ? "en-US" : lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-BD" : "en-US";
    }
  }, [lang]);

  function startLiveTranscription() {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    try {
      setError(null);
      setTranscript("");
      setLiveTranscript("");
      setInterimTranscript("");
      setFileName(null);
      setRecordingTime(0);
      
      // Reset recognition state
      if (recognitionRef.current) {
        recognitionRef.current.abort(); // Stop any existing recognition
      }
      
      shouldContinueRef.current = true;
      
      // Start recognition with optimized settings
      recognitionRef.current.start();
      setIsLiveTranscribing(true);
      setStatus("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Live transcription error:", err);
      if (err.name === "InvalidStateError") {
        // Already started, just continue
        setIsLiveTranscribing(true);
        setStatus("recording");
      } else {
        setError(err.message || "Failed to start live transcription. Please allow microphone access.");
        setIsLiveTranscribing(false);
        setStatus("idle");
        shouldContinueRef.current = false;
      }
    }
  }

  function stopLiveTranscription() {
    shouldContinueRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsLiveTranscribing(false);
    setStatus("idle");
    
    // Save final transcript
    if (liveTranscript || interimTranscript) {
      setTranscript((prev) => prev + liveTranscript + interimTranscript);
    }
    setInterimTranscript("");
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    try {
      setError(null);
      setTranscript("");
      setLiveTranscript("");
      setInterimTranscript("");
      setFileName(null);
      chunksRef.current = [];
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        
        // Create audio URL for playback
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
        }

        // Transcribe the recorded audio
        await transcribeAudio(blob, "audio/webm");
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Recording error:", err);
      setError(err.message || "Failed to start recording. Please allow microphone access.");
      setIsRecording(false);
      setStatus("idle");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus("idle");
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function transcribeAudio(blob: Blob, mimeType: string) {
    setStatus("transcribing");
    setError(null);

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const res = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: mimeType,
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
    } catch (err: any) {
      console.error("STT error:", err);
      setError(err.message || "Something went wrong.");
      setStatus("idle");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setTranscript("");
    setFileName(file.name);
    setStatus("uploading");

    try {
      const blob = new Blob([file], { type: file.type || "audio/webm" });
      await transcribeAudio(blob, file.type || "audio/webm");

      // playback ke liye local URL
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      setAudioBlob(blob);
    } catch (err: any) {
      console.error("STT error:", err);
      setError(err.message || "Something went wrong.");
      setStatus("idle");
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const busy = status === "transcribing" || status === "uploading";

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-black text-gray-100">
      <div className="flex flex-1 gap-6 px-6 pb-6 pt-4">
        {/* LEFT: Controls */}
        <section className="flex w-[380px] flex-col gap-4 rounded-2xl border border-[#1a1a1a] bg-[#050505] p-4">
          <div>
            <h1 className="text-lg font-semibold text-white">Speech to Text</h1>
            <p className="mt-1 text-xs text-gray-400">
              Record live speech or upload audio files — JJJ AI will convert it into clean text.
            </p>
          </div>

          {/* Live Transcription Button */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-300">
              Live transcription
            </label>
            <div className="flex items-center gap-3">
              {!isLiveTranscribing ? (
                <button
                  onClick={startLiveTranscription}
                  disabled={status === "transcribing" || status === "uploading" || isRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-sky-500/10 px-4 py-3 text-sm font-medium text-sky-200 hover:bg-sky-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="h-5 w-5" />
                  <span>Start Live Typing</span>
                </button>
              ) : (
                <button
                  onClick={stopLiveTranscription}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 hover:bg-red-500/20 transition-colors"
                >
                  <Square className="h-5 w-5 fill-red-500" />
                  <span>Stop ({formatTime(recordingTime)})</span>
                </button>
              )}
            </div>
            {isLiveTranscribing && (
              <div className="flex items-center gap-2 rounded-lg bg-sky-500/10 border border-sky-500/30 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-xs text-sky-200">Listening... Speak now</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-2 text-gray-500">OR</span>
            </div>
          </div>

          {/* Record Audio Button */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-300">
              Record audio file
            </label>
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={status === "transcribing" || status === "uploading" || isLiveTranscribing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="h-5 w-5" />
                  <span>Record Audio</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 hover:bg-red-500/20 transition-colors"
                >
                  <Square className="h-5 w-5 fill-red-500" />
                  <span>Stop ({formatTime(recordingTime)})</span>
                </button>
              )}
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-200">Recording audio file...</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-2 text-gray-500">OR</span>
            </div>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Upload audio file
            </label>
            <label 
              htmlFor="audio-upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#020617] px-3 py-3 text-xs font-medium text-gray-300 hover:bg-[#0a0a0a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4" />
              <span>Choose file</span>
            </label>
            <input
              type="file"
              accept="audio/*,video/mp4,video/mpeg"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
              disabled={status === "transcribing" || status === "uploading" || isRecording}
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
                {isLiveTranscribing
                  ? "Live transcription in progress…"
                  : status === "recording"
                  ? "Recording in progress…"
                  : busy
                  ? "Transcribing audio with JJJ AI…"
                  : "Edit, copy or export this text."}
              </p>
            </div>
            {(transcript || liveTranscript || interimTranscript) && (
              <button
                onClick={() => {
                  const textToCopy = transcript || (liveTranscript + interimTranscript);
                  navigator.clipboard.writeText(textToCopy);
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
            ) : transcript || liveTranscript || interimTranscript ? (
              <div className="relative h-full w-full overflow-hidden rounded-xl border-none bg-transparent">
                <textarea
                  ref={textareaRef}
                  value={transcript || (liveTranscript + interimTranscript)}
                  onChange={(e) => {
                    if (isLiveTranscribing) {
                      setLiveTranscript(e.target.value);
                    } else {
                      setTranscript(e.target.value);
                    }
                  }}
                  className="h-full w-full resize-none rounded-xl border-none bg-transparent p-3 text-sm text-gray-100 outline-none leading-relaxed"
                  placeholder={isLiveTranscribing ? "Start speaking... text will appear here in real-time" : ""}
                  style={{
                    scrollBehavior: "smooth",
                  }}
                />
                {isLiveTranscribing && interimTranscript && (
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-sky-400/80 italic pointer-events-none">
                    <span className="bg-slate-900/95 backdrop-blur-sm px-2 py-1 rounded border border-sky-500/30">
                      {interimTranscript}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                Record speech or upload an audio file to see the transcript here.
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
