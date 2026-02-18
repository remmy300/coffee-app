import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import ProductTable from "./components/ProductTable";
import ProductDialog from "./components/ProductDialog";
import type { Product } from "@/types";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data } = await adminApi.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button onClick={handleCreate}>Add Product</Button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        refresh={fetchProducts}
      />

      <ProductDialog
        open={open}
        setOpen={setOpen}
        product={selectedProduct}
        refresh={fetchProducts}
      />
    </div>
  );
};

export default Products;
