import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      id="contacts"
      style={{ 
        backgroundColor: 'var(--color-deep-green-dark)', 
        color: 'var(--color-ivory)', 
        padding: '60px 0 30px 0',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div className="container">
        
        {/* Footer Top Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '40px',
            marginBottom: '40px',
            borderBottom: '1px solid rgba(244, 239, 228, 0.1)',
            paddingBottom: '40px'
          }}
        >
          
          {/* Logo & Brand Info */}
          <div>
            <h3 
              className="font-serif" 
              style={{ 
                fontSize: '24px', 
                color: 'var(--color-brass-light)', 
                marginBottom: '16px', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Манжо Гриль
            </h3>
            <p 
              className="body-md" 
              style={{ 
                color: 'rgba(244, 239, 228, 0.7)', 
                lineHeight: '24px',
                maxWidth: '280px'
              }}
            >
              {"Уютный гриль-ресторан в\u00A0Ростове-на-Дону. Блюда на\u00A0открытых углях, авторский бар и\u00A0премиальные кальяны."}
            </p>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 
              className="label-caps" 
              style={{ 
                color: 'var(--color-brass)', 
                marginBottom: '16px',
                fontSize: '13px'
              }}
            >
              Часы работы
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(244, 239, 228, 0.8)' }}>
              <li>{"Понедельник\u00A0— Воскресенье"}</li>
              <li style={{ fontSize: '18px', color: 'var(--color-ivory)', fontWeight: '600', marginTop: '4px' }}>{"10:00\u00A0— 00:00"}</li>
              <li style={{ color: 'var(--color-brass)', fontStyle: 'italic', fontSize: '14px', marginTop: '8px' }}>{"Ждем вас каждый день без\u00A0выходных!"}</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 
              className="label-caps" 
              style={{ 
                color: 'var(--color-brass)', 
                marginBottom: '16px',
                fontSize: '13px'
              }}
            >
              Контакты
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(244, 239, 228, 0.8)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} style={{ color: 'var(--color-brass)', marginTop: '4px', flexShrink: 0 }} />
                <span>Ростов-на-Дону, проспект Соколова, 19/22</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: 'var(--color-brass)', flexShrink: 0 }} />
                <a href="tel:+79185431111" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>+7 (918) 543-11-11</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: 'var(--color-brass)', flexShrink: 0 }} />
                <a href="mailto:info@manjogrill.ru" style={{ color: 'inherit', textDecoration: 'none' }}>info@manjogrill.ru</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 
              className="label-caps" 
              style={{ 
                color: 'var(--color-brass)', 
                marginBottom: '16px',
                fontSize: '13px'
              }}
            >
              Связь с нами
            </h4>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <a 
                href="https://t.me/manjogrill" 
                target="_blank"
                rel="noreferrer noopener"
                style={{ 
                  color: 'var(--color-ivory)', 
                  border: '1px solid rgba(244, 239, 228, 0.2)', 
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                className="social-btn"
              >
                {/* Telegram SVG */}
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </a>
              <a 
                href="https://wa.me/79185431111" 
                target="_blank"
                rel="noreferrer noopener"
                style={{ 
                  color: 'var(--color-ivory)', 
                  border: '1px solid rgba(244, 239, 228, 0.2)', 
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                className="social-btn"
              >
                {/* Whatsapp SVG */}
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
            <p className="body-md" style={{ color: 'rgba(244, 239, 228, 0.4)', fontSize: '12px', lineHeight: '18px' }}>
              ООО "Атташе"<br/>
              ИНН: 6163101408 | ОГРН: 1106195002209<br/>
              © {new Date().getFullYear()} «Манжо Гриль».
            </p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'rgba(244, 239, 228, 0.4)' }}>
          <span>Политика конфиденциальности</span>
        </div>

      </div>

      <style>{`
        .social-btn:hover {
          color: var(--color-brass-light) !important;
          border-color: var(--color-brass) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
