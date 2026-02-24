// histórico geral de transaçoes
// Aqui sera a tela do pix lebrar de usar hooks, histórico filtrado pix
import { COLORS } from "@/src/theme/colors";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActivityItem from "../features/transactions/components/ActivityItem";
import { useTransactions } from "../features/transactions/hooks/useTransactions";

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<"all" | "pix" | "ted" | "doc">("all");

  const { transactions } = useTransactions(
    filter === "all" ? undefined : filter,
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent"></StatusBar>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: SPACING.sm }}
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem item={item} />}
          ListHeaderComponent={
            <>
              <Text
                style={[
                  {
                    marginBottom: SPACING.md,
                    marginVertical: SPACING.xl,
                    marginHorizontal: SPACING.lg,
                  },
                  TYPOGRAPHY.title,
                ]}
              >
                Histórico de Transações
              </Text>

              <View style={styles.box}>
                <FilterButton
                  label="Todos"
                  active={filter === "all"}
                  onPress={() => setFilter("all")}
                />
                <FilterButton
                  label="Pix"
                  active={filter === "pix"}
                  onPress={() => setFilter("pix")}
                />
                <FilterButton
                  label="TED"
                  active={filter === "ted"}
                  onPress={() => setFilter("ted")}
                />
                <FilterButton
                  label="DOC"
                  active={filter === "doc"}
                  onPress={() => setFilter("doc")}
                />
              </View>
            </>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </View>
  );
}

type FilterButtonProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
};

function FilterButton({ label, onPress, active }: FilterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightcolor,
  },
  box: {
    alignItems: "center",
    height: 40,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.lg,
    flexDirection: "row",
    gap: SPACING.lg,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: "#333",
    fontWeight: "500",
  },
  textActive: {
    color: COLORS.lightcolor,
  },
});
