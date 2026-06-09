import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageSquare, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import './ContactsPage.css';

export default function ContactsPage({ onBookingClick }) {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="cp-page">
      {/* Back to Home & Small Header */}
      <header className="cp-header">
        <div className="container cp-header-container">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="cp-back-link">
            <ArrowLeft size={14} />
            На главную
          </a>
        </div>
      </header>

      {/* Main Content Container with stagger animation */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container cp-content"
      >
        {/* Section 1: Intro block + Image */}
        <motion.section variants={itemVariants} className="cp-intro-section">
          <div className="cp-intro-grid">
            <div className="cp-intro-text">
              <span className="label-caps cp-brand-label">Манжо Гриль</span>
              <h1 className="font-serif cp-title">Контакты</h1>
              <p className="body-lg cp-description">
                {"Мы всегда на\u00A0связи. Забронируйте стол, уточните детали или\u00A0постройте маршрут до\u00A0ресторана."}
              </p>
            </div>
            <div className="cp-intro-image-wrap">
              <picture>
                <source srcSet="/gallery_evening_thumb.avif" type="image/avif" />
                <source srcSet="/gallery_evening_thumb.webp" type="image/webp" />
                <img 
                  src="/gallery_evening_thumb.webp" 
                  alt="Интерьер Манжо Гриль вечером" 
                  className="cp-intro-image"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="cp-intro-image-overlay" />
            </div>
          </div>
        </motion.section>

        {/* Section 2: Main Contact cards */}
        <motion.section variants={itemVariants} className="cp-cards-section">
          <div className="cp-cards-grid">
            
            {/* Card 1: Address */}
            <div className="cp-card cp-address-card">
              <div className="cp-card-icon-wrap">
                <MapPin size={24} className="cp-icon" />
              </div>
              <h3 className="font-serif cp-card-title">Адрес</h3>
              <p className="body-md cp-card-text">
                Ростов-на-Дону, проспект Соколова, 19/22
              </p>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="btn btn-secondary cp-card-btn"
              >
                ПОСТРОИТЬ МАРШРУТ
              </a>
            </div>

            {/* Card 2: Phone */}
            <div className="cp-card cp-phone-card">
              <div className="cp-card-icon-wrap">
                <Phone size={24} className="cp-icon" />
              </div>
              <h3 className="font-serif cp-card-title">Телефон</h3>
              <p className="body-md cp-card-text cp-phone-number">
                +7 (999) 999-99-99
              </p>
              <a 
                href="tel:+79999999999" 
                className="btn btn-secondary cp-card-btn"
              >
                ПОЗВОНИТЬ
              </a>
            </div>

            {/* Card 3: Operating Hours */}
            <div className="cp-card cp-hours-card">
              <div className="cp-card-icon-wrap">
                <Clock size={24} className="cp-icon" />
              </div>
              <h3 className="font-serif cp-card-title">Режим работы</h3>
              <div className="cp-hours-block">
                <p className="body-md cp-hours-days">{"Понедельник\u00A0— Воскресенье"}</p>
                <p className="cp-hours-time">{"10:00\u00A0— 00:00"}</p>
              </div>
              <p className="cp-hours-sub">{"Ждем вас каждый день без\u00A0выходных!"}</p>
            </div>

          </div>
        </motion.section>

        {/* Section 3: Messengers quick links */}
        <motion.section variants={itemVariants} className="cp-messengers-section">
          <div className="cp-messengers-card">
            <h3 className="font-serif cp-messengers-title">Напишите нам</h3>
            <p className="body-md cp-messengers-text">
              {"Выберите удобный мессенджер для\u00A0быстрой связи с\u00A0администратором:"}
            </p>
            <div className="cp-messengers-buttons">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()} 
                className="btn cp-messenger-btn cp-telegram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cp-messenger-icon">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Map */}
        <motion.section variants={itemVariants} className="cp-map-section">
          <div className="cp-map-header">
            <h2 className="font-serif cp-map-title">Как нас найти</h2>
            <p className="body-md cp-map-subtitle">
              {"Постройте маршрут и\u00A0приезжайте провести вечер в\u00A0«Манжо Гриль»."}
            </p>
          </div>
          
          <div className="cp-map-container">
            {/* Background skeleton/loader */}
            <div className="cp-map-skeleton">
              <span className="cp-map-loader" />
              <p>Загрузка интерактивной карты...</p>
            </div>
            
            {/* Interactive iframe (Yandex Maps) */}
            <iframe 
              src="https://yandex.ru/map-widget/v1/?text=Ростов-на-Дону,+проспект+Соколова,+19/22&z=16" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen={true}
              loading="lazy"
              title="Манжо Гриль на Яндекс Картах"
              className="cp-map-iframe"
            />
            
            {/* Overlay Button */}
            <div className="cp-map-overlay-btn-wrap">
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()} 
                className="btn btn-primary cp-map-external-btn"
              >
                ОТКРЫТЬ В ЯНДЕКС КАРТАХ
              </a>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Booking CTA */}
        <motion.section variants={itemVariants} className="cp-booking-section">
          <div className="cp-booking-card">
            <div className="cp-booking-info">
              <h2 className="font-serif cp-booking-title">Забронируйте стол заранее</h2>
              <p className="body-md cp-booking-text">
                {"Оставьте заявку\u00A0— администратор свяжется с\u00A0вами и\u00A0подтвердит бронирование."}
              </p>
            </div>
            <button 
              onClick={onBookingClick} 
              className="btn btn-primary cp-booking-btn"
              type="button"
            >
              <Calendar size={16} style={{ marginRight: '8px' }} />
              ЗАБРОНИРОВАТЬ СТОЛ
            </button>
          </div>
        </motion.section>

        {/* Section 6: Banquets CTA */}
        <motion.section variants={itemVariants} className="cp-banquets-section">
          <div className="cp-banquets-card">
            <div className="cp-banquets-info">
              <h3 className="font-serif cp-banquets-title">Планируете мероприятие?</h3>
              <p className="body-md cp-banquets-text">
                {"Для\u00A0дней рождения, юбилеев, корпоративов и\u00A0семейных праздников у\u00A0нас есть отдельные форматы."}
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
              className="btn btn-secondary cp-banquets-btn"
              type="button"
            >
              ПЕРЕЙТИ К БАНКЕТАМ
              <ArrowRight size={15} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
