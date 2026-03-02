import * as Clipboard from "expo-clipboard";

export class ClipboardService {
  static async getContent(): Promise<string | null> {
    const content = await Clipboard.getStringAsync();
    return content || null;
  }
}
