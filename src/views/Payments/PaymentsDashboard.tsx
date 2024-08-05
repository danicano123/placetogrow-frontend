import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DynamicPayment from "../../components/Payments/DynamicPayment";
import { Api } from "../../services/Api";

const PaymentsDashboard: React.FC = () => {
  const [payments, setPayments] = useState<string[]>([]);
  const auth = useSelector((state: any) => state.auth);
  const { micrositeId } = useParams<{ micrositeId: string }>();
  const navigate = useNavigate();

  const fetchUserPayments = async () => {
    try {
      const response = await Api.get(`/payments/microsite/${micrositeId}`, auth.data.token);
      const { data, statusCode } = response;      
      if (statusCode === 200) {
        setPayments(data.map((payment: any) => payment.request_id));        
      } else {
        console.error("Error fetching payments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchUserPayments();
  }, [auth.data.token]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Payment List</h1>
        <button
          onClick={() => navigate("./../../")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Request ID</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Reference</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((requestId) => (
              <DynamicPayment key={requestId} requestId={requestId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsDashboard;
