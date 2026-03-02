import { COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PixKeyType } from "../../domain/models/PixKey";
import { useBottomSheetAnimation } from "../../presentation/hooks/useBottomSheetAnimation";
import { formatPixInput } from "../../utils/formatPixInput";
import { useRegisterPixKey } from "../hooks/useRegisterPixKey";
import { SubmitButton } from "./SubmitButton";

interface Props {
  type: PixKeyType;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * ------------------------------------------------------------------
 * Component: RegisterPixKeyBottomSheet
 * ------------------------------------------------------------------
 *
 *  Objetivo
 * ------------------------------------------------------------------
 * Bottom Sheet responsável por permitir o cadastro de uma chave Pix
 * de forma animada, isolando:
 *
 * - Renderização da UI
 * - Controle de animações
 * - Máscara e formatação de input
 * - Orquestração do UseCase de registro
 * - Estados visuais (loading, sucesso, erro)
 *
 *
 *  Papel na Arquitetura
 * ------------------------------------------------------------------
 * Camada: Presentation
 *
 * Fluxo:
 * UI → Hook (Application) → UseCase → Repository
 *
 * Este componente NÃO conhece:
 * - Implementação de repositório
 * - Regras de negócio pesadas
 * - Infraestrutura
 *
 * Ele apenas orquestra estados e interações.
 *
 *
 *  Responsabilidades
 * ------------------------------------------------------------------
 * ✔ Renderizar overlay com blur
 * ✔ Executar animação de entrada
 * ✔ Permitir fechamento por:
 *    - Gesture (pan)
 *    - Tap no overlay
 *    - Botão "X"
 * ✔ Aplicar máscara via formatPixInput
 * ✔ Delegar registro para useRegisterPixKey
 * ✔ Exibir estados visuais:
 *    - loading
 *    - erro
 *    - sucesso
 *
 *
 *  Decisões Técnicas
 * ------------------------------------------------------------------
 *
 * • Animações isoladas em:
 *   useBottomSheetAnimation
 *
 *   → Mantém este componente focado em UI.
 *
 * • Registro isolado em:
 *   useRegisterPixKey
 *
 *   → Remove lógica de negócio da camada visual.
 *
 * • Formatação isolada em:
 *   formatPixInput
 *
 *   → Evita lógica condicional espalhada no componente.
 *
 *
 *  Limitações Atuais
 * ------------------------------------------------------------------
 * - Ainda contém pequena lógica condicional (getLabel)
 * - Validação ainda é leve (não bloqueia submit visualmente)
 *
 *
 *  Melhorias Futuras
 * ------------------------------------------------------------------
 * - Extrair Header como subcomponente
 * - Extrair InputField reutilizável
 * - Bloquear botão dinamicamente quando inválido
 * - Migrar para Reanimated se necessário
 *
 *
 *  Props
 * ------------------------------------------------------------------
 * @param type       Tipo da chave Pix (cpf | phone | email | random)
 * @param onClose    Callback executado ao fechar o Bottom Sheet
 * @param onSuccess  Callback executado após registro bem sucedido
 *
 * ------------------------------------------------------------------
 */
export function RegisterPixKeyBottomSheet({ type, onClose, onSuccess }: Props) {
  const { translateY, overlayOpacity, closeWithAnimation, panResponder } =
    useBottomSheetAnimation(onClose);
  const [value, setValue] = useState("");
  const { loading, success, error, register } = useRegisterPixKey(
    type,
    onSuccess,
    closeWithAnimation,
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function handleChange(text: string) {
    const result = formatPixInput(type, text);
    setValue(result.value);
  }

  //  Entrada suave
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
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
    <SafeAreaView edges={["right", "bottom", "left"]}>
      <Modal visible transparent animationType="none" statusBarTranslucent>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Overlay */}
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

          {/* Bottom Sheet */}
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

            {/* Header */}
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

            <SubmitButton
              loading={loading}
              success={success}
              onPress={() => register(value)}
            />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
