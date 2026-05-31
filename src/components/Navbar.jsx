import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar({ onBookingClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, y: 0, width: 0, height: 0, opacity: 0 });

  const wrapperRef = useRef(null);
  const isClickScrollingRef = useRef(false);
  const clickScrollTimeoutRef = useRef(null);

  // Track scroll position to shrink the navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to highlight active sections on scroll (only on home page)
  useEffect(() => {
    if (location.pathname === '/menu') {
      setActiveSection('menu');
      return;
    }
    if (location.pathname === '/gallery') {
      setActiveSection('gallery');
      return;
    }
    if (location.pathname === '/banquets') {
      setActiveSection('banquets');
      return;
    }
    if (location.pathname === '/contacts') {
      setActiveSection('contacts');
      return;
    }

    const sections = ['hero', 'story', 'reservation', 'contacts'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isClickScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  // Calculate and update indicator coordinates dynamically relative to the container
  useEffect(() => {
    const updateIndicator = () => {
      if (!wrapperRef.current) return;
      
      const activeLinkEl = wrapperRef.current.querySelector(`.nav-capsule-link-wrap[data-id="${activeSection}"]`);
      
      if (activeLinkEl) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const linkRect = activeLinkEl.getBoundingClientRect();
        
        const x = linkRect.left - wrapperRect.left;
        const y = linkRect.top - wrapperRect.top;
        const width = linkRect.width;
        const height = linkRect.height;
        
        setIndicatorStyle({
          x,
          y,
          width,
          height,
          opacity: 1
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();

    window.addEventListener('resize', updateIndicator);
    
    const interval = setInterval(updateIndicator, 30);
    const timeout = setTimeout(() => clearInterval(interval), 500);

    return () => {
      window.removeEventListener('resize', updateIndicator);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [activeSection, isScrolled]);

  const leftLinks = [
    { name: 'Главная', href: '#hero', id: 'hero' },
    { name: 'Меню', href: '/menu', id: 'menu' },
    { name: 'О ресторане', href: '#story', id: 'story' },
  ];

  const rightLinks = [
    { name: 'Банкеты', href: '/banquets', id: 'banquets' },
    { name: 'Галерея', href: '/gallery', id: 'gallery' },
    { name: 'Контакты', href: '/contacts', id: 'contacts' },
  ];

  const handleLinkClick = (e, href, id) => {
    e.preventDefault();

    if (id === 'menu' || id === 'gallery' || id === 'banquets' || id === 'contacts') {
      setActiveSection(id);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0 });
      }
      if (id === 'banquets') {
        navigate('/banquets');
      } else if (id === 'gallery') {
        navigate('/gallery');
      } else if (id === 'contacts') {
        navigate('/contacts');
      } else {
        navigate('/menu');
      }
      return;
    }

    if (location.pathname !== '/') {
      // Transition back to home and scroll to target section
      navigate('/', { state: { scrollTo: href, activeId: id } });
      setActiveSection(id);
    } else {
      // Local scrolling on home page
      setActiveSection(id);
      isClickScrollingRef.current = true;
      
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }

      const element = document.querySelector(href);
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

        clickScrollTimeoutRef.current = setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 1000);
      } else {
        isClickScrollingRef.current = false;
      }
    }
  };

  const indicatorTransition = {
    type: 'spring',
    stiffness: 320,
    damping: 34,
    mass: 0.7
  };

  return (
    <motion.nav
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`desktop-navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="nav-capsule-wrapper" ref={wrapperRef}>
        
        <motion.div
          className="nav-active-pill-bg"
          animate={{
            x: indicatorStyle.x,
            y: indicatorStyle.y,
            width: indicatorStyle.width,
            height: indicatorStyle.height,
            opacity: indicatorStyle.opacity
          }}
          initial={false}
          transition={indicatorTransition}
        >
          <span className="nav-active-dot" />
        </motion.div>

        <div className="nav-group">
          {leftLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                data-id={link.id}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`nav-capsule-link-wrap ${isActive ? 'active' : ''}`}
              >
                <span className="nav-dot-marker" />
                <span className="nav-link-text">{link.name}</span>
              </a>
            );
          })}
        </div>

        <button 
          onClick={onBookingClick}
          className="nav-booking-btn"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="booking-btn-text">ЗАБРОНИРОВАТЬ</span>
        </button>

        <div className="nav-group">
          {rightLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                data-id={link.id}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`nav-capsule-link-wrap ${isActive ? 'active' : ''}`}
              >
                <span className="nav-dot-marker" />
                <span className="nav-link-text">{link.name}</span>
              </a>
            );
          })}
        </div>

      </div>

      <style>{`
        /* Desktop Capsule Navbar Styles */
        .desktop-navbar {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          width: auto;
        }

        .desktop-navbar.scrolled {
          top: 14px;
        }

        .nav-capsule-wrapper {
          display: flex;
          align-items: center;
          gap: 24px;
          background-color: var(--color-deep-green-dark);
          border: 1px solid rgba(244, 239, 228, 0.1);
          border-radius: 40px;
          padding: 12px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .desktop-navbar.scrolled .nav-capsule-wrapper {
          padding: 8px 18px;
          background-color: rgba(0, 36, 25, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-color: rgba(244, 239, 228, 0.15);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        }

        .nav-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Link Wrap */
        .nav-capsule-link-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 24px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-link-text {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-ivory);
          opacity: 0.7;
          position: relative;
          z-index: 2;
          transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-capsule-link-wrap:hover .nav-link-text {
          opacity: 1;
          color: var(--color-ivory);
        }

        .nav-capsule-link-wrap.active .nav-link-text {
          color: var(--color-deep-green-dark);
          opacity: 1;
        }

        /* Dot Above Item */
        .nav-dot-marker {
          width: 3px;
          height: 3px;
          background-color: var(--color-brass);
          border-radius: 50%;
          margin-bottom: 4px;
          opacity: 0.25;
          position: relative;
          z-index: 2;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-capsule-link-wrap:hover .nav-dot-marker {
          opacity: 0.8;
          transform: scale(1.3);
        }

        .nav-capsule-link-wrap.active .nav-dot-marker {
          opacity: 0;
        }

        /* Active Pill Background sliding animation */
        .nav-active-pill-bg {
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--color-ivory);
          border-radius: 24px;
          z-index: 1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          pointer-events: none;
        }

        /* Dot Below Active Item inside indicator container */
        .nav-active-dot {
          width: 3px;
          height: 3px;
          background-color: var(--color-deep-green-dark);
          border-radius: 50%;
          margin-bottom: 4px;
        }

        /* Center Booking Button */
        .nav-booking-btn {
          background-color: var(--color-brass);
          color: var(--color-deep-green-dark);
          border: 1px solid var(--color-brass);
          border-radius: 24px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          z-index: 10;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgba(183, 154, 99, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .nav-booking-btn:hover {
          background-color: var(--color-brass-light);
          border-color: var(--color-brass-light);
          transform: translateY(-1px);
        }

        .nav-booking-btn:active {
          transform: scale(0.96);
        }

        .logo-svg {
          width: 13px;
          height: 13px;
          color: var(--color-deep-green-dark);
        }

        .booking-btn-text {
          line-height: 1.1;
        }

        /* Adjustments when scrolled */
        .desktop-navbar.scrolled .nav-booking-btn {
          padding: 6px 14px;
          font-size: 10.5px;
        }

        /* Responsive Breakpoint: Hide on mobile */
        @media (max-width: 768px) {
          .desktop-navbar {
            display: none !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}
