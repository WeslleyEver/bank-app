/**
 * Rota de setup de PIN (feature SECURITY).
 * Fluxo oficial de criação de PIN — reutilizado quando operações sensíveis
 * exigem PIN e o usuário ainda não configurou.
 */

import { PinSetupScreen } from "@/src/features/security";
import { useAuthStore } from "@/src/features/auth";
import { useRouter } from "expo-router";

export default function PinSetupPage() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const accountId = session?.user?.id ?? "";

  return (
    <PinSetupScreen
      accountId={accountId}
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
