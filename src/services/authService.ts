import { API_ENDPOINTS } from "@/config/api";
import { File } from "expo-file-system";
import { Platform } from "react-native";

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

export interface UpdateProfilePayload {
  name: string;
  email: string;
  no_hp: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  user: UserData;
  foto_url?: string;
}

export interface BasicMessageResponse {
  success: boolean;
  message: string;
}

export interface PhotoUploadAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
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

// 4. Ambil profil terbaru dari server Laravel
export async function fetchProfileApi(token: string): Promise<ProfileResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.PROFILE, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server Laravel. Periksa koneksi Wi-Fi Anda.",
      );
    }
    throw error;
  }
}

// 5. Perbarui nama, email, dan nomor HP
export async function updateProfileApi(
  token: string,
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal menghubungi server saat menyimpan profil. Cek koneksi Wi-Fi.",
      );
    }
    throw error;
  }
}

// 6. Ganti kata sandi
export async function updatePasswordApi(
  token: string,
  payload: UpdatePasswordPayload,
): Promise<BasicMessageResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<BasicMessageResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal menghubungi server saat mengganti kata sandi. Cek koneksi Wi-Fi.",
      );
    }
    throw error;
  }
}

// 7. Upload foto profil (FormData multipart)
export async function uploadProfilePhotoApi(
  token: string,
  asset: PhotoUploadAsset,
): Promise<ProfileResponse> {
  try {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const fallbackExt =
        asset.mimeType === "image/png"
          ? "png"
          : asset.mimeType === "image/webp"
            ? "webp"
            : "jpg";
      const fileName = asset.fileName || `profile_${Date.now()}.${fallbackExt}`;
      const blobResponse = await fetch(asset.uri);
      const blob = await blobResponse.blob();
      formData.append("foto", blob, fileName);
    } else {
      // Di HP: objek File dari expo-file-system (membaca nama, MIME, dan isi file)
      const file = new File(asset.uri);
      formData.append("foto", file as unknown as Blob);
    }

    // Jangan menulis header "Content-Type" manual untuk FormData,
    // karena fetch() membuat boundary multipart yang benar secara otomatis.
    const response = await fetch(API_ENDPOINTS.UPDATE_PHOTO, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal mengunggah foto ke server. Pastikan server menyala (--host=0.0.0.0).",
      );
    }
    throw error;
  }
}