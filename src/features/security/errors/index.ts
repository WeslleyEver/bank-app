export { SecurityErrorCode, type SecurityErrorCodeType } from "./security-error-codes";
export type { SecurityErrorCategory, SecurityErrorDescriptor } from "./security-error-categories.types";
export {
  getSecurityErrorDescriptor,
  createSecurityError,
  mapUnknownToSecurityError,
} from "./security-error-factory";
