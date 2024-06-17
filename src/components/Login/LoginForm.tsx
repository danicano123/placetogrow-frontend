// src/components/LoginForm.tsx
import React from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div
      className="p-8 rounded-lg shadow-md w-full max-w-md bg-white bg-opacity-90"
      style={{ boxShadow: "0 4px 6px rgba(218, 165, 32, 0.1)" }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gold">
        Iniciar Sesión
      </h2>
      <form>
        <div className="mb-4">
          <label
            className="block text-wood-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Correo
          </label>
          <input
            className="shadow appearance-none border rounded-full w-full py-2 px-3 text-wood-darker leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Correo"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-wood-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="shadow appearance-none border rounded-full w-full py-2 px-3 text-wood-darker leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Contraseña"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="button"
          >
            Iniciar Sesión
          </button>
          <span className="text-wood-darker text-lg font-bold">o</span>
          <Link
            to="/register"
            className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Registrarse
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
