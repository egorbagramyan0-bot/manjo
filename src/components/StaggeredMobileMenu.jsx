import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Calendar, Phone } from 'lucide-react';
import './StaggeredMobileMenu.css';

export default function StaggeredMobileMenu({ onBookingClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // DOM Refs for GSAP
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Animation Tween/Timeline Refs
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const colorTweenRef = useRef(null);
  const busyRef = useRef(false);

  const menuItems = [
    { label: 'Главная', href: '#hero', id: 'hero' },
    { label: 'Меню', href: '/menu', id: 'menu' },
    { label: 'О ресторане', href: '#story', id: 'story' },
    { label: 'Банкеты', href: '/banquets', id: 'banquets' },
    { label: 'Галерея', href: '/gallery', id: 'gallery' },
    { label: 'Контакты', href: '#contacts', id: 'contacts' }
  ];

  // Scroll tracking to change menu button color
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Initial layout configuration
  useEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      if (!panel || !plusH || !plusV || !icon) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.smm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      // Position: offscreen to the right (100%)
      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    });
    return () => ctx.revert();
  }, []);

  // Build the opening timeline using GSAP
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.smm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.smm-panel-list[data-numbering] .smm-panel-item'));
    const footerEl = panel.querySelector('.smm-footer');

    // Initial item offscreens
    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 6 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--smm-num-opacity': 0 });
    }
    if (footerEl) {
      gsap.set(footerEl, { opacity: 0, y: 20 });
    }

    const tl = gsap.timeline({ paused: true });

    // Stagger layers slide in
    layers.forEach((layer, i) => {
      tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.08);
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.08 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.09 : 0);
    const panelDuration = 0.65;

    // Slide in the main panel
    tl.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    // Stagger reveal menu links
    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' }
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.5,
            ease: 'power2.out',
            '--smm-num-opacity': 1,
            stagger: { each: 0.06, from: 'start' }
          },
          itemsStart + 0.08
        );
      }
    }

    // Fade in bottom footer details (socials, phone, button)
    if (footerEl) {
      const footerStart = panelInsertTime + panelDuration * 0.45;
      tl.to(
        footerEl,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        },
        footerStart
      );
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  // Slide out close animation
  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    
    closeTweenRef.current = gsap.to(all, {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.smm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 6 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.smm-panel-list[data-numbering] .smm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--smm-num-opacity': 0 });
        }
        const footerEl = panel.querySelector('.smm-footer');
        if (footerEl) {
          gsap.set(footerEl, { opacity: 0, y: 20 });
        }
        busyRef.current = false;
      }
    });
  }, []);

  // Icon spinning animation (plus to close cross)
  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, []);

  // Color change transitions for menu button
  const animateColor = useCallback((opening) => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    const targetColor = opening ? 'var(--color-ivory)' : (isScrolled ? 'var(--color-deep-green-dark)' : 'var(--color-ivory)');
    colorTweenRef.current = gsap.to(btn, {
      color: targetColor,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isScrolled]);

  // Hook scroll button color to scroll changes when closed
  useEffect(() => {
    if (!open && toggleBtnRef.current) {
      gsap.set(toggleBtnRef.current, { color: isScrolled ? 'var(--color-deep-green-dark)' : 'var(--color-ivory)' });
    }
  }, [isScrolled, open]);

  // Main Toggle
  const toggleMenu = useCallback(() => {
    if (busyRef.current) return;
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      playOpen();
    } else {
      playClose();
    }
    animateIcon(target);
    animateColor(target);
  }, [playOpen, playClose, animateIcon, animateColor]);

  // Direct close hook
  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      playClose();
      animateIcon(false);
      animateColor(false);
    }
  }, [playClose, animateIcon, animateColor]);

  // Close on click-outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closeMenu]);

  const handleBookingClick = (e) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      if (onBookingClick) onBookingClick();
    }, 350);
  };

  // Clean scrolling click helper that closes panel first
  const handleLinkClick = (e, href, id) => {
    e.preventDefault();
    closeMenu();
    
    if (id === 'menu' || id === 'gallery' || id === 'banquets') {
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0 });
        }
        if (id === 'banquets') {
          navigate('/banquets');
        } else if (id === 'gallery') {
          navigate('/gallery');
        } else {
          navigate('/menu');
        }
      }, 350);
      return;
    }

    if (location.pathname !== '/') {
      setTimeout(() => {
        navigate('/', { state: { scrollTo: href } });
      }, 350);
    } else {
      // Smooth scroll delay to match panel sliding out of view
      setTimeout(() => {
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
        }
      }, 350);
    }
  };

  return (
    <div className="staggered-mobile-menu-wrapper" ref={wrapperRef}>
      
      {/* Dynamic Header Background when closed & scrolled */}
      <div 
        className={`staggered-mobile-menu-header-bg ${isScrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`} 
      />

      {/* Header element overlay */}
      <header className="staggered-mobile-menu-header">
        
        {/* Logo and Brand Name */}
        <a 
          href="#hero" 
          onClick={(e) => handleLinkClick(e, '#hero', 'hero')}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-brass)' }}>
            <path d="M12 2v4" />
            <path d="M17 3v3" />
            <path d="M7 3v3" />
            <path d="M3 11h18" />
            <path d="M19 11v1a7 7 0 0 1-14 0v-1" />
            <path d="M7 18v3" />
            <path d="M17 18v3" />
          </svg>
          <span 
            className="font-serif" 
            style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              letterSpacing: '0.04em', 
              color: open ? 'var(--color-ivory)' : (isScrolled ? 'var(--color-deep-green-dark)' : 'var(--color-ivory)'),
              textTransform: 'uppercase',
              transition: 'color 0.3s ease'
            }}
          >
            Манжо Гриль
          </span>
        </a>

        {/* Toggle Button matching React Bits */}
        <button
          ref={toggleBtnRef}
          onClick={toggleMenu}
          className="smm-toggle"
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          type="button"
        >
          <span className="smm-toggle-textWrap">
            <span className="smm-toggle-textInner" style={{ transform: open ? 'translateY(-1.2em)' : 'translateY(0)' }}>
              <span className="smm-toggle-line">Меню</span>
              <span className="smm-toggle-line">Закрыть</span>
            </span>
          </span>
          <span ref={iconRef} className="smm-icon">
            <span ref={plusHRef} className="smm-icon-line" />
            <span ref={plusVRef} className="smm-icon-line smm-icon-line-v" />
          </span>
        </button>

      </header>

      {/* Underlay Prelayers */}
      <div ref={preLayersRef} className="smm-prelayers">
        {/* Layer 1 (Olive), Layer 2 (Gold) */}
        <div className="smm-prelayer" style={{ backgroundColor: 'var(--color-olive)' }} />
        <div className="smm-prelayer" style={{ backgroundColor: 'var(--color-brass)' }} />
      </div>

      {/* Main Drawer Panel */}
      <aside ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        


        <div className="smm-panel-inner">
          
          {/* Staggered items list */}
          <ul className="smm-panel-list" data-numbering={true}>
            {menuItems.map((item, idx) => (
              <li className="smm-panel-itemWrap" key={item.label + idx}>
                <a 
                  className="smm-panel-item" 
                  href={item.href} 
                  onClick={(e) => handleLinkClick(e, item.href, item.id)}
                >
                  <span className="smm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Socials & CTAs footer inside panel */}
          <div className="smm-footer">
            
            <a href="tel:+79185431111" className="smm-phone">
              <Phone size={16} style={{ marginRight: '6px', display: 'inline' }} />
              +7 (918) 543-11-11
            </a>

            {/* Social links */}
            <ul className="smm-socials-list">
              <li>
                <a href="https://t.me/manjogrill" target="_blank" rel="noopener noreferrer" className="smm-socials-link">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://wa.me/79185431111" target="_blank" rel="noopener noreferrer" className="smm-socials-link">
                  WhatsApp
                </a>
              </li>
            </ul>

            {/* Primary noticeable CTA */}
            <button 
              onClick={handleBookingClick}
              className="smm-booking-btn"
              type="button"
              style={{ width: '100%', border: 'none', cursor: 'pointer' }}
            >
              <Calendar size={15} />
              Забронировать стол
            </button>

          </div>

        </div>

      </aside>

    </div>
  );
}
