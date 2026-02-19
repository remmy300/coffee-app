import type { CoffeeProduct } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

type ApiResponse<T> = {
  data: T;
  message?: string;
};

const fetchApiJson = async <T>(url: string): Promise<ApiResponse<T>> => {
  const res = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const preview = (await res.text()).slice(0, 120);
    throw new Error(
      `Expected JSON but got '${contentType || "unknown"}' from ${res.url}. Response starts with: ${preview}`,
    );
  }

  return (await res.json()) as ApiResponse<T>;
};

export const fetchProducts = async (): Promise<CoffeeProduct[]> => {
  const json = await fetchApiJson<CoffeeProduct[]>(`${API_URL}/api/products`);
  return json.data;
};

export const fetchProductById = async (id: string): Promise<CoffeeProduct> => {
  const json = await fetchApiJson<CoffeeProduct>(`${API_URL}/api/products/${id}`);
  return json.data;
};
