// import HomeHeader from "";
import HomeHeader from "@/components/layout/HomeHeader";
import Loading from "@/components/loadings/Animations";
import { COLORS } from "@/src/theme/colors";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeHeader />
      <View style={styles.wrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[TYPOGRAPHY.title, styles.sp]}>
            Soluções Financeiras
          </Text>
          <Loading type="pay" loop></Loading>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "#000",
  },
});
