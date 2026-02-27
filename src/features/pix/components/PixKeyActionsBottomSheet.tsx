import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "@/src/theme/colors";
import { PIX_TYPE_CONFIG } from "../constants/pixTypeConfig";
import { PixKey } from "../domain/models/PixKey";
import { usePixStore } from "../store/pix.store";

interface Props {
  pixKey: PixKey;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CLOSE_THRESHOLD = 120;

export function PixKeyActionsBottomSheet({ pixKey, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const removeKey = usePixStore((state) => state.removeKey);

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

  function closeWithAnimation() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > CLOSE_THRESHOLD) {
          closeWithAnimation();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  async function handleShare() {
    await Share.share({
      message: `Minha chave Pix (${config.label}): ${pixKey.value}`,
    });
  }

  function handleDelete() {
    removeKey(pixKey.id);
    closeWithAnimation();
  }

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" }}>
      <Animated.View
        style={{ ...StyleSheet.absoluteFillObject, opacity: overlayOpacity }}
      >
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }} experimentalBlurMethod="dimezisBlurView">
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

        {/* 🔑 Info da chave */}
        <View style={{ alignItems: "center", marginBottom: 25 }}>
          <Ionicons name={config.icon} size={32} color={COLORS.darkcolor} />
          <Text style={{ fontWeight: "bold", marginTop: 8 }}>
            {config.label}
          </Text>
          <Text style={{ color: "#666", marginTop: 4 }}>
            {pixKey.value}
          </Text>
        </View>

        {/* 📤 Compartilhar */}
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

        {/* 🗑 Deletar */}
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <Ionicons name="trash-outline" size={22} color="red" />
          <Text style={{ marginLeft: 12, color: "red" }}>
            Deletar chave
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}