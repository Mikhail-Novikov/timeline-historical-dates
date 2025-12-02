import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';
import './TimelineBlock.scss';
import type { TimelinePeriod } from '@/data/timelineData';
import { TimelineBlockSlider} from '@/components/TimelineBlockSlider/TimelineBlockSlider';

type TimelineBlockProps = {
  title: string;
  periods: TimelinePeriod[];
};

type OrbitPoint = {
  id: string;
  label: string;
  left: string;
  top: string;
  angle: number;
};

const formatCounter = (value: number) => value.toString().padStart(2, '0');

const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, periods }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRef = useRef<HTMLDivElement>(null);
  const orbitTrackRef = useRef<HTMLDivElement>(null);
  const fromYearRef = useRef<HTMLSpanElement>(null);
  const toYearRef = useRef<HTMLSpanElement>(null);
  const fromYearValueRef = useRef<number>(periods[0]?.startYear ?? 0);
  const toYearValueRef = useRef<number>(periods[0]?.endYear ?? 0);
  const isFirstRenderRef = useRef(true);
  const markerSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const markersInitializedRef = useRef(false);

  const total = periods.length;
  const activePeriod = periods[activeIndex];

  const basePoints = useMemo<OrbitPoint[]>(() => {
    const radius = 50;
    const step = (2 * Math.PI) / total;

    return periods.map((period, index) => {
      const baseAngle = -Math.PI / 2 + index * step; // начинаем сверху

      const x = 50 + radius * Math.cos(baseAngle);
      const y = 50 + radius * Math.sin(baseAngle);

      return {
        id: period.id,
        label: formatCounter(index + 1),
        angle: baseAngle,
        left: `${x}%`,
        top: `${y}%`
      };
    });
  }, [periods, total]);

  useEffect(() => {
    if (!blockRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-block__year',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1
        }
      );
    }, blockRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // GSAP анимация для span элементов при смене активного состояния, затем поворот track
  useEffect(() => {
    const animations: gsap.core.Tween[] = [];

    // Сначала анимируем span элементы
    markerSpanRefs.current.forEach((span, index) => {
      if (!span) return;

      const isActive = index === activeIndex;

      if (isActive) {
        // Анимация активации: увеличиваем scale до 1, меняем фон на белый
        if (!markersInitializedRef.current) {
          gsap.set(span, {
            scale: 1,
            backgroundColor: '#ffffff',
            border: 'none'
          });
        } else {
          const tween = gsap.to(span, {
            scale: 1,
            backgroundColor: '#ffffff',
            border: 'none',
            duration: 0.5,
            ease: 'back.out(1.7)'
          });
          animations.push(tween);
        }
      } else {
        // Анимация деактивации: уменьшаем scale до 0.15, меняем фон на #303E58
        if (!markersInitializedRef.current) {
          gsap.set(span, {
            scale: 0.15,
            backgroundColor: '#303E58',
            border: 'none'
          });
        } else {
          const tween = gsap.to(span, {
            scale: 0.15,
            backgroundColor: '#303E58',
            border: 'none',
            duration: 0.4,
            ease: 'power2.in'
          });
          animations.push(tween);
        }
      }
    });

    const rotateTrack = () => {
      if (!orbitTrackRef.current || !basePoints[activeIndex]) {
        return;
      }

      const desiredAngle = -Math.PI / 4; // первая четверть (правый верх)
      const activeAngle = basePoints[activeIndex].angle;
      const rotationDelta = ((desiredAngle - activeAngle) * 180) / Math.PI;
      const rotationValue = `${rotationDelta}deg`;

      if (isFirstRenderRef.current) {
        gsap.set(orbitTrackRef.current, { '--orbit-rotation': rotationValue });
        isFirstRenderRef.current = false;
      } else {
        gsap.to(orbitTrackRef.current, {
          '--orbit-rotation': rotationValue,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      }
    };

    if (!markersInitializedRef.current) {
      markersInitializedRef.current = true;
      // При первом рендере поворачиваем track сразу
      rotateTrack();
    } else if (animations.length > 0) {
      // Ждём завершения всех анимаций span, затем поворачиваем track
      Promise.all(
        animations.map((tween) => new Promise<void>((resolve) => {
          tween.eventCallback('onComplete', () => resolve());
        }))
      ).then(() => {
        rotateTrack();
      });
    } else {
      // Если нет анимаций, поворачиваем сразу
      rotateTrack();
    }
  }, [activeIndex, basePoints]);

  useEffect(() => {
    const fromEl = fromYearRef.current;
    const toEl = toYearRef.current;
    if (!fromEl || !toEl) {
      return;
    }

    const getStartValue = (
      el: HTMLSpanElement,
      fallback: number,
      ref: React.MutableRefObject<number>
    ) => {
      if (typeof ref.current === 'number') {
        return ref.current;
      }
      const parsed = Number(el.textContent);
      return Number.isNaN(parsed) ? fallback : parsed;
    };

    const fromState = {
      value: getStartValue(fromEl, activePeriod.startYear, fromYearValueRef)
    };
    const toState = {
      value: getStartValue(toEl, activePeriod.endYear, toYearValueRef)
    };

    const syncFrom = () => {
      fromYearValueRef.current = fromState.value;
      fromEl.textContent = Math.round(fromState.value).toString();
    };

    const syncTo = () => {
      toYearValueRef.current = toState.value;
      toEl.textContent = Math.round(toState.value).toString();
    };

    const fromTween = gsap.to(fromState, {
      value: activePeriod.startYear,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: syncFrom
    });

    const toTween = gsap.to(toState, {
      value: activePeriod.endYear,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: syncTo
    });

    return () => {
      fromTween.kill();
      toTween.kill();
    };
  }, [activePeriod.startYear, activePeriod.endYear]);


  const handlePrevPeriod = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextPeriod = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleMarkerHover = (index: number, isHovering: boolean) => {
    const span = markerSpanRefs.current[index];
    if (!span || index === activeIndex) return;

    if (isHovering) {
      // При наведении: расширяем до scale(1), меняем фон на белый
      gsap.to(span, {
        scale: 1,
        backgroundColor: '#ffffff',
        border: '1px solid #303E58',
        duration: .4,
        ease: 'power1.in'
      });
    } else {
      // При уходе: возвращаем к scale(0.15), фон обратно на #303E58
      gsap.to(span, {
        scale: 0.15,
        backgroundColor: '#303E58',
        border: 'none',
        duration: .4,
        ease: 'power1.in'
      });
    }
  };

  return (
    <section className="timeline-block" ref={blockRef} aria-label={title}>
      <header className="timeline-block__header">
        <div>
          <p className="timeline-block__eyebrow">Временная шкала</p>
          <h1 className="timeline-block__title">{title}</h1>
        </div>
        <div className="timeline-block__badge">
          <span className="timeline-block__badge-index">
            {formatCounter(activeIndex + 1)}
          </span>
          <span className="timeline-block__badge-text">
            {activePeriod.category}
          </span>
        </div>
      </header>

      <div className="timeline-block__orbit">
        <div className="timeline-block__years">
          <span
            className="timeline-block__year timeline-block__year--from"
            ref={fromYearRef}
          >
            {activePeriod.startYear}
          </span>
          <span
            className="timeline-block__year timeline-block__year--to"
            ref={toYearRef}
          >
            {activePeriod.endYear}
          </span>
        </div>
        <div className="timeline-block__orbit-track" ref={orbitTrackRef}>
          {basePoints.map((point, index) => (
            <button
              key={point.id}
              type="button"
              className={[
                'timeline-block__orbit-marker',
                index === activeIndex ? 'is-active' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ left: point.left, top: point.top }}
              onMouseEnter={() => handleMarkerHover(index, true)}
              onMouseLeave={() => handleMarkerHover(index, false)}
              onClick={() => setActiveIndex(index)}
              aria-label={`Перейти к отрезку ${point.label}`}
            >
              <span
                ref={(el) => {
                  markerSpanRefs.current[index] = el;
                }}
              >
                {point.label}
              </span>
            </button>
          ))}
        </div>
        <div className="timeline-block__orbit-axis timeline-block__orbit-axis--horizontal" />
        <div className="timeline-block__orbit-axis timeline-block__orbit-axis--vertical" />
      </div>
      
      <div className="timeline-block__period-controls">
        <span className="timeline-block__counter">
          {formatCounter(activeIndex + 1)}/{formatCounter(total)}
        </span>
        <div className="timeline-block__nav-group">
          <button
            type="button"
            className="timeline-block__nav-button"
            onClick={handlePrevPeriod}
            aria-label="Предыдущий временной отрезок"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            className="timeline-block__nav-button"
            onClick={handleNextPeriod}
            aria-label="Следующий временной отрезок"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <TimelineBlockSlider activeIndex={activeIndex} periods={periods} />
    </section>
  );
};

export default TimelineBlock;

