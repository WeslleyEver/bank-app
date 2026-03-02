import { COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { PIX_TYPE_CONFIG } from "../../constants/pixTypeConfig";
import { PixKeyType } from "../../domain/models/PixKey";

type Props = {
  pixKey: string;
  keyType: PixKeyType;
  onClose: () => void;
  onContinue: () => void;
};

export function ClipboardPixBottomSheet({
  pixKey,
  keyType,
  onClose,
  onContinue,
}: Props) {
  const config = PIX_TYPE_CONFIG[keyType];

  return (
    <Modal transparent animationType="slide">
      <BlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={{
          flex: 1,
          justifyContent: "flex-end",
          //     backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            <Ionicons name={config.icon} size={32} color={COLORS.primary} />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
              Chave Pix detectada
            </Text>
          </View>

          {/* Key Info */}
          <View
            style={{
              backgroundColor: "#f5f5f5",
              padding: 15,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{config.label}</Text>
            <Text style={{ marginTop: 5, color: "#555" }}>{pixKey}</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={onContinue}
            style={{
              backgroundColor: COLORS.primary,
              padding: 15,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Continuar transferência
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 15,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}
