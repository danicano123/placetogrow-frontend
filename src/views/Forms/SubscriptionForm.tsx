import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import DynamicFormField from "../../components/Forms/DynamicFormField";

import { Api } from "../../services/Api";
import { createSubscriptionToken } from "../../services/PlaceToPay";
import DynamicSubscription from "../../components/Subscriptions/DynamicSubscription";

interface FormFieldOption {
  id: number;
  name: string;
}

interface FormField {
  id: number;
  name: string;
  type: "text" | "select" | "number" | "subscription";
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

const SubscriptionForm: React.FC = () => {
  const { micrositeId, slug } = useParams<{ micrositeId: string; slug: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [selectedSubscription, setSelectedsubscription] = useState<FormField | null>(null);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({"Document Type": "CC"});
  const auth = useSelector((state: any) => state.auth);

  const fetchForm = async () => {
    try {
      const response = await Api.get(`/forms/${micrositeId}/full`, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        setForm(data);
      } else {
        // Swal.fire({
        //   title: "Error",
        //   text: `${data.message}`,
        //   icon: "error",
        // });
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

  const handleFieldChange = (name: string, value: string | number) => {
    // Actualizar el estado de formValues con el nuevo valor
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value.toString(),      
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) {
      Swal.fire({
        title: "Error",
        text: "Please select a product",
        icon: "error",
      });
      return;
    }

    // Recopilar todos los datos necesarios para la sesión de pago
    const reference = selectedSubscription.name;
    const description = selectedSubscription.description || "No description";
    const total = selectedSubscription.value || 0;
console.log(auth);

    try {
      await createSubscriptionToken(
        reference,
        description,
        micrositeId!,
        formValues["Document Type"].valueOf(),
        formValues["Document"].valueOf(),
        slug!,
        auth,
      );
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
              .filter((field) => field.type !== "subscription")
              .map((field) => (
                <DynamicFormField
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  options={field.options}
                  isRequired={field.is_required}
                  onChange={(value) => handleFieldChange(field.name, field.type == 'select'? field.name :value)}  // Pasar name en lugar de id
                />
              ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {form.fields
              .filter((field) => field.type === "subscription")
              .map((subscription) => (
                <DynamicSubscription
                  key={subscription.id}
                  id={subscription.id}
                  name={subscription.name}
                  url_img={subscription.url_img}
                  description={subscription.description}
                  value={subscription.value}
                  isSelected={selectedSubscription?.id === subscription.id}
                  onSelect={() => setSelectedsubscription(subscription)}
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

export default SubscriptionForm;
