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
      description: 'Chat with AI powered by OpenAI. Get instant answers and assistance.',
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
    <div className="h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Hero Section - Compact on Mobile */}
      <div className="mb-2 sm:mb-4 md:mb-6 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
          <div className="p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-sky-400" />
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-clip-text text-transparent">
            JJJ AI Studio
          </h1>
        </div>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm lg:text-base max-w-2xl hidden sm:block">
          Powerful AI tools at your fingertips. Choose any tool below to get started.
        </p>
      </div>

      {/* Features Grid - 2x2 on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-2 sm:mb-4 md:mb-6 flex-1 overflow-y-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-[#1A1A1A] bg-black/70 backdrop-blur-xl p-2 sm:p-3 md:p-4 lg:p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:scale-[1.02] flex flex-col"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`inline-flex p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br ${feature.color} mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 self-start`}>
                  <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-1.5 md:mb-2 group-hover:text-sky-300 transition-colors leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 leading-tight sm:leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Arrow indicator - Hidden on mobile */}
                <div className="mt-1.5 sm:mt-2 md:mt-3 lg:mt-4 flex items-center text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                  <span className="text-[10px] sm:text-xs md:text-sm font-medium">Get Started</span>
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Quick Actions - Compact on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0">
        {/* Upgrade to Pro */}
        <Link
          href="/upgrade"
          className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-xl p-2 sm:p-3 md:p-4 lg:p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-semibold text-white mb-0.5 sm:mb-1 md:mb-1.5 lg:mb-2 group-hover:text-amber-300 transition-colors leading-tight">
                Upgrade to Pro
              </h3>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-400 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 leading-tight hidden sm:block">
                Unlock unlimited access to all AI tools.
              </p>
              <div className="inline-flex items-center text-amber-400 font-medium text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
                Learn More
                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Account Settings */}
        <Link
          href="/account"
          className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl border border-[#1A1A1A] bg-black/70 backdrop-blur-xl p-2 sm:p-3 md:p-4 lg:p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]"
        >
          <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-semibold text-white mb-0.5 sm:mb-1 md:mb-1.5 lg:mb-2 group-hover:text-sky-300 transition-colors leading-tight">
                Account
              </h3>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-400 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 leading-tight hidden sm:block">
                Manage your account and preferences.
              </p>
              <div className="inline-flex items-center text-sky-400 font-medium text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
                View
                <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
