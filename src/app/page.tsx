import styles from "./page.module.css";
import Image from "next/image";

import heroImg from "../../public/assets/img/relaxation.svg";

export default function Home() {
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
          <h1 className={styles.title}>
            A complete and different &quot;todo&quot; app for you!{" "}
          </h1>
        </div>
      </main>
    </>
  );
}
