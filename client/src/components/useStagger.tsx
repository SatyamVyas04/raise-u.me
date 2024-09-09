// useStaggerAnimation.ts
import { useEffect } from 'react';
import { gsap } from 'gsap';

const useStagger = (selector: string) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, [selector]);
};

export default useStagger;
