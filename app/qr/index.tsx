import { processQRCode } from "@/services/qrService";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { QRScanner } from "./QRScanner";
import { useQRScanner } from "./useQRScanner";

export default function QRScreen() {
  const { handleScan } = useQRScanner();
  const router = useRouter();

  function onScan(data: string) {
    handleScan(data, (value) => {
      const result = processQRCode(value);

      if (result.type === "PIX") {
        router.push({
          pathname: "/pix/confirm",
          params: { payload: result.payload },
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <QRScanner onScan={onScan} />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    top: "25%",
    left: "15%",
    right: "15%",
    height: 250,
    borderWidth: 2,
    borderColor: "#EB0459",
    borderRadius: 20,
  },
});
