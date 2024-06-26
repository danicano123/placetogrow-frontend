import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type props = {
  children: ReactNode | ReactNode[];
};

const ProtectedRoutes = ({ children }: props) => {
  const { isLogged } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) {         
      navigate("/login");
    }
  }, [isLogged]);

  return <>{children}</>;
};

export default ProtectedRoutes;
