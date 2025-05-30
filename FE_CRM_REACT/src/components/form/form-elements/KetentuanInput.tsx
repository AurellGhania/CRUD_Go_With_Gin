import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function TermsInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Terms Name">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input Terms here</Label>
          <InputProduct 
            type="text"
            id="productName"
            {...register("terms", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

