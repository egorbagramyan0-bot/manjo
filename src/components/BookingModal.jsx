import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import './BookingModal.css';

export default function BookingModal({ isOpen, onClose }) {
  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key close trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="booking-modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="booking-modal-card"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="booking-modal-close-btn" onClick={onClose} aria-label="Закрыть">
              <X size={20} />
            </button>

            {/* Reusable Booking Form */}
            <BookingForm source="Модальное окно" onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
