import type { CoffeeProduct } from "@/types";

export const fetchProducts = async (): Promise<CoffeeProduct[]> => {
  const res = await fetch("http://localhost:4000/api/products");
  const json = await res.json();
  return json.data;
};

export const fetchProductById = async (id: string): Promise<CoffeeProduct> => {
  const res = await fetch(`http://localhost:4000/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
};
