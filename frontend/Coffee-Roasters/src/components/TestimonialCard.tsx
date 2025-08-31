import type { Testimonial } from "@/types";
import AvatarPlaceholder from "./AvatarPlaceholder";
import { Star } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full min-h-[300px] flex flex-col justify-between">
      <div className="flex  items-center mb-4 gap-2">
        <AvatarPlaceholder
          initials={testimonial.initials}
          name={testimonial.author}
          size="md"
        />
        <div>
          <h4 className="font-medium text-gray-800">{testimonial.author}</h4>
          {testimonial.role && (
            <p className="text-sm text-gray-600">{testimonial.role}</p>
          )}
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < testimonial.rating
                ? "stroke-amber-600 fill-amber-600"
                : "stroke-gray-400"
            }`}
          />
        ))}
      </div>
      <blockquote className="text-gray-800 italic mb-4 line-clamp-3">
        "{testimonial.content}"
      </blockquote>
      <p className="text-sm text-gray-600">{testimonial.date}</p>
    </div>
  );
};

export default TestimonialCard;
