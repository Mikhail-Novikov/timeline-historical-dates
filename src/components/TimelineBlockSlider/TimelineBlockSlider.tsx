import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TimelineBlockSlider.scss";
import "./TimelineBlockSliderMobile.scss";
import type { TimelinePeriod } from "@/data/timelineData";

type TimelineBlockSliderProps = {
  activeIndex: number;
  periods: TimelinePeriod[];
  category?: string;
};

export const TimelineBlockSlider: React.FC<TimelineBlockSliderProps> = ({
  activeIndex = 0,
  periods,
  category,
}) => {
  const sliderPrevRef = useRef<HTMLButtonElement>(null);
  const sliderNextRef = useRef<HTMLButtonElement>(null);
  const swiperInstance = useRef<SwiperClass | null>(null);
  const sliderContainerRef = useRef(null);

  const activePeriod = periods[activeIndex];

  useEffect(() => {
    if (swiperInstance.current) {
      swiperInstance.current.slideTo(0, 0);
    }
  }, [activePeriod.id]);

  useEffect(() => {
    const swiper = swiperInstance.current;
    if (
      !swiper ||
      !sliderPrevRef.current ||
      !sliderNextRef.current ||
      !swiper.navigation
    ) {
      return;
    }

    const navigation = swiper.params.navigation;
    if (navigation && typeof navigation !== "boolean") {
      navigation.prevEl = sliderPrevRef.current;
      navigation.nextEl = sliderNextRef.current;
    }

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, [activePeriod.id]);

  useEffect(() => {
    if (!sliderContainerRef.current) return;

    gsap.fromTo(
      sliderContainerRef.current,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.inOut",
      }
    );
  }, [activePeriod.id]);

  return (
    <div>
      <h2 className="timeline-block__category-mobile">{category}</h2>
      <div className="timeline-block__slider">
        <div className="timeline-block__slider-headline">
          <div className="timeline-block__slider-nav">
            <button
              type="button"
              ref={sliderPrevRef}
              className="timeline-block__nav-button r-180"
              aria-label="Предыдущий слайд">
              <span aria-hidden>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none">
                  <path
                    d="M0.707092 0.707093L5.70709 5.70709L0.707093 10.7071"
                    stroke="#3877EE"
                    stroke-width="2"
                  />
                </svg>
              </span>
            </button>
            <button
              type="button"
              ref={sliderNextRef}
              className="timeline-block__nav-button"
              aria-label="Следующий слайд">
              <span aria-hidden>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none">
                  <path
                    d="M0.707092 0.707093L5.70709 5.70709L0.707093 10.7071"
                    stroke="#3877EE"
                    stroke-width="2"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <Swiper
          ref={sliderContainerRef}
          key={activePeriod.id}
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperInstance.current = swiper;
          }}
          navigation={{
            prevEl: sliderPrevRef.current,
            nextEl: sliderNextRef.current,
          }}
          pagination={{ clickable: true }}
          watchOverflow
          spaceBetween={50}
          breakpoints={{
            320: { 
              slidesPerView: 1.5,
              pagination: { enabled: true, clickable: true },
              slidesOffsetBefore: 20
            },
            577: { slidesPerView: 2.5, pagination: { enabled: false } },
            1400: { slidesPerView: 3.5, pagination: { enabled: false } },
          }}>
          {activePeriod.events.map((event) => (
            <SwiperSlide
              key={`${activePeriod.id}-${event.year}-${event.title}`}>
              <article className="timeline-block__card">
                <data className="timeline-block__card-year">{event.year}</data>
                <p
                  className="timeline-block__card-text"
                  title={event.description}>
                  {event.description}
                </p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
