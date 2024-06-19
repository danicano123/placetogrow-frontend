interface ApiResponse<T> {
    statusCode: number;
    data: T;
}

export class Api{

    static baseUrl = 'http://127.0.0.1:8000/api/v1';

    static async post<T>(url: string, data: T): Promise<ApiResponse<T>>{
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        const fetchResult = await response.json();

        return {
            statusCode: response.status,
            data: fetchResult,

        }
    }

}