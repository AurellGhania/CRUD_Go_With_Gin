import { useFormContext } from "react-hook-form";
import ComponentCard from "../../../common/ComponentCard.tsx";
import Label from "../../Label.tsx";
import InputProduct from "../../input/InputProduct.tsx";


export default function UpdateAPIKeyProductInput() {
  const { register } = useFormContext();

  return (
    <ComponentCard title="API Key">
      <div className="space-y-6">
        <div>
          <Label htmlFor="apiKey">Input API Key here</Label>
          <InputProduct
            type="text"
            id="apiKey"
            {...register("api_key", { required: true })}
          />
        </div>
      </div>
    </ComponentCard>
  );
}