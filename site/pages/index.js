import CTA from '../components/CTA'
import FAQ from '../components/FAQ'
import Features from '../components/Features'
import FeaturesScreenshot from '../components/FeatureScreenshot'
import Footer from '../components/Footer'
import Graphs from '../components/Graphs'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Pricing from '../components/Pricing'
import Stats from '../components/Stats'
// import getGraphs from '../lib/getGraphs'

export default function App({graphs}) {
  return (
    <main className='scroll-smooth bg-gray-900'>
      <Header />
      <Hero />
      {/* <Graphs graphs={graphs} /> */}
      <Features />
      <FeaturesScreenshot />
      <Stats />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

// export async function getStaticProps({ params }) {
//   const graphs = await getGraphs(params?.graph)
//   console.log('AppIndex', graphs)
//   return { props: { graphs } }
// }
