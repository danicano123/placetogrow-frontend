import CryptoJS from "crypto-js";
import moment from "moment";
import { Api } from "../services/Api"; // Asegúrate de importar el servicio correcto para la API

const url = import.meta.env.VITE_P2P_ENDPOINT;
const login = import.meta.env.VITE_P2P_LOGIN;
const secret_key = import.meta.env.VITE_P2P_SECRET_KEY;
const port = import.meta.env.VITE_PORT || 5173; 

if (!url || !login || !secret_key) {
  throw new Error("Missing environment variables");
}

// Función para crear la sesión de pago
export const createPaymentSession = async (
  payment_expiration_time: number,
  reference: string,
  description: string,
  currency: string,
  total: number,
  user_id: string,
  name: string,
  surname: string,
  email: string,
  document_type: string,
  document: string,
  microsite_id: string,
  slug: string,
  token: string
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
    payment: {
      reference,
      description,
      amount: {
        currency,
        total,
      },
    },
    payer: {name, surname, email, documentType: document_type, document},
    expiration: new Date(new Date().getTime() + payment_expiration_time * 60 * 1000).toISOString(),
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
      window.location.href = result.processUrl;

      // Llamar a la API para enviar los datos después de abrir el iframe
      const requestData = {
        microsite_id,
        user_id,
        request_id: result.requestId,
      };

      // Asumiendo que tienes un método post en tu servicio Api para enviar los datos
      const postResponse = await Api.post("/payments", requestData, token);

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
export const fetchAdditionalData = async (requestId: string): Promise<any> => {
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
      result.aditionalData = response;    
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
