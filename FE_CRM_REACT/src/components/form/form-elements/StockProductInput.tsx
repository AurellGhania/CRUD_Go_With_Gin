import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function StockProductInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Input Stock Product">
      <div className="space-y-6">
        <div>
          <Label htmlFor="stock">Input Stock Product here</Label>
          <InputProduct 
            type="text"
            id="stock"
            {...register("stock", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

