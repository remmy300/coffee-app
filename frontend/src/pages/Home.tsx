import Hero from "@/components/Hero";
import CoffeeCard from "@/components/CoffeeCard";
import Spinner from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { fetchProducts } from "@/utils/apiProducts";

import type { CoffeeProduct } from "@/types";

const Home = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchProducts,
    select: (products) => {
      const featured = products.filter((product) => product.isFeatured);

      if (featured.length < 3) {
        const nonFeatured = products
          .filter((product) => !product.isFeatured)
          .slice(0, 3 - featured.length);
        return [...featured, ...nonFeatured];
      }

      return featured.slice(0, 3);
    },
  });

  if (isLoading)
    return (
      <p>
        <Spinner />
      </p>
    );

  // Verify uniqueness in development
  if (process.env.NODE_ENV === "development") {
    const ids = featuredProducts?.map((p) => p.id);
    if (new Set(ids).size !== ids?.length) {
      console.error("Duplicate IDs in featured products!");
    }
  }
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <section className="bg-white py-12">
        <h2 className="text-2xl text-gray-800 font-semibold mt-3 text-center">
          Our Roasting Story
        </h2>
        <div className="py-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 shadow rounded-lg overflow-hidden">
            <img
              src="/img/grinder.webp"
              alt="Coffee roasting process"
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>

          <article className="md:w-1/2  bg-white/90 shadow-lg p-8 rounded-lg">
            <h2 className="text-xl font-medium mb-4 text-gray-800 ">
              Artisan Roasters Since 2010
            </h2>
            <p className="mb-4 text-gray-700">
              We began with a 5kg roaster and a passion for perfecting the
              craft. Today, we operate state-of-the-art Probat roasters,
              meticulously developing profiles for each origin to highlight
              their unique characteristics.
            </p>
            <p className="mb-4 text-gray-700">
              Our direct relationships with growers ensure ethical sourcing and
              premium quality green beans. We specialize in small-batch
              roasting, allowing precise control over each lot - whether it's a
              single-origin for specialty cafes or a consistent blend for
              wholesale partners.
            </p>
            <p className="mb-4 text-gray-700">
              For retail customers, we offer freshly roasted bags with roast
              dates and brewing guides. Wholesale clients benefit from our
              flexible ordering systems, private labeling options, and barista
              training programs.
            </p>
            <p className="mb-4 text-gray-700">
              Every batch is cupped by our Q-graded team, because we believe
              exceptional coffee should be both scientifically excellent and
              soulfully satisfying.
            </p>
          </article>
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl text-gray-800 font-bold text-center mb-2">
            Featured Coffees
          </h2>
          <p className="text-gray-700 text-center mb-8">
            Discover our premium selections
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts?.map((product) => (
              <CoffeeCard
                key={`featured-${product.id}`}
                product={product as CoffeeProduct}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              View All Coffees →
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl text-gray-800 font-bold text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-700 text-center mb-12 max-w-2xl mx-auto">
            Hear from coffee lovers and wholesale partners
          </p>

          <TestimonialCarousel />
        </div>
      </section>
    </div>
  );
};

export default Home;
