import { useEffect, useState } from 'react';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusSquareIcon, Trash2Icon } from 'lucide-react';

interface RepeaterFieldProps {
  label: string;
  name: string;
  type: 'text' | 'textarea';
  form: any;
  placeholder?: string;
  isRequired?: string;
  customRepeaterFields: any;
  setCustomRepeaterFields: any;
}

const RepeaterField: React.FC<RepeaterFieldProps> = ({ label, name, type, form, placeholder, isRequired = false, customRepeaterFields, setCustomRepeaterFields }) => {
  const [fields, setFields] = useState([{ id: `${name}_0`, name: name, value: '' }]);
  const [isFieldSet, setIsField] = useState(false);

  useEffect(() => {

    if (customRepeaterFields.length > 0) {
      form.setValue('customRepeaterFields', customRepeaterFields);
      const filteredFields = customRepeaterFields.filter((field: any) => field.name === name);
      console.log(filteredFields, 'FIl', type)
      if (filteredFields.length > 0) {
        const newFields = filteredFields.flatMap((field: any) =>
          field.value.map((value: any, index: number) => ({
            id: `${field.name}_${index}`,
            type: type,
            name: field.name,
            value: value,
          }))
        );
        console.log(fields.length, isFieldSet, fields)
        if (fields.length === 1 && !isFieldSet) {
          setFields(newFields);
          setIsField(true);
        }
      }
    }
  }, [name, customRepeaterFields]);

  const handleAddField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { id: `${name}_${prevFields.length}`, type: type, name: name, value: '' },
    ]);
  };


  const handleRemoveField = (id: string) => {
    if (fields.length > 1) {
      const filteredFields = fields.filter(field => field.id !== id);
      setFields(filteredFields);
      const filteredFieldsArray = filteredFields.map((field) => field.value);
      const filteredFieldsObj = { name: name, type: type, value: filteredFieldsArray };
      console.log(filteredFieldsObj)
      setCustomRepeaterFields((prevFields: any) => {
        const updatedFields = [...prevFields];
        const existingFieldIndex = updatedFields.findIndex((field) => field.name === filteredFieldsObj.name);

        if (existingFieldIndex !== -1) {
          updatedFields[existingFieldIndex].value = filteredFieldsObj.value;
        } else {
          updatedFields.push(filteredFieldsObj);
        }
        console.log(filteredFieldsObj, updatedFields)
        form.setValue('customRepeaterFields', updatedFields);
        return updatedFields;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
    console.log(fields, id, name)
    setFields((prevFields) => {
      const updatedFields = prevFields.map((field) => {
        if (field.id === id && field.name === name) {
          console.log(`Updating field with id: ${id}, name: ${name}`);
          console.log('Previous value:', field.value);
          console.log('New value:', e.target.value);
          return { ...field, value: e.target.value };
        } else {
          return field;
        }
      });

      console.log('Updated fields:', updatedFields);
      return updatedFields;
    });

    const repeaterFieldPayload = prepareRepeaterFieldData();
    console.log(repeaterFieldPayload);
    setCustomRepeaterFields((prevFields: any) => {
      const updatedFields = [...prevFields];
      const existingFieldIndex = updatedFields.findIndex((field) => field.name === repeaterFieldPayload.name);

      if (existingFieldIndex !== -1) {
        updatedFields[existingFieldIndex].value = repeaterFieldPayload.value;
      } else {
        updatedFields.push(repeaterFieldPayload);
      }

      form.setValue('customRepeaterFields', updatedFields);
      return updatedFields;
    });
  };
  console.log(form.getValues(), form, "demo")

  const prepareRepeaterFieldData = () => {
    const valueArray = fields.map((field) => field.value);
    const formObject = { name: name, type: type, value: valueArray };
    return formObject;
  };
  console.log(fields, "FIELD")
  return (
    <div style={{ marginBottom: '16px' }}>
      <FormLabel>{label}</FormLabel>
      {fields.map((field, index) => (
        <div key={`${field.id}_${index.toString()}`} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <FormControl style={{ marginRight: '8px' }}>
            {type === 'text' ? (
              <Input
                className={`required-${isRequired} shad-input`}//@ts-ignore
                required={isRequired}
                placeholder={placeholder}
                value={field.value || ''}
                onChange={(e) => handleChange(e, field.id)}
              />
            ) : (
              <Textarea
                className="shad-input" //@ts-ignore
                required={isRequired}
                placeholder={placeholder}
                value={field.value || ''}
                onChange={(e) => handleChange(e, field.id)}
              />
            )}
          </FormControl>
          {fields.length > 1 && (
            <button type="button" onClick={() => handleRemoveField(field.id)}>
              <Trash2Icon />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddField} style={{ marginTop: '8px' }}>
        <PlusSquareIcon />
      </button>
    </div>
  );
};

export default RepeaterField;
