import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostFormSchema } from "@/lib/validation";
import { z } from "zod";
import { Editor } from "primereact/editor";
import MediaPicker from "@/components/shared/MediaPicker";
import { useCreateOrEditPost, useGetAllCategories, useListSeoFilePaths } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { PostModel } from "@/lib/types";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Tree } from "primereact/tree";
import { messages, status } from "@/constants/message";
import SvgComponent from "@/utils/SvgComponent";
import Loader from "@/components/shared/Loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createSlug, createSpacedString, formatOption } from "@/lib/utils";
import { getAllCustomFields } from "@/lib/appwrite/api";
import DynamicForm from "./DynamicForm";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PostFormSchema {
    post_type: string,
    post: PostModel | null,
}

const PostForm: React.FC<PostFormSchema> = ({ post_type, post }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: createOrEditPost, isPending: isOperating } = useCreateOrEditPost();
    const [currentPost, setCurrentPost] = useState<PostModel | null>(post);
    const { currentDomain } = useUserContext();
    const [categories, setCategories] = useState([]);
    const { mutateAsync: getAllCategories, isPending: isCategoryLoading } = useGetAllCategories();
    const { mutateAsync: getSeoFilePath, isPending: isFilePathLoading } = useListSeoFilePaths();
    const [selectedKeys, setSelectedKeys] = useState(post?.categoryObject);
    const [metaKey, setMetaKey] = useState(false);
    const [canEdit, setCanEdit] = useState(true);
    const [seoContent, setSeoContent] = useState('');
    const [customFormFields, setCustomFormFields] = useState<any[]>([]);
    const [seoFilePath, setSeoFilePath] = useState([]);
    const [selectedValue, setSelectedValue] = useState("select");
    const [postFormData, setPostFormData] = useState({});
    const [accordionState, setAccordionState] = useState({
        customFields: true,
        mediaAndCategories: true,
        seoData: true,
        seoContent: true,
    });

    const toggleAccordion = (key: string) => {
        setAccordionState((prev) => ({
            ...prev,  //@ts-ignore
            [key]: !prev[key],
        }));
    };

    async function fetchCategories() {
        if (post_type) {
            const categoryData = await getAllCategories(post_type);
            setCategories(categoryData.data.categories);
        }
    }

    async function getListSeoFilePath() {
        if (post_type) {
            const seoFilePath = await getSeoFilePath();
            console.log(seoFilePath);
            setSeoFilePath(seoFilePath.data.files);
        }
    }

    async function fetchCustomFields() {
        if (post_type) {
            let customFieldsResponse;
            if (post_type == 'page') {
                // @ts-ignore
                customFieldsResponse = await getAllCustomFields('page', currentPost?.id);
                console.log(customFieldsResponse, customFieldsResponse?.data?.customField?.fields, "customFieldsResponse?.data?.customField?.fields")
                customFieldsResponse?.data?.customField[0]?.fields?.length > 0 && setCustomFormFields(customFieldsResponse?.data?.customField[0]?.fields)
            } else {
                // @ts-ignore
                customFieldsResponse = await getAllCustomFields(post_type, currentPost?.id);
                console.log(customFieldsResponse, customFieldsResponse?.data?.customField, "customFieldsResponse?.data?.customField?.fields posts")
                customFieldsResponse?.data?.customField[0]?.fields?.length > 0 && setCustomFormFields(customFieldsResponse?.data?.customField[0]?.fields)
                console.log(customFieldsResponse?.data?.customField, "customFormFields")
            }
        }
    }

    useEffect(() => {
        fetchCategories();
        getListSeoFilePath();
        fetchCustomFields();
        if (post?.seoData?.seoFilePath) { setSelectedValue(currentPost?.seoData?.seoFilePath) }
        console.log(selectedValue, "sele");
        console.log(customFormFields, "CUSOTM FORM FIELDS")
        if (post?.postMeta && post?.postMeta !== null) {
            if (post.categoryObject) { setSelectedKeys(post.categoryObject); }
            if (post.categories) { setCategories(categories) }
            setPostFormData(post?.postMeta?.formData)
            // @ts-ignore
            if (post?.seoData) { setSeoContent(post?.seoContent) }
        }
        // @ts-ignore
        post && setCanEdit(post?.can_edit);
        let customFieldsArray = post?.postMeta?.customFields || [];
        let customRepeaterFieldsArray = post?.postMeta?.customRepeaterFields || [];
        // Modify customFieldsArray and customRepeaterFieldsArray using map
        customFieldsArray = customFieldsArray.map((item: any) => {
            item.variant = 'normal_field';
            item.label = createSpacedString(item.name);
            item.field_type = item.type
            return item;
        });

        customRepeaterFieldsArray = customRepeaterFieldsArray.map((item: any) => {
            item.variant = 'repeater_field';
            item.label = createSpacedString(item.name);
            item.field_type = item.type
            return item;
        });

        const array = [...customFieldsArray, ...customRepeaterFieldsArray];
        setCustomFormFields(array)
    }, [post?.postMeta, post?.categoryObject, currentPost]);

    const handleTreeSelectionChange = (selectedItems: any) => {
        setSelectedKeys(selectedItems)
        const selectedValuesArray = Object.keys(selectedItems);
        form.setValue('categories', selectedValuesArray);
    };

    const form = useForm<z.infer<typeof PostFormSchema>>({
        resolver: zodResolver(PostFormSchema),
        defaultValues: {
            id: currentPost?.id || '',
            post_type: post_type,
            domain: currentDomain,
            title: currentPost?.title || '',
            content: currentPost?.content || '',
            featuredImage: currentPost?.featuredImage.id || '',
            categories: currentPost?.categories || [],
            seoData: currentPost?.seoData || { seoUrl: currentPost?.slug, seoTitle: '', seoFilePath: 'select', seoDescription: '' },
            customFields: currentPost?.postMeta?.customFields,
        },
    });

    async function onSubmit(values: z.infer<typeof PostFormSchema>) {
        if (values.seoData === undefined || values?.seoData.seoFilePath === undefined || values?.seoData?.seoFilePath === 'select' || values?.seoData?.seoFilePath === '') {
            values.seoData.seoFilePath = `${createSlug(values.title)}.js`;
        }
        // @ts-ignore
        values.formData = postFormData;
        const createOrEditPostResponse = await createOrEditPost(values);
        
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: messages.update_error, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
        if (createOrEditPostResponse?.code === status.created || createOrEditPostResponse?.code === status.updated) {
            const updatedPost = createOrEditPostResponse?.data?.post;
            setCurrentPost(updatedPost);
            form.setValue('id', updatedPost?.id);
            const message = createOrEditPostResponse?.code === status.created ? messages.item_updated : messages.item_created;
            // @ts-ignore
            navigate('/' + btoa(localStorage.getItem('domain')) + '/posts/' + post_type)
            return toast({ variant: 'default', description: message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
        } else {
            return toast({ variant: 'default', description: messages.default_error, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
        }
    }

    return (
        <Form {...form}>
            <div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-8 w-full mt-4 relative"
                >
                    <div className="flex">
                        <div className="main_content w-[70%]">
                            <div className="form_data flex gap-8">
                                <div className="form_elements w-full flex flex-col gap-8">
                                    {/* Title Field */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="shad-input"
                                                        placeholder="Enter title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Content Editor */}
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content</FormLabel>
                                                <FormControl>
                                                    <Editor
                                                        value={field.value}
                                                        onTextChange={(e) =>
                                                            field.onChange({ target: { value: e.htmlValue } })
                                                        }
                                                        style={{ height: "320px" }}
                                                        name="content"
                                                    />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            {/* Custom Fields Accordion */}
                            <Accordion placeholder={''}
                                open={accordionState.customFields}
                                icon={
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`mx-auto h-4 w-4 transition-transform ${accordionState.customFields ? "rotate-180" : ""
                                            }`}
                                    />
                                }
                            >
                                <AccordionHeader placeholder={''}
                                    onClick={() => toggleAccordion("customFields")}
                                    className="text-main-bg-900 text-xl font-bold"
                                >
                                    Custom Fields
                                </AccordionHeader>
                                <AccordionBody>
                                    <div className="flex flex-col gap-8">
                                        <DynamicForm
                                            fields={customFormFields}
                                            postFormData={postFormData}
                                            setPostFormData={setPostFormData}
                                        />
                                    </div>
                                </AccordionBody>
                            </Accordion>
                        </div>

                        <div className="sidebar_content w-[30%] mx-4 px-4 rounded-lg border">
                            {/* Media and Categories Accordion */}
                            <Accordion placeholder={''}
                                open={accordionState.mediaAndCategories}
                                icon={
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`mx-auto h-4 w-4 transition-transform ${accordionState.mediaAndCategories ? "rotate-180" : ""
                                            }`}
                                    />
                                }
                            >
                                <AccordionHeader placeholder={''}
                                    onClick={() => toggleAccordion("mediaAndCategories")}
                                    className="text-main-bg-900 text-xl font-bold"
                                >
                                    Media and Categories
                                </AccordionHeader>
                                <AccordionBody>
                                    {/* Media Picker and Categories */}
                                    <div className="media_image flex flex-col gap-8">
                                        {/* Featured Image */}
                                        <FormField
                                            control={form.control}
                                            name="featuredImage"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Featured Image</FormLabel>
                                                    <FormControl>
                                                        <MediaPicker
                                                            filterExtension={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
                                                            defaultValue={post?.featuredImage}
                                                            onSelect={(selectedImage) => {
                                                                form.setValue(
                                                                    "featuredImage",
                                                                    selectedImage ? selectedImage.id : ""
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        {/* Categories */}
                                        {categories.length === 0 && post_type !== "page" && (
                                            <FormField
                                                name="categories"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Select Categories</FormLabel>
                                                        <FormControl>
                                                            <Tree
                                                                value={categories}
                                                                metaKeySelection={metaKey}
                                                                selectionMode="multiple"
                                                                selectionKeys={selectedKeys}
                                                                onSelectionChange={(e) =>
                                                                    handleTreeSelectionChange(e.value)
                                                                }
                                                                className="w-full md:w-30rem"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </AccordionBody>
                            </Accordion>

                            {/* SEO Data Accordion */}
                            <Accordion placeholder={''}
                                open={accordionState.seoData}
                                icon={
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`mx-auto h-4 w-4 transition-transform ${accordionState.seoData ? "rotate-180" : ""
                                            }`}
                                    />
                                }
                            >
                                <AccordionHeader placeholder={''}
                                    onClick={() => toggleAccordion("seoData")}
                                    className="text-main-bg-900 text-xl font-bold"
                                >
                                    SEO Data
                                </AccordionHeader>
                                <AccordionBody>
                                    {/* SEO Fields */}
                                    <div className="flex flex-col gap-8 w-full">
                                        <FormField
                                            control={form.control}
                                            name="seoData.seoTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="shad-input"
                                                            placeholder="Enter SEO title"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="seoData.seoDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO Description</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="shad-input"
                                                            placeholder="Enter SEO description"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="seoData.seoUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO URL</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="shad-input"
                                                            placeholder="Enter SEO URL"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="seoData.seoFilePath"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SEO Schema</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value || "select"}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue>
                                                                    {!field.value ||
                                                                        field.value === "select" ||   //@ts-ignore
                                                                        !seoFilePath.includes(field?.value)
                                                                        ? "Default Schema"
                                                                        : formatOption(field.value)}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem key={"select"} value={"select"}>
                                                                    Default Schema
                                                                </SelectItem>
                                                                {!isFilePathLoading &&
                                                                    seoFilePath.map((option) => (
                                                                        <SelectItem key={option} value={option}>
                                                                            {formatOption(option)}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionBody>
                            </Accordion>

                            {/* SEO Content Accordion */}
                            {seoContent && (
                                <Accordion placeholder={''}
                                    open={accordionState.seoContent}
                                    icon={
                                        <ChevronDownIcon
                                            strokeWidth={2.5}
                                            className={`mx-auto h-4 w-4 transition-transform ${accordionState.seoContent ? "rotate-180" : ""
                                                }`}
                                        />
                                    }
                                >
                                    <AccordionHeader placeholder={''}
                                        onClick={() => toggleAccordion("seoContent")}
                                        className="text-main-bg-900 text-xl font-bold"
                                    >
                                        SEO Content
                                    </AccordionHeader>
                                    <AccordionBody>
                                        <pre className="text-balance">
                                            {JSON.stringify(seoContent, null, 2)}
                                        </pre>
                                    </AccordionBody>
                                </Accordion>
                            )}
                        </div>
                    </div>
                    {canEdit && (
                        <Button
                            type="submit"
                            className="shad-button_primary max-w-fit self-end min-w-24 relative"
                            disabled={isOperating}
                        >
                            {isOperating ? <Loader /> : !currentPost ? "Create" : "Save"}
                        </Button>
                    )}
                </form>
            </div>
        </Form>
    );
};

export default PostForm;