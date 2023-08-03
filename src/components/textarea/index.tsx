import { HTMLProps } from "react";
import styles from "./styles.module.scss";

export function Textarea({ ...props }: HTMLProps<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...props}></textarea>;
}
