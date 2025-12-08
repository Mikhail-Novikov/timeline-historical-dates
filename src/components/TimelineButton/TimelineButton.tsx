import React from "react";

// Тип для пропсов компонента
type TimelineButtonProps = {
  id: string;
  index: number;
  label: string;
  // CSS-левое и CSS-топ для маркера
  left: string;
  top: string;
  isActive: boolean;
  // флаг видимости категории для анимации
  isCategoryVisible: boolean;
  // текст категории активного периода
  category: string;
  onHover: (index: number, isHovering: boolean) => void;
  onSelect: (index: number) => void;
  // метод для сохранения ссылки на маркер
  setMarkerRef: (index: number, el: HTMLSpanElement | null) => void;
};

/**
 * Компонент для отображения маркера на временной шкале.
 *
 * @param props - объект с пропсами:
 *   id - уникальный ID маркера,
 *   index - индекс маркера,
 *   label - текст маркера,
 *   left - CSS-левое для маркера,
 *   top - CSS-топ для маркера,
 *   isActive - флаг активности маркера,
 *   isCategoryVisible - флаг видимости категории,
 *   category - текст категории,
 *   onHover - функция, вызываемая при наведении на маркер,
 *   onSelect - функция, вызываемая при клике на маркер,
 *   setMarkerRef - метод для сохранения ссылки на маркер.
 *
 * @returns {JSX.Element}
 */
export const TimelineButton: React.FC<TimelineButtonProps> = ({
  id,
  index,
  label,
  left,
  top,
  isActive,
  isCategoryVisible,
  category,
  onHover,
  onSelect,
  setMarkerRef,
}): JSX.Element => {
  return (
    <button
      key={id}
      type="button"
      className="timeline-block__orbit-marker"
      style={{ left, top }}
      onMouseEnter={() => onHover(index, true)}
      onMouseLeave={() => onHover(index, false)}
      onClick={() => onSelect(index)}
      aria-label={`Перейти к отрезку ${label}`}>
      <span
        className="timeline-block__marker-item"
        ref={(el) => setMarkerRef(index, el)}>
        {label}
      </span>
      {isActive && (
        <span
          className={
            "timeline-block__marker-category " +
            (isCategoryVisible ? "is-visible" : "")
          }
          aria-hidden>
          {category}
        </span>
      )}
    </button>
  );
};