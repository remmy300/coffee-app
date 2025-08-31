import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CheckCircle, Truck } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      id="hero"
      className="relative h-screen bg-[url('/img/coffee1.webp')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-gray-900/60 transition-all duration-500 hover:bg-gray-900/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
        {/* Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text">
              Freshly Roasted
            </span>
            <span className="text-white block mt-2">Coffee Beans</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
            Artisan blends roasted to perfection. Experience the rich, complex
            flavors of our sustainably sourced coffee.
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                src="/img/arabica.webp"
                className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover"
                alt="Arabica coffee"
              />
              <img
                src="/img/coffee4.webp"
                className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover"
                alt="Coffee beans"
              />
            </div>
            <span className="text-gray-100 text-sm md:text-base">
              Trusted by 1,000+ coffee enthusiasts
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-amber-400 w-5 h-5" />
              <span className="text-gray-100">100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="text-amber-400 w-5 h-5" />
              <span className="text-gray-100">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-amber-400 w-5 h-5" />
              <span className="text-gray-100">Direct Trade</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/shop")}
          className="mt-8 px-8 py-4 text-lg font-medium bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:shadow-lg"
        >
          Explore Our Blends
          <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            →
          </span>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
