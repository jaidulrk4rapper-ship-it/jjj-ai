import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SettingsProvider } from "@/contexts/SettingsContext";
import SettingsDock from "@/components/SettingsDock";
import ConditionalLayout from "@/components/admin/ConditionalLayout";
import { UserProvider } from "@/providers/UserProvider";

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
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
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
      >
        <UserProvider>
          <SettingsProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
            <SettingsDock />
          </SettingsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
