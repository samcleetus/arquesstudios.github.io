import { useEffect } from 'react';
import { initNavIndicator } from './modules/navIndicator.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initLazyMedia } from './modules/lazyMedia.js';
import { initGamesCarousel } from './modules/gamesCarousel.js';
import { initParallax } from './modules/parallax.js';
import { initMobileNav } from './modules/mobileNav.js';

const BOOTSTRAP_DATASET_KEY = 'arquesReactBootstrapped';

function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  let ticking = false;
  let isVisible = false;

  const updateVisibility = () => {
    const nextVisible = window.scrollY > 400;
    if (nextVisible !== isVisible) {
      btn.classList.toggle('visible', nextVisible);
      isVisible = nextVisible;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateVisibility);
  };
  const onClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', onClick);
  updateVisibility();
}

function App() {
  useEffect(() => {
    if (document.body.dataset[BOOTSTRAP_DATASET_KEY] === 'true') return;
    document.body.dataset[BOOTSTRAP_DATASET_KEY] = 'true';

    initNavIndicator();
    initScrollReveal();
    initGamesCarousel();
    initLazyMedia();
    initParallax();
    initMobileNav();
    initScrollTop();
  }, []);

  return (
    <>
      <header className="site-header" data-defense="outer">
        <div className="logo" aria-label="Arques Studios">
          <img
            src="/images/ArquesStudios.png"
            width="64"
            height="64"
            alt="Arques Studios Logo"
            decoding="async"
            loading="lazy"
          />
          <div className="logo-text">
            <h1>Arques Studios</h1>
          </div>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Open navigation menu"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <nav
          id="primary-nav"
          className="primary-nav"
          data-nav=""
          role="navigation"
          aria-label="Primary"
        >
          <a href="#home">Home</a>
          <a href="#games">Games</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <span className="nav-indicator" aria-hidden="true" />
        </nav>
      </header>

      <main id="home" className="hero" aria-labelledby="hero-heading">
        <div className="hero__background" aria-hidden="true" data-parallax="0.25" />
        <div className="hero-left" data-animate="">
          <h2 id="hero-heading">Worlds built to last.</h2>
          <p>One developer. Multiple worlds. Infinite stories.</p>
          <a href="#games" className="button button--primary">
            Start Playing
          </a>
        </div>
      </main>

      <div className="castle-divider" aria-hidden="true" />

      <section id="games" className="games" aria-label="Arques Studios Games" data-defense="keep">
        <div className="section-heading" data-animate="">
          <h2>Games</h2>
          <p className="section-intro">
            Explore the growing library of Arques Studios. Each project blends narrative,
            atmosphere, and mechanics to create memorable journeys.
          </p>
        </div>

        <div className="games-carousel-shell">
          <button
            type="button"
            className="carousel-control carousel-control--prev"
            data-carousel-prev=""
            aria-label="View previous game"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>

          <div
            className="games-carousel"
            data-games-carousel=""
            tabIndex="0"
            aria-label="Arques Studios games carousel"
          >
            <article className="game-card" data-carousel-card="">
              <header>
                <h3>Ascata</h3>
              </header>
              <div className="game-meta">
                <span className="badge badge--platform">iOS</span>
                <span className="badge badge--genre">Platformer</span>
              </div>
              <p>
                <strong>Ascata</strong> is Arques Studios&apos; debut mobile release - an endless vertical
                platformer with multiple immersive settings and a wide range of unlockable character skins.
                Jump through gear-filled factories, vibrant cityscapes, and mysterious forests. Every run
                offers a fresh and exciting experience.
              </p>
              <p>Download and play for free on the App Store!</p>
              <div className="game-images ascata-gallery">
                <figure>
                  <img
                    className="fortress-frame"
                    data-lazy=""
                    data-src="/images/game1.jpeg"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='5'%3E%3Crect width='3' height='5' fill='%230e1621'/%3E%3C/svg%3E"
                    width="1179"
                    height="2556"
                    alt="Screenshot of Ascata"
                    decoding="async"
                  />
                </figure>
                <figure>
                  <img
                    className="fortress-frame"
                    data-lazy=""
                    data-src="/images/game2.jpeg"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='5'%3E%3Crect width='3' height='5' fill='%230a3c5a'/%3E%3C/svg%3E"
                    width="1179"
                    height="2556"
                    alt="Another screenshot of Ascata"
                    decoding="async"
                  />
                </figure>
              </div>
            </article>

            <article className="game-card" data-carousel-card="">
              <header>
                <h3>Crownlands</h3>
              </header>
              <div className="game-meta">
                <span className="badge badge--platform">Web</span>
                <span className="badge badge--genre">World-Builder</span>
              </div>
              <p>
                <strong>Crownlands</strong> is an experimental world-building assistant for players and
                dungeon masters who want to bring their fantasy kingdoms to life. By adjusting parameters
                like geography, climate, and regional tension, Crownlands procedurally assembles a custom
                map shaped directly by those choices.
              </p>
              <p>
                Check out{' '}
                <a href="https://crownlands.vercel.app/" target="_blank" rel="noopener">
                  <strong>Crownlands</strong>
                </a>{' '}
                and build a world of your own!
              </p>
              <div className="game-images single">
                <figure>
                  <img
                    className="fortress-frame"
                    data-lazy=""
                    data-src="/images/crownlands_img.jpg"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='19'%3E%3Crect width='20' height='19' fill='%230e1621'/%3E%3C/svg%3E"
                    width="2001"
                    height="1927"
                    alt="Concept art of a procedurally generated Crownlands realm"
                    decoding="async"
                  />
                </figure>
              </div>
            </article>

            <article className="game-card" data-carousel-card="">
              <header>
                <div className="game-card-title-row">
                  <h3>Cent Isle</h3>
                  <span className="badge badge--coming-soon">Coming Soon</span>
                </div>
              </header>
              <div className="game-meta">
                <span className="badge badge--platform">Mobile</span>
                <span className="badge badge--genre">Educational</span>
              </div>
              <p>
                <strong>Cent Isle</strong> is an upcoming financial literacy game set on a tropical island
                economy. Players manage resources, trade goods, and make investment decisions as they grow
                their island from a small fishing village into a thriving financial hub.
              </p>
              <p>
                Learn real-world money concepts through engaging gameplay - budgeting, saving, investing,
                and more.
              </p>
              <div className="game-images single">
                <figure>
                  <img
                    className="fortress-frame"
                    data-lazy=""
                    data-src="/images/centIsle_placeholder.jpg"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%2300897b'/%3E%3C/svg%3E"
                    width="1600"
                    height="900"
                    alt="Placeholder concept art for Cent Isle"
                    decoding="async"
                  />
                </figure>
              </div>
            </article>

            <article className="game-card" data-carousel-card="">
              <header>
                <div className="game-card-title-row">
                  <h3>King&apos;s Crest</h3>
                  <span className="badge badge--coming-soon">Coming Soon</span>
                </div>
              </header>
              <div className="game-meta">
                <span className="badge badge--platform">PC</span>
                <span className="badge badge--genre">Narrative</span>
              </div>
              <p>
                <strong>King&apos;s Crest</strong> is Arques Studios&apos; next major project - a story-driven
                first-person exploration game about solitude, perseverance, and truth. As a traveler
                climbing a mountain cloaked in secrecy, players uncover why the monarchs isolated
                themselves, and must confront the emotional and moral weight of their own journey.
              </p>
              <p>
                Built with cutting-edge integration of large language models, King&apos;s Crest encourages
                players to decipher clues and grant meanings by their own design. The choices you make
                shape how the story ends.
              </p>
              <div className="game-images single">
                <figure>
                  <img
                    className="fortress-frame"
                    data-lazy=""
                    data-src="/images/kingsCrest.jpg"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%235dd9cc'/%3E%3C/svg%3E"
                    width="1612"
                    height="1135"
                    alt="Concept art of King&apos;s Crest"
                    decoding="async"
                  />
                </figure>
              </div>
            </article>
          </div>

          <button
            type="button"
            className="carousel-control carousel-control--next"
            data-carousel-next=""
            aria-label="View next game"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </div>
      </section>

      <div className="castle-divider" aria-hidden="true" />

      <section id="about" className="about" aria-label="About Arques Studios" data-defense="inner">
        <div className="floating-orb orb-3" aria-hidden="true" />
        <div className="about-text" data-animate="">
          <h2>About</h2>
          <p>
            As a solo game developer, I founded Arques Studios as a means through which to build worlds
            and tell stories through gameplay. Every detail, from concept and code to design and marketing,
            is crafted with care to bring unique ideas to life.
          </p>
          <p>
            Inspired by the Chateau d&apos;Arques, a symbol of enduring craftsmanship, resilience, and
            artistry, I strive to create games built with the same precision and imagination. Whether
            through vibrant worlds or memorable characters, my goal is to craft stories that stay with
            players long after the game ends and experiences that stand the test of time.
          </p>
          <p>Ascata is just the beginning. I&apos;m excited to keep building one game at a time.</p>
          <a href="#contact" className="button button--primary">
            Contact Us
          </a>
        </div>
        <div className="about-img" data-animate="">
          <img
            className="fortress-frame"
            data-lazy=""
            data-parallax="0.15"
            data-src="/images/about2.jpg"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='3'%3E%3Crect width='2' height='3' fill='%230e1621'/%3E%3C/svg%3E"
            width="1178"
            height="1972"
            alt="Developer workspace with concept art sketches"
            decoding="async"
          />
        </div>
      </section>

      <div className="castle-divider" aria-hidden="true" />

      <section id="contact" className="contact" aria-label="Contact Arques Studios">
        <div className="contact-card" data-animate="">
          <h2>Contact Us</h2>
          <p>Have a question or want to work together? Reach out.</p>
          <div className="contact-links">
            <a
              href="mailto:support@arquesstudios.com"
              className="contact-link"
              aria-label="Email Arques Studios"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              support@arquesstudios.com
            </a>
            <a
              href="https://www.instagram.com/arquesstudios"
              target="_blank"
              rel="noopener"
              className="contact-link"
              aria-label="Arques Studios on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              @arquesstudios
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              src="/images/ArquesStudios.png"
              width="36"
              height="36"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <span>Arques Studios</span>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#home">Home</a>
            <a href="#games">Games</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="privacy.html" rel="noopener">
              Privacy
            </a>
          </nav>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/arquesstudios"
              target="_blank"
              rel="noopener"
              aria-label="Arques Studios on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="mailto:support@arquesstudios.com" aria-label="Email Arques Studios">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
        <p className="footer-copy">&copy; 2025 Arques Studios. All rights reserved.</p>
      </footer>

      <button type="button" className="scroll-top" id="scroll-top" aria-label="Scroll to top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}

export default App;
