import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function VoucherDurationInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Voucher Duration">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input Voucher Duration Days</Label>
          <InputProduct 
            type="text"
            id="productName"
            {...register("duration", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

