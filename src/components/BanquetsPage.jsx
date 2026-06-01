import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Phone, MessageSquare, Send, CheckCircle, AlertTriangle, Sparkles, MapPin, Award, ShieldCheck, Flame, Compass } from 'lucide-react';
import './BanquetsPage.css';

const eventFormats = [
  { name: 'Свадьбы', desc: 'Красивое торжество с\u00A0изысканной подачей', image: '/gallery_table_full.webp' },
  { name: 'Дни рождения', desc: 'Веселый праздник в\u00A0кругу близких', image: '/gallery_evening_full.webp' },
  { name: 'Юбилеи', desc: 'Особенная дата в\u00A0торжественной обстановке', image: '/hero2_desktop.webp' },
  { name: 'Корпоративы', desc: 'Стильное событие для\u00A0вашей команды', image: '/gallery_hall_full.webp' },
  { name: 'Семейные праздники', desc: 'Уютный вечер, полный тепла и\u00A0заботы', image: '/gallery_veranda_full.webp' },
  { name: 'Камерные ужины', desc: 'Индивидуальный формат для\u00A0узкого круга', image: '/gallery_fireplace_full.webp' }
];

const banquetHalls = [
  {
    id: 'main',
    name: 'Основной зал',
    desc: 'Просторный и\u00A0светлый зал с\u00A0высокими потолками, панорамными окнами и\u00A0сценой для\u00A0проведения масштабных праздников и\u00A0больших компаний.',
    image: '/gallery_hall_thumb.webp'
  },
  {
    id: 'cozy',
    name: 'Уютная зона',
    desc: 'Обособленное пространство с\u00A0мягким приглушенным светом и\u00A0расслабляющей атмосферой для\u00A0камерных мероприятий в\u00A0спокойной обстановке.',
    image: '/gallery_fireplace_thumb.webp'
  },
  {
    id: 'general',
    name: 'Общий формат',
    desc: 'Размещение в\u00A0общем пространстве ресторана для\u00A0проведения праздника с\u00A0живой и\u00A0динамичной атмосферой «Манжо Гриль».',
    image: '/gallery_veranda_thumb.webp'
  }
];

const galleryImages = [
  { src: '/gallery_table_thumb.webp', alt: 'Детали сервировки банкета' },
  { src: '/gallery_hall_thumb.webp', alt: 'Оформление праздничного зала' },
  { src: '/gallery_evening_thumb.webp', alt: 'Атмосфера вечернего праздника' },
  { src: '/gallery_cuisine_thumb.webp', alt: 'Подача банкетных блюд' },
  { src: '/gallery_veranda_thumb.webp', alt: 'Банкет на летней веранде' },
  { src: '/gallery_fireplace_thumb.webp', alt: 'Уютная каминная зона для встреч' },
  { src: '/dish_grill_thumb.webp', alt: 'Фирменные блюда на открытом огне' },
  { src: '/hero2_desktop.webp', alt: 'Застолье в интерьере ресторана' }
];

export default function BanquetsPage() {
  const formRef = useRef(null);
  const hallsRef = useRef(null);
  const galleryRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    guests: '10',
    zone: 'main',
    occasion: 'birthday',
    contactMethod: 'phone',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Drag scroll state for horizontal gallery
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  // Force page to open at the top on mount
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const scrollToElement = (ref) => {
    if (ref.current) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = ref.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      if (window.lenis) {
        window.lenis.scrollTo(ref.current, { offset: -offset, duration: 1.2 });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format Russian phone number +7 (XXX) XXX-XX-XX
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    let digits = value.replace(/[^\d]/g, '');

    if (digits.startsWith('7') || digits.startsWith('8')) {
      digits = digits.substring(1);
    }

    let formatted = '';
    if (digits.length > 0) {
      formatted = '+7 (' + digits.substring(0, 3);
    } else {
      formatted = '';
    }

    if (digits.length >= 4) {
      formatted += ') ' + digits.substring(3, 6);
    }
    if (digits.length >= 7) {
      formatted += '-' + digits.substring(6, 8);
    }
    if (digits.length >= 9) {
      formatted += '-' + digits.substring(8, 10);
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSelectHall = (hallId) => {
    setFormData((prev) => ({ ...prev, zone: hallId }));
    scrollToElement(formRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const digitsOnly = formData.phone.replace(/[^\d]/g, '');
    if (digitsOnly.length < 11) {
      setErrorMsg('Пожалуйста, введите корректный номер телефона (11 цифр).');
      return;
    }

    setIsSubmitting(true);

    try {
      const zoneMap = {
        main: 'Основной зал',
        cozy: 'Уютная зона',
        general: 'Общий формат'
      };

      const occasionMap = {
        birthday: 'День рождения',
        wedding: 'Свадьба',
        anniversary: 'Юбилей',
        corporate: 'Корпоратив',
        family: 'Семейный праздник',
        chamber: 'Камерный ужин',
        other: 'Другой повод'
      };

      const contactMap = {
        telegram: 'Telegram',
        whatsapp: 'WhatsApp',
        max: 'MAX Messenger',
        phone: 'Звонок по телефону'
      };

      const adminMessage = `
Новая заявка на банкет — Манжо Гриль

Имя: ${formData.name}
Телефон: ${formData.phone}
Дата мероприятия: ${formData.date}
Количество гостей: ${formData.guests}
Выбранная зона: ${zoneMap[formData.zone]}
Повод: ${occasionMap[formData.occasion]}
Способ связи: ${contactMap[formData.contactMethod]}
Комментарий: ${formData.comment || 'Нет'}
Источник: Страница «Банкеты»
Отправлено: ${new Date().toLocaleString('ru-RU')}
      `.trim();

      console.log("%c[Манжо Гриль - New Banquet Booking]%c\n" + adminMessage, "color: #B79A63; font-weight: bold; font-size: 13px;", "color: inherit;");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        date: '',
        guests: '10',
        zone: 'main',
        occasion: 'birthday',
        contactMethod: 'phone',
        comment: ''
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Не удалось отправить заявку. Попробуйте еще раз или свяжитесь с нами по телефону.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag to scroll logic for horizontal gallery
  const onMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeftVal.current = galleryRef.current.scrollLeft;
    galleryRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    galleryRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
    }
  };

  // Form rendering helpers
  const contactOptions = [
    { key: 'phone', label: 'Позвонить' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'max', label: 'MAX' }
  ];

  const renderContactIcon = (key) => {
    switch (key) {
      case 'phone':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );
      case 'telegram':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case 'max':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ borderRadius: '3px', overflow: 'hidden', marginRight: '6px' }}>
            <defs>
              <linearGradient id="maxGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="50%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#9d00ff" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="24" height="24" rx="5" fill="url(#maxGradient2)" />
            <path fill="#ffffff" fillRule="evenodd" d="M12,4.5 C16.142,4.5 19.5,7.858 19.5,12 C19.5,16.142 16.142,19.5 12,19.5 C10.895,19.5 9.851,19.261 8.912,18.832 L6.645,19.965 C6.147,20.214 5.597,19.745 5.781,19.217 L6.591,16.889 C5.264,15.582 4.5,13.863 4.5,12 C4.5,7.858 7.858,4.5 12,4.5 Z M12,8.25 C9.929,8.25 8.25,9.929 8.25,12 C8.25,13.05 8.65,13.85 9.295,14.445 L8.891,15.608 L10.456,15.416 C10.95,15.65 11.45,15.75 12,15.75 C14.071,15.75 15.75,14.071 15.75,12 C15.75,9.929 14.071,8.25 12,8.25 Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="banquets-page">
      
      {/* 1. Hero Screen */}
      <section className="banquets-hero" style={{ backgroundImage: `url('/gallery_table_full.webp')` }}>
        <div className="banquets-hero-overlay" />
        <div className="banquets-hero-content container">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="label-caps hero-badge"
          >
            Манжо Гриль
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif hero-title"
          >
            {"Банкеты и\u00A0особенные события"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-subtitle"
          >
            {"Создадим атмосферу для\u00A0вашего праздника\u00A0— от\u00A0камерного семейного ужина до\u00A0большого торжества."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="hero-buttons"
          >
            <button 
              onClick={() => scrollToElement(formRef)} 
              className="btn btn-primary hero-btn-main"
            >
              ОБСУДИТЬ БАНКЕТ
            </button>
            <button 
              onClick={() => scrollToElement(hallsRef)} 
              className="btn btn-secondary hero-btn-sub"
            >
              ПОСМОТРЕТЬ ЗАЛЫ
            </button>
          </motion.div>
        </div>

        {/* Hero Features Bar at the bottom */}
        <div className="banquets-hero-features">
          <div className="container features-inner">
            <div className="feature-item">
              <Sparkles size={16} className="feature-icon" />
              <span>Индивидуальное меню</span>
            </div>
            <div className="feature-item">
              <Compass size={16} className="feature-icon" />
              <span>{"Помощь с\u00A0организацией"}</span>
            </div>
            <div className="feature-item">
              <Flame size={16} className="feature-icon" />
              <span>Уютная атмосфера</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Introductory Section */}
      <section className="banquets-intro section-gap">
        <div className="container intro-grid">
          <div className="intro-text">
            <span className="label-caps accent-label">О БАНКЕТАХ</span>
            <h2 className="font-serif section-title">{"Ваш праздник в\u00A0«Манжо Гриль»"}</h2>
            <p className="body-lg intro-p">
              {"День рождения, свадьба, юбилей, корпоратив или\u00A0семейный ужин\u00A0— мы поможем подобрать подходящий формат, составить меню и\u00A0продумать детали мероприятия. Вам останется только наслаждаться вечером вместе с\u00A0гостями."}
            </p>
          </div>
          <div className="intro-image-wrap">
            <picture>
              <source srcSet="/hero_conservatory_thumb.avif" type="image/avif" />
              <source srcSet="/hero_conservatory_thumb.webp" type="image/webp" />
              <img 
                src="/hero_conservatory_thumb.webp" 
                alt="Застолье в ресторане" 
                className="intro-img" 
                loading="lazy" 
                decoding="async" 
              />
            </picture>
          </div>
        </div>
      </section>

      {/* 3. Formats of events */}
      <section className="banquets-formats section-gap" style={{ backgroundColor: 'var(--color-beige-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="label-caps accent-label">События</span>
            <h2 className="font-serif section-title">{"Для\u00A0любого повода"}</h2>
          </div>

          <div className="formats-grid">
            {eventFormats.map((format, idx) => (
              <div 
                key={idx} 
                className="format-card" 
                style={{ backgroundImage: `url('${format.image}')` }}
              >
                <div className="format-card-overlay" />
                <div className="format-card-content">
                  <h3 className="font-serif format-name">{format.name}</h3>
                  <p className="format-desc">{format.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Halls and Zones */}
      <section ref={hallsRef} className="banquets-halls section-gap">
        <div className="container">
          <div className="section-header">
            <span className="label-caps accent-label">Локации</span>
            <h2 className="font-serif section-title">Выберите подходящий формат</h2>
          </div>

          <div className="halls-grid">
            {banquetHalls.map((hall) => (
              <div key={hall.id} className="hall-card">
                <div className="hall-img-wrap">
                  <picture>
                    <source srcSet={hall.image.replace('.webp', '.avif')} type="image/avif" />
                    <source srcSet={hall.image} type="image/webp" />
                    <img 
                      src={hall.image} 
                      alt={hall.name} 
                      className="hall-img" 
                      loading="lazy" 
                      decoding="async" 
                    />
                  </picture>
                </div>
                <div className="hall-info">
                  <h3 className="font-serif hall-name">{hall.name}</h3>
                  <p className="body-md hall-desc">{hall.desc}</p>
                  <div className="hall-capacity">
                    <span className="capacity-label">Вместимость:</span>
                    <span className="capacity-value">{"уточняется у\u00A0администратора"}</span>
                  </div>
                  <button 
                    onClick={() => handleSelectHall(hall.id)} 
                    className="btn btn-secondary hall-btn"
                  >
                    УЗНАТЬ ПОДРОБНЕЕ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Benefits block */}
      <section className="banquets-benefits section-gap" style={{ backgroundColor: 'var(--color-deep-green-dark)', color: 'var(--color-ivory)' }}>
        <div className="container">
          <div className="section-header center-header">
            <span className="label-caps accent-label" style={{ color: 'var(--color-brass)' }}>ПРЕИМУЩЕСТВА</span>
            <h2 className="font-serif section-title" style={{ color: 'var(--color-ivory)' }}>{"Мы возьмём организацию на\u00A0себя"}</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <Award size={20} className="benefit-icon" />
              </div>
              <h3 className="font-serif benefit-title">Персональное меню</h3>
              <p className="body-md benefit-desc">{"Подберём блюда под\u00A0формат праздника и\u00A0предпочтения гостей."}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <ShieldCheck size={20} className="benefit-icon" />
              </div>
              <h3 className="font-serif benefit-title">Помощь администратора</h3>
              <p className="body-md benefit-desc">{"Ответим на\u00A0вопросы и\u00A0поможем продумать детали мероприятия."}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <MapPin size={20} className="benefit-icon" />
              </div>
              <h3 className="font-serif benefit-title">Атмосферный интерьер</h3>
              <p className="body-md benefit-desc">{"Пространство, в\u00A0котором приятно проводить особенные вечера."}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrap">
                <Flame size={20} className="benefit-icon" />
              </div>
              <h3 className="font-serif benefit-title">Блюда на открытом огне</h3>
              <p className="body-md benefit-desc">Фирменная кухня «Манжо Гриль» станет частью впечатлений гостей.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Photo Gallery (Drag Scroll) */}
      <section className="banquets-gallery section-gap">
        <div className="container">
          <div className="section-header">
            <span className="label-caps accent-label">Фотогалерея</span>
            <h2 className="font-serif section-title">{"Как проходят праздники в\u00A0«Манжо Гриль»"}</h2>
          </div>
        </div>

        <div className="gallery-drag-container-wrap">
          {/* Subtle edge masks for desktop view */}
          <div className="gallery-drag-mask-left" />
          <div className="gallery-drag-mask-right" />
          
          <div 
            ref={galleryRef}
            className="gallery-drag-container"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
          >
            {galleryImages.map((image, idx) => (
              <div key={idx} className="gallery-drag-item">
                <picture>
                  <source srcSet={image.src.replace('.webp', '.avif')} type="image/avif" />
                  <source srcSet={image.src} type="image/webp" />
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="gallery-drag-img" 
                    draggable="false" 
                    loading="lazy" 
                    decoding="async" 
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Steps to organize */}
      <section className="banquets-steps section-gap" style={{ backgroundColor: 'var(--color-beige-light)' }}>
        <div className="container">
          <div className="section-header center-header">
            <span className="label-caps accent-label">ПРОЦЕСС</span>
            <h2 className="font-serif section-title">Как организовать банкет</h2>
          </div>

          <div className="steps-container">
            <div className="steps-line" />
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number font-serif">1</div>
                <h3 className="step-title">Оставьте заявку</h3>
                <p className="body-md step-desc">{"Заполните форму внизу страницы или\u00A0позвоните нам напрямую."}</p>
              </div>

              <div className="step-card">
                <div className="step-number font-serif">2</div>
                <h3 className="step-title">Обсудите детали</h3>
                <p className="body-md step-desc">{"Администратор свяжется с\u00A0вами, ответит на\u00A0вопросы и\u00A0обсудит повод."}</p>
              </div>

              <div className="step-card">
                <div className="step-number font-serif">3</div>
                <h3 className="step-title">Согласуйте меню</h3>
                <p className="body-md step-desc">{"Мы поможем выбрать оптимальное количество закусок, горячего и\u00A0напитков."}</p>
              </div>

              <div className="step-card">
                <div className="step-number font-serif">4</div>
                <h3 className="step-title">Приходите на праздник</h3>
                <p className="body-md step-desc">{"В\u00A0назначенный день мы сделаем все, чтобы вечер прошел безупречно."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Booking Form Section */}
      <section ref={formRef} className="banquets-booking section-gap">
        <div className="container form-max-width">
          <div className="booking-card">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="banquets-form">
                <div className="form-header">
                  <span className="label-caps accent-label" style={{ color: 'var(--color-brass)' }}>ОБРАТНАЯ СВЯЗЬ</span>
                  <h2 className="font-serif form-main-title">Давайте обсудим ваш праздник</h2>
                  <p className="form-subtitle">{"Оставьте контакты\u00A0— администратор свяжется с\u00A0вами и\u00A0поможет подобрать подходящий формат."}</p>
                </div>

                <div className="form-fields-grid">
                  {/* Name field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-name">Имя</label>
                    <input 
                      type="text" 
                      id="bq-name"
                      name="name"
                      placeholder="Александр"
                      required
                      className="form-input"
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Phone field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-phone">Номер телефона</label>
                    <input 
                      type="tel" 
                      id="bq-phone"
                      name="phone"
                      placeholder="+7 (___) ___-__-__"
                      required
                      className="form-input"
                      disabled={isSubmitting}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>

                  {/* Date field */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-date">Дата мероприятия</label>
                    <input 
                      type="date" 
                      id="bq-date"
                      name="date"
                      required
                      className="form-input"
                      disabled={isSubmitting}
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Guests count */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-guests">Количество гостей</label>
                    <select 
                      id="bq-guests"
                      name="guests"
                      className="form-input form-select"
                      disabled={isSubmitting}
                      value={formData.guests}
                      onChange={handleInputChange}
                    >
                      <option value="5-10">До 10 гостей</option>
                      <option value="10-20">10 – 20 гостей</option>
                      <option value="20-40">20 – 40 гостей</option>
                      <option value="40-60">40 – 60 гостей</option>
                      <option value="60+">Более 60 гостей</option>
                    </select>
                  </div>

                  {/* Zone selection */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-zone">Желаемая зона</label>
                    <select 
                      id="bq-zone"
                      name="zone"
                      className="form-input form-select"
                      disabled={isSubmitting}
                      value={formData.zone}
                      onChange={handleInputChange}
                    >
                      <option value="main">Основной зал</option>
                      <option value="cozy">Уютная зона</option>
                      <option value="general">Общий формат</option>
                    </select>
                  </div>

                  {/* Occasion */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="bq-occasion">Повод</label>
                    <select 
                      id="bq-occasion"
                      name="occasion"
                      className="form-input form-select"
                      disabled={isSubmitting}
                      value={formData.occasion}
                      onChange={handleInputChange}
                    >
                      <option value="birthday">День рождения</option>
                      <option value="wedding">Свадьба</option>
                      <option value="anniversary">Юбилей</option>
                      <option value="corporate">Корпоратив</option>
                      <option value="family">Семейный праздник</option>
                      <option value="chamber">Камерный ужин</option>
                      <option value="other">Другой повод</option>
                    </select>
                  </div>

                  {/* Contact preference */}
                  <div className="form-group full-row">
                    <label className="form-label">Предпочтительный способ связи</label>
                    <div className="form-contact-methods">
                      {contactOptions.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setFormData(prev => ({ ...prev, contactMethod: opt.key }))}
                          className={`form-contact-btn ${formData.contactMethod === opt.key ? 'active' : ''}`}
                        >
                          {renderContactIcon(opt.key)}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="form-group full-row">
                    <label className="form-label" htmlFor="bq-comment">Комментарий</label>
                    <textarea 
                      id="bq-comment"
                      name="comment"
                      rows={3}
                      placeholder="Напишите особые пожелания или требования к мероприятию..."
                      className="form-input form-textarea"
                      disabled={isSubmitting}
                      value={formData.comment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="form-error">
                    <AlertTriangle size={15} style={{ marginRight: '6px' }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-submit-wrap">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary form-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner" />
                        ОТПРАВКА...
                      </>
                    ) : (
                      <>
                        <Send size={14} style={{ marginRight: '8px' }} />
                        ОТПРАВИТЬ ЗАЯВКУ
                      </>
                    )}
                  </button>
                  <p className="form-privacy-p">
                    {"Нажимая кнопку, вы соглашаетесь с\u00A0политикой обработки персональных данных."}
                  </p>
                </div>
              </form>
            ) : (
              <div className="form-success">
                <div className="success-icon-wrap">
                  <CheckCircle size={44} style={{ color: 'var(--color-brass)' }} />
                </div>
                <h3 className="font-serif success-title">Спасибо!</h3>
                <p className="success-desc">{"Администратор свяжется с\u00A0вами в\u00A0ближайшее время."}</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-secondary success-reset-btn"
                >
                  ОТПРАВИТЬ ЕЩЕ ОДНУ ЗАЯВКУ
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="banquets-final-cta" style={{ backgroundImage: `url('/hero2_desktop.webp')` }}>
        <div className="final-cta-overlay" />
        <div className="final-cta-content container">
          <h2 className="font-serif final-cta-title">{"Особенные вечера начинаются с\u00A0правильного места"}</h2>
          <button 
            onClick={() => scrollToElement(formRef)} 
            className="btn btn-primary final-cta-btn"
          >
            ЗАБРОНИРОВАТЬ БАНКЕТ
          </button>
        </div>
      </section>

    </div>
  );
}
