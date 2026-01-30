const SupportFAQItem = ({ question, answer }) => {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 hover:bg-zinc-950 hover:border-cyan-500/50 transition-colors duration-300 p-4 sm:p-5">
      <h3 className="text-sm sm:text-base font-medium text-zinc-100 mb-1.5">
        {question}
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
        {answer}
      </p>
    </article>
  );
};

export default SupportFAQItem;
