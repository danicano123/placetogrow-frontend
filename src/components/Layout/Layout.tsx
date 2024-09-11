import { ReactNode } from "react";
import Header from "../Header/Header";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: ReactNode }) => {
  const auth = useSelector((state: any) => state.auth);

  return (
    <div className="bg-blue-to-gray min-h-screen flex flex-col">
      <Header 
      isLogged={auth.isLogged} 
      userName={`${auth.data.user?.first_name || ""} 
      ${auth.data.user?.second_name || ""} 
      ${auth.data.user?.first_surname || ""} 
      ${auth.data.user?.second_surname || ""}`} 
      role={auth.data.role} />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default Layout;
