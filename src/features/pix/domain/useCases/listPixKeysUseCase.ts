import { pixRepository } from "../../infra/pix.repository";
import { PixKey } from "../models/PixKey";

export async function listPixKeysUseCase(): Promise<PixKey[]> {
  return pixRepository.list();
}
