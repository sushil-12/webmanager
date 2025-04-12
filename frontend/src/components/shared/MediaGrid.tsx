import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { MediaItem } from '@/lib/types';
import GalleryMediaItem from './GalleryMediaItem';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToast } from '../ui/use-toast';
import { useDeleteMedia } from '@/lib/react-query/queriesAndMutations';
import { useMedia } from '@/context/MediaProvider';
import { bytesToSize } from '@/lib/utils';
import { Skeleton } from 'primereact/skeleton';
import SvgComponent from '@/utils/SvgComponent';
import { status } from '@/constants/message';
import { FileIcon, ImageIcon, FileTextIcon, FileVideoIcon, FileAudioIcon, EyeIcon, Trash2Icon, DownloadIcon, ExternalLinkIcon } from 'lucide-react';

interface MediaGridProps {
    media: MediaItem[];
    isLoading: boolean;
    setPaginate: any;
    canEdit: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, isLoading, setPaginate, canEdit }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const { toast } = useToast();
    const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMedia();
    const { setMedia } = useMedia();

    const getFileType = (url: string) => {
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension) {
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
            if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
            if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
            if (extension === 'pdf') return 'pdf';
            if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(extension)) return 'document';
        }
        return 'file';
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="h-5 w-5 text-blue-500" />;
            case 'video':
                return <FileVideoIcon className="h-5 w-5 text-purple-500" />;
            case 'audio':
                return <FileAudioIcon className="h-5 w-5 text-green-500" />;
            case 'pdf':
                return <FileIcon className="h-5 w-5 text-red-500" />;
            case 'document':
                return <FileTextIcon className="h-5 w-5 text-orange-500" />;
            default:
                return <FileIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const openEditModal = (mediaItem: MediaItem) => {
        setSelectedMedia(mediaItem);
        setVisible(true);
    };

    const onHide = () => {
        setVisible(false);
        setSelectedMedia(null);
    };

    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles font-inter font-semibold text-[1.625rem] mb-4'>Attachment Details</h1>
                <button onClick={() => setVisible(false)}><SvgComponent className='cursor-pointer' svgName='close' /></button>
            </div>
        );
    };

    async function accept(media_id: string) {
        const deleteMediaResponse = await deleteMedia(media_id);
        const updatedMedia = media.filter((item) => item.id !== media_id);
        setMedia(updatedMedia);
        setPaginate((prev: boolean) => !prev);
        if (!deleteMediaResponse) return toast({ variant: "destructive", description: "You have cancelled the operations", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        if (deleteMediaResponse?.code == status.created) {
            return toast({ variant: "default", description: deleteMediaResponse.data.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } else {
            return toast({ variant: "destructive", description: "You have cancelled the operations", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }

    const reject = () => {
        console.log("CANCELLED", isLoading);
    }

    const confirmDelete = (media_id: string) => {
        confirmDialog({
            header: 'Do you want to delete this media file?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => accept(media_id),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((mediaItem: MediaItem) => {
                const fileType = getFileType(mediaItem.url);
                const isImage = fileType === 'image';
                const isGif = mediaItem.url.toLowerCase().endsWith('.gif');

                return (
                    <div key={mediaItem?.id} className="group relative">
                        {mediaItem.title === 'false' ? (
                            <div className="card group cursor-pointer">
                                <div className="aspect-h-1 aspect-w-1 w-full border rounded-lg overflow-hidden bg-gray-50">
                                    <div className="relative w-full h-[180px]">
                                        <img 
                                            src={mediaItem.tempUrl} 
                                            style={{ opacity: 0.2 }} 
                                            className="h-full w-full object-contain object-center" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
                                        </div>
                                    </div>
                                    <div className="p-2.5">
                                        <Skeleton height="16px" width="80px" className="mb-1.5" />
                                        <Skeleton height="14px" width="50px" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`card group cursor-pointer ${isDeleting ? 'blur-sm' : ''}`}>
                                <div 
                                    className="aspect-h-1 aspect-w-1 w-full border rounded-lg overflow-hidden bg-gray-50 relative group"
                                    onClick={() => openEditModal(mediaItem)}
                                >
                                    {isImage ? (
                                        <div className="relative w-full h-[180px]">
                                            <img
                                                src={mediaItem.url}
                                                alt={mediaItem.alt_text}
                                                className="h-full w-full object-contain object-center group-hover:opacity-75 transition-all duration-200"
                                            />
                                            {isGif && (
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2.5 py-1 rounded-full font-medium tracking-wide shadow-sm">
                                                    GIF
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="flex gap-2">
                                                    <a 
                                                        href={mediaItem.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
                                                    </a>
                                                    <a 
                                                        href={mediaItem.url}
                                                        download
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-green-50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <DownloadIcon className="h-4 w-4 text-green-600" />
                                                    </a>
                                                    <button 
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(mediaItem);
                                                        }}
                                                    >
                                                        <EyeIcon className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    {canEdit && (
                                                        <button 
                                                            className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(mediaItem.id);
                                                            }}
                                                        >
                                                            <Trash2Icon className="h-4 w-4 text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-[180px] p-4">
                                            <div className="mb-2 transform transition-transform duration-200 group-hover:scale-110">
                                                {getFileIcon(fileType)}
                                            </div>
                                            <p className="text-sm text-gray-500 text-center break-words line-clamp-2 mb-2">
                                                {mediaItem.title}
                                            </p>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="flex gap-2">
                                                    <a 
                                                        href={mediaItem.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
                                                    </a>
                                                    <a 
                                                        href={mediaItem.url}
                                                        download
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-green-50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <DownloadIcon className="h-4 w-4 text-green-600" />
                                                    </a>
                                                    <button 
                                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(mediaItem);
                                                        }}
                                                    >
                                                        <EyeIcon className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    {canEdit && (
                                                        <button 
                                                            className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(mediaItem.id);
                                                            }}
                                                        >
                                                            <Trash2Icon className="h-4 w-4 text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2.5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {mediaItem.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {bytesToSize(mediaItem.size)}
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5 ml-2">
                                            <a 
                                                href={mediaItem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLinkIcon className="h-3.5 w-3.5 text-gray-400 hover:text-blue-600" />
                                            </a>
                                            <a 
                                                href={mediaItem.url}
                                                download
                                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DownloadIcon className="h-3.5 w-3.5 text-gray-400 hover:text-green-600" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            {selectedMedia && (
                <Dialog
                    draggable={false}
                    header={headerTemplate}
                    closeIcon={`hidden`}
                    closable={false}
                    pt={{
                        root: { 
                            className: 'bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-100/20' 
                        },
                        headerTitle: { 
                            className: 'text-xl font-semibold text-gray-800 tracking-tight' 
                        },
                        header: {
                            className: 'px-6 py-4 border-b border-gray-100/20 bg-white/50 backdrop-blur-sm'
                        },
                        content: { 
                            className: 'p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent' 
                        }
                    }}
                    className="transform transition-all duration-300 ease-out"
                    style={{ 
                        width: '80vw',
                        maxWidth: '1200px',
                        maxHeight: '90vh',
                        margin: '0 auto',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                    }}
                    breakpoints={{ '960px': '95vw' }}
                    visible={visible} 
                    onHide={onHide}
                    transitionOptions={{
                        timeout: 300,
                        classNames: {
                            enter: 'opacity-0 scale-95',
                            enterActive: 'opacity-100 scale-100',
                            exit: 'opacity-100 scale-100',
                            exitActive: 'opacity-0 scale-95'
                        }
                    }}
                >
                    <div className="relative w-full h-full">
                        <GalleryMediaItem item={selectedMedia} modalVisibility={onHide} canEdit={canEdit} />
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default MediaGrid;