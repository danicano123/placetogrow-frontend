import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { fetchAuth } from "../../store/slices/authSlice";

interface RegisterFormValues {
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm = () => {
  const initialValues: RegisterFormValues = {
    first_name: "",
    second_name: "",
    first_surname: "",
    second_surname: "",
    email: "",
    password: "",
    password_confirmation: "",
  };
  const navigate = useNavigate();
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);
  useEffect(() => {
    auth.isLogged ? navigate("/") : "";
  }, [auth.isLogged]);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Campo requerido").max(20, "Máximo 20 caracteres"),
    second_name: Yup.string().max(20, "Máximo 20 caracteres"),
    first_surname: Yup.string().required("Campo requerido").max(20, "Máximo 20 caracteres"),
    second_surname: Yup.string().max(20, "Máximo 20 caracteres"),
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("Campo requerido"),
    password: Yup.string()
      .min(8, "Mínimo 8 caracteres")
      .required("Campo requerido"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
      .required("Campo requerido"),
  });

  const handleSubmit = (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    Api.post("/register", values).then((response) => {
      if (response.statusCode === 200 || response.statusCode === 201) {
        dispatch(fetchAuth({ ...response, isLogged: true }));

        //navigate("/register");
      } else {
        Swal.fire({
          title: "Error",
          text: `${response.data.message}`,
          icon: "error",
        });
      }
    });
    actions.setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Registro</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                    Primer Nombre
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="Primer Nombre"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="second_name">
                    Segundo Nombre
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="second_name"
                    type="text"
                    name="second_name"
                    placeholder="Segundo Nombre (opcional)"
                  />
                  <ErrorMessage name="second_name" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_surname">
                    Primer Apellido
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first_surname"
                    type="text"
                    name="first_surname"
                    placeholder="Primer Apellido"
                  />
                  <ErrorMessage name="first_surname" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="second_surname">
                    Segundo Apellido
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="second_surname"
                    type="text"
                    name="second_surname"
                    placeholder="Segundo Apellido (opcional)"
                  />
                  <ErrorMessage name="second_surname" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Correo
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Correo"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Contraseña
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                    Confirmar Contraseña
                  </label>
                  <Field
                    className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmar Contraseña"
                  />
                  <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Registrarse
                </button>
                <span className="text-gray-700 text-lg font-bold">o</span>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
