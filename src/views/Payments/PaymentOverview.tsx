import React, { useEffect, useState } from "react";
import {
  fetchAdditionalData,
  createPaymentSession,
} from "../../services/PlaceToPay";
import { Api } from "../../services/Api";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

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
  paymentId: number;
  requestId: string;
  micrositeId: string;
  token: string;
}

// Componente
const PaymentOverview: React.FC<DynamicPaymentProps> = ({
  paymentId,
  requestId,
  micrositeId,
  token,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useSelector((state: any) => state.auth);

  const fetchPaymentDetails = async (id: string) => {
    try {
      const result = await fetchAdditionalData(id);
      setPaymentDetails(result);
      console.log(result);
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
          auth
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
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Microsite Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          {/* <DetailItem label="Name" value={microsite.name} />
          <DetailItem label="Alias" value={microsite.slug} />
          <DetailItem label="Logo URL" value={microsite.logo_url} />
          <DetailItem label="Category" value={microsite.category} />
          <DetailItem label="Microsite Type" value={microsite.microsite_type} />
          <DetailItem label="Currency Type" value={microsite.currency_type} />
          <DetailItem label="Payment Expiration Time (minutes)" value={microsite.payment_expiration_time?.toString()} /> */}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;
