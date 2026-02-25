import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SharedValue } from "react-native-reanimated";
import { styles } from "./styles";
import { PromoItem } from "./types";
interface Props {
  item: PromoItem;
  index: number;
  scrollX: SharedValue<number>;
}

export function PromoCard({ item, index, scrollX }: Props) {
  return (
    <ImageBackground
      source={typeof item.image === "string" ? { uri: item.image } : item.image}
      style={styles.card}
      imageStyle={{ borderRadius: 24 }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 24,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.actionText && (
          <TouchableOpacity>
            <Text style={styles.action}>{item.actionText} →</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}
