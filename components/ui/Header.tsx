import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/user")}
        style={[styles.topRow, styles.borders]}
      >
        <View>
          <Ionicons name="person" size={24} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* <View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {title && <Text style={styles.title}>{title}</Text>}
      </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: "#EB0459",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topRow: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
  },
  borders: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#20010d21",
    justifyContent: "center",
    alignItems: "center",
  },
});
