import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Api } from '../../services/Api';
import { useSelector } from 'react-redux';

interface EditProductModalProps {
  id: number;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ id, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url_img, setUrlImg] = useState('');
  const [value, setValue] = useState<number>(0);
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await Api.get(`/form-fields/${id}`, auth.data.token);
        const { data, statusCode } = response;        
        if (statusCode === 200) {
          setName(data.formField.name);
          setDescription(data.formField.description);
          setUrlImg(data.formField.url_img);
          setValue(data.formField.value);
        } else {
          Swal.fire({
            title: 'Error',
            text: `${data.message}`,
            icon: 'error',
          });
        }
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: `${error.message}`,
          icon: 'error',
        });
      }
    };

    fetchProduct();
  }, [id, auth.data.token]);

  const handleEdit = async () => {
    try {
      const response = await Api.patch(`/form-fields/${id}`, {
        name,
        description,
        url_img,
        value
      }, auth.data.token);
      if (response.statusCode === 200) {
        Swal.fire({
          title: 'Success',
          text: 'Product updated successfully!',
          icon: 'success'
        });
        onClose();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error'
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={url_img}
            onChange={(e) => setUrlImg(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
