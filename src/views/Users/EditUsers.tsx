import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Api } from "../../services/Api";
import Swal from "sweetalert2";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>(""); // Default role value
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await Api.get(`/users/${id}`, auth.data.token);
        const { data, statusCode } = response;
        if (statusCode === 200) {
          setUser(data.user);
          setRole(data.user.role);
          // Set initial role from fetched user data
        } else {
          Swal.fire({
            title: "Error",
            text: `${data.message}`,
            icon: "error",
          });
        }
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: `${error.message}`,
          icon: "error",
        });
      }
    };

    fetchUser();
  }, [id, auth.data.token]);

  const handleRoleChange = (newRole: string) => {
    Api.post(`/users/${id}/remove-role`, { role }, auth.data.token)
      .then((revokeResponse) => {
        if (revokeResponse.statusCode === 200) {
          return Api.post(
            `/users/${id}/assign-role`,
            { role: newRole },
            auth.data.token
          );
        } else {
          throw new Error(revokeResponse.data.message);
        }
      })
      .then((assignResponse) => {
        if (assignResponse.statusCode === 200) {
          setRole(newRole); // Update local state with new role
          Swal.fire({
            title: "Success",
            text: "Role updated successfully",
            icon: "success",
          });
        } else {
          throw new Error(assignResponse.data.message);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      });
  };

  const handleSave = async () => {
    try {
      const response = await Api.patch(`/users/${id}`, user, auth.data.token);
      const { data, statusCode } = response;
      if (statusCode === 200) {
        Swal.fire({
          title: "Success",
          text: "User updated successfully",
          icon: "success",
        });
        navigate("/dashboard/users");
      } else {
        Swal.fire({
          title: "Error",
          text: `${data.message}`,
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditUser;
