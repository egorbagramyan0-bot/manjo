import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function MenuAnnounce() {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
    navigate('/menu');
  };

  return (
    <section 
      className="section-gap" 
      style={{ 
        backgroundColor: 'var(--color-ivory-light)', 
        position: 'relative',
        padding: '60px 0'
      }}
    >
      <div className="container">
        
        {/* Botanical Divider */}
        <div className="botanical-divider" style={{ marginBottom: '32px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C12 2 15 8 18 11C21 14 21 18 18 20C15 22 12 22 12 22C12 22 9 22 6 20C3 18 3 14 6 11C9 8 12 2 12 2Z" />
          </svg>
        </div>

        {/* Compact Card Announcement */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            backgroundColor: 'var(--color-beige-light)',
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            boxShadow: '0 12px 35px rgba(22, 58, 45, 0.05)',
            border: '1px solid var(--color-beige)',
            maxWidth: '920px',
            margin: '0 auto'
          }}
        >
          {/* Left Block: Image */}
          <div 
            style={{ 
              height: '320px', 
              position: 'relative', 
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={handleMenuClick}
            className="menu-announce-img-wrap"
          >
            <img 
              src="/dish_grill.png" 
              alt="Grill food teaser" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="menu-announce-img"
            />
            {/* Visual overlay for depth */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0, 36, 25, 0.2), transparent)'
              }}
            />
          </div>

          {/* Right Block: Content */}
          <div 
            style={{ 
              padding: '40px 48px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: 'var(--color-brass)' }} />
              <span className="label-caps" style={{ color: 'var(--color-olive)' }}>Гастрономия</span>
            </div>
            
            <h3 
              className="font-serif" 
              style={{ 
                fontSize: '28px', 
                color: 'var(--color-deep-green-dark)',
                lineHeight: '1.2'
              }}
            >
              Откройте меню «Манжо Гриль»
            </h3>
            
            <p 
              className="body-md" 
              style={{ 
                color: 'var(--color-on-surface-variant)', 
                lineHeight: '1.6',
                margin: 0
              }}
            >
              {"Авторские блюда на\u00A0открытом огне, сочное мясо, закуски и\u00A0напитки для\u00A0тёплых вечеров."}
            </p>
            
            <a 
              href="/menu" 
              onClick={handleMenuClick}
              className="btn btn-secondary"
              style={{ marginTop: '12px' }}
            >
              Посмотреть меню
            </a>
          </div>
        </div>

      </div>

      <style>{`
        .menu-announce-img-wrap:hover .menu-announce-img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .menu-announce-img-wrap {
            height: 240px !important;
          }
        }
      `}</style>
    </section>
  );
}
