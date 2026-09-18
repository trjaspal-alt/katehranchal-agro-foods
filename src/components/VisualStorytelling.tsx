import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, ProductCategory } from '../types';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface VisualStorytellingProps {
  onNavigate: (route: PageRoute, category?: ProductCategory) => void;
}

interface StoryScene {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actionText?: string;
  actionRoute?: PageRoute;
  actionCategory?: ProductCategory;
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 'collection',
    stepNumber: '01',
    title: 'Traditional Village Products for Modern Homes',
    subtitle: 'The Katehranchal Harvest',
    description:
      'A curated collection of pure Desi Ghee, traditional mustard oils, and whole natural grains crafted with rural patience and honest dedication.',
    imageSrc: './assets/story/scene-1-collection.svg',
    imageAlt: 'Katehranchal Agro Foods complete collection with Desi Ghee, mustard oils, seeds, and wheat',
    actionText: 'Explore Entire Catalog',
    actionRoute: 'shop',
    actionCategory: 'all',
  },
  {
    id: 'desi-ghee',
    stepNumber: '02',
    title: 'A Familiar Kitchen Tradition',
    subtitle: 'Pure Desi Ghee',
    description:
      'A traditional favourite for everyday meals, rotis, dal and family recipes. Clarified gently to preserve its granular texture and rich aroma.',
    imageSrc: './assets/story/scene-2-desi-ghee.svg',
    imageAlt: 'Golden Desi Ghee in traditional glass jar with brass spoon',
    actionText: 'View Desi Ghee Options',
    actionRoute: 'shop',
    actionCategory: 'desi-ghee',
  },
  {
    id: 'mustard-oils',
    stepNumber: '03',
    title: 'Character for Everyday Cooking',
    subtitle: 'Selected Mustard Oils',
    description:
      'Mustard oil selections for traditional cooking, homemade pickles and familiar recipes. Robust in natural character, aroma, and everyday utility.',
    imageSrc: './assets/story/scene-3-mustard-oils.svg',
    imageAlt: 'Mustard oil in clean glass bottles with black and yellow mustard seeds',
    actionText: 'Discover Mustard Oils',
    actionRoute: 'shop',
    actionCategory: 'black-mustard-oil',
  },
  {
    id: 'natural-wheat',
    stepNumber: '04',
    title: 'From Grain to the Family Table',
    subtitle: 'Whole Natural Wheat',
    description:
      'Whole wheat for home milling and the everyday comfort of fresh rotis. Final batch handling and quality specifications will be published after verification.',
    imageSrc: './assets/story/scene-4-natural-wheat.svg',
    imageAlt: 'Clean whole wheat grains in earthen container with golden wheat stalks',
    actionText: 'View Whole Wheat Grain',
    actionRoute: 'shop',
    actionCategory: 'natural-wheat',
  },
  {
    id: 'brand-story',
    stepNumber: '05',
    title: 'Rooted in Tradition. Made for Modern Homes.',
    subtitle: 'The Agricultural Journey',
    description:
      'Rooted in the agricultural heritage of rural India, Katehranchal Agro Foods is dedicated to bringing honest nutrition to contemporary family kitchens.',
    imageSrc: './assets/story/scene-5-brand-story.svg',
    imageAlt: 'Calm rural Indian agricultural landscape with golden wheat fields, sunrise, and flowing river',
    actionText: 'Read Our Full Story',
    actionRoute: 'our-story',
  },
];

export const VisualStorytelling: React.FC<VisualStorytellingProps> = ({ onNavigate }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Intersection observer for sticky visual crossfade on desktop
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sceneRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSceneIndex(index);
            }
          });
        },
        {
          root: null,
          rootMargin: '-30% 0px -40% 0px',
          threshold: 0.2,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section 
      id="visual-story"
      aria-label="Katehranchal Agro Foods Visual Story"
      className="relative bg-[#F5EFEB] border-y border-[#124328]/10 py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124328]/5 border border-[#124328]/10 text-xs font-semibold text-[#124328] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E0980B]" />
            <span>Visual Storytelling</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#124328] tracking-tight">
            The Journey of Rural Nutrition
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#132218]/75 mt-3 max-w-[62ch] mx-auto">
            Experience the natural simplicity and generational craftsmanship behind every staple we deliver to your doorstep.
          </p>
        </div>

        {/* 1. Desktop Experience: Sticky Visual with Scrollable Text Waypoints */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start relative">
          {/* Left Column: Narrative Waypoints */}
          <div className="lg:col-span-6 space-y-36 py-12">
            {STORY_SCENES.map((scene, index) => {
              const isActive = activeSceneIndex === index;
              return (
                <div
                  key={scene.id}
                  ref={(el) => {
                    sceneRefs.current[index] = el;
                  }}
                  className={`transition-opacity duration-500 min-h-[50vh] flex flex-col justify-center ${
                    isActive ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-8 sm:p-10 border border-[#124328]/10 shadow-sm space-y-4 max-w-lg">
                    {/* Step & Subtitle */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#124328] text-[#E0980B] font-sans font-bold text-xs flex items-center justify-center">
                        {scene.stepNumber}
                      </span>
                      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#E0980B]">
                        {scene.subtitle}
                      </span>
                    </div>

                    {/* Headline in Fraunces */}
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#124328] leading-[1.2]">
                      {scene.title}
                    </h3>

                    {/* Description in Manrope */}
                    <p className="font-sans text-sm sm:text-base text-[#132218]/80 leading-relaxed max-w-[58ch]">
                      {scene.description}
                    </p>

                    {/* Interactive Action Link */}
                    {scene.actionText && (
                      <div className="pt-2">
                        <button
                          onClick={() => onNavigate(scene.actionRoute || 'shop', scene.actionCategory)}
                          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-[#124328] hover:text-[#1C602A] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] rounded"
                        >
                          <span>{scene.actionText}</span>
                          <ArrowRight className="w-4 h-4 text-[#E0980B] group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Visual Window */}
          <div className="lg:col-span-6 sticky top-28 py-6">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#ECE4D8] border border-[#124328]/15 shadow-xl">
              {STORY_SCENES.map((scene, index) => {
                const isCurrent = activeSceneIndex === index;
                return (
                  <div
                    key={scene.id}
                    className={`absolute inset-0 w-full h-full ${
                      prefersReducedMotion
                        ? isCurrent
                          ? 'opacity-100 block'
                          : 'opacity-0 hidden'
                        : 'transition-opacity duration-700 ease-in-out'
                    } ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img
                      src={scene.imageSrc}
                      alt={scene.imageAlt}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      width={800}
                      height={600}
                    />

                    {/* Subtle Corner Scene Indicator */}
                    <div className="absolute top-4 right-4 bg-[#124328]/85 text-[#FBF9F4] backdrop-blur-xs px-3 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 border border-white/10 shadow-sm">
                      <span className="text-[#E0980B] font-bold">{scene.stepNumber}</span>
                      <span className="text-white/40">/</span>
                      <span className="text-white/70">05</span>
                    </div>

                    {/* Scene Subtitle Badge at bottom */}
                    <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-[#124328]/80 via-[#124328]/50 to-transparent p-4 rounded-b-2xl">
                      <div className="font-serif text-sm sm:text-base font-medium text-[#FBF9F4] drop-shadow-xs">
                        {scene.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Step Indicators below sticky container */}
            <div className="flex items-center justify-center gap-2.5 mt-4">
              {STORY_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    sceneRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setActiveSceneIndex(idx);
                  }}
                  aria-label={`Jump to scene ${idx + 1}: ${scene.title}`}
                  className={`h-2 rounded-full transition-all ${
                    activeSceneIndex === idx
                      ? 'w-8 bg-[#124328]'
                      : 'w-2 bg-[#124328]/25 hover:bg-[#124328]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Mobile Experience: Stacked Story Cards */}
        <div className="lg:hidden space-y-8">
          {STORY_SCENES.map((scene) => (
            <div
              key={scene.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#124328]/10 shadow-xs flex flex-col"
            >
              {/* Image with Aspect Ratio */}
              <div className="relative aspect-[16/10] w-full bg-[#ECE4D8] overflow-hidden">
                <img
                  src={scene.imageSrc}
                  alt={scene.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={600}
                  height={375}
                />
                <span className="absolute top-3 left-3 bg-[#124328] text-[#E0980B] font-sans font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                  {scene.stepNumber}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-3">
                <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#E0980B]">
                  {scene.subtitle}
                </div>
                <h3 className="font-serif text-xl font-medium text-[#124328] leading-snug">
                  {scene.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#132218]/75 leading-relaxed">
                  {scene.description}
                </p>

                {scene.actionText && (
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate(scene.actionRoute || 'shop', scene.actionCategory)}
                      className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-[#124328] hover:text-[#1C602A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0980B] rounded"
                    >
                      <span>{scene.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E0980B]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
