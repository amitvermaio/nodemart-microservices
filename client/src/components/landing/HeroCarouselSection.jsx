import { useEffect, useState } from 'react';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    eyebrow: 'For focused builders',
    title: 'Design your ideal dev workspace',
    description:
      'Dial in a setup that keeps you in flow — from monitors and lighting to every small detail.',
    primaryCta: 'Shop workstations',
    secondaryCta: 'Browse all gear',
    image:
      'https://images.unsplash.com/photo-1480506132288-68f7705954bd?q=80&w=1220&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    eyebrow: 'Ship faster',
    title: 'Launch production-ready Node.js projects faster',
    description:
      'Skip boilerplate. Start with opinionated kits that include everything you actually use.',
    primaryCta: 'Explore Node kits',
    secondaryCta: 'View documentation',
    image:
      'https://images.unsplash.com/photo-1763568258752-fe55f4ab7267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGN1cmF0ZWQlMjBub2RlanMlMjBzdGFydGVyJTIwa2l0fGVufDB8fDB8fHww',
  },
  {
    id: 3,
    eyebrow: 'For indie makers',
    title: 'Turn side projects into scalable products faster',
    description:
      'Hardware, tools and digital products that support fast iteration and clean execution.',
    primaryCta: 'Discover maker tools',
    secondaryCta: 'See community picks',
    image:
      'https://images.unsplash.com/photo-1698934688661-522c99f4c98f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGN1cmF0ZWQlMjBub2RlanMlMjBzdGFydGVyJTIwa2l0fGVufDB8fDB8fHww',
  },
];


const HeroCarouselSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(id);
  }, []);

  const current = slides[activeIndex];

  const backgroundStyle = {
    minHeight: 'calc(100vh - 4rem)',
    backgroundImage: `linear-gradient(120deg, rgba(9,9,11,0.88), rgba(9,9,11,0.78), rgba(9,9,11,0.6)), url(${current.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      id="shop"
      className="w-full flex items-center border-b border-zinc-800 bg-zinc-950"
      style={backgroundStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="max-w-3xl space-y-8 px-5 sm:px-0">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur">
                <span className="font-code text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                  {current.eyebrow}
                </span>
                <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
                <span className="font-body text-[11px] text-zinc-400">
                  Slide {activeIndex + 1} of {slides.length}
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                {current.title}
              </h1>

              <p className="font-body text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
                {current.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-body font-semibold tracking-wide hover:bg-zinc-200 transition-colors group shadow-sm">
                {current.primaryCta}
                <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border border-zinc-700 text-white px-8 py-3 rounded-lg font-body font-semibold tracking-wide hover:bg-zinc-900 hover:border-cyan-500/70 transition-colors">
                {current.secondaryCta}
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="size-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/60 bg-zinc-900/80 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeftIcon className="size-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="size-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/60 bg-zinc-900/80 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRightIcon className="size-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${index === activeIndex
                        ? 'w-5 bg-cyan-400'
                        : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarouselSection;
