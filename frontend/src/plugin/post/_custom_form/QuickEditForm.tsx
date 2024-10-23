import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { quickEditFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Calendar } from 'primereact/calendar';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuickEditPostById } from '@/lib/react-query/queriesAndMutations';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/shared/Loader';
import { PostModel } from '@/lib/types';
import { messages, status } from '@/constants/message';
import SvgComponent from '@/utils/SvgComponent';

interface Props {
    setIsQuickEditForm: React.Dispatch<React.SetStateAction<boolean>>;
    setExpandedQuickEditRows: React.Dispatch<React.SetStateAction<string>>;

    rowData: PostModel; // Replace YourRowDataType with the type of rowData
    setRerender: React.Dispatch<React.SetStateAction<boolean>>;
    rerenderPostTable: boolean;
    post_type: string
}

const QuickEditForm: React.FC<Props> = ({ setIsQuickEditForm, rowData, setRerender, rerenderPostTable, post_type, setExpandedQuickEditRows }) => {
    const currentdate = new Date();
    const [date, setDate] = useState(currentdate);
    const { mutateAsync: quickEditPostById, isPending: isLoading } = useQuickEditPostById();
    const { toast } = useToast();

    const dropdownStatus = [
        { name: 'Published', code: 'published' },
        { name: 'Draft', code: 'draft' },
    ];

    const form = useForm<z.infer<typeof quickEditFormSchema>>({
        resolver: zodResolver(quickEditFormSchema),
        defaultValues: {
            id: rowData?.id,
            title: rowData?.title || '',
            status: rowData?.status || '',
            slug: rowData?.slug || '',
            publicationDate: rowData?.publicationDate || date,
            // @ts-ignore
            sticky: rowData?.sticky || false,
        },
    });

    useEffect(() => {
        if (rowData) {
            const publicationDate = rowData?.publicationDate ? new Date(rowData?.publicationDate) : currentdate;
            setDate(publicationDate);
            form.setValue('publicationDate', publicationDate)
            console.table({ publicationDate });
        }

        console.table({ rowData });
    }, [rerenderPostTable]);
    async function onSubmit(values: z.infer<typeof quickEditFormSchema>) {
        values.publicationDate = date;
        const createOrEditPostResponse = await quickEditPostById({ post_id: rowData.id, postData: values });
        if (!createOrEditPostResponse) {
            return toast({ variant: "destructive", description: messages.delete_error , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />  })
        }
        if (createOrEditPostResponse?.code === status.created || createOrEditPostResponse?.code === status.updated) {
            setRerender(!rerenderPostTable);
            console.log("!rerenderPostTable", rerenderPostTable)
            const message = createOrEditPostResponse?.code === status.created ? messages.item_updated : messages.item_updated;
            setExpandedQuickEditRows('');
            setIsQuickEditForm(false)
            return toast({ variant: 'default', description: message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" />  });
        } else {
            return toast({ variant: 'default', description: messages.default_error , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />  });
        }

    }

    return (
        <div className='pt-8'>
            <hr className="h-px ml-[-10px] bg-gray-300 border-0 mb-2.5" />
            <h6 className='mb-2.5 text-sm leading-[20px] font-medium'>QUICK EDIT</h6>
            <Form {...form}>
                <div className="">

                    <form
                        className=""
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="form_data flex flex-col gap-2.5 ">
                            <div className="flex gap-[23px]">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input w-[320px]"
                                                    placeholder="Enter title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <SelectTrigger className="w-[151px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dropdownStatus.map((option) => (
                                                            <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="flex gap-[23px] items-center">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="shad-input w-[320px]"
                                                    placeholder="Enter slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>

                                    )}
                                />
                                {post_type !== 'page' && (
                                    <FormField
                                        control={form.control}
                                        name="sticky"
                                        render={({ }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex align-items-center gap-[8px] w-[250px]">
                                                        <input
                                                            type="checkbox"
                                                            id="sticky"
                                                            name="sticky"
                                                            onChange={(e) => {
                                                                form.setValue('sticky', e.target.checked);
                                                            }}
                                                            width={"16px"}
                                                            height={"16px"}
                                                            checked={form.getValues('sticky')}
                                                        />
                                                        <label htmlFor="sticky" className="text-sm font-medium leading-[20px]">
                                                            Make this {post_type} sticky
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />
                                )}

                            </div>

                            {post_type !== 'page' && (
                                <div className="flex gap-2.5 items-center">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="publicationDate"
                                            render={({ }) => (
                                                <FormItem>
                                                    <FormControl>{/*@ts-ignore*/}
                                                        <Calendar value={date} className="w-[91px]" onChange={(e) => { setDate(e.value); form.setValue('publicationDate', date) }} view="month" dateFormat="M" />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="publicationDate"
                                            render={({ }) => (
                                                <FormItem>
                                                    <FormControl>{/*@ts-ignore*/}
                                                        <Calendar value={date} className="w-[45px]" onChange={(e) => { setDate(e.value); form.setValue('publicationDate', date) }} view="date" dateFormat="dd" />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="publicationDate"
                                            render={({ }) => (
                                                <FormItem>
                                                    <FormControl>{/*@ts-ignore*/}
                                                        <Calendar value={date} className="w-[60px]" onChange={(e) => { setDate(e.value); form.setValue('publicationDate', date) }} view="year" dateFormat="yyyy" />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        at
                                    </div>

                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="publicationDate"
                                            render={({ }) => (
                                                <FormItem>
                                                    <FormControl>{/*@ts-ignore*/}
                                                        <Calendar value={date} onChange={(e) => { setDate(e.value); form.setValue('publicationDate', date) }} className='shad-input w-[78px]' timeOnly />
                                                    </FormControl>
                                                    <FormMessage className="shad-form_message" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}




                        </div>

                        <div className="flex gap-2.5">
                            <Button type="submit" className="shad-button_primary w-[64px] h-[33px] text-xs font-medium   self-end mt-2.5" disabled={isLoading} >
                                {isLoading ? (<Loader />) : 'Update'}
                            </Button>
                            <Button type="submit" className="bg-light-1 rounded flex  h-[33px] text-main-bg-900 text-xs font-medium mt-2.5 items-center w-[64px]  border-main-bg-900 border" onClick={() => { event?.preventDefault(); setIsQuickEditForm(false); setExpandedQuickEditRows('') }} >
                                Cancel
                            </Button>
                        </div>


                    </form>
                </div>
            </Form>
        </div>
    );

}

export default QuickEditForm
