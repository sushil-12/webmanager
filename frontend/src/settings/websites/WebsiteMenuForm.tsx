
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { commonNavSchema, createOrEditWebsiteMenuSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { createSlug } from "@/lib/utils";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import SvgPickerComponent from "@/components/shared/SvgPickerComponent";
import SvgComponent from "@/utils/SvgComponent";
import Loader from "@/components/shared/Loader";
import { useCreateEditWebsite } from "@/lib/react-query/queriesAndMutations";
import { IMenuItem } from "@/lib/types";


const WebsiteMenuForm: React.FC<{ item: any, activeTab: string, selectedItem?: any, setFormType?: any, setVisible?: any, setRerender?: any, setSidebarRender?:any }> = ({ item, activeTab, selectedItem, setVisible, setRerender, setSidebarRender }) => {

    const items = [
        { name: 'Custom Post', value: 'custom_post' },
        { name: 'default', value: 'default' }
    ];

    const [action, setAction] = useState('new')
    const [type, setType] = useState('custom_post');
    const [svgPicker, setSvgPicker] = useState(false);
    const [svgName, setSvgName] = useState('website');
    const [selectedMenuAfter, setSelectedMenuAfter] = useState([]);
    const [localItem, setLocalItem] = useState<any>(selectedItem); // Initialize localItem with item passed from parent
    const [localFormItem, setLocalFormItem] = useState<IMenuItem>(selectedItem); // Initialize localItem with item passed from parent
    const { mutateAsync: createOrEditWebsite, isPending: isWebsiteCreating } = useCreateEditWebsite();

    // @ts-ignore
    const validationSchema = {
        comman: commonNavSchema,
        website: createOrEditWebsiteMenuSchema,
    };

    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Svg Picker <span className="text-sm">(click to choose svg)</span></h1>
                <button onClick={() => setSvgPicker(false)}><SvgComponent className="cursor-pointer" svgName="close" /></button>
            </div>
        );
    };

    const modalForm = useForm<z.infer<typeof createOrEditWebsiteMenuSchema>>({
        // @ts-ignore
        resolver: zodResolver(validationSchema[activeTab]),
        defaultValues: {
            id: '',
            route: '',
            label: '',
            imgURL: '',
            type: 'custom_post',
            category: 'no',
        },
    });


    useEffect(() => {
        setLocalItem(item);
        setLocalFormItem(selectedItem)
        if (localFormItem) {
            setAction('edit');
            setType(localFormItem?.type);
            setSvgName(localFormItem?.imgURL)
            modalForm.setValue('id', localFormItem?.id)
            modalForm.setValue('type', localFormItem?.type)
            modalForm.setValue('route', localFormItem?.route)
            modalForm.setValue('label', localFormItem?.label)
            modalForm.setValue('imgURL', localFormItem?.imgURL)
            modalForm.setValue('category', localFormItem?.category ? 'yes' : 'no')
        }
        console.log(selectedItem, "localItem")
    }, [selectedItem, localItem, localFormItem, item]);
    useEffect(() => {

    })
    const { toast } = useToast()

    async function handleSubmit() {
       event?.preventDefault();
        try {
            let updatedMenus;
            if (action == 'new') {
                modalForm.setValue('imgURL', svgName);
                if (action == 'new') { modalForm.setValue('id', Math.random().toString(36).substr(2, 9)) }
                modalForm.clearErrors();
                const formValues = modalForm.getValues();
                if (formValues.label == '') { modalForm.setError('label', { message: 'Please enter a label' }) }
                if (formValues.imgURL == '') { modalForm.setError('imgURL', { message: 'Please choose Icon' }) }
                if (!modalForm.formState.errors) {
                    return;
                }{/* @ts-ignore */ }
                if(formValues.category == 'yes'){formValues.category = true} {/* @ts-ignore */ }
                if(formValues.category == 'no'){formValues.category = false}
                let insertIndex = localItem.menus.length; // By default, insert at the end
                if (formValues.place_after) {
                    {/* @ts-ignore */ }
                    const placeAfterIndex = localItem.menus.findIndex(menu => menu.label === formValues.place_after);
                    if (placeAfterIndex !== -1) {
                        insertIndex = placeAfterIndex + 1;
                    }
                }
                updatedMenus = [...localItem.menus.slice(0, insertIndex), formValues, ...localItem.menus.slice(insertIndex)];
                const { icon, ...updatedLocalItem } = localItem;
                setLocalItem({ ...updatedLocalItem, menus: updatedMenus });
                console.log(localItem, "LOCALITEM")
            } else {
                modalForm.setValue('imgURL', svgName);
                const formValues = modalForm.getValues();
                const itemIdToUpdate = formValues.id; {/* @ts-ignore */ }
                if(formValues.category == 'yes'){formValues.category = true} {/* @ts-ignore */ }
                if(formValues.category == 'no'){formValues.category = false}
                 {/* @ts-ignore */ }
                const itemIndexToUpdate = localItem.menus.findIndex(menu => menu.id === itemIdToUpdate);

                // If the item is found
                if (itemIndexToUpdate !== -1) {
                    // Update the item
                    updatedMenus = [
                        ...localItem.menus.slice(0, itemIndexToUpdate), // Items before the updated item
                        { ...localItem.menus[itemIndexToUpdate], ...modalForm.getValues() }, // Updated item
                        ...localItem.menus.slice(itemIndexToUpdate + 1) // Items after the updated item
                    ];
                    const { icon, ...updatedLocalItem } = localItem;
                    setLocalItem({ ...updatedLocalItem, menus: updatedMenus });
                } else {
                    console.error('Item to update not found');
                }
            }
            const { icon, ...updatedLocalItem } = localItem;
            const updateResponse = await createOrEditWebsite({ ...updatedLocalItem, menus: updatedMenus });
            if(updateResponse){
                setSidebarRender((prev: boolean) => !prev);
            }
            setVisible(false);
            setRerender((prev: boolean) => !prev);
            toast({ description: 'Website menus updated sucessfuly!', variant: 'default', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
            console.log(updateResponse)
            return;
            // Optionally, you can trigger any further action here after successful submission, such as displaying a success message
            // toast({ description: 'Website operated Succesfully!', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
        } catch (error) {
            // Handle any errors that occur during submission
            console.error("Error submitting form:", error);
            toast({ description: 'Website operated Failed!', variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
        }
    }
    return (
        <Form {...modalForm}>
            <div className=" card overflow-x-hidden w-[400px] ">
                <form
                    className="space-y-1 flex flex-col gap-3 w-full "
                >
                    <FormField control={modalForm.control} name="label" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Navigation Label</FormLabel>
                            <FormControl><Input className="" placeholder="Add label" {...field} onInput={(e) => modalForm.setValue('route', createSlug((e.target as HTMLSelectElement).value))} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />

                    <FormField control={modalForm.control} name="type" render={({ }) => (
                        <FormItem>
                            <FormLabel>Post Type</FormLabel>
                            <FormControl>
                                <SelectButton
                                    value={type} onChange={(e) => { setType(e.value); modalForm.setValue('type', e.value); console.log(modalForm.getValues(), modalForm) }}
                                    optionLabel="name"
                                    className="select_buttons"
                                    options={items}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>

                    )}
                    />
                    <FormField control={modalForm.control} name="place_after" render={({ }) => (
                        <FormItem>
                            <FormLabel>Select After</FormLabel>
                            <FormControl>
                                {/* @ts-ignore  */}
                                <Dropdown value={selectedMenuAfter} onChange={(e) => { setSelectedMenuAfter(e.value); modalForm.setValue('place_after', e.value.label); }} optionLabel="label" options={localItem?.menus}
                                    placeholder="Place After" className="w-full md:w-14rem" />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>

                    )}
                    />
                    <div className=" gap-4 items-center justify-evenly">
                        <FormLabel>
                            <div className="flex align-middle items-center">Choose Icon
                                <Button onClick={(e) => { e.preventDefault(); setSvgPicker(true); }} ><SvgComponent className="" svgName="edit" /></Button >
                                {/* @ts-ignore */}
                                <SvgComponent className="border border-primary-500 p-4" svgName={svgName} />
                            </div>
                        </FormLabel>

                        {type != 'default' &&
                            <FormField control={modalForm.control} name="category" render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormLabel>Enable Category</FormLabel>
                                    <FormControl className="mx-4 mt-4">
                                        <InputSwitch
                                            checked={modalForm.getValues("category") === 'yes'}
                                            onChange={() => {
                                                const newValue = modalForm.getValues("category") === 'yes' ? 'no' : 'yes';
                                                modalForm.setValue("category", newValue);
                                                field.onChange(newValue);
                                                console.log(modalForm, modalForm.getValues("category") === 'yes')
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )} />
                        }
                    </div>


                    <Dialog draggable={false} visible={svgPicker} onHide={() => setSvgPicker(false)} style={{ width: '60vw' }} header={headerTemplate} closable={false} > {/* @ts-ignore */}
                        <SvgPickerComponent setSvgName={setSvgName} setSvgPicker={setSvgPicker} />
                    </Dialog>

                    <div className="flex gap-4">
                        {/* @ts-ignore */}
                        <Button type="button" className="shad-button_primary" disabled={isWebsiteCreating} onClick={handleSubmit}>
                            {isWebsiteCreating ? <Loader /> : 'Save'}
                        </Button>

                    </div>

                </form>
            </div>
        </Form>
    );
};

export default WebsiteMenuForm;
