// MediaContext.tsx
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { MediaItem } from '@/lib/types';

type MediaContextType = {
  media: MediaItem[];
  setMedia: Dispatch<SetStateAction<MediaItem[]>>;
};

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);

  return (
    <MediaContext.Provider value={{ media, setMedia }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
