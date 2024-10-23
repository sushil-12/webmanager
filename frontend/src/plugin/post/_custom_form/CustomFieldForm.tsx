import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPostsAndPages, usecreateOrEditCustomField } from '@/lib/react-query/queriesAndMutations';
import { CustomFormFieldSchema } from '@/lib/validation';
import SvgComponent from '@/utils/SvgComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormBuilder from './FormBuilder';

interface CustomFieldFormSchema {
    setVisible: any;
    selectedCustomField: any;
}

const CustomFieldForm: React.FC<CustomFieldFormSchema> = ({ setVisible, selectedCustomField }) => {
    console.log(selectedCustomField, "Sel")
    const { mutateAsync: createOrEditCustomField, isPending: isCreating } = usecreateOrEditCustomField();
    const { mutateAsync: getAllPostsAndPages, isPending: isLoading } = useGetAllPostsAndPages();
    const { toast } = useToast();
    const [postType, setPostType] = useState([]);
    const [fields, setFields] = useState(selectedCustomField.fields || []);


    async function getPostTypesAndPages(type: any) {
        const fetchTypeData = await getAllPostsAndPages(type);
        // @ts-ignore
        type !== 'page' ? setPostType([{ value: 'default', label: 'Default Post type' }, ...fetchTypeData.data.posts]) : setPostType([...fetchTypeData.data.posts]);

    }

    const item_type = [
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

    async function handleChange(type: string) {
        await getPostTypesAndPages(type);
        form.setValue('item_type', type);
    }

    async function onSubmit(values: z.infer<typeof CustomFormFieldSchema>) {
        const repeaterValues = fields;
        //@ts-ignore
        values.customFields = repeaterValues;

        const createOrEditCustomFieldResponse = await createOrEditCustomField(values);
        if (createOrEditCustomFieldResponse.status === 'error') {
            setVisible(false);
            return toast({
                variant: 'destructive',
                description: createOrEditCustomFieldResponse.message,
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent className="" svgName="close_toaster" />,
            });
        }

        // @ts-ignore
        const message = createOrEditCustomFieldResponse?.code === status?.created
            ? 'Successfully Updated CustomField'
            : 'Successfully Created CustomField';

        setVisible(false);
        selectedCustomField = {};
        if (createOrEditCustomFieldResponse) {
            return toast({
                variant: 'default',
                description: message,
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent className="" svgName="check_toaster" />,
            });
        }
    }

    return (
        <Form {...form}>
            <div className={`et-${isLoading}`}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 flex flex-col gap-8 w-full mt-4">
                    <div className="form_data flex gap-8  align-middle items-center justify-evenly">
                        <div className="form_elements w-full flex flex-col gap-8">
                            {/* Title Input */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template title</FormLabel>
                                        <FormControl>
                                            <Input className="shad-input" placeholder="Enter Template label" {...field} />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />

                            {/* Item Type Dropdown */}
                            <FormField
                                control={form.control}
                                name="post_type"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Item Type </FormLabel>
                                        <FormControl>
                                            <Dropdown
                                                value={form.getValues('item_type')}
                                                onChange={(e) => handleChange(e.value)}
                                                options={item_type}
                                                optionLabel="label"
                                                placeholder="Select Post Type"
                                                className="w-full md:w-14rem"
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />

                            {/* Post Type Dropdown */}
                            <FormField
                                control={form.control}
                                name="post_type"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Post Type </FormLabel>
                                        <FormControl>
                                            <Dropdown
                                                value={form.getValues('post_type')}
                                                onChange={(e) => form.setValue('post_type', e.value)}
                                                options={postType}
                                                optionLabel="label"
                                                placeholder="Select Post Type"
                                                className="w-full md:w-14rem"
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormBuilder setFieldData={setFields} fieldData={fields} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="shad-button_primary max-w-fit self-end" disabled={isCreating}>
                        Save
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default CustomFieldForm;