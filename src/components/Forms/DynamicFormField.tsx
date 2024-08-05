import React, { useEffect, useState } from "react";
import { Api } from "../../services/Api";

interface FormFieldOption {
  id: number;
  name: string;
}

interface DynamicFormFieldProps {
  id: number;
  type: "text" | "select" | "number" | "product";
  name: string;
  options?: FormFieldOption[];
  isRequired: boolean;
  onChange: (value: string | number) => void;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  id,
  type,
  name,
  options,
  isRequired,
  onChange,
}) => {
  const [value, setValue] = useState<string | number>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name}
      </label>
      {type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required={isRequired}
        />
      ) : type === "number" ? (
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required={isRequired}
        />
      ) : (
        <select
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required={isRequired}
        >
          {options?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default DynamicFormField;
