import Head from 'next/head'
import Image from 'next/image'
import LoginForm from '../components/forms/LoginForm'
import styles from '../styles/Home.module.css'
import { useAuthContext } from '../contexts/AuthContext';

export default function Home() {
  // const  auth  = useAuthContext() // AuthContext object.

  return (
    <div >
      <Head>
        <title>LPR VMS</title>
        <meta name="description" content="Generated by Midl Tech" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full" >
       <LoginForm/>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
