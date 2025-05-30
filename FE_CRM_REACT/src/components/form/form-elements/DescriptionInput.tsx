import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function DescriptionInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Input Description">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input Description here</Label>
          <InputProduct 
            type="text"
            id="productName"
            {...register("description", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

