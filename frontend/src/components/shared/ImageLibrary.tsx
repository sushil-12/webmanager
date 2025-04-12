import { useState, useEffect, useRef } from 'react';
import { useGetAllImages } from '@/lib/react-query/queriesAndMutations';
import { Skeleton } from 'primereact/skeleton';
import Header from '../ui/header';

interface Image {
  id: string;
  url: string;
  alt_text: string;
  format?: string;
}

interface ImageLibraryProps {
  onSelect: (image: Image) => void;
  filterExtension?: string[];
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onSelect, filterExtension = [] }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const { mutateAsync: getAllImages, isPending: isLoading } = useGetAllImages();
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllImages();
        setImages(mediaResponse?.data?.imagesdata || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchData();
  }, [getAllImages]);

  useEffect(() => {
    if (filterExtension.length === 0) {
      setFilteredImages(images);
      return;
    }

    const filtered = images.filter(image => {
      const imageUrl = image.url.toLowerCase();
      return filterExtension.some(ext => 
        imageUrl.endsWith(ext.toLowerCase()) || 
        imageUrl.includes(`.${ext.toLowerCase()}`)
      );
    });

    setFilteredImages(filtered);
  }, [images, filterExtension]);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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

    document.querySelectorAll('.lazy-load-image').forEach((img) => {
      observer.observe(img);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  return (
    <div className="">
      <Header title='Select File (Double click to select)' />
      <div ref={imageContainerRef} className="pt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {!isLoading ? (
          filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <a className="card group cursor-pointer" key={image.id}>
                <div className="relative aspect-square flex items-center justify-center border rounded-lg overflow-hidden">
                  {image.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={image.url}
                      data-src={image.url}
                      alt={image.alt_text}
                      className="lazy-load-image w-full h-full object-cover"
                      onDoubleClick={() => onSelect(image)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-2">{getFileIcon(image.url)}</span>
                      <span className="text-sm text-gray-600 truncate max-w-full">
                        {image.url.split('/').pop()}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                {filterExtension.length > 0 
                  ? `No files found with extensions: ${filterExtension.join(', ')}`
                  : 'No files available'}
              </p>
            </div>
          )
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
