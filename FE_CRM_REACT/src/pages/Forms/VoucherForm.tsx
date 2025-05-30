// src/pages/VoucherForm.tsx
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FormProvider } from "react-hook-form";
import Alert from "../../components/ui/alert/Alert";
import ButtonProduct from "../../components/ui/button/ButtonProduct";
import VoucherDurationInput from "../../components/form/form-elements/VoucherDurationInput";
import VoucherStartTime from "../../components/form/form-elements/VoucherStartTime";
import VoucherEndTime from "../../components/form/form-elements/VoucherEndTime";
import QuantityInput from "../../components/form/form-elements/QuantityInput";
import { postVouchers } from "../../hooks/voucher-crud/postVochers";

export default function VoucherForm() {
  const { form, onSubmit, status } = postVouchers ();

  return (
    <div>
      <PageMeta
        title="Product Form"
        description="This is the form to add a new product"
      />
      <PageBreadcrumb pageTitle="Voucher Form" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <VoucherDurationInput />
              <QuantityInput />
            </div>
            <div className="space-y-6">
              <VoucherStartTime />
              <VoucherEndTime />
            </div>
          </div>

          <ButtonProduct
            type="submit"
            size="md"
            className="mt-6"
            variant="primary"
          >
            Submit Product
          </ButtonProduct>
        </form>
      </FormProvider>

      {status === "success" && (
        <Alert
          variant="success"
          title="Success!"
          message="Product created successfully."
          showLink={false}
        />
      )}
      {status === "error" && (
        <Alert
          variant="error"
          title="Error!"
          message="Failed to create product. Try again."
          showLink={false}
        />
      )}
    </div>
  );
}
