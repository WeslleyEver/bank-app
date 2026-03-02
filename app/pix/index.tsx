import { DEFAULT_SCREEN_OPTIONS } from "@/constants/navigation";
import AreaPixScreen from "@/src/features/pix/presentation/screens/AreaPixScreen";
import { Stack } from "expo-router";

/**
 * PixPage
 *
 * Camada de roteamento do Expo Router.
 * Responsável apenas por conectar a rota "/pix"
 * com a Screen real da feature Pix.
 *
 * Mantemos a lógica da feature isolada em src/features
 * para preservar a arquitetura modular e escalável.
 */
export default function PixPage() {
  return (
    <>
      <Stack.Screen
        options={{
          ...DEFAULT_SCREEN_OPTIONS,
          title: 'Área Pix',
          headerBackTitle: "",
          headerBackVisible: true,
        }}
      />
      <AreaPixScreen />
    </>
  );
}
