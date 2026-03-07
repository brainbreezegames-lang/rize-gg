import { createContext, useContext } from "react";

export const EditContext = createContext<{
  onNavigate?: (label: string) => void;
} | null>(null);

export function useEditContext() {
  return useContext(EditContext);
}
