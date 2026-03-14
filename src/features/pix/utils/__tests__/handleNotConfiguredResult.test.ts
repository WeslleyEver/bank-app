/**
 * Testes do handler not_configured (redirecionamento para setup de PIN).
 */

import { PIN_SETUP_ROUTE } from "@/constants/navigation";
import { navigateToPinSetup } from "../handleNotConfiguredResult";

describe("handleNotConfiguredResult", () => {
  it("navega para rota de setup de PIN quando chamado", () => {
    const pushMock = jest.fn();
    const router = { push: pushMock };

    navigateToPinSetup(router);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(PIN_SETUP_ROUTE);
  });

  it("PIN_SETUP_ROUTE aponta para fluxo oficial de setup", () => {
    expect(PIN_SETUP_ROUTE).toBe("/security/pin-setup");
  });
});
