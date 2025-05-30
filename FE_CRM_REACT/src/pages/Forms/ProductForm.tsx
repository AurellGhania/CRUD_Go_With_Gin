import { FormProvider } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import NameInput from "../../components/form/form-elements/NameInput";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import ButtonProduct from "../../components/ui/button/ButtonProduct";
import Alert from "../../components/ui/alert/Alert";
import { updateProduct } from "../../hooks/product-crud/updateProduct";
import { postProduct } from "../../hooks/product-crud/postProduct";
import { useProductForm, ProductFormValues } from "../../hooks/product-crud/useProductForm";
import PriceProductInput from "../../components/form/form-elements/APIKeyProductInput";
import DescriptionProductInput from "../../components/form/form-elements/DescriptionProductInput";
import StockProductInput from "../../components/form/form-elements/StockProductInput";
import PickCategory from "../../components/form/form-elements/PickCategory";

export default function ProductForm() {
  const { ID } = useParams<{ ID: string }>();
  const isEdit = Boolean(ID);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  const { form, status, setStatus } = useProductForm();
  const [files, setFiles] = useState<File[]>([]);

  // Fetch existing product if edit mode
  useEffect(() => {
    if (isEdit) {
      setStatus("loading");
      axios.get(`${baseUrl}/products/${ID}`)
        .then((res) => {
          const product = res.data;
          form.reset({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
            category: product.category_id, // ID kategori sebagai string

          });
          setStatus("idle");
        })
        .catch(() => setStatus("error"));
    }
  }, [ID]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setStatus("loading");
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("stock", data.stock);
      formData.append("category_id", data.category);
      files.forEach((file) => formData.append("images", file));
  
      if (isEdit && ID) {
        await updateProduct(ID, formData);
      } else {
        await postProduct(formData);
      }
  
      setStatus("success");
      form.reset();
      setFiles([]);
      setTimeout(() => {
        navigate("/product-table");
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div>
      <PageMeta
        title={isEdit ? "Edit Product" : "Product Form"}
        description={isEdit ? "Edit existing product data" : "Form to add a new product"}
      />
      <PageBreadcrumb pageTitle={isEdit ? "Edit Product" : "Add Product"} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <NameInput />
              <PriceProductInput />
              <DropzoneComponent setFiles={setFiles} />

            </div>
            <div className="space-y-6">
              <DescriptionProductInput />
              <StockProductInput />
              <PickCategory form={form} /> {/* ← passing form untuk kontrol */}
              <ButtonProduct
                type="submit"
                size="md"
                className="mt-6"
                variant="primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update Product" : "Submit Product")}
              </ButtonProduct>
            </div>
          </div>

        </form>
      </FormProvider>

      {status === "success" && (
        <Alert
          variant="success"
          title="Success!"
          message={`Product ${isEdit ? "updated" : "created"} successfully.`}
          showLink={false}
        />
      )}
      {status === "error" && (
        <Alert
          variant="error"
          title="Error!"
          message={`Failed to ${isEdit ? "update" : "create"} product. Try again.`}
          showLink={false}
        />
      )}
    </div>
  );
}
