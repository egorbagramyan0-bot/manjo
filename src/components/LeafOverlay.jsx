import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function LeafOverlay() {
  const springConfig = { damping: 40, stiffness: 200, mass: 1.5 };
  const leafX2 = useSpring(useMotionValue(0), springConfig);
  const leafY2 = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      
      leafX2.set(-x * 0.5);
      leafY2.set(-y * 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [leafX2, leafY2]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
      {/* Bottom Right Leaf (Palm Branch) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          opacity: 0.08,
          x: leafX2,
          y: leafY2,
          rotate: 45,
        }}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--color-deep-green)', width: '100%', height: '100%' }}>
          <path d="M10 90 C30 70 60 50 90 40 M90 40 C75 42 60 48 45 55 M90 40 C80 30 68 20 50 15 M95 35 C82 32 68 30 52 32 M85 45 C70 48 55 52 40 58 M80 50 C65 54 50 60 35 68 M75 55 C60 60 45 68 30 78 M70 60 C55 68 40 78 25 90 M60 70 C48 78 35 88 20 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}
