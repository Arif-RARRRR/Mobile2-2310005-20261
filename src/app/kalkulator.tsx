import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Daftar operasi: dipakai untuk render tombol sekaligus jadi sumber kebenaran
const DAFTAR_OPERASI = [
  { simbol: "+", label: "Tambah" },
  { simbol: "-", label: "Kurang" },
  { simbol: "×", label: "Kali" },
  { simbol: "÷", label: "Bagi" },
];

export default function KalkulatorMini() {
  // 1. State utama
  const [angka1, setAngka1] = useState("");
  const [angka2, setAngka2] = useState("");
  const [hasil, setHasil] = useState(null); // null = belum ada hasil
  const [operator, setOperator] = useState("");
  const [pesanError, setPesanError] = useState("");

  // Helper: bersihkan input agar hanya angka, titik, koma, dan minus
  const bersihkanInput = (teks: string) => teks.replace(/[^0-9.,-]/g, "");

  // Helper: konversi teks → angka (koma dianggap desimal gaya Indonesia)
  const keAngka = (teks: string) => parseFloat(teks.replace(",", "."));

  // 2. Fungsi hitung — dipanggil saat tombol operasi ditekan
  const hitung = (op: string) => {
    setOperator(op);

    const a = keAngka(angka1);
    const b = keAngka(angka2);

    // Validasi: kedua kolom harus berisi angka valid
    if (isNaN(a) || isNaN(b)) {
      setHasil(null);
      setPesanError("Masukkan Angka Pertama dan Angka Kedua terlebih dahulu.");
      return;
    }

    // Penanganan khusus: pembagian dengan nol
    if (op === "÷" && b === 0) {
      setHasil(null);
      setPesanError("Angka pembagi tidak boleh nol.");
      return;
    }

    let nilai;
    switch (op) {
      case "+":
        nilai = a + b;
        break;
      case "-":
        nilai = a - b;
        break;
      case "×":
        nilai = a * b;
        break;
      case "÷":
        nilai = a / b;
        break;
      default:
        return;
    }

    // Anti floating-point error: 0.1 + 0.2 → 0.3, bukan 0.30000000000000004
    nilai = Number(nilai.toFixed(10));

    setHasil(nilai);
    setPesanError("");
  };

  // Setiap input berubah → hasil lama dibersihkan (mencegah ekspresi basi)
  const ubahAngka1 = (teks) => {
    setAngka1(bersihkanInput(teks));
    setHasil(null);
    setOperator("");
    setPesanError("");
  };

  const ubahAngka2 = (teks) => {
    setAngka2(bersihkanInput(teks));
    setHasil(null);
    setOperator("");
    setPesanError("");
  };

  const reset = () => {
    setAngka1("");
    setAngka2("");
    setHasil(null);
    setOperator("");
    setPesanError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalkulator Mini (4 Operasi)</Text>

      {/* Input 1: Angka Pertama */}
      <Text style={styles.label}>Angka Pertama:</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 12"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        value={angka1}
        onChangeText={ubahAngka1}
      />

      {/* Input 2: Angka Kedua */}
      <Text style={styles.label}>Angka Kedua:</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 5"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        value={angka2}
        onChangeText={ubahAngka2}
      />

      {/* Baris 4 Tombol Operasi (Flexbox mendatar) */}
      <Text style={styles.label}>Pilih Operasi:</Text>
      <View style={styles.rowOperasi}>
        {DAFTAR_OPERASI.map((op) => (
          <Pressable
            key={op.simbol}
            accessibilityLabel={`Operasi ${op.label}`}
            style={({ pressed }) => [
              styles.buttonOperasi,
              operator === op.simbol && styles.buttonOperasiAktif,
              pressed && styles.buttonOperasiPressed,
            ]}
            onPress={() => hitung(op.simbol)}
          >
            <Text style={styles.buttonOperasiText}>{op.simbol}</Text>
          </Pressable>
        ))}
      </View>

      {/* Kartu Hasil Dinamis */}
      <View style={styles.cardHasil}>
        <Text style={styles.cardTitle}>Hasil Perhitungan</Text>

        {pesanError !== "" ? (
          // Kondisi 1: ada error validasi
          <Text style={styles.errorText}>{pesanError}</Text>
        ) : hasil === null ? (
          // Kondisi 2: belum ada perhitungan
          <Text style={styles.cardHint}>
            Isi kedua angka, lalu tekan salah satu tombol operasi.
          </Text>
        ) : (
          // Kondisi 3: hasil tersedia
          <>
            <Text style={styles.expressionText}>
              {angka1} {operator} {angka2} =
            </Text>
            <Text style={styles.hasilText}>{hasil}</Text>
          </>
        )}
      </View>

      {/* Tombol Reset */}
      <Pressable style={styles.buttonReset} onPress={reset}>
        <Text style={styles.buttonText}>Hapus / Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    paddingTop: 48,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  rowOperasi: {
    flexDirection: "row", // Flexbox mendatar
    gap: 10, // RN >= 0.71; jika error, ganti dengan marginHorizontal
    marginTop: 8,
  },
  buttonOperasi: {
    flex: 1, // 4 tombol membagi lebar sama rata
    backgroundColor: "#1d4ed8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOperasiAktif: {
    backgroundColor: "#0ea5e9", // highlight operator yang aktif
  },
  buttonOperasiPressed: {
    opacity: 0.75,
  },
  buttonOperasiText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardHasil: {
    marginTop: 20,
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 8,
  },
  cardHint: {
    fontSize: 13,
    color: "#0369a1",
    textAlign: "center",
  },
  expressionText: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 4,
  },
  hasilText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
    textAlign: "center",
  },
  buttonReset: {
    marginTop: 16,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
