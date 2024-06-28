import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type props = {
  children: ReactNode | ReactNode[];
};

const ProtectedRoutes = ({ children }: props) => {
  const { isLogged, role } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogged) {         
      navigate("/login");
    }
    if (role != 'admin') {         
      navigate("/");
    }
  }, [isLogged]);

  return <>{children}</>;
};

export default ProtectedRoutes;
