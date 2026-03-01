import PixKeyScreen from "@/src/features/pix/presentation/screens/PixKeySreen";

/**
 * PixKeyPage
 *
 * Rota responsável por representar a URL "/pix/key".
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
export default function PixKeyPage() {
  return <PixKeyScreen />;
}
