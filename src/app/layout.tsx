import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SettingsProvider } from "@/contexts/SettingsContext";
import SettingsDock from "@/components/SettingsDock";
import ConditionalLayout from "@/components/admin/ConditionalLayout";
import { UserProvider } from "@/providers/UserProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{
          backgroundColor: 'var(--bg-color, #000000)',
          color: 'var(--fg-color, #e5e7eb)',
        }}
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
