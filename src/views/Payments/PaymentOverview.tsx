import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAdditionalData } from "../../services/PlaceToPay";

const PaymentOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [payment, setPayment] = useState<any>(null);
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const fetchPaymentDetails = async (id: string | undefined) => {
    try {
      const result = await fetchAdditionalData(id);
      setPayment(result);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPaymentDetails(id);
  }, [id, auth.data.token]);

  if (!payment) return <div className="text-center py-4">Loading...</div>;

  // Si `payment` tiene la propiedad `subscription`, mostrar un estilo de factura más detallado
  if (payment.subscription) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Factura de Suscripción</h1>
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">Detalles del Micrositio</h2>
                <DetailItem label="Nombre" value={payment.name} />
                <DetailItem label="Alias" value={payment.slug} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold">Detalles de Pago</h2>
                <DetailItem label="Fecha" value={new Date(payment.status.date).toDateString()} />
                <DetailItem label="Hora" value={new Date(payment.status.date).toTimeString()} />
                <DetailItem label="Número de Factura" value={payment.invoice_number || 'N/A'} />
              </div>
            </div>

            <div className="my-4 border-t border-gray-200" />

            <h2 className="text-xl font-semibold">Detalles de la Suscripción</h2>
            <DetailItem label="Nombre del Plan" value={payment.subscription.plan_name} />
            <DetailItem label="Duración" value={payment.subscription.duration} />
            <DetailItem label="Precio" value={`$${payment.subscription.price}`} />
            <DetailItem label="Moneda" value={payment.currency_type} />
            
            <div className="my-4 border-t border-gray-200" />

            <h2 className="text-xl font-semibold">Total a Pagar</h2>
            <div className="flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-lg">{`$${payment.subscription.total || payment.subscription.price}`}</span>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no tiene `subscription`, mostrar el formato anterior
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Detalles del Micrositio</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <DetailItem label="Nombre" value={payment.name} />
          <DetailItem label="Alias" value={payment.slug} />
          <DetailItem label="URL del Logo" value={payment.logo_url} />
          <DetailItem label="Categoría" value={payment.category} />
          <DetailItem label="Tipo de Micrositio" value={payment.microsite_type} />
          <DetailItem label="Tipo de Moneda" value={payment.currency_type} />
          <DetailItem
            label="Tiempo de Expiración del Pago (minutos)"
            value={payment.payment_expiration_time?.toString()}
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between p-2 border-b border-gray-200">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900 text-left w-3/4">{value}</span>
  </div>
);

export default PaymentOverview;
