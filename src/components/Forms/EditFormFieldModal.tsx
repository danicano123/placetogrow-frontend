import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { Api } from "../../services/Api";

interface EditFormFieldModalProps {
  id: number;
  onClose: () => void;
}

const EditFormFieldModal: React.FC<EditFormFieldModalProps> = ({ id, onClose }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"text" | "select" | "number">("text");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        const response = await Api.get(`/form-fields/${id}`, auth.data.token);
        const { data, statusCode } = response;
        if (statusCode === 200) {
          setName(data.formField.name);
          setType(data.formField.type);
          setIsRequired(data.formField.is_required);
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldData();
  }, [id, auth.data.token]);

  const handleSave = async () => {
    try {
      const response = await Api.patch(`/form-fields/${id}`, 
        { name, type, is_required: isRequired }, 
        auth.data.token
      );
      const { data, statusCode } = response;
      if (statusCode === 200) {
        Swal.fire({
          title: "Success",
          text: "Form field updated successfully",
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
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-lg font-medium mb-4">Edit Form Field</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required
          </label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="mt-1"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
          >
            Save
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

export default EditFormFieldModal;
