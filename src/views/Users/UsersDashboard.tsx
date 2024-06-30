import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Api } from "../../services/Api";
import { persistor } from "../../store";
import Swal from "sweetalert2";

const UsersDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, statusCode } = await Api.get("/users", auth.data.token);
        if (statusCode === 200) {
          setUsers(data.users);
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
          persistor.purge().then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error: credenciales inválidas",
          icon: "error",
        });
      }
    };

    fetchUsers();
  }, [auth.data.token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Nombre</th>
            <th className="py-2 px-4 border-b text-center">Correo Electrónico</th>
            <th className="py-2 px-4 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{user.name}</td>
              <td className="py-2 px-4 border-b text-center">{user.email}</td>
              <td className="py-2 px-4 border-b flex justify-center items-center space-x-4">
                <button
                  onClick={() => navigate(`/dashboard/users/${user.id}`)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Editar
                </button>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="toggle-switch" checked={user.is_active} readOnly />
                  <span>Activo</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersDashboard;
