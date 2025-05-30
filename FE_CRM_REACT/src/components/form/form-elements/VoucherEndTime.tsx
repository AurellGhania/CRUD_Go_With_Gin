import { useFormContext, Controller } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../date-picker";

export default function VoucherStartTime() {
  const { control, setValue } = useFormContext();

  return (
    <ComponentCard title="Voucher End Time">
      <div className="space-y-6">
        <Controller
          name="expired_use"
          control={control}
          render={({ field }) => (
            <DatePicker
              id="expired-voucher"
              label="Select Voucher End Time"
              placeholder="Select a date"
              defaultDate={field.value}
              onChange={([selectedDate]) => {
                setValue("expired_use", selectedDate);
                field.onChange(selectedDate);
              }}
            />
          )}
        />
      </div>
    </ComponentCard>
  );
}
