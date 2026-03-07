import { useLogout } from "@/src/features/auth/hooks/useLogout";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

type LogoutButtonProps = {
  title?: string;
  style?: object;
};

export function LogoutButton({ title = "Sair", style }: LogoutButtonProps) {
  const { logout } = useLogout();

  const handlePress = () => {
    Alert.alert("Sair da conta?", "Você realmente deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: logout, style: "destructive" },
    ]);
  };

  return (
    <Pressable style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#DC2626",
    borderRadius: 8,
  },
  text: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
