import CryptoJS from "crypto-js";
import moment from "moment";
import { setRequestId } from "../store/slices/subscriptionSlice";
import { Api } from "./Api";

const url = import.meta.env.VITE_P2P_ENDPOINT;
const login = import.meta.env.VITE_P2P_LOGIN;
const secret_key = import.meta.env.VITE_P2P_SECRET_KEY;
const port = import.meta.env.VITE_PORT || 5173;

if (!url || !login || !secret_key) {
  throw new Error("Missing environment variables");
}
const fetchMicrosite = async (micrositeId: string, token: string) => {
  const response = await Api.get(`/microsites/${micrositeId}`, token);
  const { data, statusCode } = response;
  if (statusCode === 200) {
    return data.microsite;
  } else {
  }
};
// Función para crear la sesión de pago
export const createPaymentSession = async (
  reference: string,
  description: string,
  total: number,
  document_type: string,
  document: string,
  microsite_id: string,
  slug: string,
  auth: any,
  dispatch: any
): Promise<void> => {
  const micrositeData = await fetchMicrosite(microsite_id, auth.data.token);

  // Generar nonce aleatorio y codificar en Base64
  const nonceRaw = CryptoJS.lib.WordArray.random(16);
  const nonce = CryptoJS.enc.Base64.stringify(nonceRaw);

  // Generar seed en formato ISO 8601
  const seed = moment().toISOString();

  // Concatenar nonce, seed y secretKey y codificar en Base64 después de aplicar SHA-256
  const operation = nonceRaw.concat(CryptoJS.enc.Utf8.parse(seed + secret_key));
  const tranKey = CryptoJS.SHA256(operation).toString(CryptoJS.enc.Base64);

  const data = {
    auth: {
      login: login,
      tranKey,
      nonce,
      seed,
    },
    payment: {
      reference,
      description,
      amount: {
        currency: micrositeData.currency,
        total,
      },
    },

    payer: {
      name:
        auth.data.user.first_name + " " + (auth.data.user.second_name || ""),
      surname:
        auth.data.user.first_surname +
        " " +
        (auth.data.user.second_surname || ""),
      email: auth.data.user.email,
      documentType: document_type,
      document,
    },
    expiration: new Date(
      new Date().getTime() + micrositeData.payment_expiration_time * 60 * 1000
    ).toISOString(),
    returnUrl: `http://localhost:${port}/microsites/${slug}/form/${microsite_id}`,
    ipAddress: "127.0.0.1",
    userAgent: navigator.userAgent,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status.status === "OK") {
      dispatch(setRequestId(result.requestId));
      window.location.href = result.processUrl;

      // Llamar a la API para enviar los datos después de abrir el iframe
      const requestData = {
        microsite_id,
        microsite_type: "payment",
        user_id: auth.data.user.id,
        request_id: result.requestId,
      };

      // Asumiendo que tienes un método post en tu servicio Api para enviar los datos
      const postResponse = await Api.post(
        "/payments",
        requestData,
        auth.data.token
      );

      if (postResponse.statusCode === 201) {
        console.log("Payment data sent successfully");
      } else {
        console.error("Error sending payment data:", postResponse.data.message);
      }
    } else {
      console.error("Error creating payment session", result);
    }
  } catch (error) {
    console.error(
      "Error fetching payment session",
      error instanceof Error ? error.message : error
    );
  }
};

export const createSubscriptionToken = async (
  reference: string,
  description: string,
  total: number,
  microsite_id: string,
  document_type: string,
  document: string,
  auth: any,
  dispatch: any
): Promise<void> => {
  // Generar nonce aleatorio y codificar en Base64
  const nonceRaw = CryptoJS.lib.WordArray.random(16);
  const nonce = CryptoJS.enc.Base64.stringify(nonceRaw);

  // Generar seed en formato ISO 8601
  const seed = moment().toISOString();

  // Concatenar nonce, seed y secretKey y codificar en Base64 después de aplicar SHA-256
  const operation = nonceRaw.concat(CryptoJS.enc.Utf8.parse(seed + secret_key));
  const tranKey = CryptoJS.SHA256(operation).toString(CryptoJS.enc.Base64);

  const data = {
    auth: {
      login: login,
      tranKey,
      nonce,
      seed,
    },
    subscription: {
      reference,
      description,
    },

    payer: {
      name:
        auth.data.user.first_name + " " + (auth.data.user.second_name || ""),
      surname:
        auth.data.user.first_surname +
        " " +
        (auth.data.user.second_surname || ""),
      email: auth.data.user.email,
      documentType: document_type,
      document,
    },
    returnUrl: `http://localhost:${port}/payment-details`,
    ipAddress: "127.0.0.1",
    userAgent: navigator.userAgent,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.status.status === "OK") {
      dispatch(setRequestId({ requestId: result.requestId }));
      window.location.href = result.processUrl;


      // Llamar a la API para enviar los datos después de abrir el iframe
      const requestData = {
        microsite_id,
        microsite_type: "subscription",
        user_id: auth.data.user.id,
        request_id: result.requestId,
        value: total,
      };

      // Asumiendo que tienes un método post en tu servicio Api para enviar los datos
      const postResponse = await Api.post(
        "/payments",
        requestData,
        auth.data.token
      );

      if (postResponse.statusCode === 201) {
        console.log("Payment data sent successfully");
      } else {
        console.error("Error sending payment data:", postResponse.data.message);
      }
    } else {
      console.error("Error creating payment session", result);
    }
  } catch (error) {
    console.error(
      "Error fetching payment session",
      error instanceof Error ? error.message : error
    );
  }
};

// Función para obtener datos adicionales con requestId
export const fetchAdditionalData = async (
  requestId: string | undefined
): Promise<any> => {
  // Generar nonce aleatorio y codificar en Base64
  if (!requestId) {
    throw new Error("requestId is required");
  }
  const nonceRaw = CryptoJS.lib.WordArray.random(16);
  const nonce = CryptoJS.enc.Base64.stringify(nonceRaw);

  // Generar seed en formato ISO 8601
  const seed = moment().toISOString();

  // Concatenar nonce, seed y secretKey y codificar en Base64 después de aplicar SHA-256
  const operation = nonceRaw.concat(CryptoJS.enc.Utf8.parse(seed + secret_key));
  const tranKey = CryptoJS.SHA256(operation).toString(CryptoJS.enc.Base64);

  const data = {
    auth: {
      login: login,
      tranKey,
      nonce,
      seed,
    },
  };

  try {
    const response = await fetch(`${url}/${requestId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      // Maneja el error y lanza una excepción para que el llamador pueda manejarlo
      throw new Error(
        `Error fetching additional data: ${result.message || "Unknown error"}`
      );
    }
  } catch (error) {
    // Lanza una excepción para que el llamador pueda manejarlo
    throw new Error(
      `Error fetching additional data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
