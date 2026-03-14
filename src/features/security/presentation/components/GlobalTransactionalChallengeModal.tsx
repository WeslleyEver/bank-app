/**
 * Modal global de challenge transacional.
 * Exibido sempre que currentChallenge está setado, independente de qual tela o disparou.
 * Garante que qualquer entrypoint (ConfirmScreen, cards, etc.) mostre o PIN corretamente.
 */

import { Modal } from "react-native";
import { TransactionalChallengeScreen } from "../screens/TransactionalChallengeScreen";
import { useSecurityStore } from "../../store";

export function GlobalTransactionalChallengeModal() {
  const currentChallenge = useSecurityStore((s) => s.currentChallenge);
  const visible = currentChallenge !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {}}
    >
      <TransactionalChallengeScreen onCancel={() => {}} />
    </Modal>
  );
}
