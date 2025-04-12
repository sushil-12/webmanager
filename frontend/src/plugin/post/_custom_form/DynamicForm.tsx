import { getHeroIcon } from "@/lib/HeroIcon";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FileViewer from 'react-file-viewer';
import { FileIcon } from "lucide-react";
import { MAX_FILE_SIZE } from "@/config/constants";
import MediaPicker from "@/components/shared/MediaPicker";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
const getFieldIcon = (fieldType: string): string => {
  switch (fieldType) {
    case 'text':
      return 'DocumentTextIcon';
    case 'textarea':
      return 'DocumentDuplicateIcon';
    case 'select':
      return 'ListBulletIcon';
    case 'checkbox':
      return 'CheckIcon';
    case 'number':
      return 'HashtagIcon';
    case 'date':
      return 'CalendarIcon';
    case 'email':
      return 'EnvelopeIcon';
    case 'phone':
      return 'PhoneIcon';
    case 'url':
      return 'LinkIcon';
    case 'group':
      return 'FolderIcon';
    case 'file':
      return 'DocumentIcon';
    default:
      return 'DocumentTextIcon';
  }
};
interface Field {
  field_type: string;
  label: string;
  name: string;
  options?: string[];
  value?: string | string[] | { [key: string]: any };
  repeatable: boolean;
  required: boolean;
  nestedFields?: Field[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  rows?: number;
  pattern?: string;
}

interface DynamicFormProps {
  fields: Field[];
  postFormData?: any;
  setPostFormData?: any;
}

interface PreviewState {
  isOpen: boolean;
  type: 'image' | 'pdf' | 'document' | null;
  url: string | null;
}


const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  postFormData,
  setPostFormData,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formWithValueData, setFormWithValueData] = useState<Field[]>(fields);
  const [preview, setPreview] = useState<PreviewState>({
    isOpen: false,
    type: null,
    url: null,
  });
  const [fileError, setFileError] = useState<string | null>(null);
  // const { mutateAsync: uploadMediaFile, isPending: isUploading } = useUploadFiles();
  console.log(fileError, "fileError")
  console.log(postFormData)
  // Initialize form data when fields change
  useEffect(() => {
    const initialData: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.repeatable) {
        initialData[field.name] = Array.isArray(field.value) ? field.value : [""];
      } else {
        initialData[field.name] = field.value || [""];
      }
    });
    setFormData(initialData);
  }, [fields]);

  // Update the form data with the correct values
  useEffect(() => {
    const updatedFormWithValueData = fields.map((field) => {
      if (field.repeatable) {
        return {
          ...field,
          value: formData[field.name] ? formData[field.name] : [],
        };
      }
      return { ...field, value: formData[field.name] || "" };
    });
    setFormWithValueData(updatedFormWithValueData);
  }, [formData, fields]);

  const handleInputChange = (
    name: string,
    value: any,
    isRepeatable: boolean,
    index: number = 0
  ) => {
    console.log(isRepeatable, "isRepeatable")
    setFormData((prevData) => {
      const updatedArray = [...(prevData[name] || [])];
      updatedArray[index] = value;
      return { ...prevData, [name]: updatedArray };
    });
  };

  const addGroupField = (field: Field) => {
    const newFieldValue = field.nestedFields?.reduce(
      (acc: any, nestedField: Field) => {
        acc[nestedField.name] = "";
        return acc;
      },
      {}
    );

    setFormData((prev) => ({
      ...prev,
      [field.name]: [...(prev[field.name] || []), newFieldValue],
    }));
  };

  const removeGroupField = (fieldName: string, index: number) => {
    event?.preventDefault();
    setFormData((prev) => {
      const newData = [...(prev[fieldName] || [])];
      newData.splice(index, 1);
      return { ...prev, [fieldName]: newData };
    });
  };

  // Effect to set post data when the form values change
  useEffect(() => {
    if (setPostFormData) {
      setPostFormData(formWithValueData); // Pass form data to parent when ready
    }
  }, [formWithValueData, setPostFormData]);



  const handleFileViewerError = (e: Error) => {
    console.error('Error in file viewer:', e);
    setFileError('Failed to load file. Please try again.');
  };

  const handleCloseFileViewer = () => {
    setPreview(prev => ({ ...prev, isOpen: false }));
    setFileError(null);
  };


  const renderFileInput = (field: Field, index: number, handleInputChange: Function) => {
    const getAcceptedFormats = (fieldType: string, accept?: string) => {
      if (accept) return accept.split(',').map(ext => ext.trim());
      if (fieldType === 'image') return ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      if (fieldType === 'file') return ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
      return [];
    };

    const fieldValue = field.repeatable
      ? (Array.isArray(field.value) ? field.value[index] : null)
      : field.value?.at(0);


    return (
      <div>
        <MediaPicker
          filterExtension={getAcceptedFormats(field.field_type, field.placeholder)}
          maxSize={MAX_FILE_SIZE}
          className="w-full"
          defaultValue={fieldValue}
          onSelect={(media) => {
            const fileData = {
              file: null,
              preview: media.url,
              type: media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' :
                media.url.match(/\.pdf$/i) ? 'pdf' : 'document',
              name: media.alt_text,
              url: media.url
            };
            handleInputChange(field.name, fileData, field.repeatable, index);
          }}
        />
      </div>
    );
  };

  const renderField = (field: Field) => {
    // Handle group fields (nested fields)
    console.log(field, "field")
    if (field.field_type === "group") {
      const singleNestedData =
        formData[field.name] || (field.repeatable ? [{}] : {});
      const nestedDataArray = Array.isArray(singleNestedData)
        ? singleNestedData
        : [singleNestedData];

      return (
        <div className="group-field" key={field.name}>
          <Accordion placeholder={''} open={true}>
            <AccordionHeader
              placeholder={''}
              className="bg-info border-b border-gray-200 px-4 py-3 flex justify-between items-center cursor-pointer transition-colors text-white"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium  flex items-center gap-2">
                  {getHeroIcon('FolderIcon')} {field.label}
                </h3>
                {field.required && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-right float-right">
                {field.repeatable && (
                  <button
                    type="button"
                    onClick={() => addGroupField(field)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    {getHeroIcon('PlusIcon')} Add
                  </button>
                )}
              </div>
            </AccordionHeader>

            <AccordionBody className="p-4 bg-white">
              <div className="space-y-4">
                {nestedDataArray.map((nestedData: any, index: number) => (
                  <div key={index} className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {field.nestedFields?.map((nestedField) => {
                        const handleNestedChange = (value: any) => {
                          handleInputChange(
                            field.name,
                            { ...nestedData, [nestedField.name]: value },
                            true,
                            index
                          );
                        };

                        switch (nestedField.field_type) {
                          case "text":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <input
                                  type="text"
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  placeholder={nestedField.placeholder}
                                  pattern={nestedField.pattern}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "textarea":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <textarea
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  placeholder={nestedField.placeholder}
                                  rows={nestedField.rows || 4}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "number":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <input
                                  type="number"
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  min={nestedField.min}
                                  max={nestedField.max}
                                  step={nestedField.step}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "date":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <input
                                  type="date"
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "email":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <input
                                  type="email"
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  placeholder={nestedField.placeholder}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "password":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <input
                                  type="password"
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  placeholder={nestedField.placeholder}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                />
                              </div>
                            );

                          case "file":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                {renderFileInput(nestedField, index, handleNestedChange)}
                              </div>
                            );

                          case "select":
                            return (
                              <div key={nestedField.name}>
                                <label className="block text-sm">{nestedField.label}</label>
                                <select
                                  name={nestedField.name}
                                  value={nestedData[nestedField.name] || ""}
                                  required={nestedField.required}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                  onChange={(e) => handleNestedChange(e.target.value)}
                                >
                                  <option value="" disabled>Select an option</option>
                                  {nestedField.options?.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );

                          case "checkbox":
                            return (
                              <div key={nestedField.name} className="flex items-center">
                                <input
                                  type="checkbox"
                                  name={nestedField.name}
                                  checked={nestedData[nestedField.name] || false}
                                  className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  onChange={(e) => handleNestedChange(e.target.checked)}
                                />
                                <label className="ml-2 text-sm">{nestedField.label}</label>
                              </div>
                            );

                          default:
                            return null;
                        }
                      })}
                    </div>
                    {field.repeatable && (
                      <button
                        type="button"
                        onClick={() => removeGroupField(field.name, index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      >
                        {getHeroIcon('XIcon')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </AccordionBody>
          </Accordion>
        </div>
      );
    }

    // Handle non-group fields
    return (
      <div className="mb-0" key={field.name}>
        <Accordion placeholder={''} open={true}>
          <AccordionHeader
            placeholder={''}
            className="bg-info border-b border-gray-200 px-4 py-3 flex justify-between items-center cursor-pointer text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                {getHeroIcon(getFieldIcon(field.field_type))} {field.label}
              </h3>
              {field.required && (
                <span className="text-xs text-red-500">*</span>
              )}
            </div>
            <div className="flex items-center gap-2 absolute right-0">
              {field.repeatable && (
                <button
                  type="button"
                  onClick={() => addGroupField(field)}
                  className="text-xs text-white-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors mr-2"
                >
                  {getHeroIcon('PlusIcon')} Add another row
                </button>
              )}
            </div>
          </AccordionHeader>

          <AccordionBody className="p-4 bg-white">
            <div className="space-y-4">
              {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map(
                (value: any, index: number) => (
                  <div key={index} className="relative">
                    {field.repeatable && (
                      <button
                        type="button"
                        onClick={() => removeGroupField(field.name, index)}
                        className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      >
                        {getHeroIcon('TrashIcon')}
                      </button>
                    )}
                    {field.field_type === "file" && (
                      <div className="space-y-2">
                        {renderFileInput(field, index, handleInputChange)}
                      </div>
                    )}
                    {field.field_type === "text" && (
                      <input
                        type="text"
                        name={field.name}
                        value={value}
                        required={field.required}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "textarea" && (
                      <textarea
                        name={field.name}
                        value={value}
                        required={field.required}
                        placeholder={field.placeholder}
                        rows={field.rows || 4}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "number" && (
                      <input
                        type="number"
                        name={field.name}
                        value={value}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "date" && (
                      <input
                        type="date"
                        name={field.name}
                        value={value}
                        required={field.required}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "email" && (
                      <input
                        type="email"
                        name={field.name}
                        value={value}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "password" && (
                      <input
                        type="password"
                        name={field.name}
                        value={value}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      />
                    )}
                    {field.field_type === "select" && (
                      <select
                        name={field.name}
                        value={value}
                        required={field.required}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        onChange={(e) => handleInputChange(field.name, e.target.value, true, index)}
                      >
                        <option value="" disabled>Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    {field.field_type === "checkbox" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={value || false}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onChange={(e) => handleInputChange(field.name, e.target.checked, true, index)}
                        />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </AccordionBody>
        </Accordion>
      </div>
    );
  };

  return (
    <>
      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {fields.map((field) => (
            <div key={field.name}>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

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
            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gray-50 p-6">
              <div className="bg-white rounded-lg shadow h-full overflow-hidden">
                {preview.type && preview.url && (
                  <div className="h-full w-full">
                    <div className="max-h-[80vh] overflow-auto"> {/* NEW WRAPPER */}
                      <FileViewer
                        fileType={preview.type === 'pdf' ? 'pdf' : preview.type === 'image' ? 'png' : 'docx'}
                        filePath={preview.url}
                        onError={handleFileViewerError}
                        onClose={handleCloseFileViewer}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicForm;
