import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DynamicPayment from "../../components/Payments/DynamicPayment";
import { Api } from "../../services/Api";

const PaymentsList: React.FC = () => {
  const [payments, setPayments] = useState<any>([{}]);
  const auth = useSelector((state: any) => state.auth);
 // TODO: converit esos log en sweet alert
  const fetchUserPayments = async () => {
    try {
      const response = await Api.get(`/payments/user/${auth.data.user.id}`, auth.data.token);
      const { data, statusCode } = response; 
      
      if (statusCode === 200) {
        setPayments(data.map((payment: any) => payment));        
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
      <h1 className="text-3xl font-bold mb-6 text-center">Payment List</h1>
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
            {payments.map((payment: any) => (              
              <DynamicPayment key={payment.id} paymentId={payment.id} requestId={payment.request_id} token={auth.data.token} micrositeId={payment.microsite_id}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsList;
