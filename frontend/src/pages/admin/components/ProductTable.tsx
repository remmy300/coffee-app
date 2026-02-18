import { Button } from "@/components/ui/button";
import { adminApi } from "@/services/adminApi";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  refresh: () => void;
}

const ProductTable = ({ products, onEdit, refresh }: Props) => {
  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminApi.delete(`/products/${id}`);
    refresh();
  };

  return (
    <div className="border rounded-md">
      <table className="w-full text-left">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Price</th>
            <th className="p-4">Category</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-4">{product.name}</td>
              <td className="p-4">${product.price}</td>
              <td className="p-4">{product.type}</td>
              <td className="p-4 space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
