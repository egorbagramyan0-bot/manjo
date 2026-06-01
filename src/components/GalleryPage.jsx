import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Phone, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import './GalleryPage.css';

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'interior', name: 'Интерьер' },
  { id: 'kitchen', name: 'Кухня' },
  { id: 'atmosphere', name: 'Атмосфера' },
  { id: 'banquets', name: 'Банкеты' },
  { id: 'details', name: 'Детали' }
];

const galleryItems = [
  {
    id: 1,
    src: '/hero_conservatory.png',
    title: 'Панорамный зимний сад',
    desc: 'Светлое пространство зимнего сада, наполненное живыми тропическими растениями и\u00A0атмосферой уюта.',
    categories: ['interior', 'atmosphere'],
    sizeClass: 'gp-grid-wide'
  },
  {
    id: 2,
    src: '/gallery_table.png',
    title: 'Детали сервировки',
    desc: 'Премиальная сервировка стола, натуральный текстиль и\u00A0внимание к\u00A0каждой мелочи для\u00A0вашего праздника.',
    categories: ['details', 'banquets'],
    sizeClass: 'gp-grid-tall'
  },
  {
    id: 3,
    src: '/gallery_fireplace.png',
    title: 'Уютный каминный зал',
    desc: 'Теплый свет живого огня в\u00A0камине, мягкие кресла и\u00A0спокойная атмосфера загородного отдыха.',
    categories: ['interior', 'atmosphere', 'details'],
    sizeClass: 'gp-grid-square'
  },
  {
    id: 4,
    src: '/gallery_cuisine.png',
    title: 'Авторская подача блюд',
    desc: 'Изысканные вкусовые сочетания и\u00A0художественная подача от\u00A0нашего шеф-повара.',
    categories: ['kitchen'],
    sizeClass: 'gp-grid-tall'
  },
  {
    id: 5,
    src: '/gallery_hall.png',
    title: 'Просторный банкетный зал',
    desc: 'Элегантный и\u00A0вместительный основной зал ресторана «Манжо Гриль» для\u00A0масштабных торжеств.',
    categories: ['interior', 'banquets'],
    sizeClass: 'gp-grid-square'
  },
  {
    id: 6,
    src: '/gallery_evening.png',
    title: 'Вечерняя атмосфера',
    desc: 'Особое настроение вечернего ресторана с\u00A0приглушенным светом и\u00A0живым общением.',
    categories: ['atmosphere', 'banquets'],
    sizeClass: 'gp-grid-wide'
  },
  {
    id: 7,
    src: '/gallery_bar.png',
    title: 'Барная зона',
    desc: 'Стильная контактная стойка, профессиональные бармены и\u00A0эксклюзивная карта напитков.',
    categories: ['interior', 'details'],
    sizeClass: 'gp-grid-square'
  },
  {
    id: 8,
    src: '/gallery_grill.png',
    title: 'Кухня на углях',
    desc: 'Процесс приготовления фирменных мясных деликатесов на\u00A0открытом огне березовых углей.',
    categories: ['kitchen', 'atmosphere'],
    sizeClass: 'gp-grid-tall'
  },
  {
    id: 9,
    src: '/dish_grill.png',
    title: 'Сочный стейк Рибай',
    desc: 'Премиальное мясо идеальной прожарки, приготовленное на\u00A0решетке гриля.',
    categories: ['kitchen'],
    sizeClass: 'gp-grid-square'
  },
  {
    id: 10,
    src: '/dish_salad.png',
    title: 'Фирменный зеленый салат',
    desc: 'Сочетание хрустящей зелени, спелых овощей и\u00A0оригинальной легкой заправки.',
    categories: ['kitchen', 'details'],
    sizeClass: 'gp-grid-wide'
  },
  {
    id: 11,
    src: '/dish_cocktail.png',
    title: 'Авторский коктейль',
    desc: 'Эстетика в\u00A0каждом бокале: сбалансированные коктейли с\u00A0необычными вкусовыми нотками.',
    categories: ['kitchen', 'details'],
    sizeClass: 'gp-grid-tall'
  },
  {
    id: 12,
    src: '/gallery_veranda.png',
    title: 'Летняя терраса',
    desc: 'Утопающая в\u00A0зелени веранда для\u00A0приятных обедов и\u00A0ужинов на\u00A0свежем воздухе.',
    categories: ['interior', 'atmosphere'],
    sizeClass: 'gp-grid-square'
  }
];

export default function GalleryPage({ onBookingClick }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const filterSliderRef = useRef(null);

  // Force page to open at the top on mount
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Filter items based on active category
  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.categories.includes(activeFilter));

  // Keydown listener for Modal (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredItems]);

  // Lock scroll when Modal is open
  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex]);

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  };

  // Touch Swipe Handlers for Mobile Lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const distance = touchEndX.current - touchStartX.current;
    
    // Threshold of 50px for swipes
    if (distance > 50) {
      handlePrevPhoto();
    } else if (distance < -50) {
      handleNextPhoto();
    }
  };

  return (
    <div className="gp-page">
      
      {/* 1. First Screen - Editorial Header */}
      <header className="gp-header">
        <div className="container gp-header-container">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="gp-back-link">
            <ArrowLeft size={14} />
            На главную
          </a>
          <span className="label-caps gp-brand-badge">Манжо Гриль</span>
          <h1 className="font-serif gp-title">Галерея</h1>
          <p className="gp-header-subtitle">
            {"Атмосфера, ради которой хочется возвращаться. Интерьер, блюда и\u00A0особенные моменты в\u00A0«Манжо Гриль»."}
          </p>
        </div>
      </header>

      {/* 2. Banner Image */}
      <div className="container gp-banner-container">
        <div className="gp-hero-banner-wrap">
          <picture>
            <source srcSet="/hero_conservatory_full.avif" type="image/avif" />
            <source srcSet="/hero_conservatory_full.webp" type="image/webp" />
            <img 
              src="/hero_conservatory_full.webp" 
              alt="Атмосфера Манжо Гриль" 
              className="gp-hero-banner-img"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="gp-hero-banner-overlay" />
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <nav className="gp-filters-nav">
        <div className="container">
          <div className="gp-filters-container" ref={filterSliderRef}>
            {categories.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveFilter(cat.id);
                    setSelectedPhotoIndex(null); // Reset open photo states on filter change
                  }}
                  className={`gp-filter-btn ${isActive ? 'active' : ''}`}
                  type="button"
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Modular Photo Grid */}
      <section className="gp-grid-section">
        <div className="container">
          <motion.div 
            layout 
            className="gp-photo-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                // Find matching index in filtered array for modal navigation
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`gp-photo-card ${item.sizeClass}`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <div className="gp-photo-img-wrap">
                      <picture>
                        <source srcSet={item.src.replace('.png', '_thumb.avif')} type="image/avif" />
                        <source srcSet={item.src.replace('.png', '_thumb.webp')} type="image/webp" />
                        <img 
                          src={item.src.replace('.png', '_thumb.webp')} 
                          alt={item.title} 
                          className="gp-photo-img" 
                          loading={index < 4 ? "eager" : "lazy"} 
                          decoding="async"
                        />
                      </picture>
                      <div className="gp-photo-card-overlay">
                        <div className="gp-photo-card-info">
                          <h3 className="font-serif gp-photo-card-title">{item.title}</h3>
                          <p className="gp-photo-card-desc">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 5. Accent Bento Block inside gallery */}
      <section className="gp-accent-section">
        <div className="container">
          <div className="gp-accent-card" style={{ backgroundImage: `url('/gallery_fireplace_full.webp')` }}>
            <div className="gp-accent-overlay" />
            <div className="gp-accent-content">
              <h2 className="font-serif gp-accent-title">Здесь каждый вечер складывается из деталей</h2>
              <p className="gp-accent-text">
                {"Тёплый свет, живая атмосфера и\u00A0кухня, к\u00A0которой хочется возвращаться."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Banquets Page CTA Block */}
      <section className="gp-banquets-cta-section section-gap">
        <div className="container">
          <div className="gp-banquet-cta-card">
            <div className="gp-banquet-cta-info">
              <h3 className="font-serif gp-banquet-cta-title">Планируете особенный вечер?</h3>
              <p className="gp-banquet-cta-text">
                {"Расскажите нам о\u00A0вашем событии\u00A0— мы поможем подобрать подходящий формат."}
              </p>
            </div>
            <button 
              onClick={() => {
                if (window.lenis) {
                  window.lenis.scrollTo(0, { immediate: true });
                } else {
                  window.scrollTo(0, 0);
                }
                navigate('/banquets');
              }} 
              className="btn btn-secondary gp-banquet-cta-btn"
              type="button"
            >
              ПЕРЕЙТИ К БАНКЕТАМ
              <ArrowRight size={15} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Final Booking CTA */}
      <section className="gp-final-cta-section" style={{ backgroundImage: `url('/hero2_desktop.webp')` }}>
        <div className="gp-final-cta-overlay" />
        <div className="container gp-final-cta-container">
          <h2 className="font-serif gp-final-title">Увидимся в «Манжо Гриль»</h2>
          <p className="gp-final-subtitle">{"Забронируйте стол и\u00A0почувствуйте атмосферу лично."}</p>
          <button 
            onClick={onBookingClick} 
            className="btn btn-primary gp-final-btn"
            type="button"
          >
            <Calendar size={15} style={{ marginRight: '8px' }} />
            ЗАБРОНИРОВАТЬ СТОЛ
          </button>
        </div>
      </section>

      {/* 8. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="gp-lightbox-overlay"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="gp-lightbox-close-btn"
              aria-label="Закрыть просмотр"
              type="button"
            >
              <X size={24} />
            </button>

            {/* Navigation Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="gp-lightbox-nav-btn gp-lightbox-nav-left"
              aria-label="Предыдущее фото"
              type="button"
            >
              <ChevronLeft size={36} />
            </button>

            {/* Lightbox Content Container */}
            <div 
              className="gp-lightbox-content"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <picture>
                <source srcSet={filteredItems[selectedPhotoIndex].src.replace('.png', '_full.avif')} type="image/avif" />
                <source srcSet={filteredItems[selectedPhotoIndex].src.replace('.png', '_full.webp')} type="image/webp" />
                <img 
                  src={filteredItems[selectedPhotoIndex].src.replace('.png', '_full.webp')} 
                  alt={filteredItems[selectedPhotoIndex].title} 
                  className="gp-lightbox-img"
                  decoding="async"
                />
              </picture>
              
              {/* Photo Caption */}
              <div className="gp-lightbox-caption">
                <h4 className="font-serif gp-lightbox-caption-title">
                  {filteredItems[selectedPhotoIndex].title}
                </h4>
                <p className="gp-lightbox-caption-desc">
                  {filteredItems[selectedPhotoIndex].desc}
                </p>
              </div>
            </div>

            {/* Navigation Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="gp-lightbox-nav-btn gp-lightbox-nav-right"
              aria-label="Следующее фото"
              type="button"
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
