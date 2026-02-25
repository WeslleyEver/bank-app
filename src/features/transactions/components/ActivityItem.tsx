import { SPACING } from "@/src/theme/spacing";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types";

// import Ripple from "react-native-material-ripple";
/**
 * ------------------------------------------------------------------
 * Component: ActivityItem
 * ------------------------------------------------------------------
 *
 * Descrição:
 * Componente responsável por renderizar um item individual de
 * atividade/transação financeira (ex: Pix enviado, pagamento, etc).
 *
 * Estrutura visual:
 * - Nome da pessoa/empresa
 * - Descrição da transação
 * - Valor formatado (positivo ou negativo)
 * - Data da transação
 *
 * Regras aplicadas:
 * - Valores negativos aparecem em vermelho
 * - Valores positivos aparecem em verde
 * - Valor é formatado com duas casas decimais
 *
 * Props:
 * item: {
 *   id?: string;
 *   name: string;           // Nome da pessoa ou empresa
 *   description: string;    // Tipo da transação (ex: "Pix enviado")
 *   amount: number;         // Valor da transação (positivo ou negativo)
 *   date: string;           // Data formatada (ex: "20/fev")
 * }
 *
 * Exemplo de uso:
 *
 * <ActivityItem
 *   item={{
 *     name: "99 Tecnologia Ltda",
 *     description: "Pagamento com Pix",
 *     amount: -12.80,
 *     date: "20/fev"
 *   }}
 * />
 *
 * Observação:
 * Este componente é reutilizável e pode ser usado em:
 * - Tela inicial (últimas atividades)
 * - Tela de histórico completo
 * - Tela de extrato
 *
 * ------------------------------------------------------------------
 */

type Props = {
  item: Transaction;
};

export default function ActivityItem({ item }: Props) {
  const iconMap = {
    pix: <FontAwesome6 name="pix" size={20} color="#32BCAD" />,
    ted: <FontAwesome6 name="building-columns" size={20} color="#302c2e" />,
    doc: <FontAwesome6 name="building-columns" size={20} color="#302c2e" />,
  };

  const dateObj = new Date(item.date);
  const formattedDate = `${dateObj.getDate()}/${dateObj.toLocaleString(
    "pt-BR",
    { month: "short" },
  )}`;

  const isNegative = item.amount < 0;

  const transactionTypeLabel = item.type.toUpperCase();

  const description = `${transactionTypeLabel} ${
    isNegative ? "enviado" : "recebido"
  }`;
  return (
    /**
     * Lembrar de configurar o Riplepress
     */

    <View style={styles.container}>
      <View style={[styles.row]}>
        <View style={styles.icon}>{iconMap[item.type]}</View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[styles.amount, { color: isNegative ? "#E53935" : "#2E7D32" }]}
        >
          {isNegative ? "-" : "+"} R$
          {Math.abs(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
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
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    padding: 5,
    borderRadius: 24,
    backgroundColor: "#00000018",
  },
  row: {
    alignItems: "center",
    gap: SPACING.md,
    flexDirection: "row",
  },
  date: {
    color: "#777",
    marginTop: 4,
  },
});
