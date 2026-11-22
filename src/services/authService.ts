import { API_ENDPOINTS } from "@/config/api";

export interface UserData {
  id: number;
  name: string;
  email: string;
  no_hp: string | null;
  foto: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  no_hp: string;
  password: string;
  password_confirmation: string;
}

// Helper agar error dari Laravel (422, 401, dll.) seragam
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Error validasi Laravel: { errors: { email: ["..."] } }
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstMsg = data.errors[firstKey]?.[0];
      if (firstMsg) {
        throw new Error(firstMsg);
      }
    }
    throw new Error(
      data?.message || `Permintaan gagal dengan status HTTP ${response.status}.`,
    );
  }

  return data as T;
}

// 1. Login
export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server Laravel. Pastikan server berjalan (--host=0.0.0.0) dan IP di src/config/api.ts sudah benar.",
      );
    }
    throw error;
  }
}

// 2. Register
export async function registerApi(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<AuthResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server Laravel. Periksa koneksi Wi-Fi dan alamat API_BASE_URL.",
      );
    }
    throw error;
  }
}

// 3. Logout (hapus token di server)
export async function logoutApi(token: string): Promise<void> {
  try {
    await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Jika jaringan putus saat logout, sesi lokal tetap dibersihkan
  }
}