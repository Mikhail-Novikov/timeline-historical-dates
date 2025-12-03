import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "./TimelineBlock.scss";

import type { TimelinePeriod } from "@/data/timelineData";
import { TimelineBlockSlider } from "@/components/TimelineBlockSlider/TimelineBlockSlider";
import useHeaderYearsAnimation from "@/hooks/useHeaderYearsAnimation";
import useMarkerOrbit from "@/hooks/useMarkerOrbit";
import useYearTweens from "@/hooks/useYearTweens";
import { MARKER_ANIMATION_DURATION, MARKER_SCALE_COEFFICIENT } from "@/constants/";

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

const TimelineBlock: React.FC<TimelineBlockProps> = ({ periods }) => {
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

  // GSAP анимация для span элементов при смене активного состояния
  useEffect(() => {
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
          gsap.to(span, {
            scale: 1,
            backgroundColor: '#ffffff',
            border: 'none',
            duration: 0.6,
            ease: 'back.out(1.7)'
          });
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
          gsap.to(span, {
            scale: 0.15,
            backgroundColor: '#303E58',
            border: 'none',
            duration: 0.6,
            ease: 'power2.in'
          });
        }
      }
    });

    // Вращаем орбиту параллельно с анимациями маркеров
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
      markersInitializedRef.current = true;
    } else {
      gsap.to(orbitTrackRef.current, {
        '--orbit-rotation': rotationValue,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }, [activeIndex, basePoints]);

  // Синхронизация span элементов годов с активным периодом
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
        border: 'none',
        duration: .3,
        ease: 'power1.in'
      });
    } else {
      // При уходе: возвращаем к scale(0.15), фон обратно на #303E58
      gsap.to(span, {
        scale: 0.15,
        backgroundColor: '#303E58',
        border: 'none',
        duration: .3,
        ease: 'power1.in'
      });
    }
  };

  return (
    <section className="timeline" ref={blockRef}>
      <div className="timeline-block">
      <div className="timeline-block__orbit">
        <div className="timeline-block__years">
          <span
            className="timeline-block__year timeline-block__year--from"
            ref={fromYearRef}>
            {activePeriod.startYear}
          </span>
          <span
            className="timeline-block__year timeline-block__year--to"
            ref={toYearRef}>
            {activePeriod.endYear}
          </span>
        </div>
        <div className="timeline-block__orbit-track" ref={orbitTrackRef}>
          {basePoints.map((point, index) => (
            <button
              key={point.id}
              type="button"
              className={[
                "timeline-block__orbit-marker",
                index === activeIndex ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ left: point.left, top: point.top }}
              onMouseEnter={() => handleMarkerHover(index, true)}
              onMouseLeave={() => handleMarkerHover(index, false)}
              onClick={() => setActiveIndex(index)}
              aria-label={`Перейти к отрезку ${point.label}`}>
              <span
                ref={(el) => {
                  markerSpanRefs.current[index] = el;
                }}>
                {point.label}
              </span>
              {index === activeIndex && (
                <span
                  className={
                    "timeline-block__marker-category " +
                    (activeIndex === index ? "is-visible" : "")
                  }
                  aria-hidden>
                  {activePeriod.category}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>        
      </div>


      <div className="timeline-block__period-controls">
        <div className="timeline-block__counter">
          {formatCounter(activeIndex + 1)}/{formatCounter(total)}
        </div>
        <div className="timeline-block__nav-group">
          <button
            type="button"
            className="timeline-block__nav-button"
            onClick={handlePrevPeriod}
            aria-label="Предыдущий временной отрезок">
            <span aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none">
                <path
                  d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071"
                  stroke="#42567A"
                  stroke-width="2"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className="timeline-block__nav-button"
            onClick={handleNextPeriod}
            aria-label="Следующий временной отрезок">
            <span aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none">
                <path
                  d="M0.707092 0.707108L6.95709 6.95711L0.707093 13.2071"
                  stroke="#42567A"
                  stroke-width="2"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <TimelineBlockSlider activeIndex={activeIndex} periods={periods} />
    </section>
  );
};

export default TimelineBlock;
