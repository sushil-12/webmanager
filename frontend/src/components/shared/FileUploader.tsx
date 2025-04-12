import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadFiles } from '@/lib/react-query/queriesAndMutations';
import { UploadIcon, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
    onFileUpload: (fileData: { id: string; url: string; name: string; type: string }) => void;
    accept?: string;
    maxSize?: number;
    className?: string;
}

interface ErrorState {
    message: string;
    type: 'size' | 'format' | 'upload' | 'other';
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFileUpload,
    accept = '*/*',
    maxSize = 4 * 1024 * 1024, // 4MB default
    className = ''
}) => {
    const [error, setError] = useState<ErrorState | null>(null);
    const { mutateAsync: uploadMediaFile, isPending: isUploading } = useUploadFiles();

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFileType = (file: File, acceptedFormats: string): boolean => {
        if (acceptedFormats === '*/*') return true;
        const acceptedTypes = acceptedFormats.split(',').map(type => type.trim());

        // Handle mime types (e.g., image/*)
        if (acceptedTypes.some(type => type.endsWith('/*'))) {
            const generalTypes = acceptedTypes
                .filter(type => type.endsWith('/*'))
                .map(type => type.split('/')[0]);
            if (generalTypes.some(type => file.type.startsWith(type))) {
                return true;
            }
        }

        // Handle specific extensions (e.g., .pdf)
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        console.log("FILE EXTENSION", fileExtension)
        return acceptedTypes.some(type =>
            type.startsWith('.') ? type.toLowerCase() === fileExtension : file.type === type
        );
    };

    const handleUpload = async (file: File) => {
        try {
            // Size validation
            if (file.size > maxSize) {
                setError({
                    type: 'size',
                    message: `File size (${formatFileSize(file.size)}) exceeds the limit of ${formatFileSize(maxSize)}`
                });
                return;
            }

            // Format validation
            if (!validateFileType(file, accept)) {
                setError({
                    type: 'format',
                    message: `File type not supported. Accepted formats: ${accept}`
                });
                return;
            }

            setError(null);

            try {
                const response = await uploadMediaFile(file);
                onFileUpload({
                    id: response.data._id,
                    url: response.data.url,
                    name: file.name,
                    type: file.type
                });
            } catch (uploadError: any) {
                setError({
                    type: 'upload',
                    message: uploadError.message || 'Failed to upload file. Please try again.'
                });
            }
        } catch (error: any) {
            setError({
                type: 'other',
                message: error.message || 'An unexpected error occurred.'
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                const [firstRejection] = rejectedFiles;
                const [firstError] = firstRejection.errors;
                setError({
                    type: firstError.code === 'file-too-large' ? 'size' : 'format',
                    message: firstError.message
                });
                return;
            }

            if (acceptedFiles.length > 0) {
                await handleUpload(acceptedFiles[0]);
            }
        },
        accept: accept ? { [accept.includes('/') ? accept : 'application/*']: accept.split(',') } : undefined,
        maxSize,
        multiple: false
    });

    return (
        <div className={className}>
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-primary-500 bg-primary-50' : ''}
          ${isDragReject || error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-primary-500'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    {error ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : (
                        <UploadIcon className="w-6 h-6 text-gray-400" />
                    )}
                    <div className="text-sm text-gray-600">
                        {isDragActive ? (
                            <p>Drop the file here</p>
                        ) : error ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            <p>
                                Drag & drop or <span className="text-primary-500">browse</span>
                            </p>
                        )}
                    </div>
                    {!error && accept && accept !== '*/*' && (
                        <p className="text-xs text-gray-500">
                            Accepted formats: {accept}
                        </p>
                    )}
                    {!error && (
                        <p className="text-xs text-gray-500">
                            Maximum size: {formatFileSize(maxSize)}
                        </p>
                    )}
                </div>
                {isUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;