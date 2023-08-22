import { TasksProps } from "@/app/dashboard/interfaces";
import { db } from "@/services/firebaseConnection";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Session } from "next-auth";

export async function loadTasks(session: Session | null) {
  const tasksRef = collection(db, "tasks");
  const taskList: TasksProps[] = [];
  const q = query(
    tasksRef,
    orderBy("created", "desc"),
    where("user", "==", session?.user?.email || ""),
  );

  try {
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      taskList.push({
        id: doc.id,
        task: doc.data().task,
        created: doc.data().created,
        user: doc.data().user,
        public: doc.data().public,
      });
    });

    return taskList;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}
