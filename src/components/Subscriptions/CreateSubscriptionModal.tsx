import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { Api } from '../../services/Api';

interface CreateSubscriptionModalProps {
  formId: number;
  onClose: () => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({ formId, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url_img, setUrlImg] = useState('');
  const [value, setValue] = useState<number>(0);
  const auth = useSelector((state: any) => state.auth);

  const handleCreate = async () => {
    try {
      const response = await Api.post('/form-fields', {
        name,
        description,
        url_img,
        value,
        form_id: formId,
        type: 'subscription',
        is_required: false,
      }, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 201) {
        Swal.fire({
          title: 'Success',
          text: 'Service created successfully!',
          icon: 'success',
        });
        onClose();
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Create Service</h2>
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
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;
