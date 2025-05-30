import { useFormContext, Controller } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard";
import DatePicker from "../date-picker";

export default function VoucherStartTime() {
  const { control, setValue } = useFormContext();

  return (
    <ComponentCard title="Voucher Start Time">
      <div className="space-y-6">
        <Controller
          name="expired_voucher"
          control={control}
          render={({ field }) => (
            <DatePicker
              id="expired-voucher"
              label="Select Voucher Start Time"
              placeholder="Select a date"
              defaultDate={field.value}
              onChange={([selectedDate]) => {
                setValue("expired_voucher", selectedDate);
                field.onChange(selectedDate);
              }}
            />
          )}
        />
      </div>
    </ComponentCard>
  );
}
