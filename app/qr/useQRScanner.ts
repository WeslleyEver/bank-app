import { useState } from "react";

export function useQRScanner() {
  const [scanned, setScanned] = useState(false);

  function handleScan(data: string, callback: (data: string) => void) {
    if (scanned) return;

    setScanned(true);
    callback(data);
  }

  function reset() {
    setScanned(false);
  }

  return { scanned, handleScan, reset };
}
