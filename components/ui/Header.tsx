import { StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={styles.container}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#0F172A",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
  },
});