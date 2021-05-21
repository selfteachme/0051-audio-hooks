import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useRouter } from "next/router";
import { AudioPlayer } from "../components/AudioPlayer"

export default function Home() {
  const router = useRouter();
  const { t } = router.query;
  return (
    <div className={styles.container}>
      <Head>
        <title>React Audio Player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <AudioPlayer timeJump={t} />
      </main>
    </div>
  )
}
