import { useState, useEffect } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { socket } from '../socket';

const AiAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { socketConnected, role } = useSelector(state => state.auth);

  const isSeller = role === 'seller';

  useEffect(() => {
    if (!socketConnected) return;

    const handleMessage = (message) => {
      console.log('AI Agent Message:', message);
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', content: message },
      ]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socketConnected]);

  const handleSend = () => {
    if (!socketConnected || isSeller) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    setChatHistory((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
    ]);

    socket.emit('message', trimmed);
    setInput('');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-cyan-400" />
              <div>
                <p className="text-sm font-semibold">Shopping AI Agent</p>
                <p className="text-xs text-zinc-400">Ask for a product to add to cart</p>
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
            {chatHistory.length === 0 ? (
              <>
                <p className="text-zinc-300">
                  Ask for any product by name. I&apos;ll search for it and, if found, add it directly to your cart.
                </p>
                <p className="text-xs text-zinc-500">
                  Tip: if I can&apos;t find the product, I&apos;ll let you know it isn&apos;t available.
                </p>
              </>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs ${msg.role === 'user'
                        ? 'bg-cyan-600 text-zinc-50'
                        : 'bg-zinc-800 text-zinc-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder={isSeller ? 'AI agent is disabled for sellers' : 'E.g. Add iPhone 15 to my cart'}
                disabled={!socketConnected || isSeller}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                disabled={!socketConnected || isSeller}
                type="button"
                onClick={handleSend}
                className={`inline-flex items-center justify-center rounded-full ${socketConnected && !isSeller ? 'bg-cyan-600 text-zinc-100 cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'} px-3 py-1.5 text-xs font-medium hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 transition`}
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
        <span className="hidden sm:inline text-sm font-medium">Shopping AI</span>
      </button>
    </>
  );
};

export default AiAgent;