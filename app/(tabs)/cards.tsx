import Loading from "@/components/loadings/Animations";
import { COLORS } from "@/src/theme/colors";
import { TYPOGRAPHY } from "@/src/theme/typography";

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Cards() {
  return (
    <View style={styles.container}>
      <Text style={TYPOGRAPHY.title}>Em Breve!</Text>

      <Loading type="card" size={300}></Loading>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.background_white,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sp: {
    marginTop: 13,
  },
  title: {
    // fontSize: TYPOGRAPHY.title.,
    color: "#000",
  },
});

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });
