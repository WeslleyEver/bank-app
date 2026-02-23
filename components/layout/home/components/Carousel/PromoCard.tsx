import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { PromoItem } from "./types";

interface Props {
  item: PromoItem;
}

export function PromoCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.actionText && (
          <TouchableOpacity>
            <Text style={styles.action}>{item.actionText} →</Text>
          </TouchableOpacity>
        )}
      </View>

      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );
}
