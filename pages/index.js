import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useRouter } from "next/router";
import { AudioPlayer } from "../components/AudioPlayer"

export default function Home() {
  const router = useRouter();
  const { t } = router.query;

  const chapters = [
    {
      start: 0,
      end: 15
    },
    {
      start: 60,
      end: 75
    }
  ]

  const track = "https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3";

  return (
    <div className={styles.container}>
      <Head>
        <title>React Audio Player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <AudioPlayer timeJump={t} chapters={chapters} track={track} />
      </main>
    </div>
  )
}
