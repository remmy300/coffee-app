import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: Product | null;
  refresh: () => void;
}

const initialForm: Product = {
  _id: "",
  id: "",
  name: "",
  images: { url: "", public_id: "" },
  price: 0,
  type: "single-origin",
  roastLevel: "medium",
  description: "",
  weight: 250,
  inventory: 0,
  roastDate: new Date().toISOString().slice(0, 10),
};

const ProductDialog = ({ open, setOpen, product, refresh }: Props) => {
  const [form, setForm] = useState<Product>(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        _id: product._id || "",
        id: product.id || "",
        name: product.name || "",
        images: product.images,
        price: product.price || 0,
        type: product.type || "single-origin",
        roastLevel: product.roastLevel || "medium",
        description: product.description || "",
        weight: product.weight || 250,
        inventory: product.inventory || 0,
        roastDate: product.roastDate || new Date().toISOString().slice(0, 10),
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [product]);

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.type.trim() ||
      !form.roastLevel.trim() ||
      !form.description.trim() ||
      !form.roastDate.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.price < 0 || form.weight <= 0 || form.inventory < 0) {
      setError("Price, weight, and inventory values are invalid.");
      return;
    }

    try {
      const payload = {
        ...form,
        id: form.id?.trim() || undefined,
        name: form.name.trim(),
        type: form.type.trim(),
        roastLevel: form.roastLevel.trim(),
        description: form.description.trim(),
      };

      if (product?._id) {
        await adminApi.put(`/products/${product._id}`, payload);
      } else {
        await adminApi.post("/products", payload);
      }

      refresh();
      setOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save product.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <input
            className="w-full border p-2 rounded"
            placeholder="Product Code (optional)"
            value={form.id || ""}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as "single-origin" | "blend",
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="single-origin">Single Origin</option>
            <option value="blend">Blend</option>
          </select>

          <select
            value={form.roastLevel}
            onChange={(e) => setForm({ ...form, roastLevel: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="light">Light Roast</option>
            <option value="medium">Medium Roast</option>
            <option value="dark">Dark Roast</option>
          </select>

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Weight (grams)"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Inventory"
            value={form.inventory}
            onChange={(e) =>
              setForm({ ...form, inventory: Number(e.target.value) })
            }
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.roastDate}
            onChange={(e) => setForm({ ...form, roastDate: e.target.value })}
          />

          <Button className="w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
