// export default async function apiCall({ url, method = 'GET', body = null, headers = {} }) {
//     const options = {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//             ...headers,
//         },
//     };

//     if (body) {
//         options.body = JSON.stringify(body);
//     }
//     try {
//         const response = await fetch(url, options);

//         let data;
//         try {
//             data = await response.json();
//         } catch {
//             data = await response.text(); // fallback if not JSON
//         }

//         if (!response.ok) {
//             throw new Error((data && data.message) || data || 'API error');
//         }

//         return data;
//     } catch (error) {
//         console.error('API call error:', error.message);
//         throw error;
//     }
// }

export type ApiCallParams = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any; // optionally you can make it generic
  headers?: Record<string, string>;
};

export default async function apiCall<T = any>({
  url,
  method = 'GET',
  body = null,
  headers = {},
}: ApiCallParams): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    let data: T | string;
    try {
      data = await response.json();
    } catch {
      data = (await response.text()) as any;
    }

    if (!response.ok) {
      throw new Error((data && (data as any).message) || (data as string) || 'API error');
    }

    return data as T;
  } catch (error: any) {
    console.error('API call error:', error.message);
    throw error;
  }
}

