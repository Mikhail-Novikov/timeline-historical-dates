import { useEffect } from 'react';
import { gsap } from 'gsap';

import { HEADER_ANIMATION_DURATION } from '@/constants/';

/**
 * Хук анимирует непрозрачность и положение y элементов .timeline-block__year
 * @param blockRef - ref компонента.
 * @param deps - массив index периодов.
 * @returns {void} - Функция создаёт анимацию.
 */
const useHeaderYearsAnimation = (blockRef: React.RefObject<HTMLElement>, deps: number[]): void => {
  useEffect(() => {
    if (!blockRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-block__year',
        { opacity: 0 },
        {
          opacity: 1,
          duration: HEADER_ANIMATION_DURATION,
          ease: 'power3.out',
        }
      );
    }, blockRef);

    return () => ctx.revert();

  }, deps);
}

export default useHeaderYearsAnimation;
