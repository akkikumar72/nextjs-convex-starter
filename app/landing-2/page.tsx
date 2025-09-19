import { HeroHeader } from '../(landing)/header'
import HeroSection from './hero-section'
import PainPoints from './pain-points'
import Results from './results'
import DemoSection from './demo-section'
import Capabilities from './capabilities'
import CaseStudy from './case-study'
import FAQSection from './faqs'
import CTASection from './cta-section'
import Footer from './footer'

export default function LandingTwoPage() {
  return (
    <div className="bg-white text-slate-900">
      <HeroHeader />
      <main>
        <HeroSection />
        <PainPoints />
        <Results />
        <DemoSection />
        <Capabilities />
        <CaseStudy />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
