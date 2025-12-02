import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Пропсы хука useYearTweens
interface YearTweensProps {
  // рефы на элементы годов от
  fromYearRef: React.RefObject<HTMLSpanElement>;
  // рефы на элементы годов до
  toYearRef: React.RefObject<HTMLSpanElement>;
  // начальный год
  startYear: number;
  // конечный год
  endYear: number;
}

/**
 * Хук анимирует два года (fromYearRef и toYearRef) из startYear в endYear.
 * @param fromYearRef - ссылка на элемент .timeline-block__year из которого берется начальное значение для анимации.
 * @param toYearRef - ссылка на элемент .timeline-block__year в который будет анимироваться конечное значение для анимации.
 * @param startYear - начальное значение для анимации.
 * @param endYear - конечное значение для анимации.
 * @returns - {void}
 */
export const useYearTweens = (
  { fromYearRef, toYearRef, startYear, endYear }: YearTweensProps
): void => {
  // рефы для хранения текущих значений годов
  const fromValue = useRef<number | null>(null);
  const toValue = useRef<number | null>(null);

  useEffect(() => {
    const fromEl = fromYearRef.current;
    const toEl = toYearRef.current;
    if (!fromEl || !toEl) return;

    /**
     * Возвращает значение элемента или значение по умолчанию.
     * @param el - элемент span с годом.
     * @param fallback - значение по умолчанию.
     * @param ref - реф для хранения текущего значения.
     * @returns - значение для анимации, либо из рефа, либо из текста элемента, либо значение по умолчанию.
     */
    const getStartValue = (el: HTMLSpanElement, fallback: number, ref: React.MutableRefObject<number | null>): number => {
      if (typeof ref.current === 'number') return ref.current;
      const parsed = Number(el.textContent);
      return Number.isNaN(parsed) ? fallback : parsed;
    };

    const fromState = { value: getStartValue(fromEl, startYear, fromValue) };
    const toState = { value: getStartValue(toEl, endYear, toValue) };

    // Функции для синхронизации значений fromYear
    const syncFrom = () => {
      fromValue.current = fromState.value;
      fromEl.textContent = Math.round(fromState.value).toString();
    };

    // Функции для синхронизации значений toYear
    const syncTo = () => {
      toValue.current = toState.value;
      toEl.textContent = Math.round(toState.value).toString();
    };

    // Анимация fromYear
    const fromTween = gsap.to(fromState, {
      value: startYear,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: syncFrom
    });

    // Анимация toYear
    const toTween = gsap.to(toState, {
      value: endYear,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: syncTo
    });

    // Очистка анимаций
    return () => {
      fromTween.kill();
      toTween.kill();
    };
  }, [fromYearRef, toYearRef, startYear, endYear]);
}

export default useYearTweens;
