// src/routes/ProtectedRoutes.tsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type Props = {
  children: React.ReactNode;
  requiredRole?: string; // Definir los roles requeridos para esta ruta
};

const ProtectedRoutes: React.FC<Props> = ({ children, requiredRole }) => {
  const { isLogged, data } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
      Swal.fire("Logueate para continuar!");
    } else if (requiredRole && data.role !== requiredRole) {
      navigate("/");
      Swal.fire("No tienes permiso para acceder a esta ruta");
    }
  }, [isLogged, data, navigate, requiredRole]);

  // Si el usuario tiene el rol adecuado o no se requiere un rol específico, renderiza el children
  return <>{children}</>;
};

export default ProtectedRoutes;
