import { Metadata } from "next";
import styles from "./styles.module.scss";
import authOptions from "@/lib/auth/[....nextauth]";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Meu painel de tarefas",
};

export default function Dashboard() {
  getServerSession(authOptions).then((session) => {
    if (!session?.user) redirect("/");
  });

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

        <section className={styles.taskContainer}>
          <h2>My tasks</h2>
          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PUBLIC</label>
              <button className={styles.shareButton}>
                <FiShare2 size={22} color="#3183ff" />
              </button>
            </div>
            <div className={styles.taskContent}>
              <p>My first simple of task!</p>
              <button className={styles.trashButton}>
                <FaTrash size={24} color="#ea3140" />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
