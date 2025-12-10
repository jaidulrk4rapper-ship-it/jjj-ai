import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SettingsProvider } from "@/contexts/SettingsContext";
import SettingsDock from "@/components/SettingsDock";
import ConditionalLayout from "@/components/admin/ConditionalLayout";
import { UserProvider } from "@/providers/UserProvider";
import { ToastProvider } from "@/components/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { StructuredData } from "@/components/StructuredData";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JJJ AI – Smart AI Tools for Text, Image, Voice, Coding & Productivity",
  description: "JJJ AI – Your all-in-one Artificial Intelligence platform for text generation, image creation, voice transcription, coding assistance, video tools, and more. Fast, simple and powerful AI tools to boost your productivity. Try JJJ AI free today.",
  keywords: ["AI tools", "text to speech", "speech to text", "AI chat", "text to image", "AI productivity", "Gemini AI", "OpenAI"],
  authors: [{ name: "JJJ AI" }],
  creator: "JJJ AI",
  publisher: "JJJ AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jjjai.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "JJJ AI",
    title: "JJJ AI – Smart AI Tools for Text, Image, Voice & Productivity",
    description: "Your all-in-one AI platform for chat, voice, images, and more. Fast, simple, powerful.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JJJ AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JJJ AI – Smart AI Tools",
    description: "Your all-in-one AI platform for chat, voice, images, and more.",
    images: ["/logo.png"],
    creator: "@jjjai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JJJ AI",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <StructuredData />
        <KeyboardShortcuts />
        <ErrorBoundary>
          <ToastProvider>
            <UserProvider>
              <SettingsProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
                <SettingsDock />
              </SettingsProvider>
            </UserProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
