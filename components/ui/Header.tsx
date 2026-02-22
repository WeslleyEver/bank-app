import { COLORS } from "@/src/theme/colors";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SpinButton } from "../navigation/SpinButton";
import { RipplePress } from "./RipplePress";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <RipplePress
          onPress={() => router.push("/user")}
          style={[styles.borders]}
        >
          <View>
            <Ionicons name="person" size={18} color={COLORS.lightcolor} />
          </View>
        </RipplePress>
        <View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {/* {title && <Text style={styles.title}>{title}</Text>} */}
        </View>
      </View>
      <SpinButton
        style={styles.boxsettings}
        onPress={() => router.push("/settings/settings")}
      >
        <View>
          <Ionicons name="settings-sharp" size={18} color={COLORS.lightcolor} />
        </View>
      </SpinButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 50,
    gap: 14,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.subtitle.fontSize,
  },
  borders: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#20010d21",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    flex: 1,
  },
  boxsettings: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
});
