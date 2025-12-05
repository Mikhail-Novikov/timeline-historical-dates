import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type OrbitPoint = { angle: number };

/**
 * Хук анимирует маркеры и орбиту.
 * @param activeIndex - индекс активного периода.
 * @param basePoints - массив объектов с информацией о положении маркеров на орбите.
 * @param orbitTrackRef - ссылка на элемент .timeline-block__orbit-track.
 * @param markerSpanRefs - ссылка на массив маркеров.
 * @returns {void} - Функция создаёт анимацию.
 */
const useMarkerOrbit = (
  activeIndex: number,
  basePoints: OrbitPoint[],
  orbitTrackRef: React.RefObject<HTMLElement | null>,
  markerSpanRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>,
  onRotationComplete?: VoidFunction
): void => {
  const markersInitializedRef = useRef(false);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {

    // Анимируем маркеры
    markerSpanRefs.current.forEach((span, index) => {
      if (!span) return;

      const isActive = index === activeIndex;

      if (!markersInitializedRef.current) {
        gsap.set(span, {
          scale: isActive ? 1 : 0.105,
          backgroundColor: isActive ? "#F4F5F9" : "#303E58",
        });
      } else {
        gsap.to(span, {
          scale: isActive ? 1 : 0.105,
          backgroundColor: isActive ? "#F4F5F9" : "#303E58",
          duration: 0.9,
          ease: isActive ? "back.out(0.9)" : "power2.in",
        });
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
      gsap.set(orbitTrackRef.current, { "--orbit-rotation": rotationValue });
      isFirstRenderRef.current = false;
      markersInitializedRef.current = true;
      onRotationComplete?.();
    } else {
      gsap.to(orbitTrackRef.current, {
        "--orbit-rotation": rotationValue,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => onRotationComplete?.(),
      });
    }
  }, [activeIndex, basePoints]);
};

export default useMarkerOrbit;
