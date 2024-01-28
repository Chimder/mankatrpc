import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { pages } from "@/shared/data/ScrollData";
import Link from "next/link";
import {
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";

export function Scroll() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="relative z-10 box-content flex w-full">
        {pages.map((card) => (
          <div
            key={card.name}
            className="embla__slide h-[80vh] w-full md:h-[40vh]"
            style={{ backgroundImage: `url(${card.img})` }}
          >
            <div className="z-100 box-border  flex w-full items-end justify-between ">
              <div className="flex text-white md:flex-wrap ">
                <div className="z-999  w-52 flex-shrink-0 overflow-hidden  rounded-sm p-8 md:mr-0  md:w-28 md:p-1">
                  <Link href={`/manka/${card.name}`}>
                    <img
                      className="z-999 flex w-48 items-center p-1 md:w-28"
                      src={card.img2}
                      alt=""
                    />
                  </Link>
                </div>
                <div
                  className="absolute bottom-0 z-20 box-border block h-1/2 w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(0deg, #1b1f35f2, #1b1f35cc 50%, #1b1f3500)",
                  }}
                />
                <div className="z-999 flex w-full  items-center p-1">
                  <Link
                    href={`/manka/${card.name}`}
                    className=" md:flex-shrink-1 flex-shrink-0 text-5xl lg:text-4xl md:text-2xl "
                  >
                    {card.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="embla__prev" onClick={scrollPrev}>
        <DoubleArrowLeftIcon className="z-999 h-14 w-14 fill-current  text-orange-600 hover:text-orange-950 md:w-5 " />
      </div>
      <div className="embla__next" onClick={scrollNext}>
        <DoubleArrowRightIcon className="z-999 h-14 w-14  fill-current text-orange-600 hover:text-orange-950 md:w-5" />
      </div>
    </div>
  );
}
