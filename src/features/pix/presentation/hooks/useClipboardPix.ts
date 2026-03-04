import { useEffect, useState } from "react";
import { ClipboardService } from "../../infra/clipboard/ClipboardService";
import {
  PixKeyType,
  PixValidationService,
} from "../../infra/services/PixValidationService";
import { sanitizePixInput } from "../../services/pixInputSanitizer";

export function useClipboardPix() {
  const [pixKey, setPixKey] = useState<string | null>(null);
  const [keyType, setKeyType] = useState<PixKeyType>(null);

  async function checkClipboard() {
    const content = await ClipboardService.getContent();

    if (!content) return;

    // Limite de segurança
    if (content.length > 120) return;

    const sanitized = sanitizePixInput(content);

    if (!sanitized) return;

    const detectedType = PixValidationService.detectKeyType(sanitized);

    if (!detectedType) return;

    setPixKey(sanitized);
    setKeyType(detectedType);
  }

  useEffect(() => {
    checkClipboard();
  }, []);

  return {
    pixKey,
    keyType,
    clear: () => {
      setPixKey(null);
      setKeyType(null);
    },
  };
}
