'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  MessageCircle,
  Waves,
  Mic,
  Image as ImageIcon,
  Home,
  Crown,
  X,
  Menu,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface UsageData {
  plan: 'free' | 'pro';
  usage: {
    chat: { used: number; limit: number; period: string };
    tts: { used: number; limit: number; period: string; unit?: string };
    image: { used: number; limit: number; period: string };
  };
  renewalDate?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { settings, setSettings } = useSettings();
  const isCollapsed = settings.sidebarCollapsed;

  const toggleSidebar = () => {
    setSettings((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  };
  const [usageData, setUsageData] = useState<UsageData | null>(null);

  useEffect(() => {
    // Fetch usage data
    fetch('/api/usage')
      .then((res) => {
        if (!res.ok) {
          // If API fails, just use default data
          return { plan: 'free', usage: { chat: { used: 0, limit: 30, period: 'day' }, tts: { used: 0, limit: 5, period: 'day' }, image: { used: 0, limit: 5, period: 'day' } } };
        }
        return res.json();
      })
      .then((data) => {
        if (!data.error) {
          setUsageData(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching usage:', err);
        // Set default data on error
        setUsageData({
          plan: 'free',
          usage: {
            chat: { used: 0, limit: 30, period: 'day' },
            tts: { used: 0, limit: 5, period: 'day' },
            image: { used: 0, limit: 5, period: 'day' },
          },
        });
      });
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '/', icon: Home, showUsage: false },
    { id: 'ai-chat', label: 'AI Chat', href: '/ai/chat', icon: MessageCircle, showUsage: true, usageKey: 'chat' as const },
    { id: 'text-to-speech', label: 'Text to Speech', href: '/ai/text-to-speech', icon: Waves, showUsage: true, usageKey: 'tts' as const },
    { id: 'speech-to-text', label: 'Speech to Text', href: '/ai/speech-to-text', icon: Mic, showUsage: false },
    { id: 'text-to-image', label: 'Text to Image', href: '/ai/text-to-image', icon: ImageIcon, showUsage: true, usageKey: 'image' as const },
  ];

  const isActive = (href: string) => pathname === href;

  const getUsageLabel = (item: typeof navItems[0]) => {
    if (!item.showUsage || !item.usageKey || !usageData) return null;
    
    const usage = usageData.usage[item.usageKey];
    const period = usage.period === 'day' ? 'day' : 'month';
    const unit = 'unit' in usage && usage.unit ? usage.unit : '';
    
    if (usageData.plan === 'free') {
      return `Free: ${usage.used}/${usage.limit}${unit ? ` ${unit}` : ''}/${period}`;
    } else {
      return `Pro: ${usage.used}/${usage.limit}${unit ? ` ${unit}` : ''}/${period}`;
    }
  };


  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}
      
      <div 
        className={`fixed left-0 top-0 z-30 flex h-screen flex-col bg-zinc-50/90 backdrop-blur-xl dark:bg-[#050505]/90 w-64 sm:w-60 transition-transform duration-300 ease-out will-change-transform ${
          isCollapsed 
            ? "-translate-x-full md:translate-x-0" 
            : "translate-x-0"
        } ${isCollapsed ? "md:w-0 md:overflow-hidden md:border-r-0" : "border-r border-zinc-200 dark:border-[#1A1A1A]"}`}
      >
        <div 
          className={`flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 transition-opacity duration-200 ease-in-out ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
          }`}
        >
          {/* Top brand with toggle button */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-clip-text text-transparent">
                JJJ AI
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
            </div>
            {/* Toggle button at top */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#111111] transition-colors text-gray-600 dark:text-gray-400"
              aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
            >
              <X className="h-5 w-5" />
            </button>
            <span className="text-[10px] uppercase text-gray-600 dark:text-gray-400 hidden sm:inline md:block">Studio</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const usageLabel = getUsageLabel(item);
              return (
                <div key={item.id} className="space-y-0.5">
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close sidebar on mobile when clicking a link
                      if (window.innerWidth < 768) {
                        toggleSidebar();
                      }
                    }}
                    className={`group flex items-center gap-2 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-150 ${
                      active
                        ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 shadow-[0_0_0_1px_rgba(56,189,248,0.4)] dark:bg-[#111111] dark:text-white dark:border-[#1A1A1A]'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:translate-x-[2px] dark:text-gray-400 dark:hover:bg-[#111111] dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors flex-shrink-0 ${
                        active
                          ? 'text-sky-500 dark:text-sky-400'
                          : 'text-gray-500 group-hover:text-sky-500 dark:group-hover:text-sky-400'
                      }`}
                    />
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </Link>
                  {usageLabel && !isCollapsed && (
                    <div className="px-3">
                      <span className="text-[10px] text-gray-500 dark:text-gray-500">
                        {usageLabel}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Upgrade to Pro CTA */}
          {usageData?.plan === 'free' && !isCollapsed && (
            <div className="mt-auto mb-2 rounded-lg border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-2.5 sm:p-3">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-500" />
                <span className="text-[10px] sm:text-xs font-semibold text-sky-600 dark:text-sky-400">Upgrade to Pro</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2">
                Get unlimited access to all features
              </p>
              <Link
                href="/upgrade"
                className="block w-full text-center rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[10px] sm:text-xs py-1.5 px-2 transition-colors"
              >
                ₹699/month
              </Link>
            </div>
          )}
          {usageData?.plan === 'free' && isCollapsed && (
            <div className="mt-auto mb-2 flex justify-center">
              <Link
                href="/upgrade"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10 hover:bg-sky-500/20 transition-colors"
                title="Upgrade to Pro"
              >
                <Crown className="h-4 w-4 text-sky-500" />
              </Link>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

