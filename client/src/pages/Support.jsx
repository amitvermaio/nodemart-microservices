import SupportFAQItem from '../components/support/SupportFAQItem';

const FAQ_ITEMS = [
  {
    q: 'Where can I see my orders?',
    a: 'Head to the Orders page from the top navigation to see status, tracking and history for everything you have purchased.',
  },
  {
    q: 'How do I contact support?',
    a: 'Fill out the support form on this page with your email and order ID. Our team typically responds within one business day.',
  },
  {
    q: 'Can I cancel or edit an order?',
    a: 'Orders can usually be updated while they are still in Processing. Once shipped, you can request help and we will explore available options.',
  },
];

const Support = () => {
  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-[calc(100vh-4rem)] border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-2">
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
              Support
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              We are here to help
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Get quick answers to common questions or send us a detailed request so we can get you back to building.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 sm:gap-8 items-start">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <SupportFAQItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-code uppercase tracking-[0.18em] text-cyan-400 mb-1">
                Contact
              </p>
              <h2 className="text-sm sm:text-base font-heading font-semibold text-zinc-100">
                Send a support request
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1">
                Share a bit of context and we will follow up by email.
              </p>
            </div>

            <form className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-zinc-300">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-zinc-300">Order ID (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NM-24389"
                  className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-zinc-300">How can we help?</label>
                <textarea
                  rows={4}
                  placeholder="Share as much detail as you can about what you are trying to do, and what is going wrong."
                  className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                />
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-cyan-400 hover:text-zinc-950 transition-colors"
              >
                Submit request
              </button>
            </form>

            <p className="text-[11px] text-zinc-500 mt-1">
              This form is a placeholder; wire it to your backend or ticketing system when you are ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;