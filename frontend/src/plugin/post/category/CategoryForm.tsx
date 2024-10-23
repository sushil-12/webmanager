import { useCreateOrEditCategory, useGetAllCategories } from '@/lib/react-query/queriesAndMutations';
import { CategoryModel } from '@/lib/types';
import { categoryFormSchema } from '@/lib/validation';
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreeSelect, TreeSelectChangeEvent } from 'primereact/treeselect';
import { createSlug } from '@/lib/utils';
import { useCategory } from './CategoryContext';
import { useUserContext } from '@/context/AuthProvider';
import { messages, status } from '@/constants/message';
import SvgComponent from '@/utils/SvgComponent';

interface CategoryProps {
    post_type: any;
}

const CategoryForm: React.FC<CategoryProps> = ({ post_type }) => {
    const { toast } = useToast();
    const {currentDomain} = useUserContext();
    const navigate = useNavigate();
    const { mutateAsync: createOrEditCategory, isPending: isOperating } = useCreateOrEditCategory();
    const { categories, setCategories, selectedCategory, setSelectedCategory } = useCategory();
    const [currentCategory, setCurrentCategory] = useState<CategoryModel | null>(selectedCategory);
    const { mutateAsync: getAllCategories } = useGetAllCategories();

    const [selectedNodeKeys, setSelectedNodeKeys] = useState<any>('');
    function filterOutSelectedCategory(categories: any, selectedCategoryId: any) {
        if (selectedCategoryId) {
            return categories.filter((category: any) => category.key !== selectedCategoryId);
        }
        return categories;
    }
    useEffect(() => {
        setCurrentCategory(selectedCategory);
        setSelectedNodeKeys(selectedCategory?.parentCategory)
        // Reset the form with updated default values
        form.reset({
            id: selectedCategory?.id || '',
            name: selectedCategory?.name || '',
            postType: post_type,
            parentCategory: selectedCategory?.parentCategory || '',
            slug: selectedCategory?.slug || '',
            description: selectedCategory?.description || '',
        });

        async function fetchCategories() {
            const categoryData = await getAllCategories(post_type);
            setCategories(categoryData.data.categories);
        }
        fetchCategories();
    }, [selectedCategory]);

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            id: currentCategory?.id || '',
            name: currentCategory?.name || '',
            postType: post_type,
            parentCategory: currentCategory?.parentCategory || '',
            slug: currentCategory?.slug || '',
            description: currentCategory?.description || '',
        },
    });

    async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
        const createOrEditPostResponse = await createOrEditCategory(values);
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: messages.update_error , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />  })
        }
        if (createOrEditPostResponse?.code === status.created || createOrEditPostResponse?.code === status.updated) {
            const updatedPost = createOrEditPostResponse?.data?.post;
            setCurrentCategory(updatedPost);
            setSelectedCategory(updatedPost);
            form.setValue('id', updatedPost?.id);
            const message = createOrEditPostResponse?.code === status.created ? messages.item_updated :  messages.item_created;
            navigate('/' + currentDomain + '/category/posts/' + post_type)
            return toast({ variant: 'default', description: message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" />  });
        } else {
            return toast({ variant: 'default', description: messages.default_error , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
        }
    }

    return (
        <Form {...form}>
            <div className="px-5">
                <h6 className='font-semibold text-sm text-main-bg-900'>Category Form</h6>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-8 w-full mt-4"
                >
                    <div className="form_data flex gap-8">
                        <div className="form_elements w-full flex flex-col gap-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                onInput={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    form.setValue('slug', createSlug(e.target.value));
                                                }}
                                                className="shad-input"
                                                placeholder="Enter Category Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter slug"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />
                            <FormField
                                control={form.control}
                                name="parentCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Category</FormLabel>
                                        <FormControl>
                                            <TreeSelect
                                                value={selectedNodeKeys}
                                                showClear={true}
                                                defaultValue=""
                                                onChange={(e: TreeSelectChangeEvent) => {
                                                    setSelectedNodeKeys(e.value || '');
                                                    field.onChange(e.value);
                                                }}
                                                options={filterOutSelectedCategory(categories, selectedCategory?.id)}
                                                metaKeySelection={false}
                                                className="md:w-20rem w-full"
                                                selectionMode="single"
                                                placeholder="Select Items"
                                            ></TreeSelect>
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="shad-form_message" />
                                    </FormItem>

                                )}
                            />

                        </div>

                    </div>
                    <Button type="submit" className="shad-button_primary max-w-fit self-end" disabled={isOperating}>
                        {isOperating ? <Loader /> : selectedCategory ? 'Update' : 'Create'}
                    </Button>
                </form>
            </div>
        </Form>
    );
};

export default CategoryForm
