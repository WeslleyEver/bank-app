import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import {
  Alert,
  Animated,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "@/src/theme/colors";
import { PIX_TYPE_CONFIG } from "../../constants/pixTypeConfig";
import { PixKey } from "../../domain/models/PixKey";
import { useDeletePixKey } from "../hooks/useDeletePixKey";
// import { usePixStore } from "../../store/pix.store";
import { useBottomSheetAnimation } from "../hooks/useBottomSheetAnimation";

interface Props {
  pixKey: PixKey;
  onClose: () => void;
}

export function PixKeyActionsBottomSheet({ pixKey, onClose }: Props) {
  const { translateY, overlayOpacity, closeWithAnimation, panResponder } =
    useBottomSheetAnimation(onClose);

  const { remove, loading } = useDeletePixKey(closeWithAnimation);
  // const removeKey = usePixStore((state) => state.removeKey);

  const config = PIX_TYPE_CONFIG[pixKey.type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleShare() {
    await Share.share({
      message: `Minha chave Pix (${config.label}): ${pixKey.value}`,
    });
  }

  function handleDelete() {
    Alert.alert(
      "Excluir chave",
      "Tem certeza que deseja deletar esta chave Pix?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => {
            remove(pixKey.id);
          },
        },
      ],
    );
  }

  return (
    <View
      style={{ ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" }}
    >
      <Animated.View
        style={{ ...StyleSheet.absoluteFillObject, opacity: overlayOpacity }}
      >
        <BlurView
          intensity={40}
          tint="dark"
          style={{ flex: 1 }}
          experimentalBlurMethod="dimezisBlurView"
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={closeWithAnimation} />
        </BlurView>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={{
          backgroundColor: COLORS.lightcolor,
          padding: 20,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: "#444",
            alignSelf: "center",
            marginBottom: 15,
          }}
        />

        {/*  Info da chave */}
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Ionicons name={config.icon} size={32} color={COLORS.darkcolor} />
          <Text style={{ fontWeight: "bold", marginTop: 8 }}>
            {config.label}
          </Text>
          <Text style={{ color: "#666", marginTop: 4 }}>{pixKey.value}</Text>
        </View>

        {/* Compartilhar */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#e4e4e4",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <Ionicons name="share-outline" size={22} />
          <Text style={{ marginLeft: 12 }}>Compartilhar</Text>
        </TouchableOpacity>

        {/* Deletar */}
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <Ionicons name="trash-outline" size={22} color="red" />
          <Text style={{ marginLeft: 12, color: "red" }}>Deletar chave</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
