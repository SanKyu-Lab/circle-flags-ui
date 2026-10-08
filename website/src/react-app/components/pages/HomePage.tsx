import AppFooter from '../layout/AppFooter'
import CoverageSection from './home/CoverageSection'
import FrameworksSection from './home/FrameworksSection'
import HeroSection from './home/HeroSection'
import SpecSection from './home/SpecSection'

interface HomePageProps {
  flagCount: number
  onBrowse: () => void
}

export default function HomePage({ flagCount, onBrowse }: HomePageProps) {
  return (
    <>
      <HeroSection flagCount={flagCount} onBrowse={onBrowse} />
      <SpecSection />
      <FrameworksSection />
      <CoverageSection flagCount={flagCount} onBrowse={onBrowse} />
      <AppFooter />
    </>
  )
}
