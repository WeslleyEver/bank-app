import {
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const shakeAnimation = (delay = 2000) => {
  return withRepeat(
    withSequence(
      withTiming(-15, { duration: 150 }),
      withTiming(15, { duration: 150 }),
      withTiming(-10, { duration: 120 }),
      withTiming(10, { duration: 120 }),
      withTiming(0, { duration: 150 }),
      withDelay(delay, withTiming(0)),
    ),
    -1,
    false,
  );
};
