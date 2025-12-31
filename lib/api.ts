const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const api = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include", // if using cookies for auth
    });
    return res.json();
  },

  post: async (endpoint: string, body: any, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    return res.json();
  },
};
