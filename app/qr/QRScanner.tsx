import { CameraView } from "expo-camera";
import { StyleSheet } from "react-native";

type Props = {
  onScan: (data: string) => void;
};

export function QRScanner({ onScan }: Props) {
  return (
    <CameraView
      style={StyleSheet.absoluteFillObject}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={({ data }) => {
        onScan(data);
      }}
    />
  );
}
