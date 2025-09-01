import type { CoffeeProduct } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

type ApiResponse<T> = {
  data: T;
  message?: string;
};

export const fetchProducts = async (): Promise<CoffeeProduct[]> => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json: ApiResponse<CoffeeProduct[]> = await res.json();
  return json.data;
};

export const fetchProductById = async (id: string): Promise<CoffeeProduct> => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json: ApiResponse<CoffeeProduct> = await res.json();
  return json.data;
};
