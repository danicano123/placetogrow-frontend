import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import DynamicFormField from "../../components/Forms/DynamicFormField";
import DynamicProduct from "../../components/Products/DynamicProduct";
import { Api } from "../../services/Api";
import { createPaymentSession } from "../../services/PlaceToPay";

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

const PaymentForm: React.FC = () => {
  const { micrositeId } = useParams<{ micrositeId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<FormField | null>(null);
  const auth = useSelector((state: any) => state.auth);

  const fetchForm = async () => {
    try {
      const response = await Api.get(`/forms/${micrositeId}/full`, auth.data.token);
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
  }, [micrositeId, auth.data.token]);

  const handleFieldChange = (id: number, value: string | number) => {
    // Manejo de cambios en los campos del formulario
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      Swal.fire({
        title: "Error",
        text: "Please select a product",
        icon: "error",
      });
      return;
    }

    // Recopilar todos los datos necesarios para la sesión de pago
    const reference = selectedProduct.name;
    const description = selectedProduct.description || "No description";
    const currency = "USD";
    const total = selectedProduct.value || 0;

    try {
      // Llamar a la función para crear la sesión de pago con todos los datos necesarios
      await createPaymentSession(reference, description, currency, total, auth.data.user.id, micrositeId!, auth.data.token);
    } catch (error) {
      console.error("Error creating payment session:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create payment session",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Form</h1>
      {form ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {form.fields
              .filter((field) => field.type !== "product")
              .map((field) => (
                <DynamicFormField
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  name={field.name}
                  options={field.options}
                  isRequired={field.is_required}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {form.fields
              .filter((field) => field.type === "product")
              .map((product) => (
                <DynamicProduct
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  url_img={product.url_img}
                  description={product.description}
                  value={product.value}
                  isSelected={selectedProduct?.id === product.id}
                  onSelect={() => setSelectedProduct(product)}
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500">Loading form...</p>
      )}
    </div>
  );
};

export default PaymentForm;