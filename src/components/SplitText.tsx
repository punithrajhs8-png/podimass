import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  onAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  duration = 1.2,
  ease = 'elastic.out(1, 0.5)',
  splitType = 'chars',
  from = { opacity: 0, y: 40, scale: 0, rotation: 0 },
  to = { opacity: 1, y: 0, scale: 1, rotation: 0 },
  tag = 'h1',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    const container = containerRef.current;
    
    // Split text into spans
    const splitText = () => {
      const textContent = text;
      let elements: string[] = [];
      
      if (splitType === 'chars') {
        elements = textContent.split('');
      } else {
        elements = textContent.split(' ');
      }

      container.innerHTML = elements
        .map((char, index) => {
          const isSpace = char === ' ';
          const displayChar = isSpace ? '&nbsp;' : char;
          const randomRotation = Math.random() * 30 - 15; // Random rotation between -15 and 15 degrees
          
          return `<span 
            class="split-char inline-block" 
            style="
              opacity: 0;
              transform: translateY(40px) scale(0) rotate(${randomRotation}deg);
              display: inline-block;
            "
            data-index="${index}"
          >${displayChar}</span>${splitType === 'words' && !isSpace && index < elements.length - 1 ? '&nbsp;' : ''}`;
        })
        .join('');

      return container.querySelectorAll('.split-char');
    };

    const chars = splitText();

    // Create animation
    animationRef.current = gsap.to(chars, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          hasAnimatedRef.current = true;
        }
      },
      onComplete: () => {
        onAnimationComplete?.();
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) {
          st.kill();
        }
      });
    };
  }, [text, delay, duration, ease, splitType, from, to, onAnimationComplete]);

  const Tag = tag as React.ElementType;

  return (
    <Tag 
      ref={containerRef as React.RefObject<HTMLHeadingElement>} 
      className={`split-text ${className}`}
      style={{ 
        display: 'inline-block',
        wordWrap: 'break-word'
      }}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
