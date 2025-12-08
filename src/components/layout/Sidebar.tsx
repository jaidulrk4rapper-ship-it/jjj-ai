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
  LogOut,
  Settings,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useJjjUser } from '@/providers/UserProvider';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, loading: userLoading, signInWithEmail, logout, deleteAccount } = useJjjUser();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setSignInError('Please enter a valid email address');
      return;
    }

    setSignInLoading(true);
    try {
      await signInWithEmail(emailInput.trim());
      setShowSignInModal(false);
      setEmailInput('');
    } catch (error: any) {
      setSignInError(error?.message || 'Failed to sign in. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'G';
    return email.charAt(0).toUpperCase();
  };

  const truncateEmail = (email: string | null | undefined, maxLength: number = 20) => {
    if (!email) return '';
    if (email.length <= maxLength) return email;
    return email.substring(0, maxLength - 3) + '...';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error: any) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deleteAccount();
      setShowDeleteConfirm(false);
      setShowUserMenu(false);
    } catch (error: any) {
      console.error('Delete account error:', error);
      alert(error?.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
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
                ₹699/month
              </Link>
            </div>
          )}

          {/* Bottom user section - ChatGPT style */}
          <div className="mt-auto border-t border-[#1A1A1A] pt-2">
            {userLoading ? (
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="h-8 w-8 rounded-full bg-[#111111] animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-20 bg-[#111111] rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-[#111111] rounded animate-pulse" />
                </div>
              </div>
            ) : user?.email ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Profile Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center gap-3 px-2 py-2 hover:bg-[#111111] rounded-lg transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-semibold text-white shadow-lg">
                    {getInitials(user.email)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium text-white truncate">
                      {user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {user.email}
                    </div>
                  </div>
                  {showUserMenu ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-300" />
                  )}
                </button>
                
                {/* User Menu Dropdown - ChatGPT style */}
                {showUserMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111111] border border-[#1A1A1A] rounded-lg shadow-xl overflow-hidden z-50">
                    {/* Upgrade Plan (if free) */}
                    {usageData?.plan === 'free' && (
                      <>
                        <button
                          onClick={() => {
                            router.push('/upgrade');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#050505] transition-colors border-b border-[#1A1A1A]"
                        >
                          <Crown className="h-4 w-4 text-amber-400" />
                          <span>Upgrade plan</span>
                        </button>
                      </>
                    )}
                    
                    {/* Settings */}
                    <button
                      onClick={() => {
                        router.push('/account');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#050505] transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    
                    {/* Help */}
                    <button
                      onClick={() => {
                        window.open('https://help.openai.com', '_blank');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#050505] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span>Help</span>
                      </div>
                      <span className="text-gray-500">→</span>
                    </button>
                    
                    {/* Divider */}
                    <div className="border-t border-[#1A1A1A]" />
                    
                    {/* Log out */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#050505] transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                    
                    {/* Delete Account */}
                    <div className="border-t border-[#1A1A1A]" />
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-2 py-2 space-y-2">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm py-2.5 px-3 transition-colors font-medium"
                >
                  Sign in
                </button>
                <p className="text-xs text-center text-gray-500">
                  Sign in to access all features
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sign in with email
              </h2>
              <button
                onClick={() => {
                  setShowSignInModal(false);
                  setEmailInput('');
                  setSignInError(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setSignInError(null);
                  }}
                  placeholder="you@example.com"
                  className="w-full rounded-md bg-white dark:bg-[#050505] border border-gray-300 dark:border-[#1A1A1A] px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
                {signInError && (
                  <p className="mt-1 text-xs text-red-500">{signInError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm py-2 px-4 transition-colors"
              >
                {signInLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#1A1A1A] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Account
              </h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteLoading(false);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={deleteLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone. All your data, including:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                <li>Your account information</li>
                <li>Usage history</li>
                <li>Generated content</li>
                <li>Subscription data</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                All of this will be permanently deleted.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteLoading(false);
                  }}
                  disabled={deleteLoading}
                  className="flex-1 rounded-md border border-gray-300 dark:border-[#1A1A1A] bg-white dark:bg-[#050505] text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
