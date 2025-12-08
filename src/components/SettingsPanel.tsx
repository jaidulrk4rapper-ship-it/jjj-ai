'use client';

export default function SettingsPanel() {
  return (
    <div className="w-[320px] bg-[#050816] border-l border-white/5 flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-gray-100">Run settings</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Model Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Model
          </label>
          <select className="w-full px-3 py-2 bg-[#0B1020] border border-white/10 rounded-md text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option>Gemini 1.5 Flash</option>
            <option>Gemini 1.5 Pro</option>
            <option>Gemini 2.0 Flash</option>
          </select>
        </div>

        {/* Output Type */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Output
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" name="output" value="text" defaultChecked className="w-4 h-4 text-blue-500" />
              Text
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="radio" name="output" value="audio-text" className="w-4 h-4 text-blue-500" />
              Audio + Text
            </label>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
              Temperature
            </label>
            <span className="text-xs text-gray-400">0.7</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.7"
            className="w-full h-2 bg-[#0B1020] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>1</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Max tokens
          </label>
          <input
            type="number"
            defaultValue="1024"
            className="w-full px-3 py-2 bg-[#0B1020] border border-white/10 rounded-md text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Top K */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Top K
          </label>
          <input
            type="number"
            defaultValue="40"
            className="w-full px-3 py-2 bg-[#0B1020] border border-white/10 rounded-md text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Top P */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Top P
          </label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.95"
            className="w-full px-3 py-2 bg-[#0B1020] border border-white/10 rounded-md text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>
    </div>
  );
}

