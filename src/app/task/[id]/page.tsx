"use client";

import styles from "./styles.module.scss";
import { redirect, useParams } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Textarea } from "@/components/textarea";
import { useSession } from "next-auth/react";
import { isTemplateExpression } from "typescript";
import { FaTrash } from "react-icons/fa";

interface Task {
  id: string;
  task: string;
  user: string;
  created: string;
  isPublic: boolean;
}

interface Comment {
  id: string;
  taskId: string;
  comment: string;
  created: Date;
  user: string;
  name: string;
}

export default function Task() {
  const id = useParams().id as string;
  const { data: session, status } = useSession();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [task, setTask] = useState<Task | undefined>();
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<Comment[]>([]);

  const docRef = doc(db, "tasks", id as string);

  const q = query(collection(db, "comments"), where("taskId", "==", id));

  if (allComments.length < 1) {
    getDocs(q).then((comments) => {
      let allComments: Comment[] = [];

      comments.forEach((doc) => {
        allComments.push({
          id: doc.id,
          taskId: doc.data().id,
          comment: doc.data().comment,
          created: doc.data().created,
          user: doc.data().user,
          name: doc.data().name,
        });
        setAllComments(allComments);
      });
    });
  }

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
    }
  });

  if (shouldRedirect) redirect("/");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!comment) return;
    if (!session?.user?.email || !session?.user?.name) return;

    try {
      await addDoc(collection(db, "comments"), {
        taskId: id,
        comment,
        created: new Date(),
        user: session.user.email,
        name: session.user.name,
      });

      const data = {
        taskId: id,
        comment,
        created: new Date(),
        id: docRef.id,
        user: session.user.email,
        name: session.user.name,
      };
      setAllComments((prevComments) => [...prevComments, data]);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  }
  console.log(allComments);

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const updatedComments = allComments.filter(
        (comment) => comment.id !== id,
      );
      setAllComments(updatedComments);
    } catch (err) {
      console.error(err);
    }
  }

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

        <form onSubmit={handleSubmit}>
          <Textarea
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            placeholder="type your comment..."
          />
          <button disabled={!session?.user} className={styles.button}>
            Done
          </button>
        </form>
      </section>
      <section className={styles.commentsContainer}>
        <h2>Comments</h2>
        {allComments.length < 1 && <span>No comment has been found...</span>}
        {allComments.map((comment) => (
          <article key={comment.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentLabel}>{comment.name}</label>
              {comment.user === session?.user?.email && (
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <FaTrash size={18} color="#ea3140" />
                </button>
              )}
            </div>
            <p>{comment.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
