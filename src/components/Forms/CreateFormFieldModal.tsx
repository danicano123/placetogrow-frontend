import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { Api } from "../../services/Api";

interface CreateFormFieldModalProps {
  formId: number;
  onClose: () => void;
}

const CreateFormFieldModal: React.FC<CreateFormFieldModalProps> = ({ formId, onClose }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"text" | "select" | "number">("text");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state: any) => state.auth);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await Api.post(
        `/form-fields`,
        { name, type, is_required: isRequired, form_id: formId },
        auth.data.token
      );
      const { data, statusCode } = response;
      if (statusCode === 201) {
        Swal.fire({
          title: "Success",
          text: "Form field created successfully",
          icon: "success",
        });
        onClose(); // Close the modal on success
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-lg font-medium mb-4">Create New Form Field</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "text" | "select" | "number")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFormFieldModal;
