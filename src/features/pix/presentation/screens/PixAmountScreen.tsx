import { useBalanceStore } from "@/src/features/account/store/useBalanceStore";
import { COLORS } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PixAmountScreen() {
  const { to } = useLocalSearchParams<{ to: string }>();
  const router = useRouter();
  const balance = useBalanceStore((state) => state.balance);

  const [valueInCents, setValueInCents] = useState(0);

  const formattedValue = useMemo(() => {
    return (valueInCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [valueInCents]);

  const formattedBalance = useMemo(() => {
    return balance.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [balance]);

  function handleChange(text: string) {
    const numeric = text.replace(/\D/g, "");
    setValueInCents(Number(numeric));
  }

  function handleNext() {
    const numericValue = valueInCents / 100;
    if (!numericValue || numericValue <= 0) return;

    router.push({
      pathname: "/pix/confirm",
      params: { to, amount: numericValue },
    });
  }

  const isDisabled = valueInCents <= 0 || valueInCents / 100 > balance;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.wrapper}>
          {/* CONTEÚDO */}
          <View style={styles.content}>
            <Text style={styles.title}>Insira o valor da Transferência</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.amount}>{formattedValue}</Text>

              <TextInput
                keyboardType="number-pad"
                value={String(valueInCents)}
                onChangeText={handleChange}
                style={styles.hiddenInput}
                autoFocus
              />
            </View>

            <Text style={styles.balance}>
              Saldo em conta:{" "}
              <Text style={{ fontWeight: "bold" }}>{formattedBalance}</Text>
            </Text>
          </View>

          {/* BOTÃO */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, isDisabled && { opacity: 0.5 }]}
              onPress={handleNext}
              disabled={isDisabled}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.lightcolor,
  },
  flex: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  content: {
    marginTop: 80,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    color: COLORS.darkcolor,
    marginBottom: 40,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: 60,
    opacity: 0,
  },
  balance: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  footer: {
    paddingBottom: 80,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
