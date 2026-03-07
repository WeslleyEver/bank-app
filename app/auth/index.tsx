/**
 * Rota inicial do grupo auth.
 * Redireciona para a tela de login como ponto de entrada.
 */

import { Href, Redirect } from "expo-router";

export default function AuthIndex() {
  return <Redirect href={"/auth/login" as Href} />;
}
