import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGallery from './CircularGallery';
import './Story.css';

// Atmospheric photos data representing the restaurant
const restaurantGallery = [
  { image: '/manjo photo/pic1_thumb.webp', text: '' },
  { image: '/manjo photo/pic2_thumb.webp', text: '' },
  { image: '/manjo photo/pic3_thumb.webp', text: '' },
  { image: '/manjo photo/pic4_thumb.webp', text: '' },
  { image: '/manjo photo/pic5_thumb.webp', text: '' },
  { image: '/manjo photo/pic6_thumb.webp', text: '' },
  { image: '/manjo photo/pic7_thumb.webp', text: '' },
  { image: '/manjo photo/pic8_thumb.webp', text: '' },
  { image: '/manjo photo/pic9_thumb.webp', text: '' },
  { image: '/manjo photo/pic10_thumb.webp', text: '' }
];

export default function Story() {
  const [showFullStory, setShowFullStory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  const sectionRef = useRef(null);

  // Monitor viewport size for mobile swipe-slider fallback
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // IntersectionObserver for lazy mounting WebGL content
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      id="story" 
      className="section-gap" 
      style={{ 
        backgroundColor: 'var(--color-ivory)', 
        position: 'relative', 
        overflow: 'hidden',
        paddingTop: '50px',
        paddingBottom: '30px'
      }}
      ref={sectionRef}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Upper Part: Header Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="story-text-container"
        >
          {/* Section Indicator Label */}
          <motion.span 
            variants={itemVariants} 
            className="label-caps" 
            style={{ color: 'var(--color-olive)', display: 'block', marginBottom: '12px' }}
          >
            О РЕСТОРАНЕ
          </motion.span>

          {/* Headline */}
          <motion.h2 
            variants={itemVariants} 
            className="headline-md font-serif" 
            style={{ color: 'var(--color-deep-green-dark)', marginBottom: '24px' }}
          >
            Место для тёплых вечеров
          </motion.h2>

          {/* Graphical Divider */}
          <motion.div variants={itemVariants} className="botanical-divider" style={{ marginBottom: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C12 2 15 8 18 11C21 14 21 18 18 20C15 22 12 22 12 22C12 22 9 22 6 20C3 18 3 14 6 11C9 8 12 2 12 2Z" />
              <path d="M12 2V22" />
              <path d="M12 11C12 11 15 13 16 15" />
              <path d="M12 14C12 14 9 16 8 18" />
            </svg>
          </motion.div>

          {/* Core concise description */}
          <motion.div 
            variants={itemVariants} 
            className="story-description font-serif"
            style={{ fontStyle: 'italic', fontWeight: '300' }}
          >
            {"«Манжо Гриль»\u00A0— ресторан с\u00A0блюдами на\u00A0открытом огне, выразительной кухней и\u00A0атмосферой, в\u00A0которую хочется возвращаться."}
          </motion.div>

          {/* Expand Story Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => setShowFullStory(!showFullStory)}
            className="story-toggle-btn"
            type="button"
          >
            {showFullStory ? 'Скрыть историю' : 'Читать историю'}
          </motion.button>

          {/* Collapsible Detailed Text */}
          <AnimatePresence>
            {showFullStory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="story-expanded-wrapper"
              >
                <div style={{ paddingBottom: '20px' }}>
                  <p className="story-expanded-text body-md">
                    {"В\u00A0«Манжо Гриль» мы\u00A0объединили любовь к\u00A0первоклассному мясу, профессиональный сервис и\u00A0атмосферу подлинного южного гостеприимства. Наш ресторан на\u00A0проспекте Соколова стал любимым местом встреч для\u00A0тех, кто\u00A0ценит вкусную еду и\u00A0качественный отдых."}
                  </p>
                  <p className="story-expanded-text body-md">
                    {"Наши повара\u00A0— настоящие маги и\u00A0чародеи своего дела. Мы\u00A0готовим сочные стейки, рыбу и\u00A0морепродукты на\u00A0открытом гриле, придавая им\u00A0неповторимый аромат дыма. А\u00A0чтобы ваш вечер стал еще\u00A0более расслабляющим, мы\u00A0предлагаем лучшие кальяны в\u00A0городе от\u00A0наших мастеров и\u00A0авторские коктейли. В\u00A0данный момент мы\u00A0принимаем гостей в\u00A0нашем уютном зале и\u00A0веранде, и\u00A0с\u00A0нетерпением ждем скорого открытия основного большого зала ресторана, чтобы подарить вам еще\u00A0больше тепла и\u00A0вкуса!"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lower Part: Gallery Block */}
      <div className="desktop-gallery-section" style={{ position: 'relative', zIndex: 2 }}>
        {hasBeenVisible && (
          <CircularGallery 
            items={restaurantGallery} 
            bend={isMobile ? 1.5 : 3} 
            textColor="#163A2D" 
            borderRadius={isMobile ? 0.03 : 0.05}
            font={isMobile ? "bold 13px Georgia" : "bold 18px Georgia"}
            showTitles={false}
          />
        )}
      </div>
    </section>
  );
}
