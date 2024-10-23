import React, { useEffect, useState } from 'react';

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

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, postFormData, setPostFormData }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [formWithValueData, setFormWithValueData] = useState<Field[]>(fields);

    useEffect(() => {
        const initialData: { [key: string]: any } = {};
        fields.forEach((field) => {
            if (field.repeatable) {
                initialData[field.name] = Array.isArray(field.value) ? field.value : [{}];
            } else {
                initialData[field.name] = field.value || '';
            }
        });
        setFormData(initialData);
    }, [fields]);

    useEffect(() => {
        const updatedFormWithValueData = fields.map((field) => {
            if (field.field_type === 'group') {
                // Get nested values or set default structure
                const nestedValues = formData[field.name] || (field.repeatable ? [{}] : {});
                // Ensure nestedValues is always an array
                const updatedNestedValues = Array.isArray(nestedValues) ? nestedValues : [nestedValues];
    
                const updatedNestedFields = field.nestedFields?.map((nestedField) => {
                    // Retrieve values for the nested field from all nested data
                    const valueArray = updatedNestedValues.map((nestedData) => nestedData[nestedField.name] || '');
                    return { ...nestedField, value: valueArray }; // Add the value array to the nested field
                });
    
                console.log("LATEST VALUE FROM GROUP", updatedNestedFields); // Check the updated nested fields
                return { ...field, nestedFields: updatedNestedFields }; // Return updated group fields
            }
    
            // For non-group fields, ensure the latest value is used
            const latestValue = Array.isArray(formData[field.name]) 
                ? formData[field.name].slice(-1)[0] 
                : formData[field.name] || '';
    
            return { ...field, value: latestValue };
        });
    
        setFormWithValueData(updatedFormWithValueData);
    }, [formData, fields]);

    const handleInputChange = (
        name: string, 
        nestedFieldName: string, 
        value: any, 
        isRepeatable: boolean, 
        index: number = 0, 
        field_type: string
    ) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData };

            if (field_type === 'group') {
                const groupData = updatedData[name] || (isRepeatable ? [{}] : {});
                const updatedNestedData = Array.isArray(groupData) ? [...groupData] : [groupData];

                if (!updatedNestedData[index]) {
                    updatedNestedData[index] = {};
                }

                updatedNestedData[index][nestedFieldName] = value;
                updatedData[name] = updatedNestedData;
            } else {
                updatedData[name] = value; // Directly set for non-group fields
            }

            return updatedData; 
        });
    };

    const addGroupField = (field: Field) => {
        const newFieldValue = field.nestedFields?.reduce((acc: any, nestedField: Field) => {
            acc[nestedField.name] = '';
            return acc;
        }, {});

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

    useEffect(() => {
        if (setPostFormData) {
            console.log("FOMR", formWithValueData)
            setPostFormData(formWithValueData);
        }
    }, [formWithValueData, setPostFormData]);

    const renderField = (field: Field) => {
        if (field.field_type === 'group') {
            const nestedData = formData[field.name] || (field.repeatable ? [{}] : {});
            const nestedDataArray = Array.isArray(nestedData) ? nestedData : [nestedData];

            return (
                <div className="mb-4 border border-gray-300 rounded-md p-4" key={field.name}>
                    <h3 className="font-semibold text-lg mb-2">{field.label}</h3>
                    {nestedDataArray.map((nestedData: any, index: number) => (
                        <div key={index} className="mb-2">
                            {field.nestedFields?.map((nestedField) => {
                                const handleNestedChange = (value: any) => {
                                    handleInputChange(field.name, nestedField.name, value, true, index, field.field_type);
                                };

                                switch (nestedField.field_type) {
                                    case 'text':
                                        return (
                                            <div key={nestedField.name}>
                                                <label className="block text-sm">{nestedField.label}</label>
                                                <input
                                                    type="text"
                                                    name={nestedField.name}
                                                    value={nestedData[nestedField.name] || ''}
                                                    required={nestedField.required}
                                                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                                    onChange={(e) => handleNestedChange(e.target.value)}
                                                />
                                            </div>
                                        );

                                    case 'select':
                                        return (
                                            <div key={nestedField.name}>
                                                <label className="block text-sm">{nestedField.label}</label>
                                                <select
                                                    name={nestedField.name}
                                                    value={nestedData[nestedField.name] || ''}
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

                                    case 'checkbox':
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
                                    className="text-red-500 hover:underline"
                                >
                                    Remove {field.label}
                                </button>
                            )}
                        </div>
                    ))}
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
        }

        return (
            <div className="mb-4" key={field.name}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    required={field.required}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    onChange={(e) => handleInputChange(field.name, '', e.target.value, false, 0, field.field_type)}
                />
            </div>
        );
    };

    return (
        <div>
            {fields.map((field) => renderField(field))}
        </div>
    );
};

export default DynamicForm;