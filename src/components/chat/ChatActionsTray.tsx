"use client";

import { X } from "lucide-react";

const ACTION_GROUPS = [
  {
    id: 'quick',
    label: 'Quick actions',
    actions: [
      { id: 'new-chat', label: 'New chat', description: 'Start a fresh conversation', icon: '💬' },
      { id: 'rewrite', label: 'Rewrite text', description: 'Improve or rephrase your text', icon: '✍️' },
      { id: 'summarise', label: 'Summarise text', description: 'Short summary of long text', icon: '📝' },
      { id: 'explain', label: 'Explain concept', description: 'Break down complex topics simply', icon: '💡' },
      { id: 'translate', label: 'Translate text', description: 'Translate to any language', icon: '🌐' },
      { id: 'code-help', label: 'Code help', description: 'Debug, explain, or write code', icon: '💻' },
    ],
  },
  {
    id: 'content',
    label: 'Content creation',
    actions: [
      { id: 'yt-script', label: 'YouTube script', description: 'Hook + outline + full script', icon: '🎬' },
      { id: 'short-video', label: 'Short video idea', description: 'Ideas for reels / shorts', icon: '📱' },
      { id: 'blog-post', label: 'Blog article', description: 'Full blog from topic', icon: '📄' },
      { id: 'social-post', label: 'Social media post', description: 'Engaging posts for platforms', icon: '📲' },
      { id: 'email', label: 'Email draft', description: 'Professional email templates', icon: '📧' },
      { id: 'headlines', label: 'Headlines & titles', description: 'Catchy headlines for content', icon: '✨' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis & research',
    actions: [
      { id: 'analyze-data', label: 'Analyze data', description: 'Break down data and insights', icon: '📊' },
      { id: 'research', label: 'Research topic', description: 'Deep dive into any subject', icon: '🔍' },
      { id: 'compare', label: 'Compare options', description: 'Compare pros and cons', icon: '⚖️' },
      { id: 'brainstorm', label: 'Brainstorm ideas', description: 'Generate creative solutions', icon: '🧠' },
    ],
  },
] as const;

interface ChatActionsTrayProps {
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (actionId: string) => void;
}

export default function ChatActionsTray({ isOpen, onClose, onActionClick }: ChatActionsTrayProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Tray panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:absolute md:bottom-full md:left-0 md:right-0 md:mb-2 bg-slate-900/95 border-t md:border-t-0 md:border-b border-slate-800/80 backdrop-blur-xl rounded-t-2xl md:rounded-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)] md:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform transition-all duration-300 ease-out md:max-w-3xl md:mx-auto translate-y-0 opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
          <h3 className="text-sm font-semibold text-slate-100">Quick Actions</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="max-h-[60vh] md:max-h-[500px] overflow-y-auto px-4 py-4">
          {ACTION_GROUPS.map((group) => (
            <div key={group.id} className="mb-6 last:mb-0">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 px-1">
                {group.label}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onActionClick(action.id)}
                    className="text-left p-3 rounded-xl bg-slate-800/50 border border-slate-800/80 hover:bg-slate-800/70 hover:border-sky-500/30 transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{action.icon || '💬'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-100 mb-1 group-hover:text-sky-300 transition-colors">
                          {action.label}
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

