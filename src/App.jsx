import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import StaggeredMobileMenu from './components/StaggeredMobileMenu';
import BookingModal from './components/BookingModal';
import Hero from './components/Hero';
import Story from './components/Story';
import MenuAnnounce from './components/MenuAnnounce';
import MenuPage from './components/MenuPage';
import BanquetsPage from './components/BanquetsPage';
import GalleryPage from './components/GalleryPage';
import PageLoader from './components/PageLoader';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import LeafOverlay from './components/LeafOverlay';
import ContactsPage from './components/ContactsPage';

// Scroll To Anchor helper for cross-page navigation links (e.g. from /menu to /#story)
function ScrollToAnchor({ displayLocation }) {
  useEffect(() => {
    if (displayLocation.pathname === '/' && displayLocation.state?.scrollTo) {
      const target = displayLocation.state.scrollTo;
      
      const timer = setTimeout(() => {
        const element = document.querySelector(target);
        if (element) {
          const offset = 110;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          if (window.lenis) {
            window.lenis.scrollTo(offsetPosition, { duration: 1.2 });
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
          
          // Clear routing state so it does not fire again on browser history actions
          window.history.replaceState({}, document.title);
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [displayLocation]);

  return null;
}

// Homepage layout combining key sections
function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <MenuAnnounce />
      <Reservation />
    </main>
  );
}

function AppContent({ isBookingOpen, setIsBookingOpen }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [loaderState, setLoaderState] = useState('initial-mount');
  const [isPageVisible, setIsPageVisible] = useState(false);

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    // Only enable smooth scrolling on non-touch desktop viewports (width > 768px)
    if (window.innerWidth > 768) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easing
        smoothWheel: true,
        smoothTouch: false, // preserve native touch scroll on mobile/touchpads
        syncTouch: false,
      });

      window.lenis = lenis;

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
        window.lenis = null;
      };
    }
  }, []);

  const transitionTimeouts = useRef([]);
  const clearTransitionTimeouts = () => {
    transitionTimeouts.current.forEach(clearTimeout);
    transitionTimeouts.current = [];
  };

  const loaderStateRef = useRef(loaderState);
  useEffect(() => {
    loaderStateRef.current = loaderState;
  }, [loaderState]);

  const displayLocationRef = useRef(displayLocation);
  useEffect(() => {
    displayLocationRef.current = displayLocation;
  }, [displayLocation]);

  // 1. Initial page load splash screen animation
  useEffect(() => {
    const startTime = Date.now();
    let isCleared = false;
    let visibleTimeout;
    let fadeOutTimeout;
    let idleTimeout;

    // Phase 1: Mount at opacity 0, then fade in overlay (400ms duration)
    setLoaderState('initial-mount');

    visibleTimeout = setTimeout(() => {
      setLoaderState('initial-visible');
    }, 50);

    const handleLoad = () => {
      if (isCleared) return;
      isCleared = true;

      const elapsedTime = Date.now() - startTime;
      const delay = Math.max(1000 - elapsedTime, 0); // ensure min 1000ms duration

      fadeOutTimeout = setTimeout(() => {
        setLoaderState('exiting');
        setIsPageVisible(true);

        idleTimeout = setTimeout(() => {
          setLoaderState('idle');
        }, 600); // 600ms matching fade out transition
      }, delay);
    };

    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 100);
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safeguard timeout to ensure preloader closes within 2.5s maximum
    const safeguardTimer = setTimeout(() => {
      if (!isCleared) {
        isCleared = true;
        setLoaderState('exiting');
        setIsPageVisible(true);
        idleTimeout = setTimeout(() => {
          setLoaderState('idle');
        }, 600);
      }
    }, 2500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(safeguardTimer);
      clearTimeout(visibleTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(idleTimeout);
    };
  }, []);

  // 2. SPA Route Transition Animation
  useEffect(() => {
    if (location.pathname === displayLocationRef.current.pathname) return;
    if (loaderStateRef.current === 'initial-mount' || loaderStateRef.current === 'initial-visible') return;
    if (loaderStateRef.current !== 'idle') return;

    // Clear any existing transition timeouts
    clearTransitionTimeouts();

    // Step 1: Mount the transition loader at opacity 0
    setLoaderState('route-mount');

    const t1 = setTimeout(() => {
      // Step 2: Transition overlay to opacity 1 (takes 400ms)
      setLoaderState('route-visible');

      const t2 = setTimeout(() => {
        // Step 3: Overlay is fully visible. Swap the route and hide page instantly
        setDisplayLocation(location);
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        setIsPageVisible(false); // hide page instantly

        const t3 = setTimeout(() => {
          // Step 4: Start exiting loader and fading in page container
          setLoaderState('exiting');
          setIsPageVisible(true); // fade in page container

          const t4 = setTimeout(() => {
            setLoaderState('idle');
          }, 600); // 600ms exit transition
          transitionTimeouts.current.push(t4);
        }, 50); // 50ms latency tick to let layout settle
        transitionTimeouts.current.push(t3);
      }, 450); // 450ms (400ms fade-in transition + 50ms buffer)
      transitionTimeouts.current.push(t2);
    }, 50); // 50ms to let browser register mount
    transitionTimeouts.current.push(t1);

    return () => {
      clearTransitionTimeouts();
    };
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Lock/unlock body scroll when loader is active
  useEffect(() => {
    if (loaderState !== 'idle') {
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, [loaderState]);

  return (
    <>
      {/* Page Loader Splash */}
      <PageLoader state={loaderState} />

      {/* Floating Header */}
      <header 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          pointerEvents: 'none',
          opacity: isPageVisible ? 1 : 0, 
          transition: loaderState === 'exiting' ? 'opacity 0.6s ease' : 'none'
        }}
      >
        <Navbar onBookingClick={() => setIsBookingOpen(true)} />
        <StaggeredMobileMenu onBookingClick={() => setIsBookingOpen(true)} />
      </header>

      <div 
        className="bg-grain-container" 
        style={{ 
          opacity: isPageVisible ? 1 : 0, 
          transform: isPageVisible ? 'none' : 'translateY(6px)', 
          transition: loaderState === 'exiting' ? 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          willChange: loaderState === 'exiting' ? 'opacity, transform' : 'auto'
        }}
      >
        {/* Premium Gold Scroll Progress Bar */}
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'var(--color-brass)',
            transformOrigin: '0%',
            zIndex: 9999,
            scaleX
          }}
        />

        {/* Repeating tactile paper/grain background overlay */}
        <div className="grain-overlay" />

        {/* Ambient background leaf overlays with spring-physics mouse parallax */}
        <LeafOverlay />

        {/* Cross-page scroll anchor listener */}
        <ScrollToAnchor displayLocation={displayLocation} />

        {/* Main Pages */}
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage onBookingClick={() => setIsBookingOpen(true)} />} />
          <Route path="/banquets" element={<BanquetsPage />} />
          <Route path="/gallery" element={<GalleryPage onBookingClick={() => setIsBookingOpen(true)} />} />
          <Route path="/contacts" element={<ContactsPage onBookingClick={() => setIsBookingOpen(true)} />} />
        </Routes>

        {/* Contact and address block */}
        <Footer />

        {/* Table Reservation Modal */}
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      </div>
    </>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppContent isBookingOpen={isBookingOpen} setIsBookingOpen={setIsBookingOpen} />
    </BrowserRouter>
  );
}
