import { getHeroIcon } from "@/lib/HeroIcon";
import React, { useEffect, useState } from "react";

interface Field {
  field_type: string;
  label: string;
  name: string;
  options?: string[];
  value?: string | string[] | { [key: string]: any };
  repeatable: boolean;
  required: boolean;
  nestedFields?: Field[];
}

interface DynamicFormProps {
  fields: Field[];
  postFormData?: any;
  setPostFormData?: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  postFormData,
  setPostFormData,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formWithValueData, setFormWithValueData] = useState<Field[]>(fields);

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

  const renderField = (field: Field) => {
    // Handle group fields (nested fields)
    if (field.field_type === "group") {
      const singleNestedData =
        formData[field.name] || (field.repeatable ? [{}] : {});
      const nestedDataArray = Array.isArray(singleNestedData)
        ? singleNestedData
        : [singleNestedData];

      return (
        <div className={`${field.field_type === "group" ? 'group_field': ''} mb-4`} key={field.name}>
          <h3 className="font-semibold text-lg mb-2 capitalize">{field.label}</h3>
          {nestedDataArray.map((nestedData: any, index: number) => (
            <div key={index} className=" flex gap-1 w-full relative mb-8">
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
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                          onChange={(e) => handleNestedChange(e.target.value)}
                        />
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
              {field.repeatable && (
                <button
                  type="button"
                  onClick={() => removeGroupField(field.name, index)}
                  className="text-red-500 absolute -top-3 right-0 flex gap-2 hover:underline justify-end text-right  my-3"
                >
                  {getHeroIcon('TrashIcon')} 
                </button>
              )}
            </div>
          ))}
          {field.repeatable && (
            <button
              type="button"
              onClick={() => addGroupField(field)}
              className="text-blue-500 float-end hover:underline"
            >
              Add another {field.label}
            </button>
          )}
        </div>
      );
    }

    // Handle non-group fields (text, select, checkbox)
    return (
      <div className="mb-4" key={field.name}>
        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
        {(Array.isArray(formData[field.name]) ? formData[field.name] : []).map(
          (value: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              {field.field_type === "text" && (
                <input
                  type="text"
                  name={field.name}
                  value={value}
                  required={field.required}
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
              {field.repeatable && (
                <button
                  type="button"
                  onClick={() => removeGroupField(field.name, index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          )
        )}
        {field.repeatable && (
          <button
            type="button"
            onClick={() => addGroupField(field)}
            className="text-blue-500 hover:underline"
          >
            Add another {field.label}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className=" shadow-lg rounded-lg w-full flex flex-col gap-6 ">
      {fields.map((field) => (
        <div
          key={field.name}
          className=" border  rounded-lg p-4 bg-white shadow-sm"
        >
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
