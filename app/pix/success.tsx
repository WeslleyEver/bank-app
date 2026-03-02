import { DEFAULT_SCREEN_OPTIONS } from "@/constants/navigation";
import PixSuccessScreen from "@/src/features/pix/presentation/screens/SuccessScreen";
import { Stack } from "expo-router";

/**
 * SuccessPage
 *
 * Rota responsável por representar a URL "/pix/success".
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
export default function SuccessPage() {

  return (

    <>
      <Stack.Screen
        options={{
          ...DEFAULT_SCREEN_OPTIONS,
          title: '',
        }}
      />
      <PixSuccessScreen />
    </>
  )
}
