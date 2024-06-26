
export class Api {
  static baseUrl = "http://localhost:8000/api/v1";

  static async post<T>(url: string, data: T): Promise<any> {
    const response = await fetch(`${Api.baseUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const fetchResult = await response.json();

    return {
      statusCode: response.status,
      data: fetchResult,
    };
  }

  static async get(url: string, token?: string): Promise<{ statusCode: number; data: any }> {
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
}
