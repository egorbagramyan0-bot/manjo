import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Leaf, Wind, Phone, ArrowLeft } from 'lucide-react';
import './MenuPage.css';

const menuData = {
  cold: [
    {
      id: 1,
      title: 'Тартар из\u00A0говядины с\u00A0трюфельным кремом',
      price: '950 ₽',
      weight: '150 г',
      desc: 'Мелко нарезанная говяжья вырезка зернового откорма, трюфельный айоли, пармезан, хрустящая чиабатта.',
      badges: ['Special'],
      image: '/dish_salad.png',
      ingredients: 'Говяжья вырезка, трюфельное масло, яичный желток, каперсы, лук-шалот, пармезан, гренки из чиабатты.',
      chefComment: 'Мы используем только вырезку прайм-класса. Трюфельный крем подчеркивает природный мясной вкус.',
      pairing: 'Идеально сочетается с\u00A0бокалом красного сухого вина.'
    },
    {
      id: 2,
      title: 'Плато ремесленных сыров',
      price: '1 250 ₽',
      weight: '200 г',
      desc: 'Ассорти локальных сыров: козий сыр в\u00A0хвое, твердый сыр 12 месяцев выдержки, пряный белпер кнолле, цветочный мед.',
      badges: ['GF'],
      image: '/dish_salad.png',
      ingredients: 'Ремесленный козий сыр, выдержанный коровий сыр, пряный сыр в обсыпке, грецкие орехи, лавандовый мед.',
      chefComment: 'Сыры поставляются из\u00A0небольшой частной фермы в\u00A0Ростовской области.',
      pairing: 'Отличный компаньон для\u00A0винной карты.'
    }
  ],
  hot: [
    {
      id: 3,
      title: 'Запеченный костный мозг',
      price: '820 ₽',
      weight: '250 г',
      desc: 'Мозговые косточки, запеченные в\u00A0хоспере с\u00A0чесночным маслом и\u00A0розмарином. Подаются с\u00A0луковым джемом и\u00A0гренками.',
      badges: ['Special'],
      image: '/dish_grill.png',
      ingredients: 'Мозговые кости говяжьи, чеснок, розмарин, чиабатта, домашний луковый конфитюр с портвейном.',
      chefComment: 'Настоящий деликатес. Запекание в\u00A0хоспере дает легкий и\u00A0пикантный аромат дымка.',
      pairing: 'Прекрасно сочетается с\u00A0крепкими настойками или\u00A0бурбоном.'
    },
    {
      id: 4,
      title: 'Тигровые креветки чили-чеснок',
      price: '980 ₽',
      weight: '180 г',
      desc: 'Креветки гриль, обжаренные в\u00A0оливковом масле с\u00A0добавлением чили, чеснока и\u00A0свежей зелени.',
      badges: ['GF'],
      image: '/dish_grill.png',
      ingredients: 'Тигровые креветки, чеснок, перец чили, оливковое масло, белое вино, кинза, сок лимона.',
      chefComment: 'Мы обжариваем их очень быстро, чтобы сохранить сочность и упругость мяса креветок.',
      pairing: 'Подходит к\u00A0белому вину или\u00A0светлому элю.'
    }
  ],
  salads: [
    {
      id: 5,
      title: 'Зеленый салат Манжо',
      price: '920 ₽',
      weight: '220 г',
      desc: 'Листья шпината, авокадо на\u00A0гриле, молодая спаржа, бобы эдамаме и\u00A0фирменная заправка из\u00A0цитруса и\u00A0диких трав.',
      badges: ['Vegan', 'GF'],
      image: '/dish_salad.png',
      ingredients: 'Шпинат, спаржа гриль, авокадо, эдамаме, семена тыквы, сок лайма, масло из пряного заатара.',
      chefComment: 'Обжарка авокадо на\u00A0решетке придает салату тонкий дымный оттенок, идеально контрастирующий со\u00A0свежими листьями.',
      pairing: 'Прекрасно дополняет легкие ягодные лимонады.'
    },
    {
      id: 6,
      title: 'Печеная свекла с козьим сыром',
      price: '840 ₽',
      weight: '210 г',
      desc: 'Сладкая свекла из\u00A0печи, нежный козий сыр, карамелизированный орех пекан и\u00A0соус из\u00A0молодой хвои.',
      badges: ['GF'],
      image: '/dish_salad.png',
      ingredients: 'Красная свекла, мягкий козий сыр, пекан, мед, сироп из сосновых шишек, руккола.',
      chefComment: 'Хвойный соус мы варим сами по\u00A0особому рецепту, используя молодые сосновые почки для\u00A0лесного аромата.',
      pairing: 'Отлично сочетается с\u00A0прохладным розовым вином.'
    }
  ],
  grill: [
    {
      id: 7,
      title: 'Стейк Рибай Манжо',
      price: '2 800 ₽',
      weight: '350 г',
      desc: 'Премиальный стейк влажного вызревания, приготовленный на\u00A0открытых березовых углях. Подается с\u00A0розмарином и\u00A0крупной копченой солью.',
      badges: ['GF', 'Special'],
      image: '/dish_grill.png',
      ingredients: 'Говядина Рибай (350г), свежий розмарин, чеснок, оливковое масло, смесь перцев, авторская копченая соль.',
      chefComment: 'Мы обжариваем мясо при\u00A0экстремальной температуре на\u00A0открытом пламени, сохраняя все соки внутри стейка.',
      pairing: 'Рекомендуем сочетать с\u00A0коктейлем "Ольховый Сауэр".'
    },
    {
      id: 8,
      title: 'Осьминог на углях',
      price: '1 950 ₽',
      weight: '180 г',
      desc: 'Молодой осьминог гриль с\u00A0нежным пюре из\u00A0печеного пастернака и\u00A0соусом из\u00A0спелых лесных ягод.',
      badges: ['GF'],
      image: '/dish_grill.png',
      ingredients: 'Щупальца осьминога (180г), пастернак, фермерские сливки, дикая брусника, кедровые орехи, микрозелень.',
      chefComment: 'Осьминог предварительно томится в\u00A0травах при\u00A0низкой температуре, благодаря чему становится невероятно нежным на\u00A0гриле.',
      pairing: 'Прекрасно сочетается с\u00A0бокалом белого сухого вина.'
    }
  ],
  meat: [
    {
      id: 9,
      title: 'Каре ягненка с печеным чесноком',
      price: '1 850 ₽',
      weight: '300 г',
      desc: 'Нежное каре ягненка, маринованное в\u00A0травах, обжаренное в\u00A0хоспере. Подается с\u00A0головкой запеченного чеснока.',
      badges: ['GF'],
      image: '/dish_grill.png',
      ingredients: 'Каре ягненка, тимьян, чеснок, оливковое масло, специи, печеный помидор черри.',
      chefComment: 'Ягненок обжаривается медиум-рэар для\u00A0сохранения мягкости и\u00A0нежности.',
      pairing: 'Прекрасно подходит к\u00A0насыщенным красным винам.'
    },
    {
      id: 10,
      title: 'Томагавк стейк (за 100г)',
      price: '650 ₽',
      weight: '100 г',
      desc: 'Массивный стейк на\u00A0кости сухого вызревания. Рекомендуется для\u00A0компании. Вес стейков от\u00A0800г.',
      badges: ['Special'],
      image: '/dish_grill.png',
      ingredients: 'Говядина на реберной кости, оливковое масло, специи, сливочное масло с травами.',
      chefComment: 'Сухое вызревание придает мясу концентрированный говяжий вкус и\u00A0нежность.',
      pairing: 'Отлично сочетается со\u00A0стейковыми соусами и\u00A0картофелем гриль.'
    }
  ],
  fish: [
    {
      id: 11,
      title: 'Филе лосося с диким рисом',
      price: '1 450 ₽',
      weight: '220 г',
      desc: 'Сочное филе лосося гриль со\u00A0сливочно-икорным соусом и\u00A0гарниром из\u00A0черного дикого риса.',
      badges: ['GF'],
      image: '/dish_grill.png',
      ingredients: 'Филе лосося, дикий рис, фермерские сливки, красная икра, лимонная трава, спаржа.',
      chefComment: 'Лосось обжаривается до\u00A0хрустящей корочки снаружи, оставаясь сочным внутри.',
      pairing: 'Идеально сочетается с Шардоне.'
    },
    {
      id: 12,
      title: 'Стейк из тунца',
      price: '1 350 ₽',
      weight: '200 г',
      desc: 'Стейк из\u00A0желтоперого тунца в\u00A0кунжутной панировке, быстро обжаренный на\u00A0гриле. Подается с\u00A0соусом васаби-понзу.',
      badges: ['GF'],
      image: '/dish_grill.png',
      ingredients: 'Филе тунца, семена кунжута, соус понзу, паста васаби, имбирь, микрозелень.',
      chefComment: 'Мы обжариваем тунец сеард (rare внутри), чтобы сохранить его нежнейшую текстуру.',
      pairing: 'Прекрасный компаньон для белого сухого вина или холодного саке.'
    }
  ],
  sides: [
    {
      id: 13,
      title: 'Картофель гриль с розмарином',
      price: '380 ₽',
      weight: '150 г',
      desc: 'Молодой картофель, обжаренный на\u00A0гриле с\u00A0чесноком, свежим розмарином и\u00A0крупной солью.',
      badges: ['Vegan', 'GF'],
      image: '/dish_salad.png',
      ingredients: 'Картофель бэби, оливковое масло, розмарин, чеснок, морская соль.',
      chefComment: 'Картофель сначала отваривается до\u00A0полуготовности, а\u00A0затем карамелизируется на\u00A0гриле.',
      pairing: 'Отличный гарнир ко\u00A0всем видам мяса.'
    },
    {
      id: 14,
      title: 'Овощи на углях',
      price: '450 ₽',
      weight: '180 г',
      desc: 'Сезонные овощи: цукини, баклажан, болгарский перец, томаты и\u00A0шампиньоны на\u00A0решетке.',
      badges: ['Vegan', 'GF'],
      image: '/dish_salad.png',
      ingredients: 'Цукини, баклажан, сладкий перец, помидоры, грибы шампиньоны, чесночное масло.',
      chefComment: 'Сбрызгиваем бальзамическим кремом перед\u00A0подачей для\u00A0легкой сладости.',
      pairing: 'Идеальный легкий гарнир к\u00A0стейкам.'
    }
  ],
  desserts: [
    {
      id: 15,
      title: 'Шоколадный фондан с лавандовым мороженым',
      price: '480 ₽',
      weight: '120 г',
      desc: 'Теплый кекс с\u00A0жидкой шоколадной сердцевиной и\u00A0шариком домашнего лавандового мороженого.',
      badges: ['Special'],
      image: '/dish_salad.png',
      ingredients: 'Темный бельгийский шоколад, сливочное масло, мука, яйца, тростниковый сахар, лаванда, сливки.',
      chefComment: 'Подается горячим. Наш фаворит среди десертов.',
      pairing: 'Хорошо дополняется чашечкой двойного эспрессо.'
    },
    {
      id: 16,
      title: 'Груша в вине с маскарпоне',
      price: '520 ₽',
      weight: '160 г',
      desc: 'Спелая груша, томленая в\u00A0красном пряном вине со\u00A0специями, подается с\u00A0нежным кремом из\u00A0маскарпоне.',
      badges: ['GF'],
      image: '/dish_salad.png',
      ingredients: 'Груша Конференс, сухое красное вино, корица, бадьян, гвоздика, сыр маскарпоне, ваниль.',
      chefComment: 'Пряные ароматы глинтвейна идеально пропитывают грушу в\u00A0процессе длительного томления.',
      pairing: 'Сочетается с\u00A0десертными винами.'
    }
  ],
  drinks: [
    {
      id: 17,
      title: 'Таежный чай',
      price: '450 ₽',
      weight: '600 мл',
      desc: 'Натуральный чай на\u00A0основе сбора сибирских трав, брусники, сосновых шишек и\u00A0липового меда.',
      badges: ['Vegan', 'GF'],
      image: '/dish_cocktail.png',
      ingredients: 'Травяной сбор (иван-чай, душица, чабрец), сушеная брусника, молодые сосновые шишки, мед.',
      chefComment: 'Согревающий хвойно-ягодный напиток с\u00A0ярким таежным колоритом.',
      pairing: 'Отличный выбор после\u00A0плотного ужина.'
    },
    {
      id: 18,
      title: 'Лимонад Брусника-Ель',
      price: '380 ₽',
      weight: '400 мл',
      desc: 'Домашний освежающий лимонад из\u00A0пюре лесной брусники и\u00A0натурального елового экстракта.',
      badges: ['Vegan', 'GF'],
      image: '/dish_cocktail.png',
      ingredients: 'Дикая брусника, домашний еловый сироп, газированная вода, лед, веточка розмарина.',
      chefComment: 'Сладковато-терпкий лимонад с\u00A0хвойными нотками.',
      pairing: 'Прекрасно освежает в\u00A0теплую погоду.'
    }
  ],
  cocktails: [
    {
      id: 19,
      title: 'Ольховый Сауэр',
      price: '780 ₽',
      weight: '150 мл',
      desc: 'Фирменный коктейль на\u00A0основе выдержанного бурбона, лимонного кордиала и\u00A0сиропа из\u00A0молодых еловых почек. Окуривается щепой ольхи.',
      badges: ['Special'],
      image: '/dish_cocktail.png',
      ingredients: 'Выдержанный бурбон (50мл), домашний еловый сироп, сок лимона, яичный белок, ольховый дым.',
      chefComment: 'Эффектная подача в\u00A0закрытом стеклянном клоше, наполненном ароматным дымом, который выпускается перед\u00A0гостем.',
      pairing: 'Идеальная пара к\u00A0стейку Рибай.'
    },
    {
      id: 20,
      title: 'Мятный Оранж Тини',
      price: '720 ₽',
      weight: '160 мл',
      desc: 'Бодрящий освежающий микс джина, настоянного на\u00A0листьях мяты, свежевыжатого апельсинового сока и\u00A0ликера из\u00A0бузины.',
      badges: ['Vegan'],
      image: '/dish_cocktail.png',
      ingredients: 'Джин на мяте, сок свежего апельсина, ликер бузины, тоник, лед.',
      chefComment: 'Цветочные ноты бузины и\u00A0цитрусовая свежесть создают яркий летний вкус.',
      pairing: 'Прекрасный аперитив.'
    }
  ],
  wine: [
    {
      id: 21,
      title: 'Manjo Reserve Cabernet Sauvignon',
      price: '850 ₽ / 4 200 ₽',
      weight: '150 мл / 750 мл',
      desc: 'Сухое красное вино с\u00A0тонами черной смородины, спелой вишни, табачного листа и\u00A0дуба.',
      badges: ['Special'],
      image: '/dish_cocktail.png',
      ingredients: 'Виноград Каберне Совиньон, выдержка во французских дубовых бочках 12 месяцев.',
      chefComment: 'Сбалансированное танинное вино с\u00A0долгим ягодным послевкусием.',
      pairing: 'Создано специально для\u00A0стейка Рибай.'
    },
    {
      id: 22,
      title: 'Шато де Талю Шардоне',
      price: '750 ₽ / 3 800 ₽',
      weight: '150 мл / 750 мл',
      desc: 'Российское белое сухое вино из\u00A0Краснодарского края с\u00A0нотами ванили, белых персиков и\u00A0сливочного масла.',
      badges: ['Special'],
      image: '/dish_cocktail.png',
      ingredients: 'Виноград Шардоне, выдержанный на осадке.',
      chefComment: 'Свежее, гастрономичное белое вино с приятной минеральностью.',
      pairing: 'Идеально к\u00A0осьминогу или\u00A0лососю гриль.'
    }
  ]
};

const categories = [
  { id: 'cold', name: 'Холодные закуски' },
  { id: 'hot', name: 'Горячие закуски' },
  { id: 'salads', name: 'Салаты' },
  { id: 'grill', name: 'Блюда на гриле' },
  { id: 'meat', name: 'Мясо' },
  { id: 'fish', name: 'Рыба и морепродукты' },
  { id: 'sides', name: 'Гарниры' },
  { id: 'desserts', name: 'Десерты' },
  { id: 'drinks', name: 'Напитки' },
  { id: 'cocktails', name: 'Коктейли' },
  { id: 'wine', name: 'Винная карта' }
];

export default function MenuPage({ onBookingClick }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('cold');
  const [selectedDish, setSelectedDish] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef(null);
  const tabsContainerRef = useRef(null);

  // Monitor scroll to activate sticky state styles cleanly
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.mp-header');
      const isMobile = window.innerWidth <= 768;
      const stickyOffset = 70; // Sits at top: 70px in CSS
      
      if (header) {
        const headerRect = header.getBoundingClientRect();
        setIsSticky(headerRect.bottom <= stickyOffset + 2);
      } else {
        const threshold = isMobile ? 180 : 220;
        setIsSticky(window.scrollY > threshold);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy to highlight active category based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      if (isClickScrollingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id.replace('cat-sec-', ''));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-sec-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      categories.forEach((cat) => {
        const el = document.getElementById(`cat-sec-${cat.id}`);
        if (el) observer.unobserve(el);
      });
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Smooth scroll active tab button into view inside scrollbar container
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeTabEl = tabsContainerRef.current.querySelector(`.mp-category-btn[data-id="${activeCategory}"]`);
    if (activeTabEl) {
      activeTabEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeCategory]);

  const handleCategoryClick = (e, catId) => {
    e.preventDefault();
    setActiveCategory(catId);
    isClickScrollingRef.current = true;
    
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const el = document.getElementById(`cat-sec-${catId}`);
    if (el) {
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 120 : 160; // Accounts for navbar + sticky categories bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const elPos = elRect - bodyRect;
      const offsetPosition = elPos - offset;

      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -offset, duration: 1.2 });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      clickTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 850);
    } else {
      isClickScrollingRef.current = false;
    }
  };

  const getBadgeIcon = (badge) => {
    if (badge === 'Vegan' || badge === 'GF') return <Leaf size={12} />;
    return <Flame size={12} />;
  };

  return (
    <div className="mp-page">
      
      {/* Editorial Header */}
      <header className="mp-header">
        <div className="container">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="mp-back-link">
            <ArrowLeft size={14} />
            На главную
          </a>
          <h1 className="font-serif">Меню</h1>
          <p className="mp-header-subtitle">
            {"Блюда на\u00A0открытом огне, авторская кухня и\u00A0напитки для\u00A0особенных вечеров."}
          </p>
        </div>
      </header>

      {/* Sticky Categories Navigation */}
      <nav className={`mp-categories-nav-wrap ${isSticky ? 'is-sticky' : ''}`}>
        <div className="container">
          <div className="mp-categories-container" ref={tabsContainerRef}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-id={cat.id}
                  onClick={(e) => handleCategoryClick(e, cat.id)}
                  className={`mp-category-btn ${isActive ? 'active' : ''}`}
                  type="button"
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Dishes Sections */}
      <div className="container" style={{ marginTop: '20px' }}>
        {categories.map((cat) => {
          const dishes = menuData[cat.id] || [];
          if (dishes.length === 0) return null;

          return (
            <section 
              id={`cat-sec-${cat.id}`} 
              key={cat.id} 
              className="mp-content-section"
            >
              <h2 className="mp-section-title font-serif">{cat.name}</h2>
              
              <div className="mp-dish-grid">
                {dishes.map((dish) => (
                  <div 
                    key={dish.id} 
                    className="mp-dish-card"
                    onClick={() => setSelectedDish(dish)}
                  >
                    {/* Dish Image */}
                    <div className="mp-dish-card-img-wrap">
                      <picture>
                        <source srcSet={dish.image.replace('.png', '_thumb.avif')} type="image/avif" />
                        <source srcSet={dish.image.replace('.png', '_thumb.webp')} type="image/webp" />
                        <img 
                          src={dish.image.replace('.png', '_thumb.webp')} 
                          alt={dish.title} 
                          className="mp-dish-card-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>

                    {/* Dish Content Body */}
                    <div className="mp-dish-card-body">
                      <div>
                        <div className="mp-dish-card-title-row">
                          <h3 className="mp-dish-card-title">{dish.title}</h3>
                          <span className="mp-dish-card-price">{dish.price}</span>
                        </div>
                        <p className="mp-dish-card-desc">{dish.desc}</p>
                      </div>

                      <div className="mp-dish-card-footer">
                        <span className="mp-dish-card-weight">{dish.weight}</span>
                        
                        {/* Badges container */}
                        <div className="menu-card-badges" style={{ margin: 0 }}>
                          {dish.badges.map((badge) => (
                            <span key={badge} className="badge">
                              {getBadgeIcon(badge)}
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Call to action panel at bottom */}
        <div className="mp-cta-block">
          <h3 className="mp-cta-title font-serif">{"Ждем Вас в\u00A0гостях"}</h3>
          <div className="mp-cta-buttons">
            <button 
              onClick={onBookingClick} 
              className="btn btn-primary"
              style={{ padding: '14px 28px' }}
              type="button"
            >
              Забронировать стол
            </button>
            <a href="tel:+79185431111" className="mp-phone-link">
              <Phone size={15} />
              +7 (918) 543-11-11
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Modal on Card Click */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 36, 25, 0.45)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px'
            }}
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.93, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 190 }}
              style={{
                backgroundColor: 'var(--color-ivory)',
                borderRadius: 'var(--radius-2xl)',
                maxWidth: '720px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px rgba(0, 36, 25, 0.25)',
                position: 'relative',
                border: '1px solid var(--color-beige)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDish(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'var(--color-ivory-light)',
                  border: '1px solid var(--color-beige)',
                  color: 'var(--color-deep-green)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Banner Image */}
              <div style={{ height: '300px', width: '100%', position: 'relative', backgroundColor: 'var(--color-beige)' }}>
                <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                  <source srcSet={selectedDish.image.replace('.png', '_full.avif')} type="image/avif" />
                  <source srcSet={selectedDish.image.replace('.png', '_full.webp')} type="image/webp" />
                  <img 
                    src={selectedDish.image.replace('.png', '_full.webp')} 
                    alt={selectedDish.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    decoding="async"
                  />
                </picture>
                <div 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,36,25,0.85) 0%, rgba(0,36,25,0) 65%)' 
                  }} 
                />
                <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px', color: 'var(--color-ivory)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span className="label-caps" style={{ color: 'var(--color-brass)', display: 'block', marginBottom: '8px' }}>
                        Детали позиции
                      </span>
                      <h3 className="font-serif" style={{ fontSize: '30px', color: 'var(--color-ivory)' }}>
                        {selectedDish.title}
                      </h3>
                    </div>
                    <span className="font-serif" style={{ fontSize: '26px', color: 'var(--color-brass-light)', fontWeight: '700' }}>
                      {selectedDish.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '32px' }}>
                <p className="body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: '24px', fontStyle: 'italic' }}>
                  {selectedDish.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Ingredients */}
                  <div>
                    <h4 className="label-caps" style={{ color: 'var(--color-deep-green)', marginBottom: '8px' }}>
                      Состав:
                    </h4>
                    <p className="body-md" style={{ color: 'var(--color-on-surface-variant)' }}>{dishIngredientsMap(selectedDish)}</p>
                  </div>

                  {/* Chef Commentary */}
                  <div style={{ backgroundColor: 'var(--color-beige-light)', padding: '18px', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--color-brass)' }}>
                    <h4 className="label-caps" style={{ color: 'var(--color-deep-green-dark)', marginBottom: '6px', fontSize: '11px' }}>
                      Заметки Шефа:
                    </h4>
                    <p className="body-md" style={{ color: 'var(--color-on-surface-variant)', fontStyle: 'italic' }}>
                      «{selectedDish.chefComment}»
                    </p>
                  </div>

                  {/* Pairing */}
                  <div style={{ borderTop: '1px solid var(--color-beige)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Flame size={20} style={{ color: 'var(--color-brass)' }} />
                    <p className="body-md" style={{ color: 'var(--color-deep-green)', fontWeight: '600' }}>
                      {selectedDish.pairing}
                    </p>
                  </div>

                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Fallback ingredients if not specified
function dishIngredientsMap(dish) {
  if (dish.ingredients) return dish.ingredients;
  return 'Говядина, специи, фермерское масло, травы, соус шефа.';
}
