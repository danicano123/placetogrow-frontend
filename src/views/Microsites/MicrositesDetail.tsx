import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Api } from "../../services/Api";
import Swal from "sweetalert2";

const MicrositeDetail: React.FC = () => {
  const location = useLocation();
  const { micrositeId } = location.state;
  const [microsite, setMicrosite] = useState<any>(null);
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMicrosite = async () => {
      try {
        const response = await Api.get(
          `/microsites/${micrositeId}`,
          auth.data.token
        );
        const { data, statusCode } = response;
        if (statusCode === 200) {
          setMicrosite(data.microsite);
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

    fetchMicrosite();
  }, [micrositeId, auth.data.token]);

  if (!microsite) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalle del Micrositio</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.name}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Alias</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.slug}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Logo URL</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.logo_url}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Categoría</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.category}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tipo de Micrositio</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.microsite_type}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tipo de Moneda</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.currency_type}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Tiempo de Expiración del Pago (minutos)
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.payment_expiration_time}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tipo de Documento</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.document_type}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Documento</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={microsite.document}
            readOnly
          />
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default MicrositeDetail;
