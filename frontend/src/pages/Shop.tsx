import { fetchProducts } from "@/utils/apiProducts";
import CoffeeCard from "@/components/CoffeeCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";

const Shop = () => {
  const {
    data: coffeProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading)
    return (
      <p className="text-center">
        <Spinner />
      </p>
    );
  if (error) return <p>Failed to load products</p>;

  return (
    <div className="bg-white p-4 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coffeProducts?.map((product) => (
          <CoffeeCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
