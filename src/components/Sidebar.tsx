'use client';

import { useState } from 'react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navItems = {
    Project: [
      { id: 'api-key', label: 'Get API key' },
      { id: 'new-prompt', label: 'New prompt' },
      { id: 'library', label: 'My library' },
    ],
    Tools: [
      { id: 'ai-chat', label: 'AI Chat' },
      { id: 'text-to-speech', label: 'Text to Speech' },
      { id: 'speech-to-text', label: 'Speech to Text' },
      { id: 'text-to-image', label: 'Text to Image' },
    ],
    Help: [
      { id: 'docs', label: 'Docs' },
      { id: 'examples', label: 'Examples' },
    ],
  };

  return (
    <div className="w-[260px] bg-[#0B1020] border-r border-white/5 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-4 border-b border-white/5">
        <div className="text-xl font-semibold tracking-tight text-gray-100">
          JJJ AI
        </div>
        <div className="text-xs text-gray-400 mt-0.5">Studio</div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {Object.entries(navItems).map(([section, items]) => (
          <div key={section}>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
              {section}
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full rounded-md px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                    activeItem === item.id
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-gray-300">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-300 truncate">user@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

