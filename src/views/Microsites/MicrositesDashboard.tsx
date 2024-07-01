import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/Api";
import Swal from "sweetalert2";

const MicrositesDashboard: React.FC = () => {
  const [microsites, setMicrosites] = useState<any[]>([]);
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMicrosites = async () => {
      try {
        const { data, statusCode } = await Api.get("/microsites", auth.data.token);
        if (statusCode === 200) {
          setMicrosites(data.microsites);
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error: unable to fetch active microsites",
          icon: "error",
        });
      }
    };

    fetchMicrosites();
  }, [auth.data.token]);

  const handleToggleIsActive = async (micrositeId: string, isActive: boolean) => {
    try {
      const response = await Api.patch(`/microsites/${micrositeId}/is-active`, {
        is_active: !isActive,
      }, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        const updatedMicrosites = microsites.map((microsite) =>
          microsite.id === micrositeId ? { ...microsite, is_active: !isActive } : microsite
        );
        setMicrosites(updatedMicrosites);
        Swal.fire({
          title: "Success",
          text: "Microsite updated successfully",
          icon: "success",
        });
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
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Panel De Micrositios</h1>
        <button
          onClick={() => navigate("./create-microsite")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Crear Micrositio
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Nombre</th>
            <th className="py-2 px-4 border-b text-center">Tipo de Micrositio</th>
            <th className="py-2 px-4 border-b text-center">Logo</th>
            <th className="py-2 px-4 border-b text-center">Activo</th>
            <th className="py-2 px-4 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {microsites.map((microsite) => (
            <tr key={microsite.id}>
              <td className="py-2 px-4 border-b text-center">{microsite.name}</td>
              <td className="py-2 px-4 border-b text-center">{microsite.microsite_type}</td>
              <td className="py-2 px-4 border-b text-center">
                <img
                  src={microsite.logo_url}
                  alt={microsite.name}
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="py-2 px-4 border-b text-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={microsite.is_active}
                    onChange={() => handleToggleIsActive(microsite.id, microsite.is_active)}
                  />
                  <span>{microsite.is_active ? "Activo" : "Inactivo"}</span>
                </label>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => navigate(`/dashboard/microsites/${microsite.id}`)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MicrositesDashboard;
