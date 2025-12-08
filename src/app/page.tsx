"use client";

import Link from "next/link";
import { 
  MessageCircle, 
  Waves, 
  Mic, 
  Image as ImageIcon, 
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Chat with AI powered by Gemini. Get instant answers and assistance.',
      href: '/ai/chat',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
    },
    {
      id: 'text-to-speech',
      title: 'Text to Speech',
      description: 'Convert your text into natural, high-quality speech audio.',
      href: '/ai/text-to-speech',
      icon: Waves,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
    },
    {
      id: 'speech-to-text',
      title: 'Speech to Text',
      description: 'Transcribe audio and voice recordings into text instantly.',
      href: '/ai/speech-to-text',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
    },
    {
      id: 'text-to-image',
      title: 'Text to Image',
      description: 'Generate stunning images from text descriptions using AI.',
      href: '/ai/text-to-image',
      icon: ImageIcon,
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/30',
    },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-y-auto">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30">
            <Sparkles className="w-6 h-6 text-sky-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-clip-text text-transparent">
        Welcome to JJJ AI Studio
      </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl">
          Powerful AI tools at your fingertips. Choose any tool below to get started and unlock the potential of artificial intelligence.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl border border-[#1A1A1A] bg-black/70 backdrop-blur-xl p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Get Started</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upgrade to Pro */}
        <Link
          href="/upgrade"
          className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Upgrade to Pro
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Unlock unlimited access to all AI tools with higher limits and priority support.
      </p>
              <div className="inline-flex items-center text-amber-400 font-medium text-sm">
                Learn More
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Account Settings */}
        <Link
          href="/account"
          className="group relative overflow-hidden rounded-2xl border border-[#1A1A1A] bg-black/70 backdrop-blur-xl p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors">
                Account Settings
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Manage your account, view usage statistics, and update preferences.
              </p>
              <div className="inline-flex items-center text-sky-400 font-medium text-sm">
                View Account
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
