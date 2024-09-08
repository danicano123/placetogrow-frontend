import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import EditProductModal from "./EditProductModal";
import { Api } from "../../services/Api";

interface DynamicProductEditProps {
  id: number;
  name?: string;
  description?: string;
  url_img?: string;
  value?: number;
}

const DynamicProductEdit: React.FC<DynamicProductEditProps> = ({
  id,
  name,
  description,
  url_img,
  value,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const auth = useSelector((state: any) => state.auth);

  const handleDelete = async () => {
    try {
      const response = await Api.delete(`/form-fields/${id}`, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        Swal.fire({
          title: "Success",
          text: "Product deleted successfully",
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
    <div className="w-full sm:w-1/3 p-4">
      <div className="border rounded-lg shadow-lg p-4 flex flex-col h-full">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {name}
          </label>
          <p className="text-gray-600 mb-2">{description}</p>
          <img src={url_img} alt={name} className="w-full h-32 object-cover mb-2" />
          <p className="text-gray-800 font-bold">${value}</p>
        </div>
        <div className="mt-auto flex space-x-2">
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
          <EditProductModal
            id={id}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicProductEdit;
