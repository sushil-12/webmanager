import { useState, useEffect } from 'react';
import ImageLibrary from './ImageLibrary';
import { Dialog } from 'primereact/dialog';
import { Image as ImageView } from 'primereact/image';
import { MousePointerSquare } from 'lucide-react';
import { Button } from 'primereact/button';



interface Image {
  id: string;
  url: string;
  alt_text: string;
}
interface MediaPickerProps {
  onSelect: (image: Image | null) => void;
  defaultValue?: Image | null; // Added defaultValue prop
}
const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, defaultValue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(defaultValue || null);

  useEffect(() => {
    setSelectedImage(defaultValue || null);
  }, [defaultValue]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageSelect = (image: Image) => {
    setSelectedImage(image);
    onSelect(image);
    closeModal();
  };
  const removeFeaturedImage = () => {
    setSelectedImage(null);
    onSelect(null); // Call onSelect with null when removing the featured image
  };
  return (
    <div>
      <div onClick={openModal} className='p-2 flex'><MousePointerSquare /> Open Media Library</div>
      {selectedImage && (
        <div className='p-0'>
          <ImageView src={selectedImage.url} alt={selectedImage.alt_text} preview title='Featured Image' className='p-0' />
          <Button label="Remove Featured Image" className='p-2 text-sm bg-transparent text-error border-none text-right' icon="pi pi-trash" onClick={removeFeaturedImage} />
        </div>
      )}

      <Dialog
        className="min-w-fit bg-white dark:bg-slate-900 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl"
        style={{ maxWidth: "60%", width: '60%', minWidth: '600px' }}
        visible={isModalOpen}
        onHide={closeModal}draggable={false}
        header="Media Library"
      >
        <ImageLibrary onSelect={handleImageSelect} />
      </Dialog>
    </div>
  );
};

export default MediaPicker;
