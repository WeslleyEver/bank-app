// import HomeHeader from "";
// import HomeHeader from "@/components/layout/HomeHeader";
import Button from "@/components/layout/home/components/Button";
import { PromoCarousel } from "@/components/layout/home/components/Carousel";
import HomeHeader from "@/components/layout/home/components/HomeHeader";

import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { router } from "expo-router";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  /**
   * pra API depois
   * const [activities, setActivities] = useState([]);
   * useEffect(() => {
      fetchActivities();
      }, []);
   *  troca o mock pela API
      e deixar a lista limpa: <ActivityItem item={item} />
   */
  const activities = [
    {
      id: "1",
      name: "Weslley Everton Jesus Santos",
      description: "Pix enviado",
      amount: -7,
      date: "20/fev",
    },
    {
      id: "2",
      name: "99 Tecnologia Ltda",
      description: "Pagamento com Pix",
      amount: -12.8,
      date: "20/fev",
    },
    {
      id: "3",
      name: "99 Tecnologia Ltda",
      description: "Pagamento com Pix",
      amount: -11.4,
      date: "19/fev",
    },
    {
      id: "4",
      name: "Mercado Livre",
      description: "Compra online",
      amount: -89.9,
      date: "18/fev",
    },
  ];
  const lastThree = activities.slice(0, 3);

  const mockPromos = [
    {
      id: "1",
      title: "Best Play",
      image: "https://via.placeholder.com/150",
      actionText: "Saiba mais",
    },
    {
      id: "2",
      title: "Bean Music",
      image: "https://via.placeholder.com/150",
      actionText: "Participar",
    },
    {
      id: "3",
      title: "VY-B",
      image: "https://via.placeholder.com/150",
      actionText: "Participar",
    },
    {
      id: "4",
      title: "Engage",
      image: "https://via.placeholder.com/150",
      actionText: "Participar",
    },
    {
      id: "5",
      title: "GY",
      image: "https://via.placeholder.com/150",
      actionText: "Participar",
    },
  ];
  return (
    <View style={styles.container}>
      <HomeHeader />
      <View style={styles.wrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[TYPOGRAPHY.title, styles.title]}>
            BP Soluções Financeiras
          </Text>
          <View style={styles.cardemprestimo}>
            <Text style={TYPOGRAPHY.subtitle}>Empréstimos até R$ 5.000,00</Text>
            <Button
              title={"Simular"}
              onPress={() => router.push("/credit")}
            ></Button>
          </View>
          <Text style={[TYPOGRAPHY.subtitle, styles.title]}>Histórico</Text>
          {/* substituir flatlist */}
          <FlatList
            data={lastThree}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historycard}>
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.amount}>
                    - R${Math.abs(item.amount).toFixed(2)}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
            )}
          />
          <View>
            <Text style={[TYPOGRAPHY.subtitle, styles.title]}>
              Conheça o Grupo
            </Text>
            {mockPromos.length > 0 && <PromoCarousel data={mockPromos} />}
          </View>
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
  },
  title: {
    marginTop: SPACING.xxxl,
    marginHorizontal: SPACING.md,
    color: COLORS.darkcolor,
  },
  cardemprestimo: {
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightcolor,
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  historycard: {
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ecdfe4",
    backgroundColor: COLORS.lightcolor,
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
  },
  btn: {
    fontSize: 22,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    color: "#777",
    marginTop: 4,
  },
  amount: {
    fontWeight: "600",
    fontSize: 16,
  },
  date: {
    color: "#777",
    marginTop: 4,
  },
});
