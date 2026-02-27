import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	PanResponder,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { COLORS } from "@/src/theme/colors";
import { PixKeyType } from "../domain/models/PixKey";
import { registerPixKeyUseCase } from "../domain/useCases/registerPixKeyUseCase";

interface Props {
  type: PixKeyType;
  onClose: () => void;
  onSuccess: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CLOSE_THRESHOLD = 120;

export function RegisterPixKeyBottomSheet({ type, onClose, onSuccess }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎬 Entrada suave
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

  // 👇 Swipe Down Gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return gesture.dy > 5;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
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
    }),
  ).current;

  async function handleRegister() {
    try {
      setLoading(true);

      await registerPixKeyUseCase(type, value);

      setTimeout(() => {
        setLoading(false);
        closeWithAnimation();
        onSuccess();
      }, 600);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function getLabel() {
    switch (type) {
      case "phone":
        return "Digite o celular";
      case "email":
        return "Digite o email";
      case "cpf":
        return "Digite o CPF";
      case "random":
        return "Gerar chave aleatória";
    }
  }

  const isRandom = type === "random";

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
      }}
    >
      {/* 🔥 Overlay com blur + tap para fechar */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: overlayOpacity,
        }}
      >
        <BlurView
          intensity={40}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeWithAnimation}
          />
        </BlurView>
      </Animated.View>

      {/* 🧱 Bottom Sheet */}
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
        {/* Drag Indicator */}
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

        {/* Header com X */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: COLORS.darkcolor,
            }}
          >
            {getLabel()}
          </Text>

          <TouchableOpacity onPress={closeWithAnimation}>
            <Ionicons name="close" size={24} color={COLORS.darkcolor} />
          </TouchableOpacity>
        </View>

        {!isRandom && (
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Digite aqui"
            placeholderTextColor="#666"
            style={{
              borderWidth: 1,
              borderColor: "#8b8b8b",
              backgroundColor: COLORS.lightcolor,
              borderRadius: 10,
              padding: 18,
              color: COLORS.darkcolor,
              marginBottom: 20,
            }}
          />
        )}

        <TouchableOpacity
          onPress={handleRegister}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 18,
            paddingHorizontal: 15,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Confirmar
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
