import { useUploadFiles } from '@/lib/react-query/queriesAndMutations';
import { useState, useEffect } from 'react';

interface UploadStatus {
  inProgress: boolean;
  success: boolean | null;
  error: string | null;
}

const UploadMediaForm: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutateAsync: uploadMediaFile, isPending: isLoading } = useUploadFiles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    inProgress: false,
    success: null,
    error: null,
  });
  console.log(isLoading);
  
  useEffect(() => {
    const uploadNextFile = async () => {
      if (currentIndex < files.length) {
        try {
          setIsModalOpen(true);
          setUploadStatus({ inProgress: true, success: null, error: null });

          const formData = new FormData();
          formData.append('file', files[currentIndex]);

          const response =  await uploadMediaFile(files[currentIndex]);

          if (response.ok) {
            setUploadStatus({ inProgress: false, success: true, error: null });
            setCurrentIndex(currentIndex + 1);

            if (currentIndex === files.length - 1) {
              // Reset state after uploading the last file
              setFiles([]);
              setCurrentIndex(0);
            }
          } else {
            throw new Error('Upload failed');
          }
        } catch (error:any) {
          console.error('Error uploading file:', error);
          setUploadStatus({ inProgress: false, success: false, error: error.message });
        }
      }
    };

    uploadNextFile();
  }, [files, currentIndex]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: '2px dashed #ccc', padding: '20px', marginTop: '20px' }}
      >
        <p>Drag and drop files here</p>
      </div>
      {files.length > 0 && (
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}{' '}
                <button onClick={() => handleRemoveFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {uploadStatus.inProgress && <p>Uploading...</p>}
            {uploadStatus.success && <p>Upload successful!</p>}
            {uploadStatus.error && <p>Error: {uploadStatus.error}</p>}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMediaForm;
