import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPostsAndPages, usecreateOrEditCustomField } from '@/lib/react-query/queriesAndMutations';
import { CustomFormFieldSchema } from '@/lib/validation';
import SvgComponent from '@/utils/SvgComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormBuilder from './FormBuilder';

interface CustomFieldFormProps {
    setVisible: (visible: boolean) => void;
    selectedCustomField: any;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({ setVisible, selectedCustomField }) => {
    const { mutateAsync: createOrEditCustomField, isPending: isCreating } = usecreateOrEditCustomField();
    const { mutateAsync: getAllPostsAndPages, isPending: isLoading } = useGetAllPostsAndPages();
    const { toast } = useToast();
    const [postType, setPostType] = useState([]);
    const [fields, setFields] = useState(selectedCustomField.fields || []);

    const fetchPostTypes = async (type: string) => {
        const response = await getAllPostsAndPages(type);
        setPostType(type !== 'page' 
            ? [{ value: 'default', label: 'Default Post Type' }, ...response.data.posts] 
            : response.data.posts
        );
    };
    console.log(isLoading, "isLoading");
    const itemTypes = [
        { label: 'Custom Posts', value: 'custom_post' },
        { label: 'Page', value: 'page' },
    ];

    const form = useForm<z.infer<typeof CustomFormFieldSchema>>({
        resolver: zodResolver(CustomFormFieldSchema),
        defaultValues: {
            id: selectedCustomField._id || '',
            title: selectedCustomField.title || '',
            post_type: selectedCustomField.post_type || '',
            item_type: selectedCustomField.item_type || '',
        },
    });

    const handleChange = async (type: string) => {
        await fetchPostTypes(type);
        form.setValue('item_type', type);
    };

    const onSubmit = async (values: z.infer<typeof CustomFormFieldSchema>) => {
        //@ts-ignore 
        values.customFields = fields;

        const response = await createOrEditCustomField(values);
        if (response.status === 'error') {
            setVisible(false);
            return toast({
                variant: 'destructive',
                description: response.message,
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent svgName="close_toaster" />,
            });
        }

        const message = response?.code === 'created'
            ? 'Successfully Updated CustomField'
            : 'Successfully Created CustomField';

        setVisible(false);
        toast({
            variant: 'default',
            description: message,
            duration: import.meta.env.VITE_TOAST_DURATION,
            icon: <SvgComponent svgName="check_toaster" />,
        });
    };

    useEffect(() => {
        if (selectedCustomField.item_type) {
            fetchPostTypes(selectedCustomField.item_type);
        }
    }, [selectedCustomField]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title Input */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Template Title</FormLabel>
                                <FormControl>
                                    <Input className="shad-input p-1.5 text-xs w-full border border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white" placeholder="Enter Template Label" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Item Type Dropdown */}
                    <FormField
                        control={form.control}
                        name="item_type"
                        render={() => (
                            <FormItem>
                                <FormLabel>Item Type</FormLabel>
                                <FormControl>
                                    <Dropdown
                                        value={form.getValues('item_type')}
                                        onChange={(e) => handleChange(e.value)}
                                        options={itemTypes}
                                        optionLabel="label"
                                        placeholder="Select Type"
                                        className="w-full "
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Post Type Dropdown */}
                    <FormField
                        control={form.control}
                        name="post_type"
                        render={() => (
                            <FormItem>
                                <FormLabel>Post Type</FormLabel>
                                <FormControl>
                                    <Dropdown
                                        value={form.getValues('post_type')}
                                        onChange={(e) => form.setValue('post_type', e.value)}
                                        options={postType}
                                        optionLabel="label"
                                        placeholder="Select Post Type"
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Form Builder */}
                <FormBuilder setFieldData={setFields} fieldData={fields} />

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" className="shad-button_primary" disabled={isCreating}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CustomFieldForm;