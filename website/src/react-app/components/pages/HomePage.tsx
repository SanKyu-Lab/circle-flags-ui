import AppFooter from '../layout/AppFooter'
import CoverageSection from './home/CoverageSection'
import FrameworksSection from './home/FrameworksSection'
import HeroSection from './home/HeroSection'
import SpecSection from './home/SpecSection'

interface HomePageProps {
  flagCount: number
  onBrowse: () => void
  onFlagSelect: (code: string) => void
}

export default function HomePage({ flagCount, onBrowse, onFlagSelect }: HomePageProps) {
  return (
    <>
      <HeroSection flagCount={flagCount} onBrowse={onBrowse} />
      <SpecSection />
      <FrameworksSection />
      <CoverageSection flagCount={flagCount} onBrowse={onBrowse} onFlagSelect={onFlagSelect} />
      <AppFooter />
    </>
  )
}
