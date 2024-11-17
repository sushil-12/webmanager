import { createOrEditWebsiteSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IMenuItem, IWebsite } from "@/lib/types";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import SvgComponent from "@/utils/SvgComponent";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/Loader";
import { Card } from "primereact/card";
import { confirmDialog } from 'primereact/confirmdialog';
import { useNavigate, useParams } from "react-router-dom";
import { useCreateEditWebsite, useDeleteWebsiteByID, useGetWebsite } from "@/lib/react-query/queriesAndMutations";
import { InputTextarea } from "primereact/inputtextarea";
import WebsiteMenuForm from "./WebsiteMenuForm";
import { Chip } from "primereact/chip";
import { useUserContext } from "@/context/AuthProvider";
import { formatString, menuSchemaJson } from "@/lib/utils";
import Compressor from 'compressorjs';
import { getHeroIcon } from "@/lib/HeroIcon";


const AddEditWebsite = () => {

    const { website_id, action } = useParams();
    const fileInputRef = useRef(null);
    const { mutateAsync: createOrEditWebsite, isPending: isWebsiteCreating } = useCreateEditWebsite();
    const { mutateAsync: getWebsite, isPending: isWebsiteLoading } = useGetWebsite();
    const { mutateAsync: deleteWebsiteByID, isPending: deletingWebsite } = useDeleteWebsiteByID();
    const [imageSrc, setImageSrc] = useState('');
    const [website, setWebsite] = useState<IWebsite | undefined>(undefined); // Explicitly specify the type as IWebsite | undefined
    const [dialog, setDialog] = useState('menuItem');
    const { rerender, setRerender } = useUserContext();
    const [buisnessName, setBuisnessName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [visible, setVisible] = useState(false);
    const [renderForm, setRerenderForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [currentWebsiteName, setCurrentWebsiteName] = useState("")
    const navigate = useNavigate();
    const { toast } = useToast();
    const [validationErrorMessage, setValidationErrorMessage] = useState('');

    const handleModalStates = () => {
        setBuisnessName('');
        setUrl('');
        setDescription('');
        setValidationErrorMessage('');
    }
    const fetchData = async () => {
        try {
            if (website_id) {
                const result = await getWebsite(website_id);
                if (result && result.data) {
                    setWebsite(result.data);
                    setMenuItems(result.data.menus);
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    /* confirm delete diologue */
    async function accept() {
        form.setValue('icon', '');
        setImageSrc('');
        // await form.handleSubmit(onSubmit)();
    }

    async function acceptDeleteWebsite() {
        if (website_id) {
            const deleteWebsite = await deleteWebsiteByID(website_id);
            if (deleteWebsite?.status == 'success') {
                navigate('/websites');
                setRerender(!rerender);
                return toast({ variant: "default", description: deleteWebsite.data.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
            }
        }
    }

    const reject = () => {
        console.log("CACNELLEED");
    }
    const confirmDelete = () => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to remove profile image?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => accept(),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    const confirmDeleteWebsite = () => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to delete website?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => acceptDeleteWebsite(),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    // @ts-ignore
    async function handleDelete(itemId) {
        let menuItems = website?.menus;
        //@ts-ignore
        const updatedMenus = menuItems.filter(menu => menu.id !== itemId);
        console.log(updatedMenus);
        setMenuItems(updatedMenus);
        console.log(form.getValues(), { ...form.getValues(), menus: updatedMenus });
        //@ts-ignore
        const updateResponse = await createOrEditWebsite({ ...form.getValues(), menus: updatedMenus });
        console.log(updateResponse);
        if (updateResponse) {
            setRerender(!rerender)
            return toast({ variant: "default", description: "Menu Item deleted sucessfully", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        }
        return;
    };


    const confirmMenuDelete = (itemId: string) => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to delete website menu?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => handleDelete(itemId),
            reject: reject,
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }
    const headerTemplate = () => {
        return (
            <div className={`flex items-center justify-between ${dialog !== 'email' && dialog !== 'success' && 'mb-6'}`}>
                <h1 className='page-innertitles'>{dialog === 'business_name' ? 'Edit Business Name' : dialog == 'url' ? 'Edit URL' : dialog == 'description' ? 'Edit Description' : dialog == "success" ? 'We sent you a verification email' : `Edit Menu Items  (${currentWebsiteName})`}</h1>
                <button onClick={() => { setVisible(false); handleModalStates(); }}><SvgComponent className="cursor-pointer float-right" svgName="close" /></button>
            </div>
        );
    };


    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        console.log(file.size, "FILE SIZE");
    
        if (file) {
            // Validate file size
            if (file.size > 128 * 1024) {
                return toast({ 
                    description: "Image's bigger than 128kb", 
                    variant: 'destructive', 
                    duration: import.meta.env.VITE_TOAST_DURATION, 
                    icon: <SvgComponent className="" svgName="close_toaster" /> 
                });
            }
    
            // Compress the image file
            new Compressor(file, {
                quality: 0.8, // Adjust quality as needed (0.8 is 80% quality)
                success: (compressedFile) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // @ts-ignore
                        setImageSrc(reader.result); 
                        //@ts-ignore
                        const base64Data = reader.result?.split(',')[1]; // Get the base64 data part
                        form.setValue('icon', base64Data);
                    };
                    reader.readAsDataURL(compressedFile);
                },
                error: (err) => {
                    console.error('Compression error:', err);
                    toast({ 
                        description: "Image compression failed", 
                        variant: 'destructive', 
                        duration: import.meta.env.VITE_TOAST_DURATION, 
                        icon: <SvgComponent className="" svgName="close_toaster" /> 
                    });
                }
            });
    
            // Reset the file input value to handle the same file selection
            event.target.value = '';
        }
    };


    const form = useForm<z.infer<typeof createOrEditWebsiteSchema>>({
        resolver: zodResolver(createOrEditWebsiteSchema), mode: 'all',
        defaultValues: {
            id: website?.id || '',
            business_name: website?.business_name || '',
            url: website?.url || '',
            description: website?.description || '',
        },
    });
    console.log(form.getValues('url'), "url")
    console.log(form.formState.errors, "ERRORS");
    async function onSubmit(values: z.infer<typeof createOrEditWebsiteSchema>) {
        console.log(imageSrc)
        try {

            const updateData = {
                id: website_id || '',
                business_name: form.getValues('business_name'),
                description: form.getValues('description'),
                url: form.getValues('url') || '',
            };

            if (values.icon) {
                // @ts-ignore
                updateData.icon = values.icon;
            }
            if (imageSrc == '') {
                // @ts-ignore
                updateData.icon = '';
            }
            if (values.icon == '') {
                // @ts-ignore
                updateData.icon = '';
            }
            if (action == 'new') {
                // @ts-ignore
                updateData.menus = menuSchemaJson;
            }
            const updateResponse = await createOrEditWebsite(updateData);
            console.log(updateResponse);

            if (updateResponse) {
                setRerender(!rerender);
            }
            console.log(updateResponse)
            navigate('/websites');
            return toast({ description: 'Website operated Succesfully!', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } catch (error) {
            return toast({  // @ts-ignore
                description: `${error.message || error}`,
                variant: 'destructive',
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent className="" svgName="close_toaster" />
            });
        }
    }

    const handleValidations = (value: string, key: string) => {
        let result;
        const urlSchema = createOrEditWebsiteSchema.shape.url;
        const nameSchema = createOrEditWebsiteSchema.shape.business_name;
        if (key === 'url') {
            result = urlSchema.safeParse(value);
        }
        if (key === 'name') {
            result = nameSchema.safeParse(value);
        }
        console.log(result)
        //@ts-ignore
        if (!result.success) {
            //@ts-ignore
            setValidationErrorMessage(result?.error?.issues[0]?.message);
        } else {
            setValidationErrorMessage('');
        }
    };

    useEffect(() => {
        console.log(renderForm);
        if (action === 'edit' && !website) {
            fetchData();
        } else {
            setImageSrc(website?.icon || '');
            form.setValue('id', website?.id);
            form.setValue('business_name', website?.business_name || '');
            form.setValue('description', website?.description);
            // @ts-ignore
            form.setValue('url', website?.url);
            console.log(website?.menus);
        }
    }, [action, website, form, renderForm]);

    useEffect(() => {
        fetchData();
    }, [renderForm])

    return (
        <div className="skewed-bg skewed-bg-secondary">
            <div className="content">
                <div className="heading-bold flex items-center justify-center pt-20">
                    {!website_id ? 'Add Website' : 'Edit Website'}
                </div>
                {action == "edit" && <button onClick={(e) => { e.preventDefault(); setVisible(true); setDialog('menuItem'); setCurrentWebsiteName(form.getValues('business_name')) }} className="card_form_button bg-transparent absolute top-10 right-2"  >Edit Menu Items</button>}
                <div className="white-container flex justify-center relative">

                    <div className="flex justify-center mt-12">

                        <Card className="card main_card_view  mb-8">
                            {isWebsiteLoading || deletingWebsite || isWebsiteCreating ? (<ProfilePageSkeleton />) : (
                                <div className="main-content overflow-x-hidden overflow-y-auto">
                                    <div className="edit_image_container">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-inter text-sm font-semibold">Add Icon</span>
                                            <span className="font-inter text-xs text-secondary-label font-normal">Max file size - 128kb</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-[32px] h-[32px]">
                                                {imageSrc == '' ? (<SvgComponent className="" svgName="website_icon" />) : <img src={`${imageSrc}`} alt="" className="w-[32px] h-[32px] rounded-full" />}
                                            </div>
                                            <div className="img_description flex flex-col ">
                                                <div className="flex action_buttons gap-[10px]">
                                                    <input type="file" accept="image/*" multiple={false} className="hidden" onChange={(event) => handleFileChange(event)} ref={fileInputRef} />
                                                    {/* @ts-ignore */}
                                                    <button className="bg-primary-500 rounded flex text-white items-center w-[140px] h-[30px] button_prime_text py-2.5" onClick={() => fileInputRef.current.click()}>
                                                        <SvgComponent className="pl-3 pr-2 " svgName="upload" />Upload Icon
                                                    </button>
                                                    {imageSrc !== '' && <button onClick={() => confirmDelete()} className="bg-light-1 rounded flex text-center text-main-bg-900 items-center w-[125px] h-[30px] button_prime_text py-2.5 pl-2.5 border-main-bg-900 border disabled:bg">Remove Image</button>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Form {...form}>
                                        <div className="">
                                            <form
                                                onSubmit={form.handleSubmit(onSubmit)}
                                                className="flex flex-col gap-3 w-full mt-4"
                                            >
                                                <FormField control={form.control} name="business_name" render={({ field }) => (
                                                    <FormItem className="outline-none">
                                                        <FormLabel className="card_form_label">Business name</FormLabel>
                                                        <FormControl>
                                                            <div className="text-center flex items-center gap-2">
                                                                <Input className={`bg-light-gray ${action !== "edit" ? 'card_form_label_input_fields_full' : 'card_form_label_input_fields'}`} placeholder="Business name" {...field} readOnly={action === 'edit'} />
                                                                {action == "edit" && <button onClick={(e) => { e.preventDefault(); setVisible(true); setDialog('business_name') }} className="card_form_button"  >Edit Name</button>}
                                                            </div></FormControl>
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>
                                                )}
                                                />
                                                <FormField control={form.control} name="url" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label">Url</FormLabel>
                                                        <FormControl>
                                                            <div className={`flex items-center gap-2 `}>
                                                                <Input className={` bg-light-gray ${action !== "edit" ? 'card_form_label_input_fields_full' : 'card_form_label_input_fields'}`}  {...field} placeholder="https://" readOnly={action === 'edit'} />
                                                                {action == "edit" && <button onClick={(e) => { e.preventDefault(); setVisible(true); setDialog('url') }} className="card_form_button"  >Edit URL</button>}
                                                            </div>
                                                        </FormControl>

                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />

                                                <FormField control={form.control} name="description" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label">Description</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <InputTextarea
                                                                    className={`${action !== "edit" ? 'w-full h-[113px] bg-light-gray' : 'w-full h-[113px] bg-light-gray'}`} readOnly={action === 'edit'}
                                                                    {...field} placeholder="Type here..."
                                                                />

                                                            </div>

                                                        </FormControl>
                                                        {action == "edit" && <button onClick={(e) => { e.preventDefault(); setDialog('description'); setVisible(true) }} className="card_form_button float-right"  >Edit Description</button>}
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />


                                                {/* Dialog */}
                                                <Dialog visible={visible} onHide={() => { setVisible(false); }} style={{ width: dialog === 'menuItem' ? '80vw' : '540px', minWidth: '550px' }} header={headerTemplate} closable={false} draggable={false} className="form-dialogs" >
                                                    {
                                                        dialog == 'business_name' ? (
                                                            <>
                                                                <div className="flex">
                                                                    {/* @ts-ignore */}
                                                                    <Input className={`outline-none  w-[352px] mb-2 mr-2 ${validationErrorMessage !== '' ? 'border border-error' : ''}`} onChange={(e) => setBuisnessName(e.target.value)} value={buisnessName || form.getValues('business_name')} placeholder="Enter Buisness Name" onInput={() => handleValidations(event?.target.value, "name")} />
                                                                    {<Button type="submit" onClick={() => { form.setValue('business_name', buisnessName); setVisible(false) }} className="text-white w-[131px] bg-primary-500 rounded text-[14px] " disabled={validationErrorMessage !== ''}>Edit Name </Button>}

                                                                </div> {validationErrorMessage !== '' && <p className="shad-form_message">{validationErrorMessage}</p>}</>
                                                        ) : dialog == 'url' ? (
                                                            <>
                                                                <div className="flex"> {/* @ts-ignore */}
                                                                    <Input className={`outline-none  w-[352px] mb-2 mr-2 ${validationErrorMessage !== '' ? 'border border-error' : ''}`} onChange={(e) => setUrl(e.target.value)} value={url || form.getValues('url')} placeholder="https://" onInput={() => handleValidations(event?.target.value, "url")} />
                                                                    {<Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={() => { form.setValue('url', url); setVisible(false) }} disabled={validationErrorMessage !== ''}> {'Edit URL'}
                                                                    </Button>}
                                                                </div>  {validationErrorMessage !== '' && <p className="shad-form_message">{validationErrorMessage}</p>}</>
                                                        ) :
                                                            dialog == 'description' ? (
                                                                <div className="flex flex-col">
                                                                    <InputTextarea className="outline-none mb-2 mr-2" onChange={(e) => setDescription(e.target.value)} value={description || form.getValues('description')} placeholder="Type here..." />
                                                                    {<Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={() => { form.setValue('description', description); setVisible(false) }}> {'Edit Description'}
                                                                    </Button>}
                                                                </div>
                                                            ) : dialog == 'menuItem' ? (
                                                                <div className="flex justify-between gap-4">
                                                                    <div className="w-[50%]">
                                                                        <table className="border-collapse w-full rounded-md text-sm">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className="border border-main-bg-900 px-4 py-1.5 text-center">Icon</th>
                                                                                    <th className="border border-main-bg-900 px-4 py-1.5 text-center">Label</th>
                                                                                    <th className="border border-main-bg-900 px-4 py-1.5 text-center">Category</th>
                                                                                    <th className="border border-main-bg-900 px-4 py-1.5 text-center">Type</th>
                                                                                    <th className="border border-main-bg-900 px-4 py-1.5 text-center">Action</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {menuItems && menuItems && menuItems.map((menu, index) => (
                                                                                    <tr key={index} className="border border-main-bg-900">
                                                                                        {/* @ts-ignore */}
                                                                                        <td className="border border-main-bg-900 px-4 py-1.5 text-center">{getHeroIcon(menu?.imgURL)}</td>
                                                                                        <td className="border border-main-bg-900 px-4 py-1.5 text-center">{menu.label}</td>
                                                                                        <td className="border border-main-bg-900 px-4 py-1.5 text-center"><Chip className={`text-xs ${menu.category ? 'bg-success-green text-white font-semibold' : ''}`} label={`${menu.category ? 'enabled' : 'disabled'}`} /></td>
                                                                                        <td className="border border-main-bg-900 px-4 py-1.5 text-center">{formatString(menu.type)}</td>
                                                                                        <td className="px-4 py-1.5 text-center pt-4 gap-2 flex items-center justify-center">
                                                                                            <button className="focus:outline-none" onClick={() => { setSelectedItem(menu); console.log(selectedItem) }}>
                                                                                                <SvgComponent className="" svgName="edit" />
                                                                                            </button>
                                                                                            <button className="focus:outline-none" onClick={() => confirmMenuDelete(menu.id)}>
                                                                                                <SvgComponent className="" svgName="delete" />
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="w-[50%] flex justify-center">
                                                                        <WebsiteMenuForm item={website} activeTab="website" selectedItem={selectedItem} setVisible={setVisible} setRerender={setRerenderForm} setSidebarRender={setRerender} />
                                                                    </div>
                                                                </div>

                                                            ) : (<></>)

                                                    }

                                                </Dialog>
                                                {action === 'edit' && <button className="text-error text-left " onClick={confirmDeleteWebsite}>Delete</button>}
                                                <div className="flex gap-2.5 mt-[30px] ">
                                                    <Button type="submit" className="text-white w-[50%] h-9 bg-primary-500 rounded inter-bold-16" disabled={isWebsiteCreating}>
                                                        {
                                                            isWebsiteCreating ? <Loader /> : 'Save changes'
                                                        }
                                                    </Button>
                                                </div>

                                            </form>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddEditWebsite;