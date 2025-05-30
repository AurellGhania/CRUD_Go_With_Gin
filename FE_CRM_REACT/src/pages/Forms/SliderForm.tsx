import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FormProvider } from "react-hook-form";
import Alert from "../../components/ui/alert/Alert";
import ButtonProduct from "../../components/ui/button/ButtonProduct";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import NameInput from "../../components/form/form-elements/NameInput";
import PickCategory from "../../components/form/form-elements/PickCategory";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { SliderFormValues, useSliderForm } from "../../hooks/slider-crud/useSliderForm";
import { updateSlider } from "../../hooks/slider-crud/updateSlider";
import { postSlider } from "../../hooks/slider-crud/postSlider";
import DescriptionInput from "../../components/form/form-elements/DescriptionInput";
import TermsInput from "../../components/form/form-elements/KetentuanInput";

export default function SliderForm() {
  const { ID } = useParams<{ ID: string }>();
  const isEdit = Boolean(ID);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL;

  const { form, status, setStatus } = useSliderForm();
  const [files, setFiles] = useState<File[]>([]);

  // Tambah state khusus loading data dari API
  const [loadingData, setLoadingData] = useState(false);
  // Tambah state khusus loading submit
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch existing product if edit mode
  useEffect(() => {
    if (isEdit) {
      setLoadingData(true); // start loading data
      axios
        .get(`${baseUrl}/sliders/ads/${ID}`)
        .then((res) => {
          const slider = res.data;

          // Reset form hanya sekali saat data lama di-load
          form.reset({
            name: slider.title,
            category: slider.category_id, // ID kategori sebagai string
            description: slider.description, // ID kategori sebagai string
            terms: slider.terms, // ID kategori sebagai string
          });

          setStatus("idle");
        })
        .catch(() => {
          setStatus("error");
        })
        .finally(() => {
          setLoadingData(false); // selesai loading data
        });
    }
  }, [ID]);

  const onSubmit = async (data: SliderFormValues) => {
    console.log("Submit data:", data);
    console.log("Files:", files);
  
    if (!data.category) {
      alert("Please select a category!");
      setStatus("error");
      return;
    }
    if (files.length === 0) {
      alert("Please upload at least one image!");
      setStatus("error");
      return;
    }
  
    try {
      setLoadingSubmit(true);
      setStatus("loading");
      const formData = new FormData();
      formData.append("title", data.name);
      formData.append("category_id", data.category);
      formData.append("description", data.description);
      formData.append("terms", data.terms);
      // Upload hanya 1 file saja, ganti kalau backend support multiple
      formData.append("image", files[0]);
  
      if (isEdit && ID) {
        await updateSlider(ID, formData);
      } else {
        await postSlider(formData);
      }
  
      setStatus("success");
      form.reset();
      setFiles([]);
      setTimeout(() => navigate("/slider-tables"), 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoadingSubmit(false);
    }
  };
  

  return (
    <div>
      <PageMeta
        title={isEdit ? "Edit Slider" : "Slider Form"}
        description={isEdit ? "Edit existing Slider data" : "Form to add a new Slider"}
      />
      <PageBreadcrumb pageTitle={isEdit ? "Edit Slider" : "Add Slider"} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <NameInput />
              <DescriptionInput />

              <TermsInput />
            </div>
            <div className="space-y-6">
              <PickCategory form={form} /> {/* ← passing form untuk kontrol */}

              <DropzoneComponent setFiles={setFiles} />
            </div>
          </div>

          <ButtonProduct
            type="submit"
            size="md"
            className="mt-6"
            variant="primary"
            disabled={loadingData || loadingSubmit} // disable saat loading
          >
            {loadingSubmit ? "Loading..." : "Submit Slider"}
          </ButtonProduct>
        </form>
      </FormProvider>

      {status === "success" && (
        <Alert variant="success" title="Success!" message="Slider created successfully." showLink={false} />
      )}
      {status === "error" && (
        <Alert variant="error" title="Error!" message="Failed to create Slider. Try again." showLink={false} />
      )}
    </div>
  );
}
