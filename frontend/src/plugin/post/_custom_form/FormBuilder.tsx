import { getHeroIcon } from '@/lib/HeroIcon';
import { createSlug } from '@/lib/utils';
import React, { useState } from 'react';
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

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
    // @ts-ignore
    event.preventDefault();
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
      <div className="flex gap-2 flex-wrap justify-between mb-6">
        <h1 className="font-bold text-lg text-gray-800 mb-4">Custom Fields</h1>
        <div className="buttons flex gap-4">
          <button
            onClick={() => addField('text')}
            className="py-1 pt-3 px-4 border flex gap-1 border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
          >
            {getHeroIcon('PlusCircleIcon')} Text Field
          </button>
          <button
            onClick={() => addField('select')}
            className="py-1 pt-3 px-4 border flex gap-1 border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
          >
            {getHeroIcon('PlusCircleIcon')} Select Field
          </button>
          <button
            onClick={() => addField('checkbox')}
            className="py-1 pt-3 px-4 border flex gap-1 border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
          >
            {getHeroIcon('PlusCircleIcon')} Checkbox Field
          </button>
          <button
            onClick={() => addField('group')}
            className="py-1 pt-3 px-4 border flex gap-1 border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-all text-sm"
          >
            {getHeroIcon('PlusCircleIcon')} Field Group (Nested)
          </button>
        </div>
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
    <div className={`${field.field_type == 'group' ? 'group-custom-field' : 'group-normal-field'}`}>

      {field.field_type === 'group' && (
        <div>

          <Accordion placeholder={''} open={true}>
            <AccordionHeader placeholder={''}
              // onClick={() => toggleAccordion("customFields")}
              className="text-xl font-bold bg-primary-500 text-white px-4 rounded-md flex flex-col items-left group-header"
            >
              <div className="flex w-full justify-between">
              <h3 className="text-lg font-semibold text-white capitalize ">{field.field_type} Field</h3>
                <button
                  onClick={() => onRemoveField(index, parentIndex)}
                  className="text-white transition-colors text-sm flex gap-4 "
                >
                  {getHeroIcon('MinusCircleIcon')} Delete Field
                </button>
              </div>
              <div className="flex justify-start items-center gap-4 align-middle">
                <label className=" items-center gap-4 w-max">
                  <span className="text-sm font-medium text-white w-max">Edit Group Label</span>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => onFieldChange(index, 'label', e.target.value, parentIndex)}
                    className="mt-2 p-3 block text-sm text-black w-max border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </label>
                <label className="hidden">
                  <span className="hidden text-sm font-medium text-white">Name:</span>
                  <input
                    type="text"
                    value={createSlug(field.label, '_')}
                    onChange={(e) => onFieldChange(index, 'name', e.target.value, parentIndex)}
                    className="mt-2  p-3 hidden text-sm w-full border text-black  border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </label>
                <div className="flex items-center gap-6 mt-6">
                  {!isNestedField && (
                    <label className="flex items-center space-x-2 w-max">
                      <input
                        type="checkbox"
                        checked={field.repeatable}
                        onChange={(e) => onFieldChange(index, 'repeatable', e.target.checked, parentIndex)}
                        className="h-5 w-5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-white">Mark as Repeatable</span>
                    </label>
                  )}

                  <label className="flex items-center space-x-2 w-max mr-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => onFieldChange(index, 'required', e.target.checked, parentIndex)}
                      className="h-5 w-5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-white">Mark as Required</span>
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => onAddField('text', index)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md flex gap-2 hover:bg-green-700 transition duration-200 text-sm"
                  >
                    {getHeroIcon('PlusCircleIcon')}Text Field
                  </button>
                  <button
                    onClick={() => onAddField('select', index)}
                    className="px-4 py-2 bg-red-900 text-white rounded-md flex gap-2 hover:bg-red-700 transition duration-200 text-sm"
                  >
                    {getHeroIcon('PlusCircleIcon')} Select Field
                  </button>
                  <button
                    onClick={() => onAddField('checkbox', index)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md flex gap-2 hover:bg-yellow-700 transition duration-200 text-sm"
                  >
                    {getHeroIcon('PlusCircleIcon')} Checkbox Field
                  </button>
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="mt-6 space-y-6 ">
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
            </AccordionBody>
          </Accordion>


        </div>
      )}

      {field.field_type !== 'group' && (
        <div className='group-normal'>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-500 capitalize ">{field.field_type} Field</h3>
            <button
              onClick={() => onRemoveField(index, parentIndex)}
              className="text-red-600 hover:text-red-700 transition-colors text-sm"
            >
              {getHeroIcon('MinusCircleIcon')}
            </button>
          </div>
          <div className="flex gap-6 flex-col sm:flex-row">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <label className="block flex-1">
                <span className="text-sm font-medium text-black">Label:</span>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onFieldChange(index, 'label', e.target.value, parentIndex)}
                  className="mt-2 p-3 block text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </label>

              <label className=" flex-1 hidden">
                <span className="text-sm font-medium text-black">Name:</span>
                <input
                  type="text"
                  value={createSlug(field.label, '_')}
                  onChange={(e) => onFieldChange(index, 'name', e.target.value, parentIndex)}
                  className="mt-2 p-3 block text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </label>
            </div>

            {field.field_type === 'select' && (
              <div className="rounded-md mt-6">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-gray-700 text-sm font-semibold">Options</h4>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddOption(index, parentIndex);
                    }}
                    className="text-primary-500 hover:text-primary-600 transition-all p-2 text-sm rounded-md"
                  >
                    {getHeroIcon('PlusIcon')}
                  </button>
                </div>

                <div className="space-y-3 mt-4">
                  {field.options.map((option, optIndex) => (
                    <div className="flex items-center gap-4" key={optIndex}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => onOptionChange(index, optIndex, e.target.value, parentIndex)}
                        className="mt-2 p-3 block text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onRemoveOption(index, optIndex, parentIndex);
                        }}
                        className="text-red-500 hover:text-red-600 transition-all p-2"
                        title="Remove this option"
                      >
                        {getHeroIcon('MinusIcon')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-6 mt-6">
              {!isNestedField && (
                <label className="flex items-center space-x-2 w-max">
                  <input
                    type="checkbox"
                    checked={field.repeatable}
                    onChange={(e) => onFieldChange(index, 'repeatable', e.target.checked, parentIndex)}
                    className="h-5 w-5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Mark as Repeatable</span>
                </label>
              )}

              <label className="flex items-center space-x-2 w-max mr-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onFieldChange(index, 'required', e.target.checked, parentIndex)}
                  className="h-5 w-5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mark as Required</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default FormBuilder;