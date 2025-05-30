import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function QuantityInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Voucher Quantity">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input the Quantity of Voucher</Label>
          <InputProduct 
            type="text"
            id="productName"
            {...register("quantity", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

