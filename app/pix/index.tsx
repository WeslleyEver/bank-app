import AreaPixScreen from "@/src/features/pix/presentation/screens/AreaPixScreen";

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
  return <AreaPixScreen />;
}
