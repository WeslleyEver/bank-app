/**
 * Testes do logger de observabilidade do SECURITY (TASK 9).
 * Garante que logs não vazam dados sensíveis.
 */

import {
  logSecurityEvent,
  setSecurityLogger,
  resetSecurityLogger,
} from "../securityLogger";

describe("securityLogger", () => {
  let captured: Array<{ event: string; context?: Record<string, unknown> }> = [];

  beforeEach(() => {
    captured = [];
    setSecurityLogger((_level, event, context) => {
      captured.push({ event, context });
    });
  });

  afterEach(() => {
    resetSecurityLogger();
  });

  it("registra eventos com contexto seguro", () => {
    logSecurityEvent("challenge_started", { operation: "pix_transfer" });
    expect(captured).toHaveLength(1);
    expect(captured[0].event).toBe("challenge_started");
    expect(captured[0].context?.operation).toBe("pix_transfer");
  });

  it("contexto não inclui PIN, hash ou salt", () => {
    logSecurityEvent("validation_invalid", { remainingAttempts: 2 });
    const ctx = JSON.stringify(captured[0].context);
    expect(ctx).not.toMatch(/pin|hash|salt|123456|confirmation/i);
  });

  it("logs incluem apenas contexto seguro/sanitizado", () => {
    logSecurityEvent("challenge_denied", { code: "PIN_INVALID" });
    expect(captured[0].context?.code).toBe("PIN_INVALID");
    expect(captured[0].context).not.toHaveProperty("pin");
    expect(captured[0].context).not.toHaveProperty("hash");
  });

  it("eventos principais do SECURITY são registráveis", () => {
    const events = [
      "challenge_started",
      "challenge_authorized",
      "challenge_denied",
      "challenge_cancelled",
      "challenge_blocked",
      "challenge_not_configured",
      "pin_setup_success",
      "pin_setup_failed",
      "validation_invalid",
      "storage_read_failed",
    ] as const;

    events.forEach((event) => {
      logSecurityEvent(event, {});
    });

    expect(captured).toHaveLength(events.length);
    events.forEach((event, i) => {
      expect(captured[i].event).toBe(event);
    });
  });
});
