'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './AnimatedText.module.css';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  splitBy?: 'lines' | 'chars';
  duration?: number;
}

export default function AnimatedText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  splitBy = 'lines',
  duration = 1.4,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(
      splitBy === 'lines' ? `.${styles.line}` : `.${styles.char}`
    );

    gsap.set(elements, {
      y: 25,
      opacity: 0,
    });

    gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration,
      stagger: splitBy === 'lines' ? 0.15 : 0.03,
      delay,
      ease: 'expo.out',
    });
  }, [delay, splitBy, duration]);

  const renderContent = () => {
    if (splitBy === 'lines') {
      const lines = text.split('\n');
      return lines.map((line, i) => (
        <span key={i} className={styles.lineWrapper}>
          <span className={styles.line}>{line}</span>
        </span>
      ));
    }

    return text.split('').map((char, i) => (
      <span key={i} className={styles.charWrapper}>
        <span className={styles.char}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ));
  };

  return (
    <Tag className={`${styles.container} ${className}`} ref={containerRef as React.RefObject<HTMLHeadingElement>}>
      {renderContent()}
    </Tag>
  );
}
