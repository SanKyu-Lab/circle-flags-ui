import AppFooter from '../layout/AppFooter'
import GallerySection from './home/GallerySection'
import HeroSection from './home/HeroSection'
import QuickStartSection from './home/QuickStartSection'

interface HomePageProps {
  flagCount: number
  onBrowseClick: () => void
  onFilterNavigate?: (code: string) => void
  onFlagClick?: (code: string) => void
}

export default function HomePage({
  flagCount,
  onBrowseClick,
  onFilterNavigate,
  onFlagClick,
}: HomePageProps) {
  return (
    <>
      <HeroSection flagCount={flagCount} onBrowseClick={onBrowseClick} onFlagClick={onFlagClick} />
      <section className="space-y-10 mb-16">
        <GallerySection onFilterNavigate={onFilterNavigate} />
        <QuickStartSection />
      </section>
      <AppFooter />
    </>
  )
}
