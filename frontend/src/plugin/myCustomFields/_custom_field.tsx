
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'; // Adjust the import path based on your project structure
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioButton } from 'primereact/radiobutton';
import { useEffect } from 'react';

interface CustomFieldProps {
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'radio';
  form: any;
  placeholder?: string;
  isRequired?: string;
}

const CustomField: React.FC<CustomFieldProps & { customFields: any[]; setCustomFields: React.Dispatch<React.SetStateAction<any[]>> }> = ({ label, name, type, form, placeholder, customFields, isRequired, setCustomFields, ...rest }) => {
  useEffect(() => {
    const initialValue = customFields.find((field) => field.name === name)?.value;
    form.setValue(name, initialValue || ''); // Set the initial value in the form context
  }, [customFields, name, form.setValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomFields((prevFields) => {
      const updatedCustomFields = prevFields.map((field) =>
        field.name === name ? { ...field, type: type, value: e.target.value } : field
      );
      const fieldIndex = updatedCustomFields.findIndex((field) => field.name === name);
      if (fieldIndex === -1) {
        updatedCustomFields.push({ name, type, value: e.target.value });
      }

      form.setValue('customFields', updatedCustomFields)
      return updatedCustomFields;

    });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* @ts-ignore */}
            {renderInput(type, field, placeholder, isRequired, rest, onChange)}
          </FormControl>
          <FormMessage className="shad-form_message" />
        </FormItem>
      )}
    />
  );
};

const renderInput = (type: string, field: any, placeholder: string | undefined, isRequired: boolean | undefined, rest: any, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => {
  switch (type) {
    case 'text':
      return <Input className="shad-input" required={isRequired} placeholder={placeholder} {...field} {...rest} onChange={onChange} />;
    case 'textarea':
      return <Textarea className="shad-input" required={isRequired} placeholder={placeholder} {...field} {...rest} onChange={onChange} />;
    case 'radio':
      return <RadioButton className="shad-input" required={isRequired} {...field} {...rest} />;
    // Add more cases as needed
    default:
      return null;
  }
};


export default CustomField;