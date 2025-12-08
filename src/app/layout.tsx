import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SettingsProvider } from "@/components/settings-provider";
import SettingsDock from "@/components/SettingsDock";
import ConditionalLayout from "@/components/admin/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JJJ AI",
  description: "Next-generation AI tools for text, voice & creativity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-gray-200`}
      >
        <SettingsProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <SettingsDock />
        </SettingsProvider>
      </body>
    </html>
  );
}
