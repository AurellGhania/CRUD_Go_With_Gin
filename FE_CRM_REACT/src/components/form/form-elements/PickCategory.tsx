import { useState, useEffect } from "react";
import axios from "axios";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import { UseFormReturn } from "react-hook-form";

interface PickCategoryProps {
  form: UseFormReturn<any>; // atau UseFormReturn<ProductFormValues>
}


export default function PickCategory({ form }: PickCategoryProps) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/categories/"); // Ganti sesuai base URL kamu
        const categoryList = response.data.categories;

        const categoryOptions = categoryList.map((category: { ID: number; name: string }) => ({
          value: String(category.ID),
          label: category.name,
        }));

        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectChange = (value: string) => {
    console.log("Selected category ID:", value);
    form.setValue("category", value); // penting: update form state!
  };

  return (
    <ComponentCard title="Select Category">
      <div className="space-y-6">
        <div>
          <Label>Select Category</Label>
          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <Select
              options={categories}
              placeholder="Select Category"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              
            />
          )}
        </div>
      </div>
    </ComponentCard>
  );
}
