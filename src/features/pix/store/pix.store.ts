import { create } from "zustand";
import { PixKey } from "../domain/models/PixKey";

interface PixStore {
  keys: PixKey[];
  setKeys: (keys: PixKey[]) => void;
  addKey: (key: PixKey) => void;
  removeKey: (id: string) => void;
}

export const usePixStore = create<PixStore>((set) => ({
  keys: [],

  setKeys: (keys) => set({ keys }),

  addKey: (key) =>
    set((state) => ({
      keys: [...state.keys, key],
    })),

  removeKey: (id) =>
    set((state) => ({
      keys: state.keys.filter((k) => k.id !== id),
    })),
}));