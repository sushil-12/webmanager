import { getHeroIcon } from '@/lib/HeroIcon';
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
  const removeOption = (index: number, optIndex: number, parentIndex?: number) => {
    const updatedFields = [...fields];

    if (parentIndex === undefined) {
      // Remove option in the main field
      updatedFields[index].options = updatedFields[index].options.filter((_, i) => i !== optIndex);
      setFields(updatedFields);
    } else {
      // Remove option in a nested field
      updatedFields[parentIndex].nestedFields![index].options = updatedFields[parentIndex].nestedFields![index].options.filter(
        (_, i) => i !== optIndex
      );
      setFields(updatedFields);
    }
  };
  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string,
    parentIndex?: number
  ) => {
    // Clone the fields array to maintain immutability
    const updatedFields = [...fields];
    if (parentIndex === undefined) {
      // Update the field options if no parentIndex is provided
      updatedFields[fieldIndex].options[optionIndex] = value;
    } else {
      // Update nested field options when a parentIndex is provided
      updatedFields[parentIndex].nestedFields![fieldIndex].options[optionIndex] = value;
    }
    // Set the new fields state, ensuring React detects the update and re-renders
    setFields(updatedFields);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-gray-50">
      <h1 className="font-bold text-lg text-gray-800 mb-4">Custom Fields</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => addField('text')}
          className="px-3 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
        >
          Add Text Field
        </button>
        <button
          onClick={() => addField('select')}
          className="px-3 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
        >
          Add Select Field
        </button>
        <button
          onClick={() => addField('checkbox')}
          className="px-3 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
        >
          Add Checkbox Field
        </button>
        <button
          onClick={() => addField('group')}
          className="px-3 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
        >
          Add Field Group (Nested)
        </button>
      </div>

      <div className="space-y-4">
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
            onRemoveOption={removeOption}
            onOptionChange={handleOptionChange}
          />
        ))}
      </div>

      {fields.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => {
              event?.preventDefault();
              setFieldData(fields);
            }}
            className="px-6 py-2 border border-primary-500 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all"
          >
            Confirm Form Fields
          </button>
        </div>
      )}
    </div>
  );
};

interface FieldComponentProps {
  isNestedField: boolean;
  field: Field;
  index: number;
  parentIndex?: number;
  onFieldChange: (index: number, key: keyof Field, value: string | boolean, parentIndex?: number) => void;
  onRemoveField: (index: number, parentIndex?: number) => void;
  onAddField: (type: string, parentIndex?: number) => void;
  onAddOption: (index: number, parentIndex?: number) => void;
  onRemoveOption: (index: number, optionIndex: number, parentIndex?: number) => void;
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
  onRemoveOption,
  onOptionChange,
}) => {
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800 capitalize">{field.field_type} Field</h3>
        <button
          onClick={() => onRemoveField(index, parentIndex)}
          className="text-red-500 hover:text-red-600 text-sm"
        >
          {getHeroIcon('MinusCircleIcon')}
        </button>
      </div>

      <div className={`flex gap-4 ${field.field_type === 'group' ? 'flex-col': ' items-center '}`}>
        <div className="flex gap-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Label:</span>
            <input
              type="text"
              value={field.label}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange(index, 'label', e.target.value, parentIndex)
              }
              className="mt-1 p-2 block text-sm w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Name:</span>
            <input
              type="text"
              value={field.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFieldChange(index, 'name', e.target.value, parentIndex)
              }
              className="mt-1 p-2 block text-sm  w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </label>



          {field.field_type === 'select' && (
            <div className="rounded-md ">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-gray-700 text-sm font-semibold">Options</h4>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddOption(index, parentIndex); // Add a new empty option
                  }}
                  className="p-0 text-primary-500 text-sm rounded-md mr-8"
                >
                  {getHeroIcon('PlusIcon')}
                </button>
              </div>

              <div className="space-y-2">
                {field.options.map((option, optIndex) => (
                  <div className='flex gap-2'>
                    <input
                      key={optIndex}
                      type="text"
                      value={option}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onOptionChange(index, optIndex, e.target.value, parentIndex)
                      }
                      className="mt-1 p-2 block text-sm w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onRemoveOption(index, optIndex, parentIndex);
                      }}
                      className="text-red-500 hover:text-red-600 transition-all"
                      title="Remove this option"
                    >
                      {getHeroIcon('MinusIcon')}
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          <div className="flex items-center gap-4 mt-5">
            {!isNestedField && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.repeatable}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(index, 'repeatable', e.target.checked, parentIndex)
                  }
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Repeatable</span>
              </label>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFieldChange(index, 'required', e.target.checked, parentIndex)
                }
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Required</span>
            </label>
          </div>
        </div>
        {field.field_type === 'group' && (
          <div className='w-full'>
            <div className="flex">
              <button
                onClick={() => onAddField('text', index)}
                className="px-3 py-1 mr-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all text-sm"
              >
                Add Nested Text Field
              </button>
              <button
                onClick={() => onAddField('select', index)}
                className="px-3 py-1  mr-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all text-sm"
              >
                Add Nested select Field
              </button>
              <button
                onClick={() => onAddField('checkbox', index)}
                className="px-3 py-1  mr-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all text-sm"
              >
                Add Nested checkbox Field
              </button>
            </div>

            <div className="mt-4 space-y-3">
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
                  onRemoveOption={onRemoveOption}
                  onOptionChange={onOptionChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;