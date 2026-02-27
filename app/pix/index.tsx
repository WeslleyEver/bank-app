import { PixKey } from "@/src/features/pix/domain/models/PixKey";
import { listPixKeysUseCase } from "@/src/features/pix/domain/useCases/listPixKeysUseCase";
import { COLORS } from "@/src/theme/colors";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AreaPixScreen() {
  // const { refresh } = useLocalSearchParams();
  // const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);

  /**
   * Carrega as chaves sempre que a tela entra em foco.
   * Isso garante atualização ao voltar do cadastro.
   */
  async function loadPixKeys() {
    const keys = await listPixKeysUseCase();
    setPixKeys(keys);
  }

  useFocusEffect(
    useCallback(() => {
      loadPixKeys();
    }, []),
  );

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          Minhas chaves Pix
        </Text>

        <FlatList
          data={pixKeys}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Nenhuma chave cadastrada
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                borderRadius: 12,
                backgroundColor: "#1c1c1e",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {item.type.toUpperCase()}
              </Text>
              <Text style={{ color: "#aaa", marginTop: 4 }}>{item.value}</Text>
            </View>
          )}
        />

        {/* BOTÃO CADASTRAR */}
        <TouchableOpacity
          onPress={() => router.push("/pix/register")}
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 12,
            backgroundColor: COLORS.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Cadastrar nova chave
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
