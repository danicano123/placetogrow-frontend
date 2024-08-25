export class Api {

  static baseUrl = `${import.meta.env.VITE_API_URL}/api/v1`;

  static async post<T>(url: string, data: T, token?: string): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      const fetchResult = await response.json();

      return {
        statusCode: response.status,
        data: fetchResult,
      };
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }

  static async get(
    url: string,
    token?: string
  ): Promise<{ statusCode: number; data: any }> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "GET",
        headers: headers,
      });

      const fetchResult = await response.json();

      return {
        statusCode: response.status,
        data: fetchResult,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async patch(
    url: string,
    data: any,
    token?: string
  ): Promise<{ statusCode: number; data: any }> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data),
      });

      const fetchResult = await response.json();

      return {
        statusCode: response.status,
        data: fetchResult,
      };
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }

  static async delete(
    url: string,
    token?: string
  ): Promise<{ statusCode: number; data: any }> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "DELETE",
        headers: headers,
      });

      const fetchResult = await response.json();

      return {
        statusCode: response.status,
        data: fetchResult,
      };
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
}
