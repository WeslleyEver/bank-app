# SECURITY — Errors and Failure Handling

## 1. Objective

This document defines the official error model for the `SECURITY` feature.

It exists to guarantee that:

- the module returns **predictable and typed failures**;
- the UI receives **clear and stable states**;
- logs and observability **never leak sensitive data**;
- business failures are not confused with technical failures;
- the feature remains extensible for future credential methods such as biometrics and OTP.

This document is normative for v1.

---

## 2. Scope

This error model applies to:

- PIN setup;
- PIN confirmation;
- PIN validation;
- transactional challenge;
- temporary block handling;
- security persistence;
- integration between `SECURITY` and sensitive operations such as Pix.

This document does **not** define API/backend error payloads.
Backend errors must be mapped into the internal `SECURITY` error model when relevant.

---

## 3. Principles

### 3.1 Typed errors are mandatory

`SECURITY` must never return raw strings as its official contract.

Every failure exposed by the feature must be represented by:

- a stable error code;
- a semantic category;
- a safe message key or UI state;
- optional non-sensitive metadata.

---

### 3.2 Business errors and technical errors are different things

The following must never be treated as the same class of failure:

- user typed the wrong PIN;
- PIN is temporarily blocked;
- user has no PIN configured;
- user cancelled the challenge;
- secure storage read failed;
- secure storage write failed;
- comparison/validation execution failed unexpectedly.

`PIN_INVALID` is a business validation result.
It must never be used as a generic fallback for unexpected failures.

---

### 3.3 Cancellation is not an error of credential validity

When the user closes or cancels the challenge intentionally:

- this must not increment failed attempts;
- this must not generate `PIN_INVALID`;
- this must not generate `PIN_BLOCKED`;
- this must not be logged as a validation failure.

Cancellation is a separate terminal outcome.

---

### 3.4 Security logs must be safe by design

Logs must never contain:

- raw PIN;
- masked PIN digits;
- derived secret material;
- hash;
- salt;
- comparison payloads;
- any value that can help reconstruct the credential.

Allowed logs are limited to:

- error code;
- flow step;
- operation type;
- generic context identifiers;
- retry/block metadata when safe.

---

### 3.5 The UI must not guess semantics

The UI must not infer meaning from arbitrary messages.
The UI must react from:

- typed result objects; or
- typed error codes.

No screen should depend on string matching such as:

- `includes("invalid")`
- `includes("blocked")`
- `includes("storage")`

---

## 4. Error categories

All `SECURITY` failures must belong to one of these categories.

### 4.1 Validation errors

Used when the credential was processed correctly, but the submitted secret is not valid.

Examples:

- wrong PIN;
- PIN confirmation mismatch.

---

### 4.2 State errors

Used when the current security state does not allow the action.

Examples:

- PIN not configured;
- challenge requested with no active operation;
- validation requested while blocked.

---

### 4.3 Policy errors

Used when a business/security policy prevents continuation.

Examples:

- temporary block active;
- attempt limit reached.

---

### 4.4 Technical errors

Used when the system cannot safely complete the operation.

Examples:

- secure storage read failure;
- secure storage write failure;
- malformed persisted metadata;
- unexpected validation execution failure.

---

### 4.5 Flow errors

Used when the orchestration contract is broken.

Examples:

- operation attempted without challenge resolution;
- challenge result missing;
- inconsistent setup step transition.

---

## 5. Official error codes

Below is the official v1 code set.

## 5.1 Setup and configuration errors

### `SECURITY_PIN_NOT_CONFIGURED`

Meaning:
There is no valid transactional credential configured for the current user/account context.

Use when:

- a sensitive operation requires challenge;
- the app checks security status;
- no PIN material is found or status indicates not configured.

Must not be used when:

- storage failed unexpectedly;
- PIN exists but user typed it incorrectly.

UI expectation:
Guide the user to the setup flow.

---

### `SECURITY_PIN_CONFIRMATION_MISMATCH`

Meaning:
The entered confirmation PIN does not match the initial PIN input during setup.

Use when:

- setup confirmation diverges from first entry.

Must not be used when:

- PIN format is invalid;
- persistence failed.

UI expectation:
Show confirmation mismatch state and allow retry.

---

### `SECURITY_PIN_FORMAT_INVALID`

Meaning:
The submitted PIN does not satisfy the v1 format policy.

For v1, the policy is:

- numeric only;
- exactly 6 digits.

Use when:

- setup input is malformed;
- validation input is malformed before secure comparison.

Must not be used when:

- the format is correct but the value is wrong.

UI expectation:
Show inline validation and prevent progression.

---

## 5.2 Validation and block errors

### `SECURITY_PIN_INVALID`

Meaning:
The submitted PIN is well-formed, validation executed correctly, and the credential does not match the persisted secure material.

Use when:

- secure comparison completed successfully;
- the entered PIN is incorrect.

Must not be used when:

- storage read failed;
- comparison failed technically;
- block is active;
- no PIN is configured.

UI expectation:
Show invalid PIN feedback and remaining-attempt context when available.

Observability note:
May be logged as a business validation failure without the submitted value.

---

### `SECURITY_PIN_BLOCKED`

Meaning:
The credential is temporarily blocked and cannot be validated until `blockUntil` expires.

Use when:

- the user attempts validation during an active temporary block.

Must not be used when:

- the current failed attempt is the one that triggers the block and the system is still computing the transition.

UI expectation:
Show blocked state and remaining time.

---

### `SECURITY_ATTEMPT_LIMIT_REACHED`

Meaning:
The current invalid attempt reached the configured threshold and the feature must transition to blocked state.

For v1:

- threshold = 3 invalid attempts;
- block duration = 5 minutes.

Use when:

- the invalid attempt that triggered the block has just occurred.

UI expectation:
Show immediate transition to blocked feedback.

Important:
This code can be used as a domain transition result, even if the persisted state afterwards becomes `SECURITY_PIN_BLOCKED` for subsequent attempts.

---

## 5.3 Challenge flow errors

### `SECURITY_CHALLENGE_CANCELLED`

Meaning:
The user intentionally cancelled the transactional challenge.

Use when:

- the user dismisses the PIN modal/screen;
- the user explicitly taps cancel/back in a supported flow.

Must not be used when:

- the app aborts due to technical failure.

UI expectation:
Abort the sensitive operation gracefully.

Observability note:
Cancellation is informational, not a credential failure.

---

### `SECURITY_CHALLENGE_NOT_ACTIVE`

Meaning:
A validation or completion step was requested without a valid active challenge context.

Use when:

- validation service is called without current challenge;
- operation tries to finalize challenge state that does not exist.

UI expectation:
Restart or reconstruct the flow.

---

### `SECURITY_CHALLENGE_RESOLUTION_MISSING`

Meaning:
A sensitive operation attempted execution without a resolved authorization outcome.

Use when:

- an operation pipeline expects `authorized` but no terminal challenge result exists.

UI expectation:
Do not execute the operation; recover flow safely.

---

## 5.4 Persistence and technical errors

### `SECURITY_STORAGE_READ_FAILED`

Meaning:
The feature could not read required security material or metadata from secure persistence.

Use when:

- secure storage access throws;
- read response is unavailable unexpectedly.

Must not be used when:

- the credential is simply absent and absence is a valid business state.

UI expectation:
Show generic security failure state.

Observability note:
Log storage read failure with step and context, never with persisted values.

---

### `SECURITY_STORAGE_WRITE_FAILED`

Meaning:
The feature could not persist required security material or metadata.

Use when:

- PIN setup cannot save hash/salt/metadata;
- attempts/block metadata cannot be updated.

UI expectation:
Abort setup/validation completion and show generic failure.

---

### `SECURITY_STORAGE_DATA_INVALID`

Meaning:
Persisted data was found, but its structure/content is invalid for the expected schema.

Use when:

- required metadata is missing;
- hash/salt structure is corrupted;
- block metadata is inconsistent.

UI expectation:
Treat as unrecoverable security state for the current flow and redirect safely.

---

### `SECURITY_VALIDATION_EXECUTION_FAILED`

Meaning:
The system was unable to complete the internal validation pipeline safely.

Use when:

- comparison execution throws unexpectedly;
- derivation or internal validation pipeline fails.

Must not be used when:

- the result is simply a wrong PIN.

UI expectation:
Show generic security failure and abort operation.

---

## 5.5 Generic fallback

### `SECURITY_UNKNOWN_ERROR`

Meaning:
Unexpected failure not mapped to a known typed code.

Use when:

- all mapping strategies failed.

Rules:

- this code must be rare;
- new recurring cases must be promoted to a specific code;
- the mapper/factory must prefer explicit codes over this fallback.

---

## 6. Suggested TypeScript model

```ts
export type SecurityErrorCode =
  | 'SECURITY_PIN_NOT_CONFIGURED'
  | 'SECURITY_PIN_CONFIRMATION_MISMATCH'
  | 'SECURITY_PIN_FORMAT_INVALID'
  | 'SECURITY_PIN_INVALID'
  | 'SECURITY_PIN_BLOCKED'
  | 'SECURITY_ATTEMPT_LIMIT_REACHED'
  | 'SECURITY_CHALLENGE_CANCELLED'
  | 'SECURITY_CHALLENGE_NOT_ACTIVE'
  | 'SECURITY_CHALLENGE_RESOLUTION_MISSING'
  | 'SECURITY_STORAGE_READ_FAILED'
  | 'SECURITY_STORAGE_WRITE_FAILED'
  | 'SECURITY_STORAGE_DATA_INVALID'
  | 'SECURITY_VALIDATION_EXECUTION_FAILED'
  | 'SECURITY_UNKNOWN_ERROR';

export type SecurityErrorCategory =
  | 'validation'
  | 'state'
  | 'policy'
  | 'technical'
  | 'flow';

export interface SecurityError {
  code: SecurityErrorCode;
  category: SecurityErrorCategory;
  messageKey: string;
  retryable: boolean;
  cause?: unknown;
  metadata?: Record<string, unknown>;
}
```

### Rules for this model

- `messageKey` is preferred over raw user-facing message strings;
- `cause` is internal and must not be rendered directly in UI;
- `metadata` must contain only safe values;
- the UI should branch primarily on `code`, not on `messageKey`.

---

## 7. Result model vs thrown errors

For `SECURITY`, not every negative outcome should be thrown as an exception.

## 7.1 Prefer typed result for expected business outcomes

Use typed result objects for expected outcomes such as:

- authorized;
- denied by invalid PIN;
- blocked;
- not configured;
- cancelled.

Example:

```ts
export type SecurityChallengeResult =
  | { status: 'authorized' }
  | { status: 'denied'; reason: 'invalid_pin'; remainingAttempts: number }
  | { status: 'blocked'; blockUntil: string }
  | { status: 'not_configured' }
  | { status: 'cancelled' };
```

## 7.2 Throw typed errors for abnormal technical failures

Throw `SecurityError` for cases such as:

- storage read/write failure;
- corrupted persisted state;
- validation pipeline failure;
- broken orchestration contract.

### Mandatory distinction

- expected user/business outcomes => typed result;
- unexpected or unrecoverable technical failures => typed error.

This distinction must remain stable across the module.

---

## 8. Mapping rules for UI

The UI must map typed codes/results to stable feedback.

## 8.1 Setup UI mapping

### `SECURITY_PIN_FORMAT_INVALID`

UI should:

- highlight invalid format;
- keep user in same step;
- avoid generic toast-only handling.

### `SECURITY_PIN_CONFIRMATION_MISMATCH`

UI should:

- explain mismatch;
- allow re-entry of confirmation;
- not persist any credential before confirmation succeeds.

---

## 8.2 Validation/challenge UI mapping

### `SECURITY_PIN_INVALID`

UI should:

- show invalid PIN state;
- optionally show remaining attempts when available;
- remain in challenge flow if policy allows retry.

### `SECURITY_ATTEMPT_LIMIT_REACHED`

UI should:

- transition immediately to blocked messaging;
- not offer immediate retry.

### `SECURITY_PIN_BLOCKED`

UI should:

- show blocked state with remaining duration;
- prevent validation submission while active.

### `SECURITY_CHALLENGE_CANCELLED`

UI should:

- abort the protected operation;
- avoid showing error styling equivalent to invalid PIN.

### `SECURITY_PIN_NOT_CONFIGURED`

UI should:

- redirect to setup or onboarding path;
- never continue sensitive operation without challenge resolution.

---

## 8.3 Technical failure UI mapping

For:

- `SECURITY_STORAGE_READ_FAILED`
- `SECURITY_STORAGE_WRITE_FAILED`
- `SECURITY_STORAGE_DATA_INVALID`
- `SECURITY_VALIDATION_EXECUTION_FAILED`
- `SECURITY_UNKNOWN_ERROR`

UI should:

- abort the flow safely;
- show generic security failure feedback;
- avoid exposing internal implementation details.

---

## 9. Mapping rules for observability

## 9.1 What may be logged

Allowed examples:

- `event: security_challenge_started`
- `event: security_pin_invalid`
- `event: security_block_activated`
- `event: security_storage_read_failed`
- `event: security_challenge_cancelled`

Allowed metadata examples:

- `operation: 'pix_transfer'`
- `attemptNumber: 2`
- `remainingAttempts: 1`
- `blockDurationMs: 300000`
- `hasConfiguredPin: true`
- `code: 'SECURITY_PIN_INVALID'`

---

## 9.2 What must never be logged

Forbidden examples:

- entered PIN;
- partial PIN;
- derived hash;
- salt;
- secure storage raw payload;
- comparison buffers;
- serialized credential material.

---

## 9.3 Logging severity guidance

Suggested severity:

- invalid PIN: `info` or `warn`
- challenge cancelled: `info`
- temporary block activated: `warn`
- storage/technical failure: `error`
- corrupted persisted state: `error`
- unknown fallback: `error`

---

## 10. Integration rules with Pix

`PIX` must not interpret raw security internals.
It must depend only on the public challenge contract.

### Pix integration outcomes

#### Authorized

- Pix flow may continue.

#### Invalid PIN / denied

- Pix flow must not execute transfer.

#### Blocked

- Pix flow must not execute transfer.

#### Not configured

- Pix flow must redirect to PIN setup or abort according to product flow.

#### Cancelled

- Pix flow must abort cleanly.

#### Technical security failure

- Pix flow must abort cleanly.
- Pix must not downgrade the failure to `invalid PIN`.

---

## 11. Factory and mapper recommendations

The feature should expose at least:

- `securityErrorFactory`
- `mapSecurityErrorToUiState`
- `mapUnknownToSecurityError`

### `securityErrorFactory`

Responsibilities:

- build strongly typed errors;
- centralize category/messageKey/retryability defaults.

### `mapUnknownToSecurityError`

Responsibilities:

- transform thrown unknown values into `SecurityError`;
- preserve explicit `SecurityError` unchanged;
- fallback to `SECURITY_UNKNOWN_ERROR` only when necessary.

### `mapSecurityErrorToUiState`

Responsibilities:

- isolate UI decision rules from services;
- keep screens simple and declarative.

---

## 12. Non-negotiable rules

The following rules are mandatory.

### 12.1 Never convert technical failure into invalid PIN

Forbidden behavior:

- storage failed => show `invalid PIN`
- validation pipeline crashed => show `invalid PIN`

This is incorrect and unsafe.

---

### 12.2 Never increment attempts on cancellation

Cancellation is not a failed validation.

---

### 12.3 Never continue a sensitive operation after unresolved challenge

If challenge result is not explicitly `authorized`, the protected operation must not execute.

---

### 12.4 Never expose internal technical details to the user

The UI may present a generic security failure state, but not internal exception messages.

---

### 12.5 Never let screens invent error semantics

All interpretation must come from typed result/error contracts.

---

## 13. Acceptance criteria

This document is considered implemented when:

- `SECURITY` exposes a stable typed error model;
- business outcomes and technical failures are clearly separated;
- cancellation is handled as its own outcome;
- logs do not leak secrets;
- UI mapping is deterministic;
- Pix integration depends only on challenge outcomes;
- `PIN_INVALID` is never used as generic fallback;
- recurring unknown failures are promoted to explicit codes.

---

## 14. Final recommendation for v1

For v1, keep the public behavior intentionally small and rigid.

Recommended stable public codes/results for immediate use:

- `SECURITY_PIN_NOT_CONFIGURED`
- `SECURITY_PIN_FORMAT_INVALID`
- `SECURITY_PIN_CONFIRMATION_MISMATCH`
- `SECURITY_PIN_INVALID`
- `SECURITY_PIN_BLOCKED`
- `SECURITY_ATTEMPT_LIMIT_REACHED`
- `SECURITY_CHALLENGE_CANCELLED`
- `SECURITY_STORAGE_READ_FAILED`
- `SECURITY_STORAGE_WRITE_FAILED`
- `SECURITY_VALIDATION_EXECUTION_FAILED`
- `SECURITY_UNKNOWN_ERROR`

Everything else may exist internally, but the public contract should remain compact and deliberate.
