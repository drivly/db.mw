import CTA from '../components/CTA'
import FAQ from '../components/FAQ'
import Features from '../components/Features'
import FeaturesScreenshot from '../components/FeatureScreenshot'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Pricing from '../components/Pricing'
import Stats from '../components/Stats'

export default function App() {
  return (
  <main className='scroll-smooth'>
    <Header/>
    <Hero/>
    <Features/>
    <FeaturesScreenshot/>
    <Stats/>
    <Pricing/>
    <FAQ/>
    <CTA/>
    <Footer/>
  </main>
  )  
}