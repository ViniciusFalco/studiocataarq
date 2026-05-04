import { useEffect, useMemo, useRef, useState } from 'react';
import { homeProjects, portfolioProjects } from '../data/projects.js';
import { createRouteClickHandler } from '../utils/routes.js';

const AUTO_HOVER_DURATION_MS = 1500;
const COVER_SLIDE_INTERVAL_MS = 6500;
const MOBILE_COVER_SLIDE_INTERVAL_MS = 6000;
const COVER_SLIDE_FADE_MS = 900;
const MOBILE_PROJECT_QUERY = '(max-width: 768px)';
const ALL_MOBILE_CARDS_ACTIVE = '__all_mobile_project_cards__';

const sectionClasses = {
  home: 'block w-full px-5 pb-24 pt-0 max-[1200px]:px-0 max-[768px]:pb-5 max-[768px]:pt-0 min-[1201px]:pb-36',
  list: 'block w-full px-5 pb-24 pt-0 max-[1200px]:px-0 min-[1201px]:pb-36',
  works: 'block w-full px-5 pb-24 pt-0 max-[1200px]:px-0 min-[1201px]:pb-36',
};

const gridClasses = {
  home: 'grid w-full grid-cols-2 gap-5 overflow-hidden max-[1200px]:grid-cols-1 max-[1200px]:gap-10',
  list: 'grid w-full grid-cols-2 gap-5 overflow-hidden max-[1200px]:grid-cols-1 max-[1200px]:gap-10',
  works: 'grid w-full grid-cols-2 gap-5 overflow-hidden max-[1200px]:grid-cols-1 max-[1200px]:gap-10',
};

const imageClasses = {
  home: 'h-[500px] max-[1200px]:h-[460px] max-[768px]:h-[420px]',
  list: 'h-[350px] max-[1200px]:h-[420px] max-[768px]:h-[420px]',
  works: 'h-[500px] max-[1200px]:h-[460px] max-[768px]:h-[460px]',
};

const featuredCardClasses = {
  home: '',
  list: 'min-[1201px]:col-span-2',
  works: 'min-[1201px]:col-span-2',
};

const featuredImageClasses = {
  home: '',
  list: 'min-[1201px]:h-[520px]',
  works: 'min-[1201px]:h-[620px]',
};

const trailingImageClasses = {
  home: '',
  list: 'min-[1201px]:h-[680px]',
  works: 'min-[1201px]:h-[880px]',
};

const trailingCardClasses = {
  home: {
    1: '',
    2: '',
  },
  list: {
    1: '',
    2: 'min-[1201px]:col-span-2',
  },
  works: {
    1: '',
    2: 'min-[1201px]:col-span-2',
  },
};

const titlePositionClasses = {
  home: 'min-[769px]:top-[45%]',
  list: 'min-[769px]:top-[45%]',
  works: 'min-[769px]:top-[45%]',
};

const subtitlePositionClasses = {
  home: 'min-[769px]:top-[64%]',
  list: 'min-[769px]:top-[66%]',
  works: 'min-[769px]:top-[58%]',
};

function getImageSrc(image) {
  return typeof image === 'string' ? image : image?.src;
}

function getCoverSlides(project) {
  if (project.coverSlides?.length) {
    return project.coverSlides.slice(0, 3);
  }

  const internalImages = portfolioProjects[project.slug]?.images
    ?.map(getImageSrc)
    .filter(Boolean) || [];

  return [project.image, ...internalImages]
    .filter((src, index, slides) => src && slides.indexOf(src) === index)
    .slice(0, 3);
}

function getProjectCardKey(variant, project, index) {
  return `${variant}-${project.href}-${index}`;
}

function getMobileTitleLines(title) {
  const words = title.split(' ');

  if (title.length <= 24 || words.length <= 2) {
    return [title];
  }

  const middle = title.length / 2;
  let bestBreakIndex = 1;
  let bestDistance = Infinity;
  let currentLength = 0;

  words.slice(0, -1).forEach((word, index) => {
    currentLength += word.length + (index > 0 ? 1 : 0);

    const distance = Math.abs(currentLength - middle);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestBreakIndex = index + 1;
    }
  });

  return [
    words.slice(0, bestBreakIndex).join(' '),
    words.slice(bestBreakIndex).join(' '),
  ];
}

function useIsMobileProjectViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(MOBILE_PROJECT_QUERY).matches
  ));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const query = window.matchMedia(MOBILE_PROJECT_QUERY);
    const updateViewportState = () => {
      setIsMobileViewport(query.matches);
    };

    updateViewportState();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', updateViewportState);

      return () => {
        query.removeEventListener('change', updateViewportState);
      };
    }

    query.addListener(updateViewportState);

    return () => {
      query.removeListener(updateViewportState);
    };
  }, []);

  return isMobileViewport;
}

function useMobileProjectMotion({ items, variant, cardRefs }) {
  const isMobileViewport = useIsMobileProjectViewport();
  const firstProjectKey = items[0] ? getProjectCardKey(variant, items[0], 0) : null;
  const [visibleProjectKeys, setVisibleProjectKeys] = useState(() => (
    firstProjectKey ? new Set([firstProjectKey]) : new Set()
  ));
  const [activeProjectKey, setActiveProjectKey] = useState(firstProjectKey);

  useEffect(() => {
    const projectKeys = items.map((project, index) => getProjectCardKey(variant, project, index));
    const firstVisibleProjectKeys = projectKeys[0] ? new Set([projectKeys[0]]) : new Set();

    setVisibleProjectKeys(firstVisibleProjectKeys);
    setActiveProjectKey(projectKeys[0] || null);

    if (!isMobileViewport || typeof window === 'undefined') {
      return undefined;
    }

    if (!projectKeys.length) {
      return undefined;
    }

    if (typeof window.IntersectionObserver !== 'function') {
      setVisibleProjectKeys(new Set(projectKeys));
      setActiveProjectKey(ALL_MOBILE_CARDS_ACTIVE);
      return undefined;
    }

    let frameId = 0;

    const updateMotionState = () => {
      frameId = 0;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportCenter = viewportHeight * 0.5;
      const nextVisibleProjectKeys = new Set();
      let closestProjectKey = null;
      let closestDistance = Infinity;

      projectKeys.forEach((projectKey) => {
        const node = cardRefs.current.get(projectKey);

        if (!node) {
          return;
        }

        const rect = node.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < viewportHeight;

        if (!isVisible) {
          return;
        }

        nextVisibleProjectKeys.add(projectKey);

        const cardCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestProjectKey = projectKey;
        }
      });

      setVisibleProjectKeys(nextVisibleProjectKeys);
      setActiveProjectKey(closestProjectKey || projectKeys[0]);
    };

    const scheduleMotionStateUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateMotionState);
    };

    const observer = new window.IntersectionObserver(scheduleMotionStateUpdate, {
      rootMargin: '0px 0px -12% 0px',
      threshold: [0, 0.12, 0.35, 0.65, 1],
    });

    projectKeys.forEach((projectKey) => {
      const node = cardRefs.current.get(projectKey);

      if (node) {
        observer.observe(node);
      }
    });

    window.addEventListener('scroll', scheduleMotionStateUpdate, { passive: true });
    window.addEventListener('resize', scheduleMotionStateUpdate);
    scheduleMotionStateUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleMotionStateUpdate);
      window.removeEventListener('resize', scheduleMotionStateUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [cardRefs, isMobileViewport, items, variant]);

  return {
    activeProjectKey,
    isMobileViewport,
    visibleProjectKeys,
  };
}

function ProjectCard({
  project,
  variant,
  onNavigate,
  isFeatured = false,
  isAutoHoverActive = false,
  isMobileActive = false,
  isMobileMotionEnabled = false,
  isMobileVisible = false,
  mobileMotionIndex = 0,
  cardRef,
  trailingSpan = 1,
}) {
  const titleSizeClass =
    variant === 'home'
      ? project.homeTitleClass || 'min-[769px]:text-[48px]'
      : project.listTitleClass || 'min-[769px]:text-[35px]';
  const featuredClass = isFeatured ? featuredCardClasses[variant] : '';
  const trailingClass = !isFeatured ? trailingCardClasses[variant][trailingSpan] : '';
  const shouldPanImage = variant !== 'home' && (isFeatured || trailingSpan > 1);
  const shouldUseSingleCenteredCover = variant === 'works' && isFeatured;
  const shouldShowIntroHover = isFeatured && isAutoHoverActive;
  const shouldCenterPan = project.coverPanMode === 'center' || (variant === 'works' && isFeatured);
  const shouldDisableZoom = project.disableCoverZoom && shouldPanImage;
  const shouldApplyPanImage = shouldPanImage && !isMobileMotionEnabled;
  const panClass = shouldCenterPan ? 'cover-pan-y-center' : 'cover-pan-y';
  const hoverZoomClass = shouldDisableZoom ? '' : 'min-[769px]:group-hover:scale-[1.04]';
  const introZoomClass = shouldShowIntroHover && !shouldDisableZoom ? 'min-[769px]:scale-[1.04]' : '';
  const mobileCardMotionClass = isMobileMotionEnabled
    ? `project-card-mobile-motion ${
        isMobileVisible
          ? 'max-[768px]:translate-y-0 max-[768px]:opacity-100'
          : 'max-[768px]:translate-y-4 max-[768px]:opacity-0'
      }`
    : '';
  const mobileMotionDelay = isMobileMotionEnabled && isMobileVisible
    ? `${Math.min(mobileMotionIndex, 4) * 45}ms`
    : '0ms';
  const mobileImageScaleClass = 'max-[768px]:scale-100';
  const mobileOverlayClass = isMobileActive ? 'opacity-100' : 'opacity-0';
  const mobileTextClass = isMobileActive
    ? 'translate-y-0 scale-100 opacity-100'
    : 'translate-y-3 scale-[0.98] opacity-0';
  const mobileTitleLines = getMobileTitleLines(project.title);
  const imageClass = isFeatured
    ? `${imageClasses[variant]} ${featuredImageClasses[variant]}`
    : `${imageClasses[variant]} ${trailingSpan > 1 ? trailingImageClasses[variant] : ''}`;
  const desktopCoverSlides = useMemo(
    () => {
      if (!shouldPanImage || shouldUseSingleCenteredCover) {
        return [project.image];
      }

      return getCoverSlides(project);
    },
    [project, shouldPanImage, shouldUseSingleCenteredCover],
  );
  const mobileCoverSlides = useMemo(() => getCoverSlides(project), [project]);
  const coverSlides = isMobileMotionEnabled ? mobileCoverSlides : desktopCoverSlides;
  const shouldRunCoverSlides = isMobileMotionEnabled
    ? isMobileActive && mobileCoverSlides.length > 1
    : shouldPanImage && desktopCoverSlides.length > 1;
  const coverSlideInterval = isMobileMotionEnabled
    ? MOBILE_COVER_SLIDE_INTERVAL_MS
    : COVER_SLIDE_INTERVAL_MS;
  const shouldShowMobileProgress = isMobileMotionEnabled && isMobileActive && coverSlides.length > 1;
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideSrc, setPreviousSlideSrc] = useState(null);
  const [isCurrentSlideVisible, setIsCurrentSlideVisible] = useState(true);
  const slideSrc = coverSlides[slideIndex % coverSlides.length] || project.image;
  const imageFrameClass = `relative mb-[15px] w-full max-w-full overflow-hidden min-[769px]:mb-0 ${imageClass}`;
  const slideImageClass = `project-card-mobile-image absolute inset-0 h-full w-full max-w-full object-cover ${mobileImageScaleClass} ${hoverZoomClass} min-[769px]:group-hover:blur-[3px] min-[769px]:group-hover:brightness-[0.6] ${shouldShowIntroHover ? `${introZoomClass} min-[769px]:blur-[3px] min-[769px]:brightness-[0.6]` : ''}`;
  const slideTransition = `opacity ${COVER_SLIDE_FADE_MS}ms ease-in-out, transform 500ms ease, filter 500ms ease`;
  const previousSlideObjectPosition = isMobileMotionEnabled
    ? 'center center'
    : shouldCenterPan
      ? 'center center'
      : 'center bottom';

  useEffect(() => {
    setSlideIndex(0);
    setPreviousSlideSrc(null);
    setIsCurrentSlideVisible(true);
  }, [coverSlides, project.image]);

  useEffect(() => {
    if (!shouldRunCoverSlides) {
      return undefined;
    }

    coverSlides.forEach((src) => {
      const image = new Image();
      image.src = src;
    });

    const intervalId = window.setInterval(() => {
      setSlideIndex((currentIndex) => {
        setPreviousSlideSrc(coverSlides[currentIndex % coverSlides.length] || project.image);
        setIsCurrentSlideVisible(false);

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setIsCurrentSlideVisible(true);
          });
        });

        return (currentIndex + 1) % coverSlides.length;
      });
    }, coverSlideInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [coverSlideInterval, coverSlides, project.image, shouldRunCoverSlides]);

  useEffect(() => {
    if (!previousSlideSrc || !isCurrentSlideVisible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousSlideSrc(null);
    }, COVER_SLIDE_FADE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCurrentSlideVisible, previousSlideSrc]);

  return (
    <a
      ref={cardRef}
      className={`group relative flex w-full max-w-full flex-col overflow-hidden rounded-[5px] p-0.5 text-black no-underline transition-colors duration-300 hover:bg-[#f2f2f2] max-[768px]:rounded-none max-[768px]:p-0 min-[769px]:hover:bg-transparent ${mobileCardMotionClass} ${featuredClass} ${trailingClass}`}
      data-mobile-visible={isMobileMotionEnabled ? String(isMobileVisible) : undefined}
      href={project.href}
      onClick={createRouteClickHandler(project.href, onNavigate)}
      style={{
        transitionDelay: mobileMotionDelay,
      }}
    >
      <div className={imageFrameClass}>
        {previousSlideSrc && (
          <img
            className={slideImageClass}
            src={previousSlideSrc}
            alt=""
            aria-hidden="true"
            style={{
              objectPosition: previousSlideObjectPosition,
              opacity: isCurrentSlideVisible ? 0 : 1,
              transition: slideTransition,
            }}
          />
        )}
        <img
          key={`${project.href}-${slideIndex}`}
          className={`${slideImageClass} ${shouldApplyPanImage ? panClass : ''}`}
          src={slideSrc}
          alt={coverSlides.length > 1 ? `${project.alt} - imagem ${slideIndex + 1}` : project.alt}
          loading="lazy"
          style={{
            objectPosition: isMobileMotionEnabled ? 'center center' : undefined,
            opacity: isCurrentSlideVisible ? 1 : 0,
            transition: slideTransition,
          }}
        />
        <span
          aria-hidden="true"
          className={`project-card-mobile-overlay pointer-events-none absolute inset-0 z-[2] bg-black/35 min-[769px]:hidden ${mobileOverlayClass}`}
        />
        {shouldShowMobileProgress && (
          <span
            className="pointer-events-none absolute bottom-4 left-1/2 z-[4] block h-px w-[72px] -translate-x-1/2 overflow-hidden bg-white/30 min-[769px]:hidden"
            aria-hidden="true"
          >
            <span
              key={`${project.href}-${slideIndex}-progress`}
              className="project-card-mobile-slide-progress block h-full w-full bg-white/90"
              style={{
                '--slide-progress-duration': `${coverSlideInterval}ms`,
              }}
            />
          </span>
        )}
        <div
          className={`project-card-mobile-overlay pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center text-white min-[769px]:hidden ${mobileTextClass}`}
        >
          <span className="project-card-mobile-title font-rams block w-full min-w-0 text-[24px] font-bold uppercase leading-tight [text-shadow:0_2px_9px_rgba(0,0,0,0.45)] [text-wrap:balance] max-[480px]:text-[18px]">
            {mobileTitleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </span>
          <span className="font-rams mt-2 block w-full min-w-0 text-sm font-normal uppercase leading-snug [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
            {project.subtitle}
          </span>
        </div>
      </div>
      <h3
        className={`project-card-desktop-text font-rams m-0 text-[18px] font-bold uppercase text-black max-[768px]:hidden min-[769px]:pointer-events-none min-[769px]:absolute min-[769px]:left-1/2 min-[769px]:z-10 min-[769px]:w-[90%] min-[769px]:-translate-x-1/2 min-[769px]:text-center min-[769px]:leading-tight min-[769px]:text-white min-[769px]:opacity-0 min-[769px]:[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] min-[769px]:transition-opacity min-[769px]:duration-300 min-[769px]:group-hover:opacity-100 ${titlePositionClasses[variant]} ${titleSizeClass} ${shouldShowIntroHover ? 'min-[769px]:opacity-100' : ''}`}
      >
        {project.title}
      </h3>
      <h2
        className={`project-card-desktop-text font-rams m-0 text-xs font-normal uppercase text-black max-[768px]:hidden min-[769px]:pointer-events-none min-[769px]:absolute min-[769px]:left-1/2 min-[769px]:z-10 min-[769px]:w-[90%] min-[769px]:-translate-x-1/2 min-[769px]:text-center min-[769px]:text-white min-[769px]:opacity-0 min-[769px]:[text-shadow:0_2px_8px_rgba(0,0,0,0.45)] min-[769px]:transition-opacity min-[769px]:duration-300 min-[769px]:group-hover:opacity-100 ${subtitlePositionClasses[variant]} ${shouldShowIntroHover ? 'min-[769px]:opacity-100' : ''}`}
      >
        {project.subtitle}
      </h2>
    </a>
  );
}

function getTrailingSpan({ index, itemCount, variant }) {
  if (variant === 'home' || index !== itemCount - 1 || itemCount <= 1) {
    return 1;
  }

  const columnCount = 2;
  const cardsAfterFeatured = itemCount - 1;
  const remainder = cardsAfterFeatured % columnCount;

  return remainder === 0 ? 1 : columnCount + 1 - remainder;
}

export default function Projects({ items = homeProjects, variant = 'home', onNavigate = () => {} }) {
  const [isAutoHoverActive, setIsAutoHoverActive] = useState(variant !== 'home');
  const cardRefs = useRef(new Map());
  const {
    activeProjectKey,
    isMobileViewport,
    visibleProjectKeys,
  } = useMobileProjectMotion({ items, variant, cardRefs });

  useEffect(() => {
    if (variant === 'home') {
      setIsAutoHoverActive(false);
      return undefined;
    }

    setIsAutoHoverActive(true);
    const timeoutId = window.setTimeout(() => {
      setIsAutoHoverActive(false);
    }, AUTO_HOVER_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [items, variant]);

  return (
    <section className={sectionClasses[variant]}>
      <div className={gridClasses[variant]}>
        {items.map((project, index) => {
          const projectKey = getProjectCardKey(variant, project, index);
          const isMobileFallbackActive = activeProjectKey === ALL_MOBILE_CARDS_ACTIVE;
          const isMobileVisible = !isMobileViewport
            || isMobileFallbackActive
            || activeProjectKey === projectKey
            || visibleProjectKeys.has(projectKey);
          const isMobileActive = isMobileViewport
            && (isMobileFallbackActive || activeProjectKey === projectKey);

          return (
            <ProjectCard
              project={project}
              variant={variant}
              key={`${variant}-${project.href}`}
              onNavigate={onNavigate}
              isFeatured={variant !== 'home' && index === 0}
              isAutoHoverActive={isAutoHoverActive}
              isMobileActive={isMobileActive}
              isMobileMotionEnabled={isMobileViewport}
              isMobileVisible={isMobileVisible}
              mobileMotionIndex={index}
              cardRef={(node) => {
                if (node) {
                  cardRefs.current.set(projectKey, node);
                } else {
                  cardRefs.current.delete(projectKey);
                }
              }}
              trailingSpan={getTrailingSpan({ index, itemCount: items.length, variant })}
            />
          );
        })}
      </div>
    </section>
  );
}
