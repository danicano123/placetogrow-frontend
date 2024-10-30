import React, { useEffect, useState } from "react";
import {
  fetchAdditionalData,
  createPaymentSession,
} from "../../services/PlaceToPay";
import { Api } from "../../services/Api";
import { useDispatch, useSelector } from "react-redux";

// Interfaces
interface PaymentStatus {
  status: string;
  reason: string;
  message: string;
  date: string;
}

interface Subscription {
  instrument: [{ key: string; value: string }];
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

interface Payer {
  document: string;
  documentType: string;
}

interface PaymentDetails {
  requestId: number;
  status: PaymentStatus;
  request: {
    payment: PaymentRequest;
    payer: Payer;
    subscription: { reference: string };
  };
  subscription: Subscription;
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
  paymentId: number;
  requestId: string;
  micrositeId: string;
  token: string;
}

// Componente
const DynamicPayment: React.FC<DynamicPaymentProps> = ({
  paymentId,
  requestId,
  micrositeId,
  token,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  const fetchPaymentDetails = async (id: string) => {
    try {
      const result = await fetchAdditionalData(id);
      setPaymentDetails(result);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const fetchMicrosite = async (micrositeId: string, token: string) => {
    const response = await Api.get(`/microsites/${micrositeId}`, token);
    const { data, statusCode } = response;
    if (statusCode === 200) {
      return data.microsite;
    } else {
    }
  };

  const handleRetryPayment = async () => {
    if (paymentDetails) {
      const deleteResponse = await Api.delete(`/payments/${paymentId}`, token);
      if (deleteResponse.statusCode === 200) {
        const micrositeData = await fetchMicrosite(micrositeId, token);
        const payment = paymentDetails.request;
        const { reference, description, amount } = payment.payment;
        const { document, documentType } = payment.payer;
        const total = amount.total;

        await createPaymentSession(
          reference,
          description,
          total,
          documentType,
          document,
          micrositeId,
          micrositeData.slug,
          auth,
          dispatch
        );
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (paymentDetails) {
      const deleteResponse = await Api.delete(`/payments/${paymentId}`, token);
      if (deleteResponse.statusCode === 200) {
        await Api.delete(
          `/subscriptions/${paymentDetails.subscription.instrument[0].value}`,
          token
        );
      }
    }
  };

  useEffect(() => {
    fetchPaymentDetails(requestId);
  }, [requestId]);

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  const paymentStatus = paymentDetails.status.status;
  const showRetryButton =
    paymentStatus === "REJECTED" || paymentStatus === "PENDING";

  return (
    <tr className="border-b">
      <td className="px-4 py-2">{paymentDetails.requestId}</td>
      <td className="px-4 py-2">{paymentStatus}</td>
      <td className="px-4 py-2">
        {paymentDetails.request.payment?.reference ||
          "Subscrito a: " + paymentDetails.request.subscription.reference}
      </td>
      <td className="px-4 py-2">
        {paymentDetails.request.payment?.amount.total ||
          "tu token es: " + paymentDetails.subscription.instrument[0].value}
      </td>
      {showRetryButton && (
        <td className="px-4 py-2">
          <button
            onClick={handleRetryPayment}
            className="bg-action-button hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry Payment
          </button>
        </td>
      )}
      {paymentDetails.request.subscription && (
        <td className="px-4 py-2">
          <button
            onClick={handleCancelSubscription}
            className="bg-action-button hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel Subsciption
          </button>
        </td>
      )}
    </tr>
  );
};

export default DynamicPayment;
