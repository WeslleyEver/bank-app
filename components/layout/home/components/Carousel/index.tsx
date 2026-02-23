import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { PromoCard } from "./PromoCard";
import { PromoItem } from "./types";

const { width } = Dimensions.get("window");

interface Props {
  data: PromoItem[];
}

export function PromoCarousel({ data }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, data]);
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <FlatList
      ref={flatListRef}
      data={data}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ width }}>
          <PromoCard item={item} />
        </View>
      )}
    />
  );
}
