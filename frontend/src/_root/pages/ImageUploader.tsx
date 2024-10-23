import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadFiles } from '@/lib/react-query/queriesAndMutations';
import { MediaItem } from '@/lib/types';
import { useMedia } from '@/context/MediaProvider';
import SvgComponent from '@/utils/SvgComponent';


interface ImageUploaderProps {
  setPaginate: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setPaginate }) => {
  const [uploadedImages, setUploadedImages] = useState<MediaItem[]>([]);
  console.log(setUploadedImages)
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

      // Create a temporary image with loading state
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


      // Add the temporary image to the beginning of the array
      setMedia((prevImages) => [tempImage, ...prevImages]);

      const response = await uploadMediaFile(file);
      setPaginate((prev: boolean) => !prev);

      // Once uploaded, replace the temporary image with the actual uploaded image
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

      // Replace the temporary image with the actual uploaded image
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
    <div className=" w-full  flex">
      <div {...getRootProps()} className={dropzoneStyle(isDragActive)}>
        <input {...getInputProps()} />
        <div className="flex flex-col justify-center items-center pt-[82px] pb-[72px]">
          <SvgComponent className="pb-[23px]" svgName="uploader" /> 
          {/* Need to change */}
          <p className="text-primary-500 text-[28px] font-semibold leading-[120%] tracking-[0%]">
            Drop files here
          </p>
        </div>

      </div>
    </div>
  );
};

const dropzoneStyle = (isDragActive: boolean): string => `
  bg-light-blue  w-full rounded-[24px]  border-primary-500 dropzone justify-center w-full items-center  h-[290px] ${isDragActive ? 'border-green-500' : 'border-gray-300'
  } rounded text-center cursor-pointer transition duration-300 ease-in-out
`;

export default ImageUploader;
