import { COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface Props {
  loading: boolean;
  success: boolean;
  onPress: () => void;
}

export function SubmitButton({ loading, success, onPress }: Props) {
  return (
    <TouchableOpacity
      disabled={loading || success}
      onPress={onPress}
      style={{
        backgroundColor: success
          ? "#2ecc71"
          : loading
            ? "#999"
            : COLORS.primary,
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : success ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Chave cadastrada!
          </Text>
        </View>
      ) : (
        <Text style={{ color: "white", fontWeight: "bold" }}>Confirmar</Text>
      )}
    </TouchableOpacity>
  );
}
