import { DEFAULT_SCREEN_OPTIONS } from "@/constants/navigation";
import PixConfirmScreen from "@/src/features/pix/presentation/screens/ConfirmScreen";
import { Stack } from "expo-router";

/**
 * ConfirmPixPage
 *
 * Rota responsável por representar a URL "/pix/confirm".
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
export default function ConfirmPixPage() {
  return (

    <>
      <Stack.Screen
        options={{
          ...DEFAULT_SCREEN_OPTIONS,
          title: '',
        }}
      />
      <PixConfirmScreen />
    </>
  )
  // return ;
}
