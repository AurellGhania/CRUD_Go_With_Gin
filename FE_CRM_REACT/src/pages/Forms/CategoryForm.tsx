// src/pages/CategoryForm.tsx
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FormProvider } from "react-hook-form";
import Alert from "../../components/ui/alert/Alert";
import ButtonProduct from "../../components/ui/button/ButtonProduct";
import NameInput from "../../components/form/form-elements/NameInput";
import { useNavigate, useParams } from "react-router";
import { CategoryFormValues, useCategoryForm } from "../../hooks/category-crud/useCategoryForm";
import { useEffect } from "react";
import axios from "axios";
import { updateCategory } from "../../hooks/category-crud/updateCategory";
import { postCategory } from "../../hooks/category-crud/postCategory";

export default function CategoryForm() {
  const { ID } = useParams<{ ID: string }>();
  const isEdit = Boolean(ID);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  const { form, status, setStatus } = useCategoryForm();

  // Fetch existing category if edit mode
  useEffect(() => {
    if (isEdit) {
      setStatus("loading");
      axios
        .get(`${baseUrl}/categories/${ID}`)
        .then((res) => {
          const category = res.data;
          form.reset({
            name: category.name,
          });
          setStatus("idle");
        })
        .catch(() => setStatus("error"));
    }
  }, [ID]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setStatus("loading");
      const formData = new FormData();
      formData.append("name", data.name);

      if (isEdit && ID) {
        await updateCategory(ID, { name: data.name });
      } else {
        await postCategory(data);
      }

      setStatus("success");
      form.reset();
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
        title={isEdit ? "Edit Category" : "Category Form"}
        description={isEdit ? "Edit existing category data" : "Form to add a new category"}
      />
      <PageBreadcrumb pageTitle={isEdit ? "Edit Category" : "Add Category"} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <NameInput />
            </div>
          </div>

          <ButtonProduct
            type="submit"
            size="md"
            className="mt-6"
            variant="primary"
            disabled={status === "loading"}
          >
            {status === "loading" ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update Category" : "Submit Category")}
          </ButtonProduct>
        </form>
      </FormProvider>

      {status === "success" && (
        <Alert
          variant="success"
          title="Success!"
          message={`Category ${isEdit ? "updated" : "created"} successfully.`}
          showLink={false}
        />
      )}
      {status === "error" && (
        <Alert
          variant="error"
          title="Error!"
          message={`Failed to ${isEdit ? "update" : "create"} category. Try again.`}
          showLink={false}
        />
      )}
    </div>
  );
}
