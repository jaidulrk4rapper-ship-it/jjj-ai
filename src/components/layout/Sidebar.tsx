'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MessageCircle,
  Waves,
  Mic,
  Image as ImageIcon,
  Home,
  Crown,
} from 'lucide-react';

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
    <div className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col border-r border-zinc-200 bg-zinc-50/90 backdrop-blur-xl dark:bg-[#050505]/90 dark:border-[#1A1A1A]">
      <div className="flex flex-col gap-6 p-4">
        {/* Top brand */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-clip-text text-transparent">
              JJJ AI
            </span>
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          </div>
          <span className="text-[10px] uppercase text-gray-600 dark:text-gray-400">Studio</span>
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
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                    active
                      ? 'bg-zinc-100 text-zinc-900 border border-zinc-300 shadow-[0_0_0_1px_rgba(56,189,248,0.4)] dark:bg-[#111111] dark:text-white dark:border-[#1A1A1A]'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:translate-x-[2px] dark:text-gray-400 dark:hover:bg-[#111111] dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      active
                        ? 'text-sky-500 dark:text-sky-400'
                        : 'text-gray-500 group-hover:text-sky-500 dark:group-hover:text-sky-400'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
                {usageLabel && (
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
        {usageData?.plan === 'free' && (
          <div className="mt-auto mb-2 rounded-lg border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-sky-500" />
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">Upgrade to Pro</span>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">
              Get unlimited access to all features
            </p>
            <Link
              href="/upgrade"
              className="block w-full text-center rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs py-1.5 px-2 transition-colors"
            >
              ₹399/month
            </Link>
          </div>
        )}

        {/* Bottom user section */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-xs text-gray-600 flex items-center gap-2 dark:border-[#1A1A1A] dark:bg-[#050505]/80 dark:text-gray-400">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[11px] font-medium text-gray-700 dark:bg-[#111111] dark:text-gray-200">
            S
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500 dark:text-gray-500">Signed in</span>
              {usageData?.plan === 'pro' && (
                <Crown className="h-3 w-3 text-sky-500" />
              )}
            </div>
            <div className="text-[11px] text-gray-700 truncate dark:text-gray-300">sera@dock.ai</div>
            {usageData?.plan === 'pro' && usageData.renewalDate && (
              <div className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                Renews {new Date(usageData.renewalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

