import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../common/ComponentCard.tsx";
import Label from "../../Label.tsx";
import InputProduct from "../../input/InputProduct.tsx";


export default function UpdateNameProductInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Product Name">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input Update Product Name here</Label>
          <InputProduct 
            type="text"
            id="productName"
            {...register("name", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

