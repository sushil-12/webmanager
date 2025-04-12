declare module 'react-file-viewer' {
  interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (error: Error) => void;
    onClose?: () => void;
  }

  const FileViewer: React.FC<FileViewerProps>;
  export default FileViewer;
} 