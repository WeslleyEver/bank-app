import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Pagination } from "./Pagination";
import { PromoCard } from "./PromoCard";
import { PromoItem } from "./types";

const { width } = Dimensions.get("window");

interface Props {
  data: PromoItem[];
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<PromoItem>);

export function PromoCarousel({ data }: Props) {
  const flatListRef = useRef<FlatList<PromoItem>>(null);
  const scrollX = useSharedValue(0);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    currentIndex.current = index;
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex.current + 1) % data.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      currentIndex.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <View style={{ position: "relative" }}>
      <AnimatedFlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={{ width }}>
            <PromoCard item={item} index={index} scrollX={scrollX} />
          </View>
        )}
      />

      <Pagination data={data} activeIndex={activeIndex} />
    </View>
  );
}
