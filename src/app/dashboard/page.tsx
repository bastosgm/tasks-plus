import { Metadata } from "next";
import styles from "./styles.module.scss";
import authOptions from "@/lib/auth/[....nextauth]";
import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export const metadata: Metadata = {
  title: "Meu painel de tarefas",
};

export default async function Dashboard() {
  const serverSession = await getSession(authOptions);
  if (!serverSession?.user) redirect("/");

  return (
    <div className={styles.container}>
      <h1>Página painel</h1>
    </div>
  );
}
