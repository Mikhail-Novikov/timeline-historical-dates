import React, { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "./TimelineBlock.scss";
import "./TimelineBlockMobile.scss";

import type { TimelinePeriod } from "@/data/timelineData";
import { TimelineBlockSlider } from "@/components/";

import useYearTweens from "@/hooks/useYearTweens";
import {
  MARKER_ANIMATION_DURATION,
  MARKER_SCALE_COEFFICIENT,
} from "@/constants/";
import useMarkerOrbit from "@/hooks/useMarkerOrbit";

// Тип для пропсов компонента
type TimelineBlockProps = {
  // заголовок
  title: string;
  // массив периодов
  periods: TimelinePeriod[];
};

// Тип для точки орбиты
type OrbitPoint = {
  // уникальный идентификатор
  id: string;
  // название периода
  label: string;
  // координаты точки
  left: string;
  // координаты точки
  top: string;
  // угол в градусах
  angle: number;
};

// Функция для форматирования значения счетчика
const formatCounter = (value: number) => value.toString();

/**
 * Компонент для отображения временной шкалы с периодами.
 *
 * @param props - объект с пропсами:
 *   title - заголовок блока,
 *   periods - массив периодов,
 *   category - категория активного периода.
 *
 * @returns {JSX.Element} - компонент для отображения временной шкалы с периодами.
 */
const TimelineBlock: React.FC<TimelineBlockProps> = ({ periods }): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCategoryIndex, setVisibleCategoryIndex] = useState<
    number | null
  >(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const orbitTrackRef = useRef<HTMLDivElement>(null);
  const fromYearRef = useRef<HTMLSpanElement>(null);
  const toYearRef = useRef<HTMLSpanElement>(null);
  const markerSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
        top: `${y}%`,
      };
    });
  }, [periods, total]);

  useMarkerOrbit(activeIndex, basePoints, orbitTrackRef, markerSpanRefs, () =>
    setVisibleCategoryIndex(activeIndex)
  );

  // Хук анимирует заголовки годов при смене активного периода
  useYearTweens({
    fromYearRef,
    toYearRef,
    startYear: activePeriod.startYear,
    endYear: activePeriod.endYear,
  });

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
      gsap.to(span, {
        scale: 1,
        backgroundColor: "#F4F5F9",
        border: "none",
        duration: MARKER_ANIMATION_DURATION,
        ease: "power1.in",
      });
    } else {
      gsap.to(span, {
        scale: MARKER_SCALE_COEFFICIENT,
        backgroundColor: "#303E58",
        border: "none",
        duration: MARKER_ANIMATION_DURATION,
        ease: "power1.in",
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
                      (visibleCategoryIndex === index ? "is-visible" : "")
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

      <TimelineBlockSlider
        activeIndex={activeIndex}
        periods={periods}
        category={activePeriod.category}
      />
    </section>
  );
};

export default TimelineBlock;
