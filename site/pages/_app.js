import '../styles.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export async function getStaticProps({ params}) {
  console.log('params', params)
  return {
    props: {
      // Will be passed to the page component as props
    },
  }
}