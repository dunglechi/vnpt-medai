import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>VNPT MedAI</title>
        <meta name="description" content="AI-Powered Medical Diagnosis Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>VNPT MedAI</h1>
        <p>AI-Powered Medical Diagnosis Assistant</p>
        
        <nav style={{ marginTop: '20px' }}>
          <Link href="/dashboard" style={{ 
            padding: '10px 15px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            Go to Dashboard
          </Link>
        </nav>
      </main>
    </div>
  )
}