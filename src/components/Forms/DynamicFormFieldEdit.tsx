import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import EditFormFieldModal from "./EditFormFieldModal";
import EditOptionsModal from "./EditOptionsModal";
import { Api } from "../../services/Api";

interface FormFieldOption {
  id: number;
  name: string;
}

interface DynamicFormFieldEditProps {
  id: number;
  name?: string;
  type?: "text" | "select" | "number" | "product";
  is_required?: boolean;
  options?: FormFieldOption[];
  description?: string;
  url_img?: string;
  value?: number;
}

const DynamicFormFieldEdit: React.FC<DynamicFormFieldEditProps> = ({
  id,
  name,
  type,
  is_required,
}) => {
  const [options, setOptions] = useState<FormFieldOption[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await Api.get(`/form-field-options/form-field/${id}`, auth.data.token);
        const { data, statusCode } = response;
        if (statusCode === 200) {
          setOptions(data.formFieldOptions || []);
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

    fetchOptions();
  }, [id, auth.data.token]);

  const handleDelete = async () => {
    try {
      const response = await Api.delete(`/form-fields/${id}`, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        Swal.fire({
          title: "Success",
          text: "Form field deleted successfully",
          icon: "success",
        });
        // Aquí puedes hacer cualquier acción adicional si es necesario
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

  return (
    <div className="p-4 border rounded-lg shadow-lg flex justify-between items-center mb-4">
      <div className="flex-grow">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {name}
        </label>
        {type === "text" ? (
          <input
            type="text"
            required={is_required}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        ) : type === "number" ? (
          <input
            type="number"
            required={is_required}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="relative">
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required={is_required}
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="absolute right-0 top-0 bg-blue-500 text-white px-2 py-1 rounded-md shadow-sm hover:bg-blue-600"
              onClick={() => setShowOptionsModal(true)}
            >
              Edit Options
            </button>
          </div>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex space-x-2">
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      {showEditModal && (
        <EditFormFieldModal
          id={id}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showOptionsModal && type === "select" && (
        <EditOptionsModal
          id={id}
          onClose={() => setShowOptionsModal(false)}
        />
      )}
    </div>
  );
};

export default DynamicFormFieldEdit;
