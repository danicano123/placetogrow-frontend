import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import DynamicFormFieldEdit from "../../components/Forms/DynamicFormFieldEdit";
import CreateFormFieldModal from "../../components/Forms/CreateFormFieldModal";
import CreateProductModal from "../../components/Products/CreateProductModal";
import DynamicProductEdit from "../../components/Products/DynamicProductEdit";
import { Api } from "../../services/Api";

interface FormFieldOption {
  id: number;
  name: string;
}

interface FormField {
  id: number;
  name: string;
  type: "text" | "select" | "number" | "product";
  is_required: boolean;
  options?: FormFieldOption[];
  description?: string;
  url_img?: string;
  value?: number;
}

interface Form {
  id: number;
  fields: FormField[];
  created_at: string;
  updated_at: string;
  microsite_id: number;
}

const EditForm: React.FC = () => {
  const { microsite_id } = useParams<{ microsite_id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const auth = useSelector((state: any) => state.auth);

  const fetchForm = async () => {
    try {
      const response = await Api.get(
        `/forms/${microsite_id}/full`,
        auth.data.token
      );
      const { data, statusCode } = response;
      if (statusCode === 200) {
        setForm(data);
      } else {
        Swal.fire({
          title: "Error",
          text: `${data.message}`,
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: `${error.message}`,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchForm();
  }, [microsite_id, auth.data.token]);

  const reloadForm = async () => {
    await fetchForm();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Form</h1>
      {form && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Fields</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 mb-4"
            >
              Add Field
            </button>
            {form.fields
              .filter((field) => field.type !== "product")
              .map((field) => (
                <DynamicFormFieldEdit key={field.id} {...field} />
              ))}
            {showCreateModal && (
              <CreateFormFieldModal
                formId={Number(form.id)}
                onClose={() => {
                  setShowCreateModal(false);
                  reloadForm();
                }}
              />
            )}
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Products</h2>
            <button
              onClick={() => setShowCreateProductModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 mb-4"
            >
              Add Product
            </button>
            <div className="flex flex-wrap -mx-4">
              {form.fields
                .filter((field) => field.type === "product")
                .map((product) => (
                  <DynamicProductEdit key={product.id} {...product} />
                ))}
            </div>
            {showCreateProductModal && (
              <CreateProductModal
                formId={Number(form.id)}
                onClose={() => {
                  setShowCreateProductModal(false);
                  reloadForm();
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditForm;
