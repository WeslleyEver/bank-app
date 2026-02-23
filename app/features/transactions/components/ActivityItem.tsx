import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
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
  item: {
    name: string;
    description: string;
    amount: number;
    date: string;
  };
};

export default function ActivityItem({ item }: Props) {
  const isNegative = item.amount < 0;

  return (
    /**
     * Lembrar de configurar o Riplepress
     */

    <View style={styles.container}>


      <View style={[styles.row]}>



        <View style={styles.icon}>
          <Ionicons
            size={20}
            name="bag-handle-outline"
            color="#000"
          />
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

      </View>

      <View style={{ alignItems: "flex-end" }}>

        <Text
          style={[
            styles.amount,
            { color: isNegative ? "#E53935" : "#2E7D32" },
          ]}
        >
          {isNegative ? "-" : "+"} R$
          {Math.abs(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
    // borderBottomWidth: 1,
    // borderColor: "#eee",
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
    width: 42,
    height: 42,
    padding: 5,
    borderRadius: 21,
    backgroundColor: "#00000018",
  },
  row: {
    alignItems: "center",
    gap: SPACING.md,
    flexDirection: "row"
  },
  date: {
    color: "#777",
    marginTop: 4,
  },
});