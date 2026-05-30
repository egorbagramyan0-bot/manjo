import React from 'react';
import BookingForm from './BookingForm';

export default function Reservation() {
  return (
    <section 
      id="reservation" 
      className="section-gap" 
      style={{ backgroundColor: 'var(--color-ivory)', position: 'relative' }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="label-caps" style={{ color: 'var(--color-olive)', display: 'block', marginBottom: '12px' }}>
            Планирование Визита
          </span>
          <h2 className="headline-md font-serif" style={{ color: 'var(--color-deep-green-dark)', marginBottom: '16px' }}>
            Бронирование в Манжо Гриль
          </h2>
          <div className="botanical-divider">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
              <path d="M12 6V12L16 14" />
            </svg>
          </div>
        </div>

        {/* Unified Booking Form Wrapper */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-beige-light)', 
            borderRadius: 'var(--radius-2xl)', 
            maxWidth: '850px', 
            margin: '0 auto',
            boxShadow: '0 15px 35px rgba(22, 58, 45, 0.05)',
            border: '1px solid var(--color-beige)',
            padding: '40px'
          }}
        >
          <BookingForm source="Главная страница (Подвал)" />
        </div>

      </div>
    </section>
  );
}
