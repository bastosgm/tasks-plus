"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import heroImg from "../../public/assets/img/relaxation.svg";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

export default function Home() {
  const [totalComments, setTotalComments] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const commentsRef = collection(db, "comments");
  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    getDocs(commentsRef).then((docs) => setTotalComments(docs.size));
    getDocs(tasksRef).then((docs) => setTotalTasks(docs.size));
  }, [commentsRef, tasksRef]);

  return (
    <>
      <main className={styles.container}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tasks+"
            src={heroImg}
            priority
          ></Image>
          <section className={styles.infoContent}>
            <h1 className={styles.title}>
              A complete and different &quot;todo&quot; app for you!{" "}
            </h1>
            <div className={styles.boxWrapper}>
              <div className={styles.box}>
                <span>+{totalTasks} posts</span>
              </div>
              <div className={styles.box}>
                <span>+{totalComments} comments</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
