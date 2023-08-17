"use client";

import styles from "./styles.module.scss";
import { redirect, useParams } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { doc, collection, query, where, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/textarea";

interface Task {
  id: string;
  task: string;
  user: string;
  created: string;
  isPublic: boolean;
}

export default function Task() {
  const { id } = useParams();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [task, setTask] = useState<Task | undefined>();

  const docRef = doc(db, "tasks", id as string);

  getDoc(docRef).then((snapshot) => {
    setShouldRedirect(!snapshot.exists() || !snapshot.data().public);
    if (snapshot.data() && !task) {
      const { task, user, created, public: isPublic } = snapshot.data()!;
      const milisseconds = created.seconds * 1000;
      const formatedTask: Task = {
        id: id as string,
        task,
        user,
        created: new Date(milisseconds).toLocaleDateString(),
        isPublic,
      };
      setTask(formatedTask);
      console.log(formatedTask);
    }
  });

  if (shouldRedirect) redirect("/");

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Task</h1>
        <article className={styles.task}>
          <p>{task?.task}</p>
        </article>
      </main>
      <section className={styles.commentsContainer}>
        <h2>Let a comment</h2>

        <form action="">
          <Textarea placeholder="type your comment..." />
          <button className={styles.button}>Done</button>
        </form>
      </section>
    </div>
  );
}
