import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

const TRANSITION_MS = 460;
const SWIPE_THRESHOLD = 48;
const CLONE_COUNT = 2;
const PLACEHOLDERS = {
  tallDark:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='5'%3E%3Crect width='3' height='5' fill='%230e1621'/%3E%3C/svg%3E",
  tallBlue:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='5'%3E%3Crect width='3' height='5' fill='%230a3c5a'/%3E%3C/svg%3E",
  wideDark:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19'%3E%3Crect width='20' height='19' fill='%230e1621'/%3E%3C/svg%3E",
  wideTeal:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%2300897b'/%3E%3C/svg%3E",
  wideAqua:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%235dd9cc'/%3E%3C/svg%3E",
};

const GAMES = [
  {
    id: 'cent-isle',
    title: 'Cent Isle',
    comingSoon: true,
    platform: 'Mobile',
    genre: 'Educational',
    paragraphs: [
      <>
        <strong>Cent Isle</strong> is a financial literacy game built to teach the intuition behind
        investing through interactive gameplay.
      </>,
      'Each match drops you into a shifting economy where inflation, volatility, and time work against you. Build your portfolio, adapt your strategy, and see how your decisions hold up under real pressure.',
      'No formulas. No textbooks. Just the instincts you\'ll actually use.',
    ],
    imageLayoutClass: 'single',
    images: [
      {
        src: '/images/Cent-Isle-1.png',
        placeholder: PLACEHOLDERS.wideTeal,
        width: 1170,
        height: 1857,
        alt: 'Concept art for Cent Isle',
      },
    ],
  },
  {
    id: 'ascata',
    title: 'Ascata',
    platform: 'iOS',
    genre: 'Platformer',
    paragraphs: [
      <>
        <strong>Ascata</strong> is Arques Studios&apos; debut mobile release - an endless vertical
        platformer with multiple immersive settings and a wide range of unlockable character skins.
        Jump through gear-filled factories, vibrant cityscapes, and mysterious forests. Every run
        offers a fresh and exciting experience.
      </>,
      'Download and play for free on the App Store!',
    ],
    imageLayoutClass: 'ascata-gallery',
    images: [
      {
        src: '/images/game1.jpeg',
        placeholder: PLACEHOLDERS.tallDark,
        width: 1179,
        height: 2556,
        alt: 'Screenshot of Ascata',
      },
      {
        src: '/images/game2.jpeg',
        placeholder: PLACEHOLDERS.tallBlue,
        width: 1179,
        height: 2556,
        alt: 'Another screenshot of Ascata',
      },
    ],
  },
  {
    id: 'crownlands',
    title: 'Crownlands',
    platform: 'Web',
    genre: 'World-Builder',
    paragraphs: [
      <>
        <strong>Crownlands</strong> is an experimental world-building assistant for players and
        dungeon masters who want to bring their fantasy kingdoms to life. By adjusting parameters
        like geography, climate, and regional tension, Crownlands procedurally assembles a custom
        map shaped directly by those choices.
      </>,
      <>
        Check out{' '}
        <a href="https://crownlands.vercel.app/" target="_blank" rel="noopener">
          <strong>Crownlands</strong>
        </a>{' '}
        and build a world of your own!
      </>,
    ],
    imageLayoutClass: 'single',
    images: [
      {
        src: '/images/crownlands_img.jpg',
        placeholder: PLACEHOLDERS.wideDark,
        width: 2001,
        height: 1927,
        alt: 'Concept art of a procedurally generated Crownlands realm',
      },
    ],
  },
  {
    id: 'kings-crest',
    title: "King's Crest",
    comingSoon: true,
    platform: 'PC',
    genre: 'Narrative',
    paragraphs: [
      <>
        <strong>King&apos;s Crest</strong> is Arques Studios&apos; next major project - a story-driven
        first-person exploration game about solitude, perseverance, and truth. As a traveler climbing
        a mountain cloaked in secrecy, players uncover why the monarchs isolated themselves, and must
        confront the emotional and moral weight of their own journey.
      </>,
      <>
        Built with cutting-edge integration of large language models, King&apos;s Crest encourages
        players to decipher clues and grant meanings by their own design. The choices you make shape
        how the story ends.
      </>,
    ],
    imageLayoutClass: 'single',
    images: [
      {
        src: '/images/kingsCrest.jpg',
        placeholder: PLACEHOLDERS.wideAqua,
        width: 1612,
        height: 1135,
        alt: "Concept art of King's Crest",
      },
    ],
  },
];

function getSlideTarget(viewport, slide) {
  return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
}

function getWrappedIndex(index, length) {
  return ((index % length) + length) % length;
}

function GameCard({ game, isCenter, isClone, isInteractive, onActivate }) {
  const onKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onActivate();
  };

  return (
    <article
      className={`game-card${isCenter ? ' is-center' : ''}`}
      data-carousel-card=""
      data-carousel-clone={isClone ? 'true' : undefined}
      aria-hidden={isClone}
      inert={isClone ? '' : undefined}
      aria-label={isInteractive ? `View details for ${game.title}` : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onActivate : undefined}
      onKeyDown={onKeyDown}
    >
      <header>
        {game.comingSoon ? (
          <div className="game-card-title-row">
            <h3>{game.title}</h3>
            <span className="badge badge--coming-soon">Coming Soon</span>
          </div>
        ) : (
          <h3>{game.title}</h3>
        )}
      </header>
      <div className="game-meta">
        <span className="badge badge--platform">{game.platform}</span>
        <span className="badge badge--genre">{game.genre}</span>
      </div>
      {game.paragraphs.map((paragraph, index) => (
        <p key={`${game.id}-paragraph-${index}`}>{paragraph}</p>
      ))}
      <div className={`game-images ${game.imageLayoutClass}`}>
        {game.images.map((image, index) => (
          <figure key={`${game.id}-image-${index}`}>
            <img
              className="fortress-frame"
              data-lazy=""
              data-src={image.src}
              src={image.placeholder}
              width={image.width}
              height={image.height}
              alt={image.alt}
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </article>
  );
}

function GamesCarousel() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const totalGames = GAMES.length;
  const edgeCloneCount = Math.min(CLONE_COUNT, totalGames);
  const firstRealSlide = edgeCloneCount;
  const lastRealSlide = firstRealSlide + totalGames - 1;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const slides = useMemo(
    () => {
      const prefixClones = GAMES.slice(-edgeCloneCount).map((game, cloneIndex) => ({
        ...game,
        cloneKey: `clone-start-${game.id}-${cloneIndex}`,
        sourceIndex: totalGames - edgeCloneCount + cloneIndex,
        isClone: true,
      }));
      const realSlides = GAMES.map((game, sourceIndex) => ({
        ...game,
        cloneKey: game.id,
        sourceIndex,
        isClone: false,
      }));
      const suffixClones = GAMES.slice(0, edgeCloneCount).map((game, cloneIndex) => ({
        ...game,
        cloneKey: `clone-end-${game.id}-${cloneIndex}`,
        sourceIndex: cloneIndex,
        isClone: true,
      }));
      return [...prefixClones, ...realSlides, ...suffixClones];
    },
    [edgeCloneCount, totalGames]
  );

  const [activeSlide, setActiveSlide] = useState(firstRealSlide);
  const [slideTargets, setSlideTargets] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  const normalizeSlideIndex = useCallback(
    (index) => {
      if (index < firstRealSlide) return index + totalGames;
      if (index > lastRealSlide) return index - totalGames;
      return index;
    },
    [firstRealSlide, lastRealSlide, totalGames]
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const targets = Array.from(track.children).map((slide) => getSlideTarget(viewport, slide));
    setSlideTargets(targets);
  }, []);

  useLayoutEffect(() => {
    let frameId = 0;
    const scheduleMeasure = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        measure();
      });
    };

    scheduleMeasure();
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('load', scheduleMeasure, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && viewportRef.current) {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('load', scheduleMeasure);
      resizeObserver?.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [measure]);

  useLayoutEffect(() => {
    if (!isSnapping) return;
    const frameId = requestAnimationFrame(() => {
      setIsSnapping(false);
    });
    return () => cancelAnimationFrame(frameId);
  }, [isSnapping]);

  const moveBy = useCallback(
    (delta) => {
      if (totalGames <= 1 || isAnimating) return;

      if (prefersReducedMotion) {
        setActiveSlide((current) => normalizeSlideIndex(current + delta));
        return;
      }

      setIsAnimating(true);
      setActiveSlide((current) => current + delta);
    },
    [isAnimating, normalizeSlideIndex, prefersReducedMotion, totalGames]
  );

  const onTrackTransitionEnd = useCallback(
    (event) => {
      if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
      setActiveSlide((current) => {
        const normalized = normalizeSlideIndex(current);
        if (normalized !== current) {
          setIsSnapping(true);
        }
        return normalized;
      });
      setIsAnimating(false);
    },
    [normalizeSlideIndex]
  );

  const activeRealIndex = getWrappedIndex(activeSlide - firstRealSlide, totalGames);
  const previousRealIndex = getWrappedIndex(activeRealIndex - 1, totalGames);
  const nextRealIndex = getWrappedIndex(activeRealIndex + 1, totalGames);

  const onCardClick = useCallback(
    (sourceIndex, slideIndex) => {
      if (isAnimating || sourceIndex === activeRealIndex) return;
      if (sourceIndex === previousRealIndex) {
        moveBy(-1);
      } else if (sourceIndex === nextRealIndex) {
        moveBy(1);
      }
    },
    [activeRealIndex, isAnimating, moveBy, nextRealIndex, previousRealIndex]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveBy(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveBy(-1);
      }
    },
    [moveBy]
  );

  const onTouchStart = useCallback((event) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      moveBy(deltaX < 0 ? 1 : -1);
    },
    [moveBy]
  );

  const targetX = slideTargets[activeSlide] ?? 0;
  const trackStyle = {
    transform: `translate3d(${-targetX}px, 0, 0)`,
    transition:
      isAnimating && !prefersReducedMotion && !isSnapping
        ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : 'none',
  };

  return (
    <section id="games" className="games" aria-label="Arques Studios Games" data-defense="keep">
      <div className="section-heading" data-animate="">
        <h2>Games</h2>
        <p className="section-intro">
          Explore the growing library of Arques Studios. Each project blends narrative, atmosphere,
          and mechanics to create memorable journeys.
        </p>
      </div>

      <div className="games-carousel-shell">
        <button
          type="button"
          className="carousel-control carousel-control--prev"
          aria-label="View previous game"
          onClick={() => moveBy(-1)}
          disabled={totalGames <= 1}
        >
          <span aria-hidden="true">&#8249;</span>
        </button>

        <div
          ref={viewportRef}
          className="games-carousel"
          tabIndex="0"
          aria-label="Arques Studios games carousel"
          aria-roledescription="carousel"
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className={`games-carousel-track${isSnapping ? ' is-snapping' : ''}`}
            style={trackStyle}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {slides.map((slide, slideIndex) => (
              <GameCard
                key={`${slide.cloneKey}-${slideIndex}`}
                game={slide}
                isCenter={slide.sourceIndex === activeRealIndex}
                isClone={slide.isClone}
                isInteractive={
                  !slide.isClone &&
                  (slide.sourceIndex === previousRealIndex || slide.sourceIndex === nextRealIndex)
                }
                onActivate={() => onCardClick(slide.sourceIndex, slideIndex)}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="carousel-control carousel-control--next"
          aria-label="View next game"
          onClick={() => moveBy(1)}
          disabled={totalGames <= 1}
        >
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>
    </section>
  );
}

export default GamesCarousel;
