import { createOrEditUserSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import SvgComponent from "@/utils/SvgComponent";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/Loader";
import { Card } from "primereact/card";
import Avatar from "@/components/shared/Avatar";
import PasswordStrength from "@/components/shared/PasswordStrength";
import { checkPasswordStrength } from "@/lib/utils";
import { useCreateEditMemebrAccount } from "@/lib/react-query/queriesAndMutations";
import { checkEmail, checkUsername } from "@/lib/appwrite/api";
import { useUserContext } from "@/context/AuthProvider";
import { IWebsite } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import TooltipMessage from "@/components/shared/TooltipMessage";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const AddUser = () => {

    const { mutateAsync: createUserMemberAccount, isPending: isUserCreating } = useCreateEditMemebrAccount();
    const { navItems } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState('');
    const [removing, setRemoving] = useState(false);
    const [websites, setWebsites] = useState<IWebsite[]>([]);
    const [permissions, setPermissions] = useState({});

    const form = useForm<z.infer<typeof createOrEditUserSchema>>({
        resolver: zodResolver(createOrEditUserSchema),
        defaultValues: {
            id: '',
            name: '',
            bio: '',
            email: '',
            password: '',
            user_type: 'user',
            permissions: [],
        },
    });

    useEffect(() => {
        setWebsites(navItems.websites);
    }, [navItems]);


    // @ts-ignore
    const handleCheckboxChange = (websiteId) => (event) => {
        const { name, checked } = event.target;

        setPermissions(prevPermissions => {
            const updatedPermissions = { ...prevPermissions };
            // @ts-ignore
            updatedPermissions[websiteId] = { ...prevPermissions[websiteId], [name]: checked };
            // @ts-ignore
            if (name === 'editor_permission' && checked) {
                // @ts-ignore
                updatedPermissions[websiteId].viewer_permission = true;
            }
            // @ts-ignore
            if (!updatedPermissions[websiteId].editor_permission && !updatedPermissions[websiteId].viewer_permission) {
                // @ts-ignore
                delete updatedPermissions[websiteId];
            }

            return updatedPermissions;
        });
    };


    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size
            if (file.size > 128 * 1024) {
                return toast({ description: "Image's bigger than 128kb", variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                // @ts-ignore
                setImageSrc(reader.result); const base64Data = reader.result?.split(',')[1]; // Get the base64 data part
                form.setValue('profile_pic', base64Data);
                // @ts-ignore
            };

            reader.readAsDataURL(file);
        }
    };

    const checkUsernameExists = async () => {
        console.log("called")
        const result = await checkUsername(form.getValues('name'));
        console.log(result?.data?.data?.message, result)
        if (result?.data?.data?.status == 'error') {
            return;
        } else {
            if (!result?.data?.data?.isUsernameAvailable) {
                form.setError('name', { message: result?.data?.data?.message })
            } else {
                form.clearErrors('name')
            }
        }
    }

    const checkEmailExists = async () => {
        const email = form.getValues('email');
        if (!email) return;
        try {
            const result = await checkEmail(email);
            console.log(result?.data?.data?.message, result);

            if (result?.data?.data?.status === 'error') {
                // Handle error response
                console.error('Error:', result?.data?.data?.message);
                return;
            } else {
                if (!result?.data?.data?.isEmailAvailable) {
                    // Set error message if email is not available
                    console.log(result?.data?.data?.message)
                    form.setError('email', { message: result?.data?.data?.message });
                } else {
                    // Clear error if email is available
                    form.clearErrors('email');
                }
            }
        } catch (error) {
            // Handle API call error
            console.error('API call error:', error);
        }
    };

    async function onSubmit(values: z.infer<typeof createOrEditUserSchema>) {
        try {
            if (permissions) form.setValue('permissions', permissions)
            if (values.password == '') { form.setError('password', { message: 'Please Enter password' }); return }
            if (values.name == '') { form.setError('name', { message: 'Please Enter name' }); return }
            const updateData = {
                username: values.name,
                firstName: values.name,
                lastName: values.name,
                id: values.id || '',
                bio: values.bio,
                email: values.email || '',
                password: values.password,
                user_type:'user',
                permissions: permissions,
            };


            if (values.profile_pic) {
                // @ts-ignore
                updateData.profile_pic = values.profile_pic;
            }
            if (values.profile_pic == '') {
                // @ts-ignore
                updateData.profile_pic = '';
            }

            const updateResponse = await createUserMemberAccount(updateData);
            console.log(updateResponse)
            navigate('/users');
            setRemoving(false);
            return toast({ description: 'Profile updated Succesfully!', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } catch (error) {
            return toast({ description: 'Profile updated Failed!', variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }


    return (
        <div className="skewed-bg skewed-bg-secondary-right-tilt">
            <div className="content">
                <div className="heading-bold flex items-center justify-center pt-20">
                    Add User
                </div>
                <div className="white-container flex justify-center relative">
                    <div className="flex justify-center mt-12">
                        <Card className="card main_card_view">
                            {isUserCreating ? (<ProfilePageSkeleton />) : (
                                <div className="main-content overflow-x-hidden overflow-y-auto">
                                    <div className="edit_image_container">
                                        <div className="flex items-center gap-8">
                                            <div className="w-[110px] h-[110px]">
                                                {imageSrc == '' ? (<Avatar char={'U'} />) : <img src={`${imageSrc}`} alt="" className="w-[110px] h-[110px] rounded-full" />}

                                            </div>
                                            <div className="img_description flex flex-col ">
                                                <span className="page-innertitles mb-2.5">Upload new image</span>
                                                <span className="mb-4 font-normal text-[1rem] leading-[150%]">Max file size - 128kb</span>
                                                <div className="flex action_buttons gap-[10px]">
                                                    <input type="file" accept="image/*" multiple={false} className="hidden" onChange={() => handleFileChange} ref={fileInputRef} />
                                                    {/* @ts-ignore */}
                                                    <button className="bg-primary-500 rounded flex text-white items-center w-[140px] h-[30px] button_prime_text py-2.5" onClick={() => fileInputRef.current.click()}>
                                                        <SvgComponent className="pl-3 pr-2 " svgName="upload" />Upload Image
                                                    </button>

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
                                                <FormField control={form.control} name="name" render={({ field }) => (
                                                    <FormItem className="outline-none">
                                                        <FormLabel className="card_form_label">Username</FormLabel>
                                                        <FormControl>
                                                            <div className="text-center flex items-center gap-2">
                                                                <Input
                                                                    className="card_form_label_input_fields_full"
                                                                    placeholder="e.g User123"
                                                                    {...field}
                                                                    onBlur={() => checkUsernameExists()} // Invoke the checkUsernameExists function
                                                                />
                                                            </div></FormControl>
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>
                                                )}
                                                />
                                                <FormField control={form.control} name="email" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label">Email</FormLabel>
                                                        <FormControl>
                                                            <div className={`flex items-center gap-2 `}>
                                                                {/* @ts-ignore */}
                                                                <Input className={`card_form_label_input_fields_full `}  {...field} placeholder="e.g user@contentlocker.com" onBlur={() => checkEmailExists()} />
                                                            </div>

                                                        </FormControl>
                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />

                                                <FormField control={form.control} name="password" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label flex items-center gap-2">Password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 "></i> </TooltipMessage></FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    className="card_form_label_input_fields_full "
                                                                    {...field}
                                                                    placeholder="Password"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        {form.getValues('password') !== '' && form.getValues('password') !== undefined && <PasswordStrength passStrength={checkPasswordStrength(form.getValues('password') || '')} />}

                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="user_type"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                                    <SelectTrigger className="w-[151px]">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>

                                                                        <SelectItem key={'admin'} value={'admin'}>{'Admin'}</SelectItem>
                                                                        <SelectItem key={'user'} value={'user'}>{'User'}</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage className="shad-form_message" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="border border-light-gray rounded-md">
                                                    {websites && websites.length > 0 && websites.map((website: IWebsite) => {
                                                        return (
                                                            <div className="flex justify-between  border-b p-2 h-10" key={website?.id}>
                                                                <div className="flex gap-2">
                                                                    {website.icon ? <img src={website.icon} className="h-6 w-6" /> : <SvgComponent className="h-6 w-6" svgName="websites" />}
                                                                    <p className="font-inter text-sm font-medium">{website.business_name}</p>
                                                                </div>
                                                                <div className="flex gap-3">
                                                                    {/* @ts-ignore */}
                                                                    <input type="checkbox" name="editor_permission" checked={permissions[website.id]?.editor_permission || false} onChange={handleCheckboxChange(website.id)}
                                                                    />
                                                                    <span className="font-inter text-sm font-normal">Editor</span>
                                                                    {/* @ts-ignore */}
                                                                    <input type="checkbox" name="viewer_permission" checked={permissions[website.id]?.viewer_permission || false} onChange={handleCheckboxChange(website.id)}
                                                                    />
                                                                    <span className="font-inter text-sm font-normal">Viewer</span>
                                                                </div>
                                                            </div>
                                                        )

                                                    })}
                                                </div>

                                                <div className="flex gap-2.5 mt-[34px]">
                                                    <Button type="submit" className="text-white w-[50%] h-9 bg-primary-500 rounded inter-bold-16" disabled={isUserCreating && !removing}>
                                                        {
                                                            isUserCreating && !removing ? <Loader /> : 'Save changes'
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
    )
}

export default AddUser
