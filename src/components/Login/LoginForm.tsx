import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAuth } from "../../store/slices/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const auth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("Campo requerido"),
    password: Yup.string().required("Campo requerido"),
  });

  const handleSubmit = (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    Api.post("/login", values).then((response) => {
      
      dispatch(fetchAuth(response))
      console.log(auth.data.user);
      
    });
    actions.setSubmitting(false);
  };

  return (
    <div
      className="p-8 rounded-lg shadow-md w-full max-w-md bg-white bg-opacity-90"
      style={{ boxShadow: "0 4px 6px rgba(218, 165, 32, 0.1)" }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gold">
        Iniciar Sesión
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label
                className="block text-wood-darker text-sm font-bold mb-2"
                htmlFor="email"
              >
                Correo
              </label>
              <Field
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-wood-darker leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                placeholder="Correo"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-wood-darker text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <Field
                className="shadow appearance-none border rounded-full w-full py-2 px-3 text-wood-darker leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="Contraseña"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isSubmitting}
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
