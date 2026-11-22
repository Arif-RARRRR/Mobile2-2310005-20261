// Ganti dengan IPv4 Wi-Fi laptop Anda (cek lewat 'ipconfig' di CMD)
// HP dan laptop harus terhubung ke Wi-Fi yang sama.
export const API_BASE_URL = "http://192.168.1.11:8000/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,
};