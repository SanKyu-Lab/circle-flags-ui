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
      <HeroSection onBrowseClick={onBrowseClick} onFlagClick={onFlagClick} />
      <GallerySection flagCount={flagCount} onFilterNavigate={onFilterNavigate} />
      <QuickStartSection />
      <AppFooter />
    </>
  )
}
