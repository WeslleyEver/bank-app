import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { RegisterPixKeyBottomSheet } from "@/src/features/pix/components/RegisterPixKeyBottomSheet";
import { PixKeyType } from "@/src/features/pix/domain/models/PixKey";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPixKeyScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PixKeyType | null>(null);
  const PIX_TYPE_CONFIG: Record<
    PixKeyType,
    { label: string; icon: keyof typeof Ionicons.glyphMap }
  > = {
    phone: {
      label: "Celular",
      icon: "phone-portrait-outline",
    },
    email: {
      label: "Email",
      icon: "mail-outline",
    },
    cpf: {
      label: "CPF",
      icon: "id-card-outline",
    },
    random: {
      label: "Chave aleatória",
      icon: "shuffle-outline",
    },
  };

  function handleSelect(type: PixKeyType) {
    setSelectedType(type);
  }

  function handleCloseSheet() {
    setSelectedType(null);
  }

  function handleSuccess() {
    setSelectedType(null);
    router.back(); // volta para lista atualizada
  }

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View style={{ flex: 1, paddingTop: 40 }}>
        {/* paddingTop: insets.top,
          flex: 1,
          backgroundColor: COLORS.tabbarligth, */}
        {/* A LISTAGEM FICA AQUI NO RETURN */}
        {(Object.keys(PIX_TYPE_CONFIG) as PixKeyType[]).map((type) => {
          const config = PIX_TYPE_CONFIG[type];

          return (
            <TouchableOpacity
              key={type}
              onPress={() => handleSelect(type)}
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 20,
                paddingVertical: 30,
                paddingHorizontal: 15,
                backgroundColor: "#1c1c1e",
                marginBottom: 12,
                marginHorizontal: 20,
                borderRadius: 12,
              }}
            >
              <Ionicons size={32} name={config.icon} color="#fff" />
              <Text style={{ color: "white", fontWeight: "600" }}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {selectedType && (
          <RegisterPixKeyBottomSheet
            type={selectedType}
            onClose={handleCloseSheet}
            onSuccess={handleSuccess}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
