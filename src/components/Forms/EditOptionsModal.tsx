import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { Api } from '../../services/Api';

interface EditOptionsModalProps {
  id: number;
  onClose: () => void;
}

interface FormFieldOption {
  id: number;
  name: string;
}

const EditOptionsModal: React.FC<EditOptionsModalProps> = ({ id, onClose }) => {
  const [options, setOptions] = useState<FormFieldOption[]>([]);
  const [newOption, setNewOption] = useState<string>('');
  const auth = useSelector((state: any) => state.auth);
  const [editOptionId, setEditOptionId] = useState<number | null>(null);
  const [editOptionName, setEditOptionName] = useState<string>('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await Api.get(`/form-field-options/form-field/${id}`, auth.data.token);
        const { data, statusCode } = response;        
        if (statusCode === 200) {
          setOptions(data.formFieldOptions || []);
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

    fetchOptions();
  }, [id, auth.data.token, newOption, editOptionName]);

  const handleAddOption = async () => {
    try {
        console.log(newOption, id);
        
      const response = await Api.post(
        `/form-field-options`,
        { name: newOption, form_field_id: id },
        auth.data.token
      );
      const { data, statusCode } = response;
      if (statusCode === 201) {
        setOptions([...options, {id:data.id, name: data.name}]);
        setNewOption('');
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

  const handleEditOption = async () => {
    if (editOptionId === null) return;

    try {
      const response = await Api.patch(
        `/form-field-options/${editOptionId}`,
        { name: editOptionName },
        auth.data.token
      );
      const { data, statusCode } = response;
      console.log(data);
      
      if (statusCode === 200) {
        setOptions(options.map(opt => (opt.id === editOptionId ? {name: data.formFieldOption.name, id: data.formFieldOption.id } : opt)));
        setEditOptionId(null);
        setEditOptionName('');
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

  const handleDeleteOption = async (optionId: number) => {
    try {
      const response = await Api.delete(`/form-field-options/${optionId}`, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        setOptions(options.filter(opt => opt.id !== optionId));
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Options</h2>
        <div className="mb-4">
          {options.map(option => (
            <div key={option.id} className="flex items-center justify-between border-b py-2">
              <span>{option.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditOptionId(option.id);
                    setEditOptionName(option.name);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOption(option.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {editOptionId !== null && (
          <div className="mb-4">
            <input
              type="text"
              value={editOptionName}
              onChange={(e) => setEditOptionName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleEditOption}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditOptionId(null);
                  setEditOptionName('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="mt-4">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="New option name"
          />
          <button
            onClick={handleAddOption}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600"
          >
            Add Option
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditOptionsModal;
