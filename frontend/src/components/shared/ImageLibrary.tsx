import { useState, useEffect, useRef } from 'react';
import { useGetAllImages } from '@/lib/react-query/queriesAndMutations';
import { Skeleton } from 'primereact/skeleton';
import Header from '../ui/header';

interface Image {
  id: string;
  url: string;
  alt_text: string;
}

interface ImageLibraryProps {
  onSelect: (image: Image) => void;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onSelect }) => {
  const [images, setImages] = useState<Image[]>([]);
  const { mutateAsync: getAllImages, isPending: isLoading } = useGetAllImages();
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllImages();
        setImages(mediaResponse?.data?.imagesdata);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [getAllImages]);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Load the image source when it comes into the viewport
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          observer.unobserve(img);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    // Observe all images within the container
    document.querySelectorAll('.lazy-load-image').forEach((img) => {
      observer.observe(img);
    });

    return () => {
      // Cleanup the observer when the component is unmounted
      observer.disconnect();
    };
  }, []);

  return (
    <div className="">
      <Header title='Select Image (Double click to select an image)' />
      <div ref={imageContainerRef} className="pt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {!isLoading ? (
          images.map((image) => (
            <a className="card group cursor-pointer" key={image.id}>
              <div
                className=""
                ref={imageContainerRef}
              >
                <img
                  src={image.url}
                  data-src={image.url}
                  alt={image.alt_text}
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                  className="lazy-load-image"
                  onDoubleClick={() => onSelect(image)}
                  loading="lazy"
                />
              </div>
            </a>
          ))
        ) : (
          Array.from({ length: 4 }, (_, index) => (
            <div className="card" key={index}>
              <div className="border-round border-1 surface-border p-4 surface-card">
                <Skeleton width="200px" height='150px'></Skeleton>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImageLibrary;
