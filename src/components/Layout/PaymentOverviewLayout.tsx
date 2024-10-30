import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const PaymentOverviewLayout = () => {
  const navigate = useNavigate();
  const requestId = useSelector((state: any) => state.subscription.requestId);
  useEffect(() => {
    console.log("jjj");
    
    if (requestId) {
      navigate(`./${requestId}`);
    }
  }, [requestId, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};
export default PaymentOverviewLayout;
