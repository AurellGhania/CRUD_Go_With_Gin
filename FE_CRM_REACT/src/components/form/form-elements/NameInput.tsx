import { useFormContext } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import InputProduct from "../input/InputProduct.tsx";


export default function NameInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="Input Name">
      <div className="space-y-6">
        <div>
          <Label htmlFor="productName">Input Name here</Label>
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

