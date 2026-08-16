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
  wideSpruce:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='63' height='50'%3E%3Crect width='63' height='50' fill='%231d7a75'/%3E%3C/svg%3E",
  wideCrimson:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%23a83350'/%3E%3C/svg%3E",
};

const GAMES = [
  {
    id: 'one-second',
    title: 'One Second: Issue #1',
    accent: '#bf3a5b',
    comingSoon: true,
    platform: 'PC & Console',
    genre: 'Narrative Action',
    paragraphs: [
      <>
        <strong>One second</strong> is all it takes for disaster to strike - and only you are fast
        enough to stop it. Race through a living 3D comic book, rescuing civilians, outsmarting
        criminals, and untangling a chain of split-second threats.
      </>,
      'Every choice shapes the crisis - and the final comic page that tells your story.',
    ],
    imageLayoutClass: 'single',
    images: [
      {
        src: '/images/OneSecond.png',
        placeholder: PLACEHOLDERS.wideCrimson,
        width: 3840,
        height: 2160,
        alt: 'Title art for One Second: Issue #1',
      },
    ],
  },
  {
    id: 'handborne',
    title: 'Handborne',
    accent: '#d2504c',
    platform: 'PC',
    genre: 'Platformer',
    paragraphs: [
      <>
        <strong>Handborne</strong> is an experimental platformer controlled through physical hand
        gestures captured by an ordinary webcam. Walk with two fingers. Jump with the motion of your
        hand.
      </>,
      'The game is the first public demonstration of MotionCore, a gesture-input system designed to translate physical movement into responsive gameplay. Handborne exists to test that mechanism in a real game and to explore how new forms of input can inspire new forms of game design.',
    ],
    imageLayoutClass: 'single',
    images: [
      {
        src: '/images/Handborne.png',
        placeholder: PLACEHOLDERS.wideSpruce,
        width: 1260,
        height: 1000,
        alt: 'Title art for Handborne',
      },
    ],
  },
  {
    id: 'ascata',
    title: 'Ascata',
    accent: '#f08050',
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
    id: 'cent-isle',
    title: 'Cent Isle',
    accent: '#d4a820',
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
    id: 'crownlands',
    title: 'Crownlands',
    accent: '#4e9466',
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
];

function getSlideTarget(viewport, slide) {
  return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
}

function getWrappedIndex(index, length) {
  return ((index % length) + length) % length;
}

function ArchWindow({ game, isCenter, isClone }) {
  return (
    <article
      className={`arch-window${isCenter ? ' is-center' : ''}`}
      data-carousel-card=""
      data-game={game.id}
      data-carousel-clone={isClone ? 'true' : undefined}
      aria-hidden={isClone || !isCenter ? 'true' : undefined}
      inert={isClone ? '' : undefined}
      style={{ '--game-accent': game.accent }}
    >
      <div className="arch-card">
        <header className="arch-card-head">
          <h3>{game.title}</h3>
          {game.comingSoon && <span className="badge badge--coming-soon">Coming Soon</span>}
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

  const activeGame = GAMES[activeRealIndex];

  return (
    <section id="games" className="games" aria-label="Arques Studios Games" data-defense="keep">
      <div className="section-heading" data-animate="">
        <h2>Games</h2>
        <p className="section-intro">
          Explore the growing library of Arques Studios. Each project blends narrative, atmosphere,
          and mechanics to create memorable journeys.
        </p>
      </div>

      <div className="arch-gallery-shell">
        <div className="arch-glow" aria-hidden="true" style={{ '--game-accent': activeGame.accent }} />

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
          className="arch-gallery"
          tabIndex="0"
          aria-label="Arques Studios games gallery"
          aria-roledescription="carousel"
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className={`arch-track${isSnapping ? ' is-snapping' : ''}`}
            style={trackStyle}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {slides.map((slide, slideIndex) => (
              <ArchWindow
                key={`${slide.cloneKey}-${slideIndex}`}
                game={slide}
                isCenter={slide.sourceIndex === activeRealIndex}
                isClone={slide.isClone}
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

      <p className="arch-live" aria-live="polite">
        {`${activeGame.title} — ${activeGame.platform}, ${activeGame.genre}`}
      </p>
    </section>
  );
}

export default GamesCarousel;
