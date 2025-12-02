import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { MARKER_ANIMATION_DURATION, MARKER_SCALE_COEFFICIENT } from '@/constants/';

type OrbitPoint = { angle: number };

/**
* Хук управляет анимацией размаха маркера, вращением по орбите и отображаемым индексом категории.
 * @param activeIndex - текущий активный индекс.
 * @param basePoints - базовые точки орбиты для маркеров.
 * @param markerSpanRefs - рефы спанов маркеров.
 * @param orbitTrackRef - реф трека орбиты.
 * @returns { visibleCategoryIndex } - возвращает индекс видимой категории.
 */
export const useMarkerOrbit = (
  activeIndex: number,
  basePoints: OrbitPoint[],
  markerSpanRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
  orbitTrackRef: React.MutableRefObject<HTMLElement | null>
) => {
  const isFirstRenderRef = useRef(true);
  const markersInitializedRef = useRef(false);
  const [visibleCategoryIndex, setVisibleCategoryIndex] = useState<number | null>(null);

  useEffect(() => {
    // создаём массив анимаций для маркеров с использованием gsap 
    const animations: gsap.core.Tween[] = [];

    markerSpanRefs.current.forEach((span, index) => {
      if (!span) return;

      const isActive = index === activeIndex;

      if (isActive) {
        if (!markersInitializedRef.current) {
          gsap.set(span, {
            scale: 1,
            backgroundColor: '#ffffff',
            border: 'none'
          });
        } else {
          // анимируем активный маркер
          const tween = gsap.to(span, {
            scale: 1,
            backgroundColor: '#ffffff',
            border: 'none',
            duration: MARKER_ANIMATION_DURATION,
            paused: true,
            ease: 'back.out(1.7)'
          });
          // добавляем активный маркер в массив анимаций
          animations.push(tween);
        }
      } else {
        if (!markersInitializedRef.current) {
          gsap.set(span, {
            scale: MARKER_SCALE_COEFFICIENT,
            backgroundColor: '#303E58',
            borderColor: 'none'
          });
        } else {
          // анимируем неактивный маркер
          const tween = gsap.to(span, {
            scale: MARKER_SCALE_COEFFICIENT,
            backgroundColor: '#303E58',
            borderColor: 'none',
            duration: MARKER_ANIMATION_DURATION,
            paused: true,
            ease: 'power2.in'
          });
          // добавляем неактивный маркер в массив анимаций
          animations.push(tween);
        }
      }
    });

/**
 * Хук создает последовательность анимаций при переходе к активному индексу.
 * @param targetIndex - целевой индекс для анимации.
 * @param [opts] - опции для настройки анимации.
 * @returns - возвращает созданную анимацию.
 */
    const buildSequence = (targetIndex: number, opts?: { onComplete?: () => void }): gsap.core.Animation | null => {
      const tl = gsap.timeline({ paused: false });

      // Поворот орбиты на нужный угол при переходе к активному индексу
      const rotate = () => {
        if (!orbitTrackRef.current || !basePoints[targetIndex]) return;

        const desiredAngle = -Math.PI / 4;
        const activeAngle = basePoints[targetIndex].angle;
        const rotationDelta = ((desiredAngle - activeAngle) * 180) / Math.PI;
        const rotationValue = `${rotationDelta}deg`;

        // Проверяем, является ли это первый рендер
        if (isFirstRenderRef.current) {
          // Если да, устанавливаем начальное положение орбиты сразу
          gsap.set(orbitTrackRef.current, { '--orbit-rotation': rotationValue });
          isFirstRenderRef.current = false;
        } else {
          // иначе анимируем поворот орбиты
          tl.to(orbitTrackRef.current, {
            '--orbit-rotation': rotationValue,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        }
      };

      // если есть анимации для маркеров, добавляем их в таймлайн
      if (animations.length > 0) animations.forEach((t) => tl.add(t));
      // делаем поворот орбиты
      rotate();

      // если передан коллбек onComplete, то добавляем его в таймлайн
      if (typeof opts?.onComplete === 'function') tl.eventCallback('onComplete', opts.onComplete);
      // если длительность таймлайна 0, вызываем onComplete сразу
      if (tl.duration() === 0) opts?.onComplete?.();

      return tl;
    };

    // сбрасываем видимый индекс категории перед анимацией, см. run
    setVisibleCategoryIndex(null);

    let cancelled = false;
    let tl: gsap.core.Animation | null = null;


    // Запуск анимации поворота орбиты на нужный угол, анимация маркеров.

    const run = () => {
      markersInitializedRef.current = markersInitializedRef.current || true;

      tl = buildSequence(activeIndex, {
        // по завершении анимации устанавливаем видимый индекс категории
        onComplete: () => {
          if (!cancelled) setVisibleCategoryIndex(activeIndex);
        }
      });
    };

    run();

    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [activeIndex, basePoints, markerSpanRefs, orbitTrackRef]);

  return { visibleCategoryIndex };
}

export default useMarkerOrbit;
