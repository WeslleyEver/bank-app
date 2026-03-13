/**
 * Smoke test + unit test do sessionExpirationService.
 * Valida que a infraestrutura de testes funciona e isSessionExpired tem o comportamento esperado.
 */

import { isSessionExpired } from "../sessionExpirationService";

describe("sessionExpirationService", () => {
  describe("isSessionExpired", () => {
    it("retorna false quando expiresAt é undefined", () => {
      const tokens = { accessToken: "x", refreshToken: "y" };
      expect(isSessionExpired(tokens)).toBe(false);
    });

    it("retorna true quando expiresAt já passou", () => {
      const tokens = {
        accessToken: "x",
        refreshToken: "y",
        expiresAt: Date.now() - 1000,
      };
      expect(isSessionExpired(tokens)).toBe(true);
    });

    it("retorna false quando expiresAt é no futuro", () => {
      const tokens = {
        accessToken: "x",
        refreshToken: "y",
        expiresAt: Date.now() + 60000,
      };
      expect(isSessionExpired(tokens)).toBe(false);
    });
  });
});
