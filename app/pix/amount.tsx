import { DEFAULT_SCREEN_OPTIONS } from "@/constants/navigation";
import PixAmountScreen from "@/src/features/pix/presentation/screens/PixAmountScreen";
import { Stack } from "expo-router";

/**
 * PixAmountPage
 *
 * Rota responsável por representar a URL "/pix/amount".
 *
 * Esta camada NÃO deve conter:
 * - Lógica de negócio
 * - Regras de validação
 * - Manipulação de estado complexa
 *
 * Sua única responsabilidade é renderizar
 * a Screen real da feature Pix.
 *
 * Arquitetura adotada:
 * - app → roteamento
 * - src/features → regras e UI
 */
export default function PixAmountPage() {

  return (
    <>
      <Stack.Screen
        options={{
          ...DEFAULT_SCREEN_OPTIONS,
          title: '',
        }}
      />
      <PixAmountScreen />
    </>
  );
  // return <PixAmountScreen />;
}
