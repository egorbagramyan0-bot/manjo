import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, Users, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import './BookingForm.css';

// Pre-defined time slots for booking
const timeSlots = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '19:30', '20:00', '21:00', '22:00', '23:00'
];

export default function BookingForm({ source = 'Главная страница', onClose = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    area: 'main',
    guests: '2',
    contactMethod: 'phone',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format Russian phone number +7 (XXX) XXX-XX-XX
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    let digits = value.replace(/[^\d]/g, '');

    // Normalize starting digit
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

  const handleAreaSelect = (areaKey) => {
    setFormData((prev) => ({ ...prev, area: areaKey }));
  };

  const handleContactSelect = (methodKey) => {
    setFormData((prev) => ({ ...prev, contactMethod: methodKey }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Phone validation
    const digitsOnly = formData.phone.replace(/[^\d]/g, '');
    if (digitsOnly.length < 11) {
      setErrorMsg('Пожалуйста, введите корректный номер телефона (11 цифр).');
      return;
    }

    setIsSubmitting(true);

    try {
      const areaMap = {
        main: 'Основной зал',
        hearth: 'Каминная зона',
        terrace: 'Летняя веранда',
        any: 'Не имеет значения'
      };

      const contactMap = {
        telegram: 'Telegram',
        whatsapp: 'WhatsApp',
        max: 'MAX Messenger',
        phone: 'Звонок по телефону'
      };

      // Format text output for administrator
      const adminMessage = `
Новая заявка на бронирование — Манжо Гриль

Имя: ${formData.name}
Телефон: ${formData.phone}
Дата: ${formData.date}
Время: ${formData.time}
Зона: ${areaMap[formData.area]}
Гостей: ${formData.guests}
Связаться через: ${contactMap[formData.contactMethod]}
Комментарий: ${formData.comment || 'Нет'}
Источник: ${source}
Отправлено: ${new Date().toLocaleString('ru-RU')}
      `.trim();

      // Log the structured message to console
      console.log("%c[Манжо Гриль - New Booking]%c\n" + adminMessage, "color: #B79A63; font-weight: bold; font-size: 13px;", "color: inherit;");

      // Simulate API network response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      
      // Clear form
      setFormData({
        name: '',
        phone: '',
        date: '',
        time: '',
        area: 'main',
        guests: '2',
        contactMethod: 'phone',
        comment: ''
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const areaMap = {
    main: 'Основной зал',
    hearth: 'Каминная зона',
    terrace: 'Летняя веранда',
    any: 'Любая зона'
  };

  // Renders a premium vector SVG icon for each contact method
  const renderContactIcon = (methodKey) => {
    switch (methodKey) {
      case 'phone':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );
      case 'telegram':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case 'max':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
            <defs>
              <linearGradient id="maxGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="50%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#9d00ff" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="24" height="24" rx="5" fill="url(#maxGradient)" />
            <path fill="#ffffff" fillRule="evenodd" d="M12,4.5 C16.142,4.5 19.5,7.858 19.5,12 C19.5,16.142 16.142,19.5 12,19.5 C10.895,19.5 9.851,19.261 8.912,18.832 L6.645,19.965 C6.147,20.214 5.597,19.745 5.781,19.217 L6.591,16.889 C5.264,15.582 4.5,13.863 4.5,12 C4.5,7.858 7.858,4.5 12,4.5 Z M12,8.25 C9.929,8.25 8.25,9.929 8.25,12 C8.25,13.05 8.65,13.85 9.295,14.445 L8.891,15.608 L10.456,15.416 C10.95,15.65 11.45,15.75 12,15.75 C14.071,15.75 15.75,14.071 15.75,12 C15.75,9.929 14.071,8.25 12,8.25 Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bf-container">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="bf-form">
          <div className="bf-header">
            <h3 className="font-serif">Забронировать стол</h3>
            <p>{"Оставьте заявку, и\u00A0администратор свяжется с\u00A0вами для\u00A0уточнения деталей визита"}</p>
          </div>

          <div className="bf-grid">
            {/* Row 1: Name & Phone */}
            <div className="bf-field-group">
              <label className="bf-label" htmlFor="bf-name">Ваше Имя</label>
              <div className="bf-input-wrap">
                <User size={16} className="bf-input-icon" />
                <input
                  type="text"
                  id="bf-name"
                  name="name"
                  className="bf-input"
                  placeholder="Александр"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bf-field-group">
              <label className="bf-label" htmlFor="bf-phone">Номер телефона</label>
              <div className="bf-input-wrap">
                <Phone size={16} className="bf-input-icon" />
                <input
                  type="tel"
                  id="bf-phone"
                  name="phone"
                  className="bf-input"
                  placeholder="+7 (___) ___-__-__"
                  required
                  disabled={isSubmitting}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            {/* Row 2: Date & Time */}
            <div className="bf-field-group">
              <label className="bf-label" htmlFor="bf-date">Желаемая дата визита</label>
              <div className="bf-input-wrap">
                <Calendar size={16} className="bf-input-icon" />
                <input
                  type="date"
                  id="bf-date"
                  name="date"
                  className="bf-input"
                  required
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]} // Block past dates
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bf-field-group">
              <label className="bf-label" htmlFor="bf-time">Желаемое время визита</label>
              <div className="bf-input-wrap">
                <Clock size={16} className="bf-input-icon" />
                <select
                  id="bf-time"
                  name="time"
                  className="bf-input bf-select"
                  required
                  disabled={isSubmitting}
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="">Выберите время</option>
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Guests count & Area Selection */}
            <div className="bf-field-group">
              <label className="bf-label" htmlFor="bf-guests">Количество гостей</label>
              <div className="bf-input-wrap">
                <Users size={16} className="bf-input-icon" />
                <select
                  id="bf-guests"
                  name="guests"
                  className="bf-input bf-select"
                  required
                  disabled={isSubmitting}
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="1">1 гость</option>
                  <option value="2">2 гостя</option>
                  <option value="3">3 гостя</option>
                  <option value="4">4 гостя</option>
                  <option value="5">5 гостей</option>
                  <option value="6">6 гостей</option>
                  <option value="Более 6 гостей">Более 6 гостей</option>
                </select>
              </div>
            </div>

            <div className="bf-field-group">
              <label className="bf-label">Желаемая зона ресторана</label>
              <div className="bf-area-toggle-group">
                {Object.keys(areaMap).map((key) => (
                  <button
                    key={key}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAreaSelect(key)}
                    className={`bf-area-btn ${formData.area === key ? 'active' : ''}`}
                  >
                    {areaMap[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Preferred Contact Method */}
            <div className="bf-field-group full-width">
              <label className="bf-label">Предпочтительный способ связи</label>
              <div className="bf-contact-toggle-group">
                {[
                  { key: 'phone', label: 'Звонок' },
                  { key: 'telegram', label: 'Telegram' },
                  { key: 'whatsapp', label: 'WhatsApp' },
                  { key: 'max', label: 'MAX' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleContactSelect(item.key)}
                    className={`bf-contact-btn ${formData.contactMethod === item.key ? 'active' : ''}`}
                  >
                    {renderContactIcon(item.key)}
                    <span className="bf-contact-label">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: Comment */}
            <div className="bf-field-group full-width">
              <label className="bf-label" htmlFor="bf-comment">Комментарий (необязательно)</label>
              <div className="bf-input-wrap">
                <MessageSquare size={16} className="bf-input-icon textarea-icon" />
                <textarea
                  id="bf-comment"
                  name="comment"
                  className="bf-input bf-textarea"
                  disabled={isSubmitting}
                  placeholder="Например: нужен детский стул или\u00A0планируем отметить день рождения"
                  rows={2}
                  value={formData.comment}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Validation & Submit details */}
          {errorMsg && (
            <div className="bf-error-box">
              <AlertTriangle size={16} className="bf-error-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bf-footer">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn bf-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="bf-spinner" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Отправить заявку
                </>
              )}
            </button>
            <span className="bf-policy-text">
              Нажимая кнопку, вы соглашаетесь с
              <a 
                href="#contacts" 
                onClick={(e) => {
                  if (onClose) onClose();
                  // Smooth scroll to footer policy details
                  const el = document.getElementById('contacts');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bf-policy-link"
              >
                {"\u00A0политикой обработки персональных данных"}
              </a>
            </span>
          </div>
        </form>
      ) : (
        <div className="bf-success-message">
          <div className="bf-success-icon-wrap">
            <CheckCircle size={44} style={{ color: 'var(--color-deep-green-dark)' }} />
          </div>
          <h3 className="font-serif">Спасибо!</h3>
          <p>{"Заявка отправлена. Администратор свяжется с\u00A0вами для\u00A0подтверждения бронирования."}</p>
          
          {onClose ? (
            <button onClick={onClose} className="btn bf-success-close-btn">
              Закрыть
            </button>
          ) : (
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="btn bf-reset-btn"
            >
              Отправить еще одну заявку
            </button>
          )}
        </div>
      )}
    </div>
  );
}
