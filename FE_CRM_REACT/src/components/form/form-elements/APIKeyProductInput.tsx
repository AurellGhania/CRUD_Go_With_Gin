import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function PriceProductInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Input Price">
      <div className="space-y-6">
        <div>
          <Label htmlFor="price">Input Product Price here</Label>
          <InputProduct
            type="text"
            id="price"
            {...register("price", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}