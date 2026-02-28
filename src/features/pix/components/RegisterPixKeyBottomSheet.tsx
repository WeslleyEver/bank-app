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
import { registerPixKeyUseCase } from "../useCases/registerPixKeyUseCase";
import { isValidCPF } from "../utils/cpfValidator";
import { cpfMask, onlyNumbers, phoneMask } from "../utils/masks";

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(text: string) {
    setError(null);
    if (type === "cpf") {
      const numbers = onlyNumbers(text);
      if (numbers.length === 11 && !isValidCPF(numbers)) {
        setError("CPF inválido");
      }
      setValue(cpfMask(text));
      return;
    }

    if (type === "phone") {
      setValue(phoneMask(text));
      return;
    }

    if (type === "email") {
      setValue(text.trim());
      return;
    }

    setValue(text);
  }

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

  useEffect(() => {
    if (type === "random") {
      handleRegister();
    }
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
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      let finalValue = value;

      if (type === "cpf" || type === "phone") {
        finalValue = onlyNumbers(value);
      }

      const startTime = Date.now();

      await registerPixKeyUseCase(type, finalValue);

      // 🔥 garante pelo menos 800ms de loading
      const elapsed = Date.now() - startTime;
      const remaining = 800 - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setSuccess(true);

      // 🔥 mostra sucesso por 1s antes de fechar
      setTimeout(() => {
        closeWithAnimation();
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message ?? "Erro ao cadastrar chave");
    } finally {
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

  // const isDisabled = loading || (!isRandom && value.trim().length === 0);

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
            autoCapitalize="none"
            keyboardType={
              type === "email"
                ? "email-address"
                : type === "phone"
                  ? "phone-pad"
                  : type === "cpf"
                    ? "number-pad"
                    : "default"
            }
            value={value}
            onChangeText={handleChange}
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
        {error && (
          <Text
            style={{
              color: "red",
              marginBottom: 15,
              fontSize: 13,
            }}
          >
            {error}
          </Text>
        )}

        <TouchableOpacity
          disabled={loading || success}
          onPress={handleRegister}
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Chave cadastrada!
              </Text>
            </View>
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
