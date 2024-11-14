import React, { useState, ChangeEvent } from 'react';

interface Field {
  field_type: string;
  label: string;
  name: string;
  options: string[];
  repeatable: boolean;
  required: boolean;
  nestedFields?: Field[]; // For nested fields
}

interface FormBuilderSchema {
  setFieldData: any;
  fieldData: any;
}

const FormBuilder: React.FC<FormBuilderSchema> = ({ setFieldData, fieldData }) => {
  const [fields, setFields] = useState<Field[]>(fieldData);
  const addField = (field_type: string, parentIndex?: number) => {
    const newField: Field = {
      field_type,
      label: '',
      name: '',
      options: [],
      repeatable: false,
      required: false,
      nestedFields: field_type === 'group' ? [] : undefined, // Support nested fields for 'group'
    };

    if (parentIndex === undefined) {
      setFields([...fields, newField]);
    } else {
      const updatedFields = [...fields];
      updatedFields[parentIndex].nestedFields?.push(newField);
      setFields(updatedFields);
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof Field,
    value: string | boolean,
    parentIndex?: number
  ) => {
    const updatedFields = [...fields];
    if (parentIndex === undefined) {
      // @ts-ignore
      updatedFields[index][key] = value as any;
      setFields(updatedFields);
    } else {
      // @ts-ignore
      updatedFields[parentIndex].nestedFields![index][key] = value as any;
      setFields(updatedFields);
    }
  };

  const removeField = (index: number, parentIndex?: number) => {
    event?.preventDefault();
    const updatedFields = [...fields];
    if (parentIndex === undefined) {
      updatedFields.splice(index, 1);
    } else {
      updatedFields[parentIndex].nestedFields!.splice(index, 1);
    }
    setFields(updatedFields);
  };

  const addOption = (index: number, parentIndex?: number) => {
    event?.preventDefault();
    const updatedFields = [...fields];
    if (parentIndex === undefined) {
      updatedFields[index].options.push('');
      setFields(updatedFields);
    } else {
      updatedFields[parentIndex].nestedFields![index].options.push('');
      setFields(updatedFields);
    }
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string,
    parentIndex?: number
  ) => {

    const updatedFields = [...fields];
    if (parentIndex === undefined) {
      updatedFields[fieldIndex].options[optionIndex] = value;
      setFields(updatedFields);
    } else {
      updatedFields[parentIndex].nestedFields![fieldIndex].options[optionIndex] = value;
      setFields(updatedFields);
    }
  };

  return (
    <div className="border rounded-md p-2">
      <h1 className="font-bold">Custom Fields</h1>

      <div className="flex gap-2 mb-6 mt-2">
        <button
          onClick={() => addField('text')}
          className="rounded-md border border-primary-500 text-primary-500 py-1 px-4 text-sm"
        >
          Add Text Field
        </button>
        <button
          onClick={() => addField('select')}
          className="rounded-md border border-primary-500 text-primary-500 py-1 px-4 text-sm "
        >
          Add Select Field
        </button>
        <button
          onClick={() => addField('checkbox')}
          className="rounded-md border border-primary-500 text-primary-500 py-1 px-4 text-sm"
        >
          Add Checkbox Field
        </button>
        <button
          onClick={() => addField('group')}
          className="rounded-md border border-primary-500 text-primary-500 py-1 px-4 text-sm"
        >
          Add Field Group (Nested)
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <FieldComponent
          isNestedField={false}
            key={index}
            field={field}
            index={index}
            onFieldChange={handleFieldChange}
            onRemoveField={removeField}
            onAddField={addField}
            onAddOption={addOption}
            onOptionChange={handleOptionChange}
          />
        ))}
      </div>

        {fields.length > 0 && (
           <div className="mt-6">
           <button
             onClick={() => { event?.preventDefault(); setFieldData(fields) }}
             className="px-6 py-2 border border-primary-500"
           >
             Confirm Form Fields
           </button>
         </div>
        )}
    </div>
  );
};

interface FieldComponentProps {
  isNestedField: boolean,
  field: Field;
  index: number;
  parentIndex?: number;
  onFieldChange: (index: number, key: keyof Field, value: string | boolean, parentIndex?: number) => void;
  onRemoveField: (index: number, parentIndex?: number) => void;
  onAddField: (type: string, parentIndex?: number) => void;
  onAddOption: (index: number, parentIndex?: number) => void;
  onOptionChange: (fieldIndex: number, optionIndex: number, value: string, parentIndex?: number) => void;
}

const FieldComponent: React.FC<FieldComponentProps> = ({
  isNestedField,
  field,
  index,
  parentIndex,
  onFieldChange,
  onRemoveField,
  onAddField,
  onAddOption,
  onOptionChange,
}) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-md space-y-4 border border-gray-300">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg capitalize">{field.field_type} Field</h3>
        <button
          onClick={() => onRemoveField(index, parentIndex)}
          className="text-red-500 hover:text-red-600 font-bold"
        >
          Remove
        </button>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Label:</span>
          <input
            type="text"
            value={field.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFieldChange(index, 'label', e.target.value, parentIndex)
            }
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700">Name:</span>
          <input
            type="text"
            value={field.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFieldChange(index, 'name', e.target.value, parentIndex)
            }
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </label>

        {field.field_type === 'select' && (
          <div>
            <button
              onClick={() => onAddOption(index, parentIndex)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
            >
              Add Option
            </button>
            {field.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={option}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onOptionChange(index, optIndex, e.target.value, parentIndex)
                }
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4">
          {!isNestedField && (
            <label className="flex items-center">
            <span className="block text-sm font-medium text-gray-700 mr-2">Repeatable:</span>
            <input
              type="checkbox"
              checked={field.repeatable}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange(index, 'repeatable', e.target.checked, parentIndex)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>
          )}

          <label className="flex items-center">
            <span className="block text-sm font-medium text-gray-700 mr-2">Required:</span>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange(index, 'required', e.target.checked, parentIndex)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </label>
        </div>

        {/* Render nested fields if it's a 'group' */}
        {field.field_type === 'group' && (
          <>
            <h4 className="font-semibold text-md mt-4">Nested Fields</h4>
            <div className="space-y-4">
              {field.nestedFields?.map((nestedField, nestedIndex) => (
                <FieldComponent
                  isNestedField={true}
                  key={nestedIndex}
                  field={nestedField}
                  index={nestedIndex}
                  parentIndex={index}
                  onFieldChange={onFieldChange}
                  onRemoveField={onRemoveField}
                  onAddField={onAddField}
                  onAddOption={onAddOption}
                  onOptionChange={onOptionChange}
                />
              ))}
            </div>
            <button
              onClick={() => onAddField('text', index)}
              className="mt-2 px-4 py-2 bg-primary-500 mr-2 text-white rounded "
            >
              Add Nested Text Field
            </button>
            <button
              onClick={() => onAddField('select', index)}
              className="mt-2 px-4 py-2  bg-primary-500 mr-2 text-white rounded "
            >
              Add Nested Select Field
            </button>
            <button
              onClick={() => onAddField('checkbox', index)}
              className="mt-2 px-4 py-2  bg-primary-500 text-white rounded "
            >
              Add Nested Checkbox Field
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;