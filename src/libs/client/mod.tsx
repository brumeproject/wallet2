import { Option } from "@hazae41/result-and-option";
import { createContext, useContext } from "react";

export const ClientContext = createContext<boolean>(false);

export function useClientContext() {
  return Option.wrap(useContext(ClientContext));
}