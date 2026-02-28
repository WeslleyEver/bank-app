import { PixKey } from "../domain/models/PixKey";
import { pixRepository } from "../infra/pix.repository";

export async function listPixKeysUseCase(): Promise<PixKey[]> {
  return pixRepository.list();
}
