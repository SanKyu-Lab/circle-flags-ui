import { useMemo } from 'react'
import { ExternalLink, Sparkles } from 'lucide-react'
import { DynamicFlag, FLAG_REGISTRY } from '@sankyu/react-circle-flags'
import DomeGallery from '../../animated-ui/DomeGallery'
import SpotlightCard from '../../animated-ui/SpotlightCard'
import LinkButton from '../../ui/LinkButton'
import { withBasePath } from 'src/react-app/routing/paths'

interface GallerySectionProps {
  onFilterNavigate?: (code: string) => void
}

const MAX_TILES = 175

export default function GallerySection({ onFilterNavigate }: GallerySectionProps) {
  const galleryItems = useMemo(
    () =>
      Object.keys(FLAG_REGISTRY)
        .sort()
        .slice(0, MAX_TILES)
        .map(code => ({
          id: code,
          node: (
            <DynamicFlag
              code={code}
              width={76}
              height={76}
              className="w-12 h-12 md:w-[76px] md:h-[76px]"
              title={`Flag ${code.toUpperCase()}`}
            />
          ),
        })),
    []
  )

  return (
    <SpotlightCard
      className="rounded-3xl border border-(--border-strong) p-8 shadow-(--shadow-lg) animate-rise delay-400 bg-(--surface)!"
      spotlightColor="oklch(0.72 0.1 162 / 0.2)"
    >
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-(--accent)" aria-hidden />
              <h2 className="text-xl font-bold">Flag Atlas</h2>
            </div>
            <p className="text-sm text-(--muted) leading-relaxed">
              Drag to orbit through a curated set of locales, then jump into the full browser.
            </p>
          </div>
          <span className="rounded-full border border-(--border-weak) bg-(--overlay-soft) px-3 py-1 text-xs font-semibold text-(--ink-secondary)">
            3D Interaction
          </span>
        </div>
        <div className="rounded-2xl border border-(--border) bg-(--surface-glass) p-3 h-105 md:h-120">
          <DomeGallery
            items={galleryItems}
            disableEnlarge={true}
            fit={0.54}
            fitBasis="min"
            overlayBlurColor="transparent"
            dragSensitivity={18}
            imageBorderRadius="22px"
            openedImageBorderRadius="26px"
            grayscale={false}
            onItemSelect={code => onFilterNavigate?.(code)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-(--muted) pt-4">
          <LinkButton href={withBasePath('browse')} target="_blank" variant="solid">
            Browse Full Gallery
            <ExternalLink className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
      </div>
    </SpotlightCard>
  )
}
