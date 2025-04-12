import MediaEditForm from '@/_auth/Forms/MediaEditForm';
import { MediaItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { FileIcon, ImageIcon, FileTextIcon, FileVideoIcon, FileAudioIcon, DownloadIcon, ExternalLinkIcon, ZoomInIcon } from 'lucide-react';
import FileViewer from 'react-file-viewer';

const GalleryMediaItem: React.FC<{ item: MediaItem, modalVisibility: any, canEdit: boolean }> = ({ item, modalVisibility, canEdit }) => {
    const [currentItem, setCurrentItem] = useState<MediaItem>(item);
    const [blur, setblur] = useState<Boolean>(false);
    const [fileType, setFileType] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setCurrentItem(item);
        setFileType(getFileType(item.url));
    }, [item]);

    const getFileType = (url: string) => {
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension) {
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
            if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
            if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
            if (extension === 'pdf') return 'pdf';
            if (['doc', 'docx'].includes(extension)) return 'docx';
            if (['xls', 'xlsx'].includes(extension)) return 'xlsx';
            if (extension === 'txt') return 'txt';
        }
        return 'file';
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="h-6 w-6 text-blue-500" />;
            case 'video':
                return <FileVideoIcon className="h-6 w-6 text-purple-500" />;
            case 'audio':
                return <FileAudioIcon className="h-6 w-6 text-green-500" />;
            case 'pdf':
                return <FileIcon className="h-6 w-6 text-red-500" />;
            case 'docx':
            case 'xlsx':
            case 'txt':
                return <FileTextIcon className="h-6 w-6 text-orange-500" />;
            default:
                return <FileIcon className="h-6 w-6 text-gray-500" />;
        }
    };

    const handleFileViewerError = (e: Error) => {
        setError('Error loading file preview');
        console.error('Error in file viewer:', e);
    };

    const handleFileViewerClose = () => {
        setError(null);
    };

    const renderMediaPreview = () => {
        const isImage = fileType === 'image';
        const isGif = currentItem.url.toLowerCase().endsWith('.gif');
        const isPreviewable = ['pdf', 'docx', 'xlsx', 'txt'].includes(fileType);

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50">
                    <div className="text-red-500 mb-4">
                        <FileIcon className="h-12 w-12" />
                    </div>
                    <p className="text-red-500 mb-6 text-sm font-medium">{error}</p>
                    <div className="flex gap-3">
                        <a 
                            href={currentItem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow"
                        >
                            <ExternalLinkIcon className="h-4 w-4 mr-2" />
                            Open File
                        </a>
                        <a 
                            href={currentItem.url} 
                            download
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
                        >
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                        </a>
                    </div>
                </div>
            );
        }

        if (isImage) {
            return (
                <div 
                    className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img 
                        src={currentItem.url} 
                        alt={currentItem.alt_text} 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {isGif && (
                        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide shadow-sm">
                            GIF
                        </div>
                    )}
                    <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <a 
                            href={currentItem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                        >
                            <ZoomInIcon className="h-6 w-6" />
                        </a>
                        <a 
                            href={currentItem.url} 
                            download
                            className="p-3 bg-white rounded-full text-gray-700 hover:text-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                        >
                            <DownloadIcon className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            );
        }

        if (isPreviewable) {
            return (
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50 shadow-inner">
                    <div className="absolute inset-0">
                        <FileViewer
                            fileType={fileType}
                            filePath={currentItem.url}
                            onError={handleFileViewerError}
                            onClose={handleFileViewerClose}
                        />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                        <a 
                            href={currentItem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white rounded-lg text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105"
                        >
                            <ExternalLinkIcon className="h-5 w-5" />
                        </a>
                        <a 
                            href={currentItem.url} 
                            download
                            className="p-2.5 bg-white rounded-lg text-gray-600 hover:text-green-600 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105"
                        >
                            <DownloadIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 rounded-xl">
                <div className="mb-6 transform transition-transform duration-200 hover:scale-110">
                    {getFileIcon(fileType)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center line-clamp-2 max-w-md">
                    {currentItem.title}
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                    {fileType.charAt(0).toUpperCase() + fileType.slice(1)} File
                </p>
                <div className="flex gap-3">
                    <a 
                        href={currentItem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105"
                    >
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        Open File
                    </a>
                    <a 
                        href={currentItem.url} 
                        download
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105"
                    >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                    </a>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-[600px]">
            {blur && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
                    <Loader />
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-6 h-full">
                <div className={`lg:w-2/3 ${blur ? 'opacity-70' : ''}`}>
                    <div className="h-[600px] rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200/50">
                        {renderMediaPreview()}
                    </div>
                </div>
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6 h-[600px] overflow-y-auto">
                        <MediaEditForm 
                            item={currentItem} 
                            handleModal={modalVisibility} 
                            setblur={setblur} 
                            canEdit={canEdit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryMediaItem;