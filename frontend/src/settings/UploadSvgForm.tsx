import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { svgUploader } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useState } from "react";
import { uploadSvg } from "@/lib/appwrite/api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { messages } from "@/constants/message";
import SvgComponent from "@/utils/SvgComponent";

// @ts-ignore
const UploadSvgForm = ({setVisible}) => {
    const { toast } = useToast();
    const [success, setSuccess] = useState(false)

    const form = useForm<z.infer<typeof svgUploader>>({
        resolver: zodResolver(svgUploader),
        defaultValues: {
            name: '',
            code: "",
        },
    }); 
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof svgUploader>) {
        console.log(values)
        const session = await uploadSvg({
            name: values.name,
            code: values.code
        });

        if (!session) {
            return toast({
                variant: "destructive",
                title: "Reset Failed",
                description: messages.default_error,
                 duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> 
            });
        }
        const response_data = session;
        if (response_data.code == 201) {
            setSuccess(true);
            setVisible(false);
            return  toast({
                variant: "default",
                title: messages.item_created
                , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> 
            });
        } else {
            return toast({
                variant: "destructive",
                title: messages.default_error
                , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> 
            });
        }

    }

    return (
        <Form {...form}>
            <div className="">
                {!success && (
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-5 mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="form_labels inter-regular-14">
                                            Name
                                        </label>
                                        <FormControl>
                                            <Input
                                                className=""
                                                placeholder="Add a label"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="form_labels inter-regular-14 mb-14">
                                            Add Svg Code
                                        </label>
                                        <FormControl>
                                            <Textarea
                                                className="h-40"
                                                placeholder="Add Svg Code"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="shad-form_message" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="bg-main-bg-900 inter-regular-14 text-white action_button w-[240px] h-10 float-right mt-4"
                        >
                           {
                            "Upload SVG"
                           } 
                        </Button>
                    </form>
                )}

            </div>
        </Form>
    );
};

export default UploadSvgForm;
