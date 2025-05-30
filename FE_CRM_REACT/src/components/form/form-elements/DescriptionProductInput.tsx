import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function DescriptionProductInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Input Description Product">
      <div className="space-y-6">
        <div>
          <Label htmlFor="description">Input Description Product here</Label>
          <InputProduct 
            type="text"
            id="description"
            {...register("description", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}

