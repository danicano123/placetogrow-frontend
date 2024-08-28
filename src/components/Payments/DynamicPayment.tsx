import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAdditionalData, createPaymentSession } from "../../services/PlaceToPay";

// Interfaces
interface PaymentStatus {
  status: string;
  reason: string;
  message: string;
  date: string;
}

interface Amount {
  currency: string;
  total: number;
  taxes?: {
    kind: string;
    amount: number;
    base: number;
  }[];
  details?: {
    kind: string;
    amount: number;
  }[];
}

interface PaymentRequest {
  reference: string;
  description: string;
  amount: Amount;
}

interface PaymentDetails {
  requestId: number;
  status: PaymentStatus;
  request: {
    payment: PaymentRequest;
  };
  payment: {
    status: PaymentStatus;
    reference: string;
    paymentMethod: string;
    amount: {
      from: Amount;
      to: Amount;
    };
  }[];
}

interface DynamicPaymentProps {
  requestId: string;
}

// Componente
const DynamicPayment: React.FC<DynamicPaymentProps> = ({ requestId }) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const authToken = 'your-auth-token'; // Reemplaza con el token adecuado si es necesario

  const fetchPaymentDetails = async (id: string) => {
    try {
      const result = await fetchAdditionalData(id);
      setPaymentDetails(result);
      console.log(result);
      
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleRetryPayment = async () => {
    if (paymentDetails) {
      const payment = paymentDetails.request.payment;
      const { reference, description, amount } = payment;
      const currency = amount.currency;
      const total = amount.total;
      // Llama a la función de crear sesión con parámetros correctos
      await createPaymentSession(reference, description, currency, total, 'user-id', 'microsite-id', authToken);
    }
  };

  useEffect(() => {
    fetchPaymentDetails(requestId);
  }, [requestId]);

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  const paymentStatus = paymentDetails.status.status;
  const showRetryButton = paymentStatus === "REJECTED" || paymentStatus === "PENDING";

  return (
    <tr className="border-b">
      <td className="px-4 py-2">{paymentDetails.requestId}</td>
      <td className="px-4 py-2">{paymentStatus}</td>
      <td className="px-4 py-2">{paymentDetails.request.payment.reference}</td>
      <td className="px-4 py-2">{paymentDetails.request.payment.amount.total}</td>
      {showRetryButton && (
        <td className="px-4 py-2">
          <button
            onClick={handleRetryPayment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry Payment
          </button>
        </td>
      )}
    </tr>
  );
};

export default DynamicPayment;
