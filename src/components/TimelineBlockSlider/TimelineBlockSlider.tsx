import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "./TimelineBlockSlider.scss";
import type { TimelinePeriod } from "@/data/timelineData";

type TimelineBlockSliderProps = {
  activeIndex: number;
  periods: TimelinePeriod[];
};

export const TimelineBlockSlider: React.FC<TimelineBlockSliderProps> = ({
  activeIndex = 0,
  periods,
}) => {
  const sliderPrevRef = useRef<HTMLButtonElement>(null);
  const sliderNextRef = useRef<HTMLButtonElement>(null);
  const swiperInstance = useRef<SwiperClass | null>(null);

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

  return (
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
        key={activePeriod.id}
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperInstance.current = swiper;
        }}
        navigation={{
          prevEl: sliderPrevRef.current,
          nextEl: sliderNextRef.current,
        }}
        // onBeforeInit={(swiper) => {
        //   if (typeof swiper.params.navigation !== 'boolean') {
        //     swiper.params.navigation = {
        //       prevEl: sliderPrevRef.current,
        //       nextEl: sliderNextRef.current
        //     };
        //   }
        // }}
        slidesPerView={1.2}
        spaceBetween={24}
        breakpoints={{
          768: { slidesPerView: 2.5 },
          1400: { slidesPerView: 3.5 },
        }}>
        {activePeriod.events.map((event) => (
          <SwiperSlide key={`${activePeriod.id}-${event.year}-${event.title}`}>
            <article className="timeline-block__card">
              <data className="timeline-block__card-year">{event.year}</data>
              <p className="timeline-block__card-text" title={event.description}>{event.description}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
