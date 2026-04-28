import { useEffect, useMemo, useState } from 'react';
import ImageLightbox from './ImageLightbox.jsx';
import { convertToLitePath } from '../utils/imagePaths.js';

function useLiteImages(images) {
  const [resolvedSources, setResolvedSources] = useState({});

  useEffect(() => {
    let isActive = true;

    images.forEach((image) => {
      const originalSrc = image.originalSrc || image.src;
      const liteSrc = convertToLitePath(originalSrc);

      if (liteSrc === originalSrc) {
        setResolvedSources((current) => ({ ...current, [originalSrc]: originalSrc }));
        return;
      }

      const testImage = new Image();
      testImage.onload = () => {
        if (isActive) {
          setResolvedSources((current) => ({ ...current, [originalSrc]: liteSrc }));
        }
      };
      testImage.onerror = () => {
        if (isActive) {
          setResolvedSources((current) => ({ ...current, [originalSrc]: originalSrc }));
        }
      };
      testImage.src = liteSrc;
    });

    return () => {
      isActive = false;
    };
  }, [images]);

  return resolvedSources;
}

export default function PortfolioGallery({ images, columns = 3 }) {
  const [loadedImages, setLoadedImages] = useState(() => new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const resolvedSources = useLiteImages(images);
  const columnsClass =
    columns === 2
      ? 'columns-1 min-[1201px]:columns-2 min-[3840px]:columns-4'
      : 'columns-1 min-[1201px]:columns-3 min-[3840px]:columns-4';

  useEffect(() => {
    setLoadedImages(new Set());
    setSelectedImage(null);
  }, [images]);

  const preparedImages = useMemo(
    () =>
      images.map((image) => {
        const originalSrc = image.originalSrc || image.src;

        return {
          ...image,
          originalSrc,
          displaySrc: resolvedSources[originalSrc] || originalSrc,
        };
      }),
    [images, resolvedSources],
  );

  const isLoaded = preparedImages.length === 0 || loadedImages.size >= preparedImages.length;

  return (
    <>
      {!isLoaded && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[rgba(255,255,255,0.8)]">
          <div className="h-[50px] w-[50px] animate-spin rounded-full border-8 border-[rgba(0,0,0,0.1)] border-t-black" />
          <div className="mt-5 text-lg text-black">Carregando...</div>
        </div>
      )}

      <section className={`mx-auto my-5 max-w-[1400px] px-5 ${columnsClass} min-[3840px]:max-w-[1800px] min-[3840px]:gap-5`}>
        {preparedImages.map((image) => (
          <button
            className="mb-5 block w-full cursor-pointer break-inside-avoid border-0 bg-transparent p-0 text-left transition-transform hover:scale-[1.015] hover:shadow-[3px_3px_8px_0px_#000000]"
            type="button"
            key={image.originalSrc}
            onClick={() => setSelectedImage(image)}
          >
            <img
              className="h-auto w-full"
              src={image.displaySrc}
              alt={image.alt}
              onLoad={() => {
                setLoadedImages((current) => new Set(current).add(image.originalSrc));
              }}
              onError={() => {
                setLoadedImages((current) => new Set(current).add(image.originalSrc));
              }}
            />
          </button>
        ))}
      </section>

      <ImageLightbox
        src={selectedImage?.originalSrc}
        fallbackSrc={selectedImage?.displaySrc}
        alt={selectedImage?.alt}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
