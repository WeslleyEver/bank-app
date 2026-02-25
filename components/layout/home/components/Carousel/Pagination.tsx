import { StyleSheet, View } from "react-native";
import { PromoItem } from "./types";

interface Props {
  data: PromoItem[];
  activeIndex: number;
}

export function Pagination({ data, activeIndex }: Props) {
  return (
    <View style={styles.container}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, activeIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    //     borderWidth: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 280,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: "#E6005C",
  },
});
