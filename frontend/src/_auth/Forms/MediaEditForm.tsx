
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { mediaEditFormSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"
import { useDeleteMedia, useEditMedia } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { MediaItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { useMedia } from "@/context/MediaProvider";
import { bytesToSize } from "@/lib/utils";
import SvgComponent from "@/utils/SvgComponent";
import { confirmDialog } from "primereact/confirmdialog";
import { status } from "@/constants/message";

const MediaEditForm: React.FC<{ item: MediaItem, handleModal: any, setblur: any, canEdit: boolean }> = ({ item, handleModal, setblur, canEdit }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMedia();

    const form = useForm<z.infer<typeof mediaEditFormSchema>>({
        resolver: zodResolver(mediaEditFormSchema),
        mode: 'all',
        defaultValues: {
            id: item?.id,
            caption: item?.caption,
            alt_text: item?.alt_text,
            description: item?.description,
            filename: item?.filename,
            category: item?.category,
            tags: item?.tags,
            title: item?.title,
        },
    });

    async function accept(media_id: string) {
        setblur(true)
        const deleteMediaResponse = await deleteMedia(media_id);
        const updatedMedia = media.filter((item) => item.id !== media_id);
        setMedia(updatedMedia);
        if (!deleteMediaResponse) return toast({ variant: "destructive", description: "You have cancelled the operations", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        if (deleteMediaResponse?.code == status.created) {
            handleModal();
            return toast({ variant: "default", description: deleteMediaResponse.data.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } else {
            handleModal();
            return toast({ variant: "destructive", description: "You have cancelled the operations", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }

    const reject = () => {
        console.log("CACNELLEED");
    }
    const confirmDelete = (media_id: string) => {
        if (isDeleting) return;
        confirmDialog({
            header: 'Are you sure youy want delete this media file?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => accept(media_id),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    useEffect(() => {
        form.setValue('id', item?.id);
        form.setValue('caption', item?.caption);
        form.setValue('alt_text', item?.alt_text);
        form.setValue('description', item?.description);
        form.setValue('filename', item?.filename);
        form.setValue('category', '');
        form.setValue('tags', '');
        form.setValue('title', item?.title);
        const timer = setTimeout(() => {
            setIsCopied(false);
        }, 1000);

        // Clear the timer on component unmount or if isCopied changes
        return () => clearTimeout(timer);
    }, [item, form, isCopied]);
    const { toast } = useToast()
    const { mutateAsync: editMedia, isPending: isUpdatingMedia } = useEditMedia();
    const { media, setMedia } = useMedia();
    console.log(isUpdatingMedia);

    async function onSubmit(values: z.infer<typeof mediaEditFormSchema>) {
        const editMediaResponse = await editMedia(values);
        const updatedItems = media.map(currentItem =>
            currentItem.id === item.id ? editMediaResponse.data?.media : currentItem
        );
        setMedia(updatedItems);
        if (!editMediaResponse) {
            return toast({ variant: "destructive", description: "Edit Failed", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
        if (editMediaResponse?.code == 200) {
            // handleModal()
            // return toast({ variant: "default", description: 'Media Updated Successfuly' })
        } else {
            handleModal()
            return toast({ variant: "default", description: 'Media Editing Failed', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }

    return (
        <Form {...form}>
            <div className={`mt-[-6px]  ${isDeleting ? 'opacity-70' : ''}`}>
                <p><span className="text-xs font-semibold leading-[1px]">Uploaded on:</span> <span className="text-xs font-[400] leading-[150%]"> {new Date(item?.createdAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</span></p>
                <p><span className="text-xs font-semibold leading-[150%]">File name:</span> <span className="text-xs font-[400] leading-[150%]">{item?.filename}</span></p>
                <p><span className="text-xs font-semibold leading-[150%]">File type:</span> <span className="text-xs font-[400] leading-[150%]">{item?.format}</span></p>
                <p><span className="text-xs font-semibold leading-[150%]">File size:</span> <span className="text-xs font-[400] leading-[150%]">{bytesToSize(item.size)}</span></p>
                <p>
                    <span className="text-xs font-semibold leading-[150%]">Dimension: </span>
                    {item?.width && item?.height ? (
                        <span className="text-xs font-[400] leading-[150%]">
                            {item.width} by {item.height} pixels
                        </span>
                    ) : (<span className="text-xs font-[400] leading-[150%]"> undefined</span>)}
                </p>
                <form
                    onChange={form.handleSubmit(onSubmit)}
                    className="space-y-1 flex flex-col gap-3 w-full mt-4"
                >
                    <FormField control={form.control} name="alt_text" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alternative Text</FormLabel>
                            <FormControl><Textarea className=" w-80 h-84 focus:shadow-none focus-within:shadow-none focus-visible:shadow-none" placeholder="Add Alternative text" {...field} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input className="w-[350px] focus:shadow-none focus-within:shadow-none focus-visible:shadow-none" placeholder="Add title" {...field} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="title" render={({ }) => (
                        <FormItem>
                            <FormLabel>File URL:</FormLabel>
                            <FormControl><Input className="w-[350px] focus:shadow-none focus-within:shadow-none focus-visible:shadow-none" placeholder="Add url" value={item?.url} /></FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                    />
                    {/* <FormField control={form.control} name="caption" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Enter Caption" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        /> */}

                    {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="filename" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Filename</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add filename" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        /> */}

                    {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add category" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl><Input className="shad-input" placeholder="Add tags" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        />
                    </div> */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        {/* <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea className="shad-input" placeholder="Add description" {...field} /></FormControl>
                                <FormMessage className="shad-form_message" />
                            </FormItem>
                        )}
                        /> */}
                    </div>


                    <Button type="submit" className={`text-white bg-primary-500  h-10 place-self-start ${isCopied && 'bg-success'} `} onClick={() => { event?.preventDefault(); navigator.clipboard.writeText(item?.url); setIsCopied(true); }}>
                        <span className="flex gap-[7px] text-sm leading-5 items-center py-[10px]">
                            {!isCopied ? (
                                <>
                                    <SvgComponent className="" svgName="copy" />
                                    Copy URL to clipboard
                                </>
                            ) : (
                                <>
                                    <SvgComponent className="h-6 w-6" svgName="checked" />
                                    Copied to clipboard
                                </>
                            )}
                        </span>

                    </Button>
                    {canEdit && (
                        <span className="text-danger cursor-pointer text-xs font-normal" onClick={() => confirmDelete(item?.id)}  >
                            {isDeleting ? 'Deleting' : 'Delete permanently'}
                        </span>
                    )}

                </form>
            </div>
        </Form>
    );
};

export default MediaEditForm;
