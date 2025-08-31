import type { CoffeeProduct } from "@/types";
import { ArrowRight, HeartPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useCartContext } from "@/context/CartContext";
interface CoffeeCardProps {
  product: CoffeeProduct;
}

const CoffeeCard = ({ product }: CoffeeCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();

  return (
    <div className="group relative border border-gray-200 rounded-xl  shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="h-60 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100">
        <button
          aria-label="Add to favorites"
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-amber-50 transition-colors"
        >
          <HeartPlus className="hover:text-amber-700" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                product.roastLevel === "light"
                  ? "bg-amber-300"
                  : product.roastLevel === "medium"
                  ? "bg-amber-500"
                  : product.roastLevel === "medium-dark"
                  ? "bg-amber-700"
                  : "bg-amber-900"
              }`}
            ></span>
            <span className="ml-1 text-sm font-medium text-gray-600 capitalize">
              {product.roastLevel} roast
            </span>
          </div>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">{product.origin}</span>
        </div>

        <p className="text-gray-600 text-sm mb-5 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {product.tastingNotes.map((note) => (
            <span
              key={note}
              className="text-xs font-medium bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-100"
            >
              {note}
            </span>
          ))}
        </div>
        <div className="flex justify-between opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => addToCart(product)}
            className="text-sm bg-amber-600 hover:bg-amber-700"
          >
            Add To Cart
          </Button>
          <Button
            onClick={() => navigate(`/details/${product.id}`)}
            className=" bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <span>View Details</span>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;
