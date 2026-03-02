import { useEffect, useState } from "react";
import { ClipboardService } from "../../infra/clipboard/ClipboardService";
import {
	PixKeyType,
	PixValidationService,
} from "../../infra/services/PixValidationService";

export function useClipboardPix() {
  const [pixKey, setPixKey] = useState<string | null>(null);
  const [keyType, setKeyType] = useState<PixKeyType>(null);

  async function checkClipboard() {
    const content = await ClipboardService.getContent();

    if (!content) return;

    const detectedType = PixValidationService.detectKeyType(content);

    if (detectedType) {
      setPixKey(content);
      setKeyType(detectedType);
    }
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
