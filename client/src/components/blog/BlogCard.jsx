import { ArrowRightIcon } from '@heroicons/react/24/outline';

const BlogCard = ({ post }) => {
  const { title, category, date, readingTime, excerpt, badge } = post;

  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/60 transition-colors duration-300 flex flex-col overflow-hidden">
      <div className="h-32 sm:h-36 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-between px-4">
        <div className="space-y-1">
          <p className="font-code text-[11px] uppercase tracking-[0.18em] text-zinc-400">
            {category}
          </p>
          <p className="text-[11px] text-zinc-500">{date}</p>
        </div>
        {badge && (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-cyan-400 text-black">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
        <div className="space-y-2">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-white group-hover:text-cyan-200">
            {title}
          </h3>
          {excerpt && (
            <p className="font-body text-xs text-zinc-400 line-clamp-3">
              {excerpt}
            </p>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between text-[11px] text-zinc-500">
          <span>{readingTime}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] text-zinc-300 group-hover:text-cyan-300"
          >
            <span>Read story</span>
            <ArrowRightIcon className="size-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
