import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, ArrowRight } from 'lucide-react';

// Wood-fired embers / sparks particle system
const Sparks = () => {
  const particles = Array.from({ length: 25 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 6;
        const startX = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${startX}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: 'var(--color-brass)',
              boxShadow: '0 0 10px var(--color-brass), 0 0 16px #ff7a00',
              opacity: 0.5,
            }}
            animate={{
              y: ['0vh', '-95vh'],
              x: [`0px`, `${(Math.random() - 0.5) * 160}px`],
              opacity: [0.5, 0.8, 0],
              scale: [1, 1.4, 0.3]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: 'easeOut'
            }}
          />
        );
      })}
    </div>
  );
};

export default function Hero() {
  const handleScrollToMenu = (e) => {
    e.preventDefault();
    const element = document.querySelector('#menu');
    if (element) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      if (window.lenis) {
        window.lenis.scrollTo(offsetPosition, { duration: 1.2 });
      } else {
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const handleScrollToBooking = (e) => {
    e.preventDefault();
    const element = document.querySelector('#reservation');
    if (element) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      if (window.lenis) {
        window.lenis.scrollTo(offsetPosition, { duration: 1.2 });
      } else {
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="hero" className="hero-section">
      
      {/* Background image & overlays */}
      <div className="hero-bg-container">
        <img 
          src="/hero2.png" 
          alt="Манжо Гриль" 
          className="hero-bg-image"
        />
        {/* Soft local left-to-right gradient overlay for desktop readability */}
        <div className="hero-desktop-overlay" />
        {/* Soft dark gradient from the bottom for mobile readability */}
        <div className="hero-mobile-overlay" />
      </div>

      {/* Floating particles (embers/sparks) */}
      <Sparks />

      <div className="container hero-container">
        <div className="hero-content-block">
          
          <motion.span 
            className="label-caps hero-label"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {"РЕСТОРАН НА\u00A0ПРОСПЕКТЕ СОКОЛОВА"}
          </motion.span>
          
          <motion.h1 
            className="display-lg font-serif hero-title" 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            МАНЖО ГРИЛЬ
          </motion.h1>
          
          <motion.p 
            className="body-lg hero-description" 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {"Авторские блюда на\u00A0открытом огне, сочное мясо на\u00A0гриле и\u00A0атмосфера, в\u00A0которую хочется возвращаться."}
          </motion.p>
          
          <motion.div 
            className="hero-buttons-container"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a 
              href="#reservation" 
              onClick={handleScrollToBooking}
              className="btn hero-btn-primary"
            >
              <Calendar size={16} />
              Забронировать стол
            </a>
            <a 
              href="#menu" 
              onClick={handleScrollToMenu}
              className="btn hero-btn-secondary"
            >
              Изучить меню
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="hero-scroll-indicator"
          onClick={handleScrollToMenu}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="scroll-indicator-inner">
            <span className="label-caps scroll-text">Листать вниз</span>
            <ChevronDown size={18} className="scroll-icon" />
          </div>
        </motion.div>

      </div>
      
      <style>{`
        /* Desktop/Base Styles */
        .hero-section {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: #00140f;
        }

        @media (min-width: 769px) {
          .hero-section {
            padding-top: 100px;
          }
        }

        .hero-bg-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* Ambient left-to-right gradient for desktop text contrast */
        .hero-desktop-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0, 36, 25, 0.85) 0%, rgba(0, 36, 25, 0.45) 45%, rgba(0, 36, 25, 0) 70%);
          pointer-events: none;
          z-index: 2;
        }

        .hero-mobile-overlay {
          display: none;
        }

        .hero-container {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: calc(var(--gutter) + 2%);
        }

        .hero-content-block {
          max-width: 580px;
          text-align: left;
          margin-top: -50px; /* Vertical lift slightly above center */
        }

        .hero-label {
          color: var(--color-brass-dim);
          display: block;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .hero-title {
          color: var(--color-ivory);
          margin-bottom: 20px;
          font-size: 80px;
          line-height: 84px;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .hero-description {
          color: rgba(244, 239, 228, 0.85);
          margin-bottom: 40px;
          line-height: 28px;
          font-size: 19px;
          font-family: var(--font-sans);
        }

        .hero-buttons-container {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        /* Buttons Styling */
        .hero-btn-primary {
          background-color: var(--color-brass);
          color: var(--color-deep-green-dark);
          border: 1px solid var(--color-brass);
          padding: 14px 28px;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-primary:hover {
          background-color: var(--color-brass-light);
          border-color: var(--color-brass-light);
          transform: translateY(-2px);
        }

        .hero-btn-secondary {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--color-ivory);
          border: 1px solid rgba(244, 239, 228, 0.3);
          padding: 14px 28px;
          border-radius: var(--radius-md);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-secondary:hover {
          background-color: var(--color-ivory);
          color: var(--color-deep-green-dark) !important;
          border-color: var(--color-ivory);
          transform: translateY(-2px);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          z-index: 4;
        }

        .scroll-indicator-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.5;
        }

        .scroll-text {
          font-size: 9px;
          color: var(--color-ivory);
          letter-spacing: 0.15em;
        }

        .scroll-icon {
          color: var(--color-brass);
        }

        /* Responsive Breakpoints */
        @media (min-width: 1440px) {
          .hero-container {
            padding-left: 5%;
          }
          .hero-title {
            font-size: 88px;
            line-height: 92px;
          }
        }

        @media (min-width: 1920px) {
          .hero-container {
            padding-left: 8%;
          }
          .hero-title {
            font-size: 96px;
            line-height: 100px;
          }
        }

        @media (max-width: 1024px) {
          .hero-container {
            padding-left: var(--gutter);
          }
          .hero-title {
            font-size: 72px;
            line-height: 76px;
          }
        }

        /* Mobile Layout */
        @media (max-width: 768px) {
          .hero-desktop-overlay {
            display: none;
          }

          .hero-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 20, 15, 0.1) 0%, rgba(0, 20, 15, 0.5) 45%, rgba(0, 20, 15, 0.85) 100%);
            pointer-events: none;
            z-index: 2;
          }

          .hero-container {
            align-items: flex-end;
            justify-content: center;
            padding-left: var(--gutter);
            padding-right: var(--gutter);
            padding-bottom: 60px;
          }

          .hero-content-block {
            max-width: 100%;
            text-align: center;
            margin-top: 0;
          }

          .hero-label {
            font-size: 11px;
            margin-bottom: 12px;
          }

          .hero-title {
            font-size: 42px;
            line-height: 48px;
            margin-bottom: 16px;
          }

          .hero-description {
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 30px;
            max-width: 450px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons-container {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
            justify-content: center;
            max-width: 320px;
            margin: 0 auto;
          }

          .hero-btn-primary, .hero-btn-secondary {
            justify-content: center;
            padding: 12px 24px;
          }
          
          .hero-scroll-indicator {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
