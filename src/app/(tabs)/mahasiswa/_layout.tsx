import { TopTabs } from "expo-router/js-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MahasiswaProvider } from "../../../context/mahasiswa";

export default function MahasiswaTopTabsLayout() {
  return (
    <MahasiswaProvider>
      <TopTabs
        screenOptions={{
          tabBarShowIcon: true,
          tabBarActiveTintColor: "#072deb",
          tabBarInactiveTintColor: "#64748b",
          tabBarIndicatorStyle: { backgroundColor: "#072deb", height: 3 },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "bold",
            textTransform: "none",
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            elevation: 2,
            shadowOpacity: 0.08,
          },
        }}
      >
        <TopTabs.Screen
          name="index"
          options={{
            title: "Data",
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="list" size={18} color={color} />
            ),
          }}
        />
        <TopTabs.Screen
          name="input"
          options={{
            title: "Input",
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="add-circle" size={18} color={color} />
            ),
          }}
        />
        <TopTabs.Screen
          name="report"
          options={{
            title: "Report",
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="bar-chart" size={18} color={color} />
            ),
          }}
        />
      </TopTabs>
    </MahasiswaProvider>
  );
}