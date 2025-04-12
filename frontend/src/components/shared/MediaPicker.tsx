import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetAllImages } from '@/lib/react-query/queriesAndMutations';
import { Skeleton } from 'primereact/skeleton';
import { UploadIcon, AlertCircle, XIcon, FileIcon } from 'lucide-react';
import { MAX_FILE_SIZE } from "@/config/constants";
import FileUploader from './FileUploader';
import FileViewer from 'react-file-viewer';

interface Media {
  id: string;
  url: string;
  alt_text: string;
  format?: string;
  filename?: string;
}

interface MediaPickerProps {
  onSelect: (media: Media) => void;
  filterExtension?: string[];
  maxSize?: number;
  className?: string;
  defaultValue?: Media | null;
}

interface PreviewState {
  isOpen: boolean;
  type: 'image' | 'pdf' | 'document' | null;
  url: string | null;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  onSelect,
  filterExtension = [],
  maxSize = MAX_FILE_SIZE,
  className = '',
  defaultValue = null
}) => {

  console.log("TABLE FOR DEFAULT VALUE", defaultValue)
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(defaultValue);
  const [preview, setPreview] = useState<PreviewState>({
    isOpen: false,
    type: null,
    url: null,
  });
  const { mutateAsync: getAllImages, isPending: isLoading } = useGetAllImages();

  useEffect(() => {
    setSelectedMedia(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getAllImages();
        setMedia(mediaResponse?.data?.imagesdata || []);
      } catch (error) {
        console.error('Error fetching media:', error);
        setError('Failed to fetch media files');
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [getAllImages, isOpen]);

  useEffect(() => {
    if (filterExtension.length === 0) {
      setFilteredMedia(media);
      return;
    }

    const filtered = media.filter(item => {
      const itemUrl = item.url.toLowerCase();
      console.table(itemUrl)
      return filterExtension.some(ext =>
        itemUrl.endsWith(ext.toLowerCase()) ||
        itemUrl.includes(`.${ext.toLowerCase()}`)
      );
    });

    setFilteredMedia(filtered);
  }, [media, filterExtension]);

  const handleFileUpload = async (fileData: { id: string; url: string; name: string; type: string }) => {
    try {
      const newMedia = {
        id: fileData.id,
        url: fileData.url,
        alt_text: fileData.name,
        filename: fileData.name,
        format: fileData.type
      };

      setMedia(prev => [...prev, newMedia]);
      setFilteredMedia(prev => [...prev, newMedia]);
      setSelectedMedia(newMedia);
      onSelect(newMedia);
      setIsOpen(false);
    } catch (error) {
      console.error('Error handling uploaded file:', error);
      setError('Failed to process uploaded file. Please try again.');
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    onSelect(null as any);
  };

  const handleFilePreview = (media: Media) => {
    const isImage = media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isPDF = media.url.match(/\.pdf$/i);
    const isDocument = media.url.match(/\.(doc|docx)$/i);

    if (isImage) {
      setPreview({
        isOpen: true,
        type: 'image',
        url: media.url
      });
    } else if (isPDF) {
      setPreview({
        isOpen: true,
        type: 'pdf',
        url: media.url
      });
    } else if (isDocument) {
      setPreview({
        isOpen: true,
        type: 'document',
        url: media.url
      });
    }
  };

  const handleFileViewerError = (e: Error) => {
    console.error('Error in file viewer:', e);
    setError('Failed to load file. Please try again.');
  };

  const handleCloseFileViewer = () => {
    setPreview(prev => ({ ...prev, isOpen: false }));
    setError(null);
  };

  console.log(selectedMedia)

  const getFileIcon = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase();
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

  const getFileType = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'docx';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'png';
      default:
        return 'docx';
    }
  };

  return (
    <div className="space-y-2 flex flex-row gap-2 items-end flex-wrap">
      {selectedMedia ? (
        <div className="relative group max-w-fit">
          <div className="border rounded-lg overflow-hidden ">
            {selectedMedia?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt_text}
                className="max-h-32 w-full object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-gray-50">
                <span className="text-2xl">{getFileIcon(selectedMedia.url)}</span>
                <span className="text-sm text-gray-600 truncate">
                  {selectedMedia.filename || selectedMedia?.url?.split('/').pop()}
                </span>
              </div>
            )}
             <button
              type="button"
              onClick={() => handleFilePreview(selectedMedia)}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center"
            >
              <span className="text-white opacity-0 group-hover:opacity-100">Preview</span>
            </button> 
          </div>
          <button
            type="button"
            onClick={handleRemoveMedia}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}
     
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center max-w-fit max-h-fit  justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ${className} ;`}
      >
        <UploadIcon className="w-4 h-4" />
        <span>{selectedMedia ? 'Change Media' : 'Select or Upload Media'}</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Media
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-6">
                <FileUploader
                  accept={filterExtension.join(',')}
                  maxSize={maxSize}
                  onFileUpload={handleFileUpload}
                />
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {!isLoading ? (
                  filteredMedia.length > 0 ? (
                    filteredMedia.map((item) => (
                      <div
                        key={item.id}
                        className={`relative aspect-square group cursor-pointer ${selectedMedia?.id === item.id ? 'ring-2 ring-primary-500' : ''
                          }`}
                        onClick={() => {
                          setSelectedMedia(item);
                          onSelect(item);
                          setIsOpen(false);
                        }}
                      >
                        <div className="absolute inset-0 border rounded-lg overflow-hidden">
                          {item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={item.url}
                              alt={item.alt_text}
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <span className="text-4xl mb-2">{getFileIcon(item.url)}</span>
                              <span className="text-sm text-gray-600 truncate max-w-full">
                                {item?.filename || "File"}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100">
                              {selectedMedia?.id === item.id ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
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
                  Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="aspect-square">
                      <Skeleton width="100%" height="100%" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={preview.isOpen} onOpenChange={(open: boolean) => setPreview(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-white rounded-lg shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {preview.type === 'pdf' && <FileIcon className="h-5 w-5 text-red-500" />}
                {preview.type === 'document' && <FileIcon className="h-5 w-5 text-blue-500" />}
                <h2 className="text-lg font-semibold text-gray-900">
                  {preview.type === 'image' ? 'Image Preview' : preview.type === 'pdf' ? 'PDF Preview' : 'Document Preview'}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gray-50 p-6">
              <div className="bg-white rounded-lg shadow h-full overflow-hidden">
                {preview.type && preview.url && preview.type !== 'image' && (
                  <div className="h-full w-full">
                    <div className="max-h-[80vh] overflow-auto">
                      <FileViewer
                        fileType={getFileType(preview.url)}
                        filePath={preview.url}
                        onError={handleFileViewerError}
                        onClose={handleCloseFileViewer}
                      />
                    </div>
                  </div>
                )}
                {preview.type && preview.url && preview.type === 'image' && (
                  <div className="h-full w-full max-h-[520px]">
                    <img src={preview.url} alt={"image"} className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaPicker;
