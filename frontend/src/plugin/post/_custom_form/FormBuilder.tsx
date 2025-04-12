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
  placeholder?: string;
  min?: string;
  max?: string;
  accept?: string;
}

interface FormBuilderSchema {
  setFieldData: any;
  fieldData: any;
}

const FormBuilder: React.FC<FormBuilderSchema> = ({ setFieldData, fieldData }) => {
  console.log(fieldData, "FIELD DATA");
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
    console.log(updatedFields, "UPDATED FIELDS SUSH");
    if (parentIndex === undefined) {
      // @ts-ignore
      updatedFields[index][key] = value as any;
      // If label is being changed, update the name field automatically
      if (key === 'label') {
        updatedFields[index].name = createSlug(value as string, '_');
      }
      setFields(updatedFields);
    } else {
      // @ts-ignore
      updatedFields[parentIndex].nestedFields![index][key] = value as any;
      // If label is being changed in nested field, update the name field automatically
      if (key === 'label') {
        updatedFields[parentIndex].nestedFields![index].name = createSlug(value as string, '_');
      }
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
    <div className="border rounded-lg p-3 shadow-sm from-white to-gray-50 ">
      <div className="flex flex-col gap-2 justify-between mb-4 bg-gray-50 p-4 rounded-md">
        <h1 className="font-semibold text-sm ">Custom Fields<small className='text-xs text-gray-500 ml-2 underline'>Note: We are using keys for the fields mapping, so you can't change the keys</small></h1>
        <div className="w-full buttons grid grid-cols-2 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
          <button
            onClick={() => addField('text')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('DocumentTextIcon')} Text
          </button>
          <button
            onClick={() => addField('textarea')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('DocumentDuplicateIcon')} Textarea
          </button>
          <button
            onClick={() => addField('select')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('ListBulletIcon')} Select
          </button>
          <button
            onClick={() => addField('checkbox')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('CheckIcon')} Checkbox
          </button>
          <button
            onClick={() => addField('number')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('HashtagIcon')} Number
          </button>
          <button
            onClick={() => addField('date')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('CalendarIcon')} Date
          </button>
          <button
            onClick={() => addField('email')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('EnvelopeIcon')} Email
          </button>
          <button
            onClick={() => addField('phone')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('PhoneIcon')} Phone
          </button>
          <button
            onClick={() => addField('url')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('LinkIcon')} URL
          </button>
          <button
            onClick={() => addField('file')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('DocumentIcon')} File
          </button>
          <button
            onClick={() => addField('group')}
            className="py-1.5 px-2 border flex items-center gap-1.5 border-gray-200 bg-white text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all text-xs shadow-sm"
          >
            {getHeroIcon('FolderIcon')} Field Group
          </button>
        </div>
      </div>

      <div className="space-y-2">
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
        <div className="mt-4">
          <button
            onClick={() => {
              event?.preventDefault();
              setFieldData(fields);
            }}
            className="px-4 py-1.5 border border-primary-500 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all text-xs shadow-sm"
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
        <div className="border border-gray-200 rounded-lg shadow-sm">
          <Accordion placeholder={''} open={true}>
            <AccordionHeader
              placeholder={''}
              className="bg-white border-b border-gray-200 p-3 flex justify-between items-center cursor-pointer transition bg-info from-blue-50 to-blue-100 text-white"
            >
              <h3 className="text-sm font-medium capitalize flex items-center gap-1.5">
                {getHeroIcon('FolderIcon')} {field.field_type} Field
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemoveField(index, parentIndex)}
                  className="hover:text-red-500 absolute right-5 transition-colors text-xs flex items-center gap-1"
                >
                  {getHeroIcon('MinusCircleIcon')} Delete
                </button>
                {/* @ts-ignore */}
                
              </div>
            </AccordionHeader>

            <AccordionBody className="p-3 space-y-3 bg-gray-50 rounded-b-lg">
              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className='flex gap-1'>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Group Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => onFieldChange(index, 'label', e.target.value, parentIndex)}
                    className="p-1.5 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                  />
                </div>
                <div className="hidden">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => onFieldChange(index, 'name', e.target.value, parentIndex)}
                    className="p-1.5 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                  />
                </div>
                {/* Checkboxes */}
                <div className="flex items-center gap-4">
                  {!isNestedField && (
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={field.repeatable}
                        onChange={(e) => onFieldChange(index, 'repeatable', e.target.checked, parentIndex)}
                        className="h-3.5 w-3.5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-700">Repeatable</span>
                    </label>
                  )}
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => onFieldChange(index, 'required', e.target.checked, parentIndex)}
                      className="h-3.5 w-3.5 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-xs text-gray-700">Required</span>
                  </label>
                </div>
              </div>
              <h6 className='text-xs font-medium text-gray-700'>Add Field</h6>
              {/* Field Type Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-2">
                {[
                  { type: 'text', icon: 'DocumentTextIcon', label: 'Text' },
                  { type: 'textarea', icon: 'DocumentDuplicateIcon', label: 'Textarea' },
                  { type: 'select', icon: 'ListBulletIcon', label: 'Select' },
                  { type: 'checkbox', icon: 'CheckIcon', label: 'Checkbox' },
                  { type: 'number', icon: 'HashtagIcon', label: 'Number' },
                  { type: 'date', icon: 'CalendarIcon', label: 'Date' },
                  { type: 'email', icon: 'EnvelopeIcon', label: 'Email' },
                  { type: 'phone', icon: 'PhoneIcon', label: 'Phone' },
                  { type: 'url', icon: 'LinkIcon', label: 'URL' },
                  { type: 'file', icon: 'DocumentIcon', label: 'File' },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => onAddField(type, index)}
                    className="px-2 py-1 bg-white text-gray-700 rounded-md flex items-center gap-1 hover:bg-gray-100 transition-colors text-xs border border-gray-200 shadow-sm"
                  >
                    {getHeroIcon(icon)} {label}
                  </button>
                ))}
              </div>

              {/* Nested Fields */}
              <div className="space-y-2 bg-gray-50 rounded-b-lg p-3">
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <Accordion placeholder={''} open={true}>
            <AccordionHeader placeholder={''}
              className="bg-info from-blue-50 to-blue-100 border-b border-gray-200 px-3 py-2 text-white"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-medium capitalize flex items-center gap-1.5">
                    {getHeroIcon(getFieldIcon(field.field_type))} {field.field_type} Field
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveField(index, parentIndex)}
                    className="hover:text-red-500 transition-colors"
                  >
                    {getHeroIcon('MinusCircleIcon')}
                  </button>
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="p-3 bg-gray-50 flex flex-row gap-2">
                {/* Main Fields Row */}
                <div className={`grid grid-cols-3 sm:grid-cols-${field.field_type === 'text' || field.field_type === 'textarea' ? '3' : '4'} gap-2 mb-2  mr-2`}>
                  <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => onFieldChange(index, 'label', e.target.value, parentIndex)}
                      className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                    />
                  </div>
                  <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Slug</label>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => onFieldChange(index, 'name', e.target.value, parentIndex)}
                      className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                    />
                  </div>
                  {(field.field_type === 'text' || field.field_type === 'textarea') && (
                    <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => onFieldChange(index, 'placeholder', e.target.value, parentIndex)}
                        className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                      />
                    </div>
                  )}
                  {field.field_type === 'number' && (
                    <>
                      <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Min</label>
                        <input
                          type="number"
                          value={field.min || ''}
                          onChange={(e) => onFieldChange(index, 'min', e.target.value, parentIndex)}
                          className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        />
                      </div>
                      <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Max</label>
                        <input
                          type="number"
                          value={field.max || ''}
                          onChange={(e) => onFieldChange(index, 'max', e.target.value, parentIndex)}
                          className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        />
                      </div>
                    </>
                  )}
                  {field.field_type === 'file' && (
                    <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm">
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Formats</label>
                      <input
                        type="text"
                        value={field.placeholder || '.pdf,.ppt,.pptx,.doc,.docx'}
                        onChange={(e) => onFieldChange(index, 'placeholder', e.target.value, parentIndex)}
                        className="p-1 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        placeholder=".pdf,.ppt,.pptx,.doc,.docx"
                      />
                    </div>
                  )}
                </div>

                {/* Select Options */}
                {field.field_type === 'select' && (
                  <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[10px] font-medium text-gray-700">Options</h4>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onAddOption(index, parentIndex);
                        }}
                        className="text-primary-500 hover:text-primary-600 transition-colors p-0.5"
                      >
                        {getHeroIcon('PlusIcon')}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {field.options.map((option, optIndex) => (
                        <div className="flex items-center gap-1" key={optIndex}>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => onOptionChange(index, optIndex, e.target.value, parentIndex)}
                            className="p-1 text-xs flex-1 border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              onRemoveOption(index, optIndex, parentIndex);
                            }}
                            className="text-gray-500 hover:text-red-500 transition-colors p-0.5"
                            title="Remove option"
                          >
                            {getHeroIcon('MinusIcon')}
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
                {/* Checkboxes */}
                <div className="flex items-center gap-2">
                  {!isNestedField && (
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={field.repeatable}
                        onChange={(e) => onFieldChange(index, 'repeatable', e.target.checked, parentIndex)}
                        className="h-3 w-3 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-[10px] text-gray-700">Repeatable</span>
                    </label>
                  )}
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => onFieldChange(index, 'required', e.target.checked, parentIndex)}
                      className="h-3 w-3 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-[10px] text-gray-700">Required</span>
                  </label>
                </div>

              </div>
            </AccordionBody>
          </Accordion>
        </div>
      )}
    </div>

  );
};

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

export default FormBuilder;