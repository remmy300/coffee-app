import Slider from "react-slick";
import { testimonials } from "@/Data";
import type { Testimonial } from "@/types";
import TestimonialCard from "./TestimonialCard";
console.log(testimonials);

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, testimonials.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    arrows: testimonials.length > 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length),
          arrows: testimonials.length > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: testimonials.length > 1,
        },
      },
    ],
  };

  return (
    <div className="slick-carousel px-4 py-8">
      {testimonials.length > 1 ? (
        <Slider {...settings}>
          {testimonials.map((testimonial: Testimonial) => (
            <div key={testimonial.id} className="px-2">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="max-w-md mx-auto">
          <TestimonialCard testimonial={testimonials[0]} />
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
