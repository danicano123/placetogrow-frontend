import React from "react";

interface DynamicSubscriptionProps {
  id: number;
  name: string;
  url_img?: string;
  description?: string;
  value?: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const DynamicSubscription: React.FC<DynamicSubscriptionProps> = ({
  id,
  name,
  url_img,
  description,
  value,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`border rounded-md p-4 mb-4 ${isSelected ? "border-blue-500" : "border-gray-300"}`}
      onClick={() => onSelect(id)}
    >
      {url_img && <img src={url_img} alt={name} className="w-full h-auto" />}
      <h3 className="text-lg font-semibold">{name}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {value !== undefined && <p className="text-lg font-bold">Price: ${value}</p>}
    </div>
  );
};

export default DynamicSubscription;
