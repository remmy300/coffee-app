import { fetchProductById } from "@/services/apiProducts";
import type { CoffeeProduct } from "@/types";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  Package,
  Scale,
  Coffee,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useCartContext } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCartContext();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<CoffeeProduct>({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-500">Product not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-gray-700 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/components">Shop</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {product?.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, id) => (
              <Star
                key={id}
                className={`w-5 h-5 ${
                  id < Math.floor((product.score ?? 0) / 20)
                    ? "fill-amber-400 stroke-amber-400"
                    : "stroke-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-700">{product.score}/100</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-gray-700">
            Roasted on {new Date(product.roastDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-amber-50 transition-colors "
              aria-label="save to favorites"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((image, id) => (
              <div
                key={id}
                className="aspect-square bg-gray-50 rounded-md overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]?.url}
                  loading="lazy"
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.wholesalePrice && (
                <span className="ml-2 text-sm text-gray-500">
                  Wholesale: ${product.wholesalePrice.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              onClick={() => addToCart(product)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Add to Cart - {product.weight}g
            </Button>
          </div>

          {/* Origin Story */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Origin Story
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium">
                    {product.region}, {product.origin}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-700">Farm</p>
                  <p className="font-medium">{product.farm}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-700">Altitude</p>
                  <p className="font-medium">{product.altitude}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-700">Process</p>
                  <p className="font-medium">{product.process}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tasting Notes
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Roast Profile */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Roast Profile
            </h2>
            <div className="flex items-center gap-4">
              <span
                className={`inline-block w-24 h-2 rounded-full ${
                  product.roastLevel === "light"
                    ? "bg-amber-300"
                    : product.roastLevel === "medium"
                      ? "bg-amber-500"
                      : product.roastLevel === "medium-dark"
                        ? "bg-amber-700"
                        : "bg-amber-900"
                }`}
              ></span>
              <span className="capitalize font-medium">
                {product.roastLevel} roast
              </span>
            </div>
          </div>

          {/* Brew Methods */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended Brew Methods
            </h2>
            <div className="flex flex-wrap gap-3">
              {product.brewMethods?.map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          About This Coffee
        </h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* Certifications */}
      {product.certifications && product.certifications.length > 0 && (
        <div className="mt-12 border-t pt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-4">
            {product.certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg"
              >
                <Package className="w-5 h-5 text-amber-600" />
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
