const Loader = ({ message = 'Preparing your workspace…' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="size-20 rounded-full border-2 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-zinc-950 flex items-center justify-center">
            <span className="font-heading text-sm tracking-tight text-white">
              &lt;Node<span className="text-cyan-400">Mart</span> /&gt;
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-body text-xs sm:text-sm text-zinc-400">
            {message}
          </p>
          <p className="font-code text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            Loading interface
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;