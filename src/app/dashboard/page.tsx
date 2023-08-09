"use client";

import styles from "./styles.module.scss";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") redirect("/");

  const [input, setInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("user", "==", session?.user?.email || ""),
      );

      onSnapshot(q, (snapshot) => {
        let taskList: TasksProps[] = [];

        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            task: doc.data().task,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(taskList);
      });
    }
    loadTasks();
  }, [session?.user?.email]);

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();

    if (!input) return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: session?.user?.email,
        public: isPublic,
      });

      setInput("");
      setIsPublic(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleShareTask(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`,
    );
    alert("URL was successfully copied!");
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>What is your next task now?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Type your task here"
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  id="checkbox"
                  name="checkbox"
                  className={styles.checkbox}
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
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
          {tasks.map((task) => (
            <article key={task.id} className={styles.task}>
              {task.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLIC</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShareTask(task.id)}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {task.public ? (
                  <Link href={`/task/${task.id}`}>
                    <p>{task.task}</p>
                  </Link>
                ) : (
                  <p>{task.task}</p>
                )}
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
