import React, { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';
import './TimelineBlock.scss';
import type { TimelinePeriod } from '@/data/timelineData';
import { TimelineBlockSlider} from '@/components/TimelineBlockSlider/TimelineBlockSlider';
import useHeaderYearsAnimation from '@/hooks/useHeaderYearsAnimation';
import useMarkerOrbit from '@/hooks/useMarkerOrbit';
import useYearTweens from '@/hooks/useYearTweens';

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

const formatCounter = (value: number) => value.toString();

const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, periods }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const blockRef = useRef<HTMLDivElement>(null);
  const orbitTrackRef = useRef<HTMLDivElement>(null);
  const fromYearRef = useRef<HTMLSpanElement>(null);
  const toYearRef = useRef<HTMLSpanElement>(null);
  const markerSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Общее количество периодов
  const total = periods.length;
  // Текущий активный период
  const activePeriod = periods[activeIndex];

  /** Вычисление базовых точек орбиты для маркеров */
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

  /** Анимация года */
  useHeaderYearsAnimation(blockRef, [activeIndex]);

  /** Анимация маркеров */
  const { visibleCategoryIndex } = useMarkerOrbit(activeIndex, basePoints, markerSpanRefs, orbitTrackRef);

  const YearTweens = {
    fromYearRef,
    toYearRef,
    startYear: activePeriod.startYear,
    endYear: activePeriod.endYear
  };
  /** Анимация смены года */
  useYearTweens(YearTweens);


/**
 * Увеличивает предыдущий годовой период.
 */
  const handlePrevPeriod = (): void => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

/**
 * Хандлер увеличивает следующ годовой период.
 */
  const handleNextPeriod = (): void => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

/**
 * Хандлер анимации наведения курсора на маркер.
 *
 * @param {number} index - Индекс маркера.
 * @param {boolean} isHovering - Флаг наведения курсора.
 * @returns {void}
 */
  const handleMarkerHover = (index: number, isHovering: boolean): void => {
    const span = markerSpanRefs.current[index];
    if (!span || index === activeIndex) return;

    if (isHovering) {
      // При наведении: расширяем до scale(1), меняем фон на белый
      gsap.to(span, {
        scale: 1,
        backgroundColor: '#ffffff',
        duration: .4,
        ease: 'power1.in'
      });
    } else {
      // При уходе: возвращаем к scale(0.15), фон обратно на #303E58
      gsap.to(span, {
        scale: 0.15,
        backgroundColor: '#303E58',
        duration: .4,
        ease: 'power1.in'
      });
    }
  };

  return (
    <section className="timeline-block" ref={blockRef} aria-label={title}>
      <header className="timeline-block__header">
        <h1 className="timeline-block__title">{title}</h1>
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
                {index === activeIndex && (
                  <span
                    className={
                      'timeline-block__marker-category ' +
                      (visibleCategoryIndex === index ? 'is-visible' : '')
                    }
                    aria-hidden
                  >
                    {activePeriod.category}
                  </span>
                )}
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

