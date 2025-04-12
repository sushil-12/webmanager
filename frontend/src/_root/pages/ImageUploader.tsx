import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadFiles } from '@/lib/react-query/queriesAndMutations';
import { MediaItem } from '@/lib/types';
import { useMedia } from '@/context/MediaProvider';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  setPaginate: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setPaginate }) => { // @ts-ignore
  const [uploadedImages, setUploadedImages] = useState<MediaItem[]>([]);
  const { mutateAsync: uploadMediaFile, isPending: isLoading } = useUploadFiles();
  const { setMedia } = useMedia();

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.tempUrl || ''));
    };
  }, [uploadedImages]);

  const uploadFile = async (file: File) => {
    try {
      const id = `${Date.now()}-${file.name}`;
      const tempUrl = URL.createObjectURL(file);

      const tempImage: MediaItem = {
        id,
        tempUrl,
        title: isLoading ? 'true' : 'false',
        caption: '',
        description: '',
        alt_text: '',
        filename: '',
        format: '',
        height: '',
        resource_type: '',
        width: '',
        cloudinary_id: '',
        url: '',
        size: '',
        storage_type: '',
        author: '',
        category: '',
        tags: '',
        domain: 'he_group',
        createdAt: ''
      };

      setMedia((prevImages) => [tempImage, ...prevImages]);

      const response = await uploadMediaFile(file);
      setPaginate((prev: boolean) => !prev);

      const uploadedImage: MediaItem = {
        id: response.data._id,
        tempUrl,
        format: response.data.format || '',
        width: response.data.width || '',
        height: response.data.height || '',
        resource_type: response.data.resource_type || '',
        title: response.data.title || '',
        caption: response.data.caption || '',
        description: response.data.description || '',
        alt_text: response.data.alt_text || '',
        filename: response.data.filename || '',
        cloudinary_id: response.data.cloudinary_id || '',
        url: response.data.url || '',
        size: response.data.size || '',
        storage_type: response.data.storage_type || '',
        author: response.data.author || '',
        category: response.data.category || '',
        tags: response.data.tags || [],
        domain: response.data.domain || [],
        createdAt: response.data.createdAt || '',
      };

      setMedia((prevImages) => prevImages.map(img => (img.id === id ? uploadedImage : img)));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`
          relative w-full rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50/50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <div className="flex flex-col items-center justify-center p-12">
          {isLoading ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-primary-500 mb-4" />
          )}
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-gray-900">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
