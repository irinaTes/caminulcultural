import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryPhoto } from "@/data/types";
import { getDictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { GalleryWall } from "./GalleryWall";

type GallerySectionProps = { photos: GalleryPhoto[] };

const titleId = "gallery-title";

/**
 * Shapes of the placeholder frames (width × height), mixed like real photos,
 * so the wall shows its sizes before the editor adds any.
 */
const placeholderShapes = [
  [4, 3],
  [2, 3],
  [16, 9],
  [1, 1],
  [2, 3],
  [3, 2],
  [4, 3],
  [16, 9],
];

/** The workshop's photo wall. Until the editor adds photos, striped placeholders. */
export async function GallerySection({ photos }: GallerySectionProps) {
  const { workshop: t } = await getDictionary();
  const wall: GalleryPhoto[] =
    photos.length > 0
      ? photos
      : placeholderShapes.map(([width, height], index) => ({
          id: `placeholder-${index + 1}`,
          src: null,
          alt: fill(t.galleryPlaceholderAlt, { n: index + 1 }),
          width,
          height,
          lqip: null,
          focus: "50% 50%",
        }));

  return (
    <section
      aria-labelledby={titleId}
      className="bg-cream px-gutter pt-20 pb-4 text-navy md:pt-28"
    >
      <div className="mx-auto flex max-w-content flex-col gap-12">
        <div className="flex flex-col gap-3.5">
          <SectionHeading
            titleId={titleId}
            label={t.galleryLabel}
            title={t.galleryTitle}
          />
          <p className="max-w-135 text-xl leading-[1.55]">{t.galleryIntro}</p>
        </div>

        {/* Only the strings the wall needs cross into the client bundle. */}
        <GalleryWall
          photos={wall}
          t={{
            open: t.galleryOpen,
            dialog: t.galleryDialog,
            previous: t.galleryPrevious,
            next: t.galleryNext,
            close: t.galleryClose,
            counter: t.galleryCounter,
            placeholder: t.galleryPlaceholder,
          }}
        />
      </div>
    </section>
  );
}
