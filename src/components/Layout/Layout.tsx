import { ReactNode } from "react";
import Header from "../Header/Header";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: ReactNode }) => {
  const auth = useSelector((state: any) => state.auth);

  return (
    <div className="bg-gradient-to-r from-wood via-gold to-wood-darker min-h-screen flex flex-col">
      <Header isLogged={auth.isLogged} userName={auth.userName} />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default Layout;
