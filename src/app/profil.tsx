import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Profil() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Profil Mahasiswa</Text>
      <Text style={styles.subtitle}>Nama: Arif Syafriyaldi</Text>
      <Text style={styles.subtitle}>NIM: 23100005</Text>

      <Link href="/" style={styles.button}>
        ← Kembali ke Halaman Utama
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0f172a",
    color: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "bold",
    overflow: "hidden",
  },
});
