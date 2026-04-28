import { useEffect, useState } from 'react';

export default function HeroSlider({ slides, interval = 8000 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(null);

  useEffect(() => {
    slides.forEach((slide) => {
      const image = new Image();
      image.src = slide.src;
    });
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => {
        setPreviousSlide(current);
        return (current + 1) % slides.length;
      });
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [interval, slides.length]);

  useEffect(() => {
    if (previousSlide === null) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setPreviousSlide(null);
    }, 600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [previousSlide]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="slider-container relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        const isPrevious = index === previousSlide;

        return (
          <div
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCurrent
                ? 'visible z-10 translate-x-0 scale-100 opacity-100'
                : isPrevious
                  ? 'visible z-[1] -translate-x-full scale-95 opacity-0'
                  : 'invisible z-[1] translate-x-full scale-105 opacity-0'
            }`}
            key={slide.src}
          >
            <img
              className="h-full w-full object-cover object-center"
              src={slide.src}
              alt={slide.alt}
            />
          </div>
        );
      })}
    </div>
  );
}
