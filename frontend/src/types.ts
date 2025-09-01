export type CoffeeProduct = {
  id: string;
  name: string;
  quantity: number;
  type: "single-origin" | "blend";
  origin?: string;
  region?: string;
  farm?: string;
  altitude?: string;
  process?: string;
  roastLevel: "light" | "medium" | "medium-dark" | "dark";
  tastingNotes: string[];
  description: string;
  price: number;
  wholesalePrice: number;
  weight: number;
  inventory: number;
  roastDate: string;
  isFeatured: boolean;
  images: string[];
  certifications?: string[];
  brewMethods?: string[];
  score?: number;
  variants: CoffeeVariant[];
  composition?: string[];
  decafProcess?: string;
  popularWith?: string[];
};

export type CoffeeVariant = {
  size: string;
  sku: string;
  price: number;
  wholesaleOnly?: boolean;
};

export type Testimonial = {
  id: string;
  author: string;
  role?: string;
  initials?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  date: string;
};
