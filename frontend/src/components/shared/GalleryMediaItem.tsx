import MediaEditForm from '@/_auth/Forms/MediaEditForm';
import { MediaItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import Loader from './Loader';

const GalleryMediaItem: React.FC<{ item: MediaItem, modalVisibility: any , canEdit: boolean}> = ({ item, modalVisibility, canEdit }) => {
    const [currentItem, setCurrentItem] = useState<MediaItem>(item);
    const [blur, setblur] = useState<Boolean>(false);
    useEffect(() => {
        setCurrentItem(item);
    }, [item]);

    return (
        <>
          {blur && (
            <div className="absolute z-[999999999999999999] flex justify-center top-[50%] left-[50%]">
              <Loader />
            </div>
          )}
          <div className="max-h-[630px] grow-0 flex flex-col md:flex-row gap-6">
            <div className={`w-[688px] overflow-hidden ${blur ? 'opacity-70' : ''}`}>
              <div className="w-full h-full rounded max-w-full max-h-[556px] overflow-hidden">
                <img src={currentItem?.url} alt={currentItem?.alt_text} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="w-1/4 md:w-auto h-full">
              <MediaEditForm item={currentItem} handleModal={modalVisibility} setblur={setblur} canEdit ={canEdit}/> {/* Corrected setBlur */}
            </div>
          </div>
        </>
      );
      
};

export default GalleryMediaItem;