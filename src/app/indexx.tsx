import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Tantangan 1: Bilah Navigasi Atas */}
      <View style={styles.topNav}>
        <View style={[styles.navBox, styles.boxRed]}>
          <Text style={styles.text}>1</Text>
        </View>

        <View style={[styles.navBox, styles.boxGreen]}>
          <Text style={styles.text}>2</Text>
        </View>

        <View style={[styles.navBox, styles.boxBlue]}>
          <Text style={styles.text}>3</Text>
        </View>
      </View>

      {/* Tantangan 2: Tata Letak 2 Kolom Seimbang */}
      <View style={styles.twoColumns}>
        <View style={styles.leftColumn}>
          <Text style={styles.columnText}>Kolom Kiri 50%</Text>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.columnText}>Kolom Kanan 50%</Text>
        </View>
      </View>

      {/* Tantangan 3 + 4: Kartu Profil & Navigasi */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Image
            source={require("../../assets/images/react-logo.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.profileName}>Profil Mahasiswa</Text>

        <Link href="/kalkulator" style={styles.navButton}>
          Menuju Halaman Kalkulator →
        </Link>

        <Link href="/input" style={styles.navButton}>
          Menuju Halaman pribadi →
        </Link>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },

  /* Tantangan 1 */
  topNav: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
  },
  navBox: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  boxRed: {
    backgroundColor: "#e74c3c",
  },
  boxGreen: {
    backgroundColor: "#2ecc71",
  },
  boxBlue: {
    backgroundColor: "#3498db",
  },
  text: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },

  /* Tantangan 2 */
  twoColumns: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  leftColumn: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  columnText: {
    color: "#334155",
    fontWeight: "600",
  },

  /* Tantangan 3 + 4 */
  profileCard: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
  },
  profileName: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  navButton: {
    backgroundColor: "#072deb",
    color: "#ffffff",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: "bold",
    overflow: "hidden",
  },
});
