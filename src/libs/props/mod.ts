import { ReactNode } from "react";

export interface ChildrenProps<T = ReactNode> {
  readonly children?: T
}