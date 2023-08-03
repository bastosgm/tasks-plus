import { Metadata } from "next";
import styles from "./styles.module.scss";
import authOptions from "@/lib/auth/[....nextauth]";
import { redirect } from "next/navigation";
import { getSession } from "./getSession";
import { Textarea } from "@/components/textarea";

export const metadata: Metadata = {
  title: "Meu painel de tarefas",
};

export default async function Dashboard() {
  const serverSession = await getSession(authOptions);
  if (!serverSession?.user) redirect("/");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What is your next task now?</h1>
            <form>
              <Textarea placeholder="Type your task here" />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  id="checkbox"
                  name="checkbox"
                  className={styles.checkbox}
                />
                <label htmlFor="checkbox">Let task public?</label>
              </div>

              <button type="submit" className={styles.button}>
                Add +
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
