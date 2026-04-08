import {Image} from '@shopify/hydrogen';
import {useEffect, useMemo, useState} from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import {cn} from '~/lib/utils';

type ProductImage = {
  id?: string | null;
  altText?: string | null;
  url: string;
  width?: number | null;
  height?: number | null;
};

export function ProductMediaCarousel({
  images,
  selectedImageId,
  productTitle,
}: {
  images: ProductImage[];
  selectedImageId?: string | null;
  productTitle: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedImages = useMemo(() => {
    if (images.length > 0) return images;
    return [
      {
        id: 'placeholder',
        altText: `${productTitle} image placeholder`,
        url: '',
      },
    ];
  }, [images, productTitle]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const nextIndex = api.selectedScrollSnap();
      setActiveIndex(nextIndex);
      window.dispatchEvent(
        new CustomEvent('storefront:product_media_slide_change', {
          detail: {index: nextIndex},
        }),
      );
    };
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !selectedImageId) return;
    const targetIndex = normalizedImages.findIndex(
      (image) => image.id && image.id === selectedImageId,
    );
    if (targetIndex >= 0) {
      api.scrollTo(targetIndex);
      setActiveIndex(targetIndex);
    }
  }, [api, normalizedImages, selectedImageId]);

  if (!images.length) {
    return <div className="aspect-square border" />;
  }

  return (
    <div className="space-y-2">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {normalizedImages.map((image) => (
            <CarouselItem key={image.id ?? image.url}>
              <div className="overflow-hidden border">
                <Image
                  alt={image.altText || productTitle}
                  aspectRatio="1/1"
                  className="h-auto w-full object-cover"
                  data={image as any}
                  sizes="(min-width: 45em) 50vw, 100vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 rounded-none" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 rounded-none" />
      </Carousel>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {normalizedImages.map((image, index) => (
          <button
            aria-label={`Go to image ${index + 1}`}
            className={cn(
              'h-14 w-14 shrink-0 overflow-hidden border',
              activeIndex === index ? 'border-foreground' : 'border-border',
            )}
            key={`${image.id ?? image.url}-thumb`}
            onClick={() => {
              api?.scrollTo(index);
              setActiveIndex(index);
            }}
            type="button"
          >
            <Image
              alt={image.altText || `${productTitle} thumbnail ${index + 1}`}
              aspectRatio="1/1"
              className="h-full w-full object-cover"
              data={image as any}
              sizes="64px"
            />
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-1" role="tablist">
        {normalizedImages.map((image, index) => (
          <button
            aria-label={`Slide ${index + 1}`}
            className={cn(
              'h-2 w-2 rounded-full',
              activeIndex === index ? 'bg-foreground' : 'bg-muted-foreground/30',
            )}
            key={`${image.id ?? image.url}-dot`}
            onClick={() => {
              api?.scrollTo(index);
              setActiveIndex(index);
            }}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
