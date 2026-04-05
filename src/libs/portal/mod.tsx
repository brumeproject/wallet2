import { ChildrenProps } from "@/libs/props/mod.ts";
import { createPortal } from "react-dom";

export function Portal(props: ChildrenProps) {
  return createPortal(props.children, document.body)
}