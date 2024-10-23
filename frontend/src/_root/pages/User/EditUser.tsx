import { useUserContext } from "@/context/AuthProvider";
import { createOrEditUserSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUser, IWebsite } from "@/lib/types";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import { cancelEmailChangeRequestApi, checkPasswordApi, checkUsername, sendOtpForVerificationApi } from "@/lib/appwrite/api";
import SvgComponent from "@/utils/SvgComponent";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/Loader";
import { Card } from "primereact/card";
import Avatar from "@/components/shared/Avatar";
import { confirmDialog } from 'primereact/confirmdialog';
import PasswordStrength from "@/components/shared/PasswordStrength";
import { InputText } from "primereact/inputtext";
import { checkPasswordStrength} from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateEditMemebrAccount, useDeleteUserByID, useGetUserMemberProfile } from "@/lib/react-query/queriesAndMutations";
import TooltipMessage from "@/components/shared/TooltipMessage";


const EditUser = () => {

    const navigate = useNavigate();
    const { user_id } = useParams();
    const { mutateAsync: getUserMemberProfile, isPending: isUserLoading } = useGetUserMemberProfile();
    const { mutateAsync: createUserMemberAccount, isPending: isUserCreating } = useCreateEditMemebrAccount();
    const { mutateAsync: deleteUserByID, isPending: deletingUser } = useDeleteUserByID();

    const { setRerender, navItems } = useUserContext();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [loader, setLoader] = useState(true);
    const fileInputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [verificationCode, setVerificationCode] = useState('');
    const [username, setUserName] = useState('');
    const [errormessage, setErrorMessage] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');

    const [disabled, setDisabled] = useState(false);
    console.log(disabled, deletingUser)
    const [removing, setRemoving] = useState(false);
    const [dialog, setDialog] = useState('');

    const [resetEmail, setResetEmail] = useState('');
    const [form_type, setFormType] = useState('send_mail');
    const [successMessage, setSuccessMessage] = useState(false)
    console.log(successMessage)

    const [isEditingEmail, setIsEditingEmail] = useState(false); // State to track whether email is being edited
    const [isLoadingPassword, setIsLoadingPassword] = useState(false); // State to track whether email is being edited
    const [isEditingPass, setIsEditingPass] = useState(false); // State to track whether email is being edited setIsVerifyingEmail
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // State to track whether email is being edited 
    const [isVerifyingEmailForDialogue, setIsVerifyingEmailForDialogue] = useState(false); // State to track whether email is being edited 
    const [isCheckingUsername, setisCheckingUsername] = useState(false); // State to track whether email is being edited 


    const [visible, setVisible] = useState(false);
    const [otpField, setOtpField] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCancelEmail, setIsCancelEmail] = useState(false);
    const [showCancel, setShowCancel] = useState(true);
    const [websites, setWebsites] = useState<IWebsite[]>([]);
    const [permissions, setPermissions] = useState({});
    console.log(isCancelEmail )

    const checkPasswordConditions = () =>{
        // @ts-ignore
        if(newPassword == confirmPassword && Object.values(checkPasswordStrength(confirmPassword)).every(value => value) && Object.values(checkPasswordStrength(oldPassword)).every(value => value) && Object.values(checkPasswordStrength(newPassword)).every(value => value)){
            return false;
        }
        return true;
    }
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
            console.log("UPDATED PERMISSIONS", updatedPermissions)
            return updatedPermissions;
        });
    };

    async function acceptDeleteUser() {
        if (user_id) {
            const deleteWebsite = await deleteUserByID(user_id);
            if (deleteWebsite?.status == 'success') {
                navigate('/users');
                return toast({ variant: "default", description: deleteWebsite.data.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
            }
        }
    }

    const confirmDeleteUser = () => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to delete website?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => acceptDeleteUser(),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }


    const confirmCancel = () => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to cancel email change request?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => cancelEditEmailRequest(),
            acceptLabel: 'Yes, cancel request',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    console.log(confirmCancel)

    const cancelEditEmailRequest = async () => {
        event?.preventDefault();
        setIsCancelEmail(true);
        const result = await cancelEmailChangeRequestApi();
        if (result?.response?.data?.status == 'error') {
            setIsCancelEmail(false);
            return;
        } else {
            setIsCancelEmail(false);
            setErrorMessage('');
            setVisible(false);
            setSuccessMessage(false);
            setShowCancel(false)
        }

    }


    const handleModalStates = () => {
        setResetEmail('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setUserName('');
    }

    /* confirm delete diologue */
    async function accept() {
        setRemoving(true);
        form.setValue('profile_pic', '');
        setImageSrc('');
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


    const headerTemplate = () => {
        console.log("form_type", form_type)
        return (
            <div className={`flex items-center justify-between ${dialog !== 'email' && dialog !== 'success' && 'mb-6'}`}>
                <h1 className='page-innertitles'>{dialog === 'verification' ? 'Enter verification code' : dialog == 'name' ? 'Edit Username' : dialog == 'email' ? 'Edit your email' : dialog == "success" ? 'We sent you a verification email' : 'Edit password'}</h1>
                <button onClick={() => { setVisible(false); setOldPassword(''); setErrorMessage(''); setFormType('send_mail') }}><SvgComponent className="cursor-pointer float-right" svgName="close" /></button>
            </div>
        );
    };

    const checkPassword = async () => {
        setIsLoadingPassword(true);
        const result = await checkPasswordApi(oldPassword);
        if (result?.response?.data?.status == 'error') {
            setIsLoadingPassword(false);
            // setCurrentPasswordError(result?.response?.data?.message?.message);
            setCurrentPasswordError('Wrong password');

            return;
        } else {
            setIsLoadingPassword(false);
            form.setValue('password', confirmPassword);
            setErrorMessage('');
            setVisible(false);
            setIsEditingPass(!isEditingPass);
        }
    }

    const verifyEmail = async () => {
        event?.preventDefault();
        form.setValue('email', resetEmail);
        setVisible(false);
        return;
        let email = resetEmail;
        if (email && email.length > 0) {
            setIsVerifyingEmail(true);
            setFormType('send_mail')
            const result = await sendOtpForVerificationApi(email, 'send_mail');
            console.log(result?.data?.status, result, "TEST MESSAGE")
            if (result?.code == 'ERR_BAD_RESPONSE') {
                return toast({ description: result?.response?.data?.message, variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
            }

            if (result?.response?.data?.status == 'error') {
                setIsVerifyingEmail(false);
                setErrorMessage(result?.response?.data?.message?.message);
                return;
            } else if (result?.data?.status == 'success' && result?.data?.data?.email_sent) {
                setIsVerifyingEmail(false);
                setErrorMessage('');
                setVisible(true);
                setDialog('success');
                setSuccessMessage(true)

                //form.setValue('email', resetEmail)
            }
        }
    }

    const verifyEmailForDialogue = async () => {
        if (verificationCode && verificationCode.length > 0) {
            setIsVerifyingEmailForDialogue(true);
            const result = await sendOtpForVerificationApi(verificationCode, form_type);
            console.log(result)
            if (result?.response?.data?.status == 'error') {
                setIsVerifyingEmailForDialogue(false);
                setVerificationCode('');
                setErrorMessage(result?.response?.data?.message?.message);
                return;
            } else if (result?.data?.status == 'success' && result?.data?.data?.verified) {
                setIsVerifyingEmailForDialogue(false);
                setErrorMessage('');
                form.setValue('email', resetEmail)
                setFormType('send_mail')
                setIsEmailVerified(true);
                setVerificationCode('')
                setDialog('')
                setVisible(false);
                setOtpField(false);
                setResetEmail('');
            }
        }
    }

    const checkUsernameExists = async () => {
        setisCheckingUsername(true);
        const result = await checkUsername(username);
        if (result?.data?.data?.status == 'error') {
            setisCheckingUsername(false);
            console.log(errormessage)
            return;
        } else {
            if (!result?.data?.data?.isUsernameAvailable) {
                setErrorMessage(result?.data?.data?.message);
                setisCheckingUsername(false);
            } else {
                setisCheckingUsername(false);
                form.setValue('name', username)
                console.log(form.getValues('name'))
                setVisible(false);
            }

        }
    }

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

    const form = useForm<z.infer<typeof createOrEditUserSchema>>({
        resolver: zodResolver(createOrEditUserSchema),
        defaultValues: {
            id: currentUser?.id,
            name: currentUser?.username,
            bio: currentUser?.bio,
            email: currentUser?.email,
            password: 'Click the button to change your password'
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user_id) {
                    const result = await getUserMemberProfile(user_id);
                    if (result && result.data) {
                        setCurrentUser(result.data);
                        if (result.data.permissions) setPermissions(result.data.permissions)
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (!currentUser) {
            fetchData();
        } else {
            // Once currentUser is set, populate form fields
            form.setValue('name', currentUser.username || '');
            form.setValue('bio', currentUser.bio || '');
            form.setValue('id', currentUser.id || '');
            setImageSrc(currentUser.profile_pic || '');
            form.setValue('email', currentUser.email || '');
            setResetEmail(currentUser.temp_email || '');
            setLoader(false);

            console.log("form", currentUser, form.getValues('id'))
        }
    }, [currentUser, user_id, form]);

    useEffect(() => {
        setWebsites(navItems.websites);
    }, [navItems]);




    async function onSubmit(values: z.infer<typeof createOrEditUserSchema>) {
        try {
            if (isEditingPass) {
                const password = form.getValues('password') || 'x';
                if (password.length < 8) {
                    form.setError('password', {
                        type: 'minLength',
                        message: 'Password must be at least 8 characters long',
                    });
                    setDisabled(true)
                    return;
                }
            } else {
                setDisabled(false)
            }

            console.log(values, "VALUES")

            const updateData = {
                username: values.name,
                firstName: values.name,
                lastName: values.name,
                id: values.id || '',
                bio: values.bio,
                email: values.email || '',
                permissions: permissions,
                ...(isEditingPass ? { password: values.password } : {}),
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
            form.setValue('password', 'Click the button to change your password')
            setRerender((prev: boolean) => !prev);
            setIsEditingPass(false);
            setIsEditingEmail(false);
            setRemoving(false);
            navigate('/users');
            return toast({ description: 'User Profile Updated Succesfully!', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } catch (error) {
            return toast({ description: 'User Profile Update Failed!', variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }

    return (
        <div className="skewed-bg skewed-bg-secondary-right-tilt">
            <div className="content">
                <div className="heading-bold flex items-center justify-center pt-20">
                    {!user_id ? 'Add User' : 'Edit User'}
                </div>
                <div className="white-container flex justify-center relative">
                    <div className="flex justify-center mt-12">
                        <Card className="card main_card_view">
                            {loader || isUserLoading ? (<ProfilePageSkeleton />) : (
                                <div className="main-content overflow-x-hidden overflow-y-auto">
                                    <div className="edit_image_container">
                                        <div className="flex items-center gap-8">
                                            <div className="w-[110px] h-[110px]">
                                                {imageSrc == '' ? (<Avatar char={currentUser ? currentUser?.username.charAt(0).toUpperCase() : 'u'} />) : <img src={`${imageSrc}`} alt="" className="w-[110px] h-[110px] rounded-full" />}

                                            </div>
                                            <div className="img_description flex flex-col ">
                                                <span className="page-innertitles mb-2.5">Upload new image</span>
                                                <span className="mb-4 font-normal text-[1rem] leading-[150%]">Max file size - 128kb</span>
                                                <div className="flex action_buttons gap-[10px]">
                                                    <input type="file" accept="image/*" multiple={false} className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                                                    {/* @ts-ignore */}
                                                    <button className="bg-primary-500 rounded flex text-white items-center w-[140px] h-[30px] button_prime_text py-2.5" onClick={() => fileInputRef.current.click()}>
                                                        <SvgComponent className="pl-3 pr-2 " svgName="upload" />Upload Image
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
                                                <FormField control={form.control} name="name" render={({ field }) => (
                                                    <FormItem className="outline-none">
                                                        <FormLabel className="card_form_label">Username</FormLabel>
                                                        <FormControl>
                                                            <div className="text-center flex items-center gap-2">
                                                                <Input className="card_form_label_input_fields" placeholder="Add name" {...field} readOnly />
                                                                <button onClick={(e) => { e.preventDefault(); setDialog('name'); setVisible(true) }} className="card_form_button"  >Edit Name</button>
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
                                                                <Input className={`card_form_label_input_fields   ${isEmailVerified && 'pointer-events-none'}`} readOnly={!isEditingEmail} {...field} />

                                                                {!isEditingEmail && (<button onClick={() => { event?.preventDefault(); setDialog('email'); setVisible(true); }} className="card_form_button disabled:opacity-50">Edit Email</button>)
                                                                }
                                                            </div>

                                                        </FormControl>
                                                        {showCancel && (
                                                            ((resetEmail !== '' && !visible && !(currentUser && currentUser?.isEmailVerified)) || successMessage) && (
                                                                <div className="flex">
                                                                    {/* <p className="font-inter text-xs">{`There is a pending change of the email to ${resetEmail}`}</p> */}
                                                                    {/* <div className="flex ml-2">
                                                                        {!isCancelEmail && <button className="text-xs font-inter text-error mr-1 underline" onClick={confirmCancel}>cancel</button>}
                                                                        {!isVerifyingEmail && <button className="text-xs font-inter text-main-bg-900 underline" onClick={verifyEmail}>resend</button>}
                                                                    </div> */}
                                                                </div>
                                                            )
                                                        )}

                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />

                                                <FormField control={form.control} name="password" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label flex items-center gap-2">Password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    className="card_form_label_input_fields "
                                                                    {...field}
                                                                    readOnly={!isEditingPass}
                                                                    onInputCapture={() => {
                                                                        const password = form.getValues('password');
                                                                        if (password && password.length > 7) {
                                                                            setDisabled(false);
                                                                        }
                                                                    }}
                                                                />
                                                                <Dialog visible={visible} onHide={() => { setVisible(false); handleModalStates() }} style={{ width: '540px', minWidth: '500px' }} className="form-dialogs"  header={headerTemplate} closable={false} draggable={false} >
                                                                    {
                                                                        dialog == 'verification' ? (
                                                                            <div className="flex">
                                                                                <Input className="outline-none  w-[352px] mb-2 mr-2" min={6} onChange={(e) => setVerificationCode(e.target.value)} value={verificationCode} placeholder="Enter Verification Code" />
                                                                                {!isEditingPass && <Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={verifyEmailForDialogue} disabled={isVerifyingEmailForDialogue}>
                                                                                    {
                                                                                        isVerifyingEmailForDialogue ? <Loader /> : 'Verify Email'
                                                                                    }
                                                                                </Button>}
                                                                            </div>
                                                                        )
                                                                            :
                                                                            dialog == 'name' ? (
                                                                                <div className="flex">
                                                                                    <Input className="outline-none  w-[352px] mb-2 mr-2" min={6} onChange={(e) => setUserName(e.target.value)} value={username ||  form.getValues('name')} placeholder="Enter user name" />
                                                                                    {!isEditingPass && <Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={checkUsernameExists} disabled={isCheckingUsername}>
                                                                                        {
                                                                                            isCheckingUsername ? <Loader /> : 'Edit Name'
                                                                                        }
                                                                                    </Button>}
                                                                                </div>
                                                                            )
                                                                                : dialog == 'email' ? (
                                                                                    <div className="flex flex-col">
                                                                                        <p className="subheading_dialog">If you change this, an email will be sent at your new address to confirm it. The new address wil not became active until confirmed</p>
                                                                                        <div className="flex">
                                                                                               {/* @ts-ignore */}
                                                                                            <Input className="outline-none w-[70%] mb-2 mr-2" disabled={otpField} min={6} onChange={(e) => setResetEmail(e.target.value)} value={resetEmail ||  form.getValues('email')} placeholder="Enter your email address" />
                                                                                            {!isEditingPass && <Button type="submit" className="text-white w-[30%] bg-primary-500 rounded text-[14px] " onClick={verifyEmail} disabled={isVerifyingEmail || otpField}>
                                                                                                {
                                                                                                    isVerifyingEmail ? <Loader /> : 'Change email'
                                                                                                }
                                                                                            </Button>}
                                                                                        </div>
                                                                                        {otpField && <div className="flex">
                                                                                            <Input className={`outline-none  w-[70%] mb-2 mr-2 ${errormessage !== '' && 'border border-error'}`} min={6} onChange={(e) => setVerificationCode(e.target.value)} value={verificationCode} placeholder="Enter Verification Code" />
                                                                                            {!isEditingPass && <Button type="submit" className="text-white w-[30%] bg-primary-500 rounded text-[14px] " onClick={verifyEmailForDialogue} disabled={isVerifyingEmailForDialogue}>
                                                                                                {
                                                                                                    isVerifyingEmailForDialogue ? <Loader /> : 'Verify Email'
                                                                                                }
                                                                                            </Button>}
                                                                                        </div>}

                                                                                    </div>
                                                                                )
                                                                                    : dialog == 'success' ? (
                                                                                        <p className="subheading_dialog">Check your current email for the verification link</p>
                                                                                    )
                                                                                        : (
                                                                                            <div className="flex flex-col gap-4">
                                                                                                <div className="flex flex-col gap-2">
                                                                                                    <FormLabel className="card_form_label items-center gap-2 flex">Enter your current password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
                                                                                                    <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels ">
                                                                                                        <span className={`p-inputgroup-addon bg-light-gray ${currentPasswordError !== '' ? 'border-error border' : ''}`} >
                                                                                                        </span>
                                                                                                        <InputText
                                                                                                            size="sm"
                                                                                                            className={`bg-light-gray border-right-none no-right-border ${currentPasswordError !== '' ? 'border-error border' : ''} '`}
                                                                                                            type={showOldPassword ? 'text' : 'password'}
                                                                                                            placeholder="Password"
                                                                                                            value={oldPassword}
                                                                                                            onChange={(e) => setOldPassword(e.target.value)}
                                                                                                        />
                                                                                                        <span className={`p-inputgroup-addon add_icon w-10 cursor-pointer bg-light-gray ${currentPasswordError !== '' ? 'border-error border' : ''}`} onClick={() => setShowOldPassword(!showOldPassword)} >
                                                                                                            <SvgComponent className="" svgName={!showOldPassword ? 'open_eye' : 'close_eye'} />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    {oldPassword !== '' && currentPasswordError == '' && <PasswordStrength passStrength={checkPasswordStrength(oldPassword)} />}
                                                                                                    {currentPasswordError !== ''} <FormMessage className="shad-form_message">{currentPasswordError}</FormMessage>
                                                                                                </div>
                                                                                                <div className="flex flex-col gap-2">
                                                                                                    <FormLabel className="card_form_label flex items-center gap-2">New Password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
                                                                                                    <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels ">
                                                                                                        <span className={`p-inputgroup-addon bg-light-gray ${form.getFieldState(field.name).error ? 'border-error' : ''}`} >
                                                                                                        </span>
                                                                                                        <InputText
                                                                                                            size="sm"
                                                                                                            className={`bg-light-gray border-right-none no-right-border '}`}
                                                                                                            type={showNewPassword ? 'text' : 'password'}
                                                                                                            placeholder="Password"
                                                                                                            value={newPassword}
                                                                                                            onChange={(e) => setNewPassword(e.target.value)}

                                                                                                        />
                                                                                                        <span className={`p-inputgroup-addon add_icon w-10 cursor-pointer bg-light-gray ${form.getFieldState(field.name).error ? 'border-error' : ''}`} onClick={() => setShowNewPassword(!showNewPassword)} >
                                                                                                            <SvgComponent className="" svgName={!showNewPassword ? 'open_eye' : 'close_eye'} />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    {newPassword !== '' && <PasswordStrength passStrength={checkPasswordStrength(newPassword)} />}
                                                                                                </div>
                                                                                                <div className="flex flex-col gap-2">
                                                                                                    <FormLabel className="card_form_label flex gap-2 items-center">Confirm new password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
                                                                                                    <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels ">
                                                                                                        <span className={`p-inputgroup-addon bg-light-gray ${form.getFieldState(field.name).error ? 'border-error' : ''}`} >
                                                                                                        </span>
                                                                                                        <InputText
                                                                                                            size="sm"
                                                                                                            className={`bg-light-gray border-right-none no-right-border '}`}
                                                                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                                                                            placeholder="Password"
                                                                                                            value={confirmPassword}
                                                                                                            onChange={(e) => setConfirmPassword(e.target.value)}

                                                                                                        />
                                                                                                        <span className={`p-inputgroup-addon add_icon w-10 cursor-pointer bg-light-gray ${form.getFieldState(field.name).error ? 'border-error' : ''}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                                                                                                            <SvgComponent className="" svgName={!showConfirmPassword ? 'open_eye' : 'close_eye'} />
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    {confirmPassword !== '' && <PasswordStrength passStrength={checkPasswordStrength(confirmPassword)} />}
                                                                                                    {confirmPassword !== '' && newPassword !== confirmPassword &&
                                                                                                        <section className='flex gap-2 items-center mt--4' style={{ marginTop: "-8px" }}>
                                                                                                            <span>
                                                                                                                <SvgComponent className="" svgName="error_password" />
                                                                                                            </span>
                                                                                                            <p className='password_error'>{'Confirm Password should match new password'}</p>
                                                                                                        </section>
                                                                                                    }
                                                                                                </div>
                                                                                                {!isEditingPass && <Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={checkPassword} disabled={isLoadingPassword || checkPasswordConditions()} >
                                                                                                    {
                                                                                                        isLoadingPassword ? <Loader /> : 'Reset Password'
                                                                                                    }
                                                                                                </Button>}
                                                                                            </div>
                                                                                        )
                                                                    }

                                                                    {errormessage != '' && <p className="text-sm ml-1 text-error">{errormessage}</p>}
                                                                </Dialog>
                                                                <button onClick={(e) => { e.preventDefault(); setDialog('password'); setVisible(true) }} className="card_form_button" >Edit Password</button>
                                                            </div>
                                                        </FormControl>

                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>



                                                )}
                                                />
                                                <div className="border border-light-gray rounded-md">
                                                    {websites && websites.map((website: IWebsite) => {
                                                        return (
                                                            <div className="flex justify-between  border-b p-2 h-10" key={website?.id}>
                                                                <div className="flex gap-2">
                                                                    {website.icon ? <img src={website.icon} className="h-6 w-6" /> : <SvgComponent className="h-6 w-6" svgName="websites" />}
                                                                    <p className="font-inter text-sm font-medium">{website.business_name}</p>
                                                                </div>
                                                                <div className="flex gap-3">
                                                                    {/* @ts-ignore */}
                                                                    <input type="checkbox" name="editor_permission" checked={permissions && permissions[website.id]?.editor_permission || false} onChange={handleCheckboxChange(website.id)}
                                                                    />
                                                                    <span className="font-inter text-sm font-normal">Editor</span>
                                                                    {/* @ts-ignore */}
                                                                    <input type="checkbox" name="viewer_permission" checked={permissions && permissions[website.id]?.viewer_permission || false} onChange={handleCheckboxChange(website.id)}
                                                                    />
                                                                    <span className="font-inter text-sm font-normal">Viewer</span>
                                                                </div>
                                                            </div>
                                                        )

                                                    })}
                                                </div>
                                                {<button className="text-error text-left " onClick={confirmDeleteUser}>Delete</button>}
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
    );
};

export default EditUser;