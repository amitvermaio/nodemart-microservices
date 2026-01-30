import { useState } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AiAgent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-cyan-400" />
              <div>
                <p className="text-sm font-semibold">AI Agent</p>
                <p className="text-xs text-zinc-400">Ask anything about this app</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-full p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              aria-label="Close AI agent"
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm text-zinc-300">
            <p className="text-zinc-300">
              This is your AI agent panel. You can wire it up to your backend or AI service later.
            </p>
            <p className="text-xs text-zinc-500">
              Tip: keep this open while you explore the app to get quick help.
            </p>
          </div>

          <div className="border-t border-zinc-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Type a question (coming soon)"
                disabled
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 px-3 py-1.5 text-xs cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 text-zinc-950 px-4 py-3 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close AI agent' : 'Open AI agent'}
      >
        <SparklesIcon className="size-5" />
        <span className="hidden sm:inline text-sm font-medium">AI Agent</span>
      </button>
    </>
  );
};

export default AiAgent;