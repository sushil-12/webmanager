import { useUserContext } from "@/context/AuthProvider";
import { editProfileFieldSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUser } from "@/lib/types";
import ProfilePageSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import { cancelEmailChangeRequestApi, checkPasswordApi, checkUsername, editProfile, sendOtpForVerificationApi } from "@/lib/appwrite/api";
import SvgComponent from "@/utils/SvgComponent";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/shared/Loader";
import { Card } from "primereact/card";
import Avatar from "@/components/shared/Avatar";
import { confirmDialog } from 'primereact/confirmdialog';
import PasswordStrength from "@/components/shared/PasswordStrength";
import { InputText } from "primereact/inputtext";
import { checkPasswordStrength } from "@/lib/utils";
import TooltipMessage from "@/components/shared/TooltipMessage";


const ProfileUpdated = () => {

    const { user, isLoading, setRerender, checkAuthUser } = useUserContext();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<IUser>(user);
    const [loader, setloader] = useState(true);
    const [isUpdating, setisUpdating] = useState(false);
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
    console.log(disabled)
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
    const [validationErrorMessage, setValidationErrorMessage] = useState('');

    const checkPasswordConditions = () => {
        // @ts-ignore
        if (newPassword == confirmPassword && Object.values(checkPasswordStrength(confirmPassword)).every(value => value) && Object.values(checkPasswordStrength(oldPassword)).every(value => value) && Object.values(checkPasswordStrength(newPassword)).every(value => value)) {
            return false;
        }
        return true;
    }


    console.log(newPassword, confirmPassword, newPassword == confirmPassword, "PASWOOR")
    const confirmCancel = () => {
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to cancel existing email change request?',
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
            user.temp_email = '';
            setVisible(false);
            setSuccessMessage(false);
            setShowCancel(false)
        }

    }


    const handleModalStates = () => {
        // setResetEmail('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setUserName('');
        setValidationErrorMessage('');
    }

    /* confirm delete diologue */
    async function accept() {
        setRemoving(true);
        form.setValue('profile_pic', '');
        setImageSrc('');
        // await form.handleSubmit(onSubmit)();
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
        console.log(isLoading)
        console.log("form_type", form_type)
        return (
            <div className={`flex items-center justify-between ${dialog !== 'email' && dialog !== 'success' && 'mb-6'}`}>
                <h1 className='page-innertitles'>{dialog === 'verification' ? 'Enter verification code' : dialog == 'name' ? 'Edit Username' : dialog == 'email' ? 'Edit your email' : dialog == "success" ? 'We sent you a verification email' : 'Edit password'}</h1>
                <button onClick={() => {  handleModalStates(); setVisible(false); setOldPassword(''); setErrorMessage(''); setFormType('send_mail') }}><SvgComponent className="cursor-pointer float-right" svgName="close" /></button>
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
        let email = resetEmail;
        console.log(email, resetEmail, email.length, "EMAIL")
        if (email && email !== '') {
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
                user.temp_email = resetEmail;
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
                setValidationErrorMessage('');
            }
        }
    }

    const checkUsernameExists = async () => {
        if(username === '') return;
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

    const handleValidations = (value:string, key:string) => {
        let result;
        const emailSchema = editProfileFieldSchema.shape.email;
        const nameSchema = editProfileFieldSchema.shape.name;
        if (key === 'email') {
          result = emailSchema.safeParse(value);
        }
        if (key === 'name') {
            result = nameSchema.safeParse(value);
        }
        console.log(result)
        //@ts-ignore
        if (!result.success) {
            //@ts-ignore
            setValidationErrorMessage(result?.error?.issues[0]?.message);
        }else{
            setValidationErrorMessage('');
        }
    };


    useEffect(() => { console.log(currentUser, "CURRENTUSYER"); console.log(resetEmail, visible, !(user?.isEmailVerified), successMessage, "TEST MESSAGE TEST", imageSrc); console.log(!visible && !user?.isEmailVerified || resetEmail, "TestDat"); if (user) { setCurrentUser(user) }; if (currentUser) { form.setValue('name', currentUser.username); form.setValue('bio', currentUser?.bio); form.setValue('id', currentUser?.id) }; currentUser?.profile_pic !== '' && setImageSrc(currentUser?.profile_pic); form.setValue('email', currentUser?.email); setloader(false); setResetEmail(currentUser?.temp_email || ''), console.log("IMAGESRC", imageSrc) }, [currentUser, user])

    const form = useForm<z.infer<typeof editProfileFieldSchema>>({
        resolver: zodResolver(editProfileFieldSchema), mode: 'all',
        defaultValues: {
            id: currentUser?.id,
            name: currentUser?.username,
            bio: currentUser?.bio,
            email: currentUser?.email,
            password: 'Click the button to change your password'
        },
    });

   

    async function onSubmit(values: z.infer<typeof editProfileFieldSchema>) {

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
            setisUpdating(true);


            const updateData = {
                name: values.name,
                id: values.id,
                bio: values.bio,
                email: values.email,
                ...(isEditingPass ? { password: values.password } : {}),
            };

            if (values.profile_pic) {
                // @ts-ignore
                updateData.profile_pic = values.profile_pic;
            }
            if (values.profile_pic == '' || imageSrc == '') {
                // @ts-ignore
                updateData.profile_pic = '';
            }// @ts-ignore
            const updateResponse = await editProfile(updateData);
            console.log(updateResponse)
            setResetEmail('');
            form.setValue('password', 'Click the button to change your password')
            checkAuthUser();
            setRerender((prev: boolean) => !prev);
            setisUpdating(false);
            setIsEditingPass(false);
            setIsEditingEmail(false);
            setRemoving(false);
            return toast({ description: 'Profile updated Succesfully!', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        } catch (error) {
            return toast({ description: 'Profile update Failed!', variant: 'destructive', duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
        }
    }

    return (
        <div className="skewed-bg">
            <div className="content">
                <div className="heading-bold flex items-center justify-center pt-20">
                    My Profile
                </div>
                <div className="white-container flex justify-center relative">
                    <div className="flex justify-center mt-12">
                        <Card className="card main_card_view">
                            {loader ? (<ProfilePageSkeleton />) : (
                                <div className="main-content overflow-x-hidden overflow-y-auto">
                                    <div className="edit_image_container">
                                        <div className="flex items-center gap-8">
                                            <div className="w-[110px] h-[110px]">
                                                {imageSrc == '' || imageSrc === undefined ? (<Avatar char={currentUser?.username.charAt(0).toUpperCase()} />) : <img src={`${imageSrc}`} alt="" className="w-[110px] h-[110px] rounded-full" />}

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

                                                                {!isEditingEmail && (<button onClick={() => { event?.preventDefault(); setDialog('email'); setVisible(true); }} className="card_form_button disabled:opacity-50" disabled={(user?.temp_email != '')} >Edit Email</button>)
                                                                }
                                                            </div>

                                                        </FormControl>
                                                        {showCancel && (
                                                            ((resetEmail !== '' && !visible && !(user?.isEmailVerified)) || successMessage) && (
                                                                <div className="">
                                                                    <p className="font-inter text-sm font-normal">{`${resetEmail}`} is pending... </p><p>    <span className="flex">
                                                                        {!isCancelEmail && <button className="text-sm font-inter  text-main-bg-900  mr-1 hover:underline " onClick={confirmCancel}>Edit email</button>}
                                                                        {!isVerifyingEmail && <button className="text-sm font-inter text-error hover:underline" onClick={verifyEmail}>Resend</button>}
                                                                    </span></p>

                                                                </div>
                                                            )
                                                        )}

                                                        <FormMessage className="shad-form_message" />
                                                    </FormItem>

                                                )}
                                                />

                                                <FormField control={form.control} name="password" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="card_form_label">Password</FormLabel>
                                                        <FormControl>
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    className="card_form_label_input_fields "
                                                                    {...field}
                                                                    readOnly={true}
                                                                    onInputCapture={() => {
                                                                        const password = form.getValues('password');
                                                                        if (password && password.length > 7) {
                                                                            setDisabled(false);
                                                                        }
                                                                    }}
                                                                />
                                                                <Dialog visible={visible} onHide={() => { setVisible(false); handleModalStates() }} style={{ width: '540px', minWidth: '500px' }} header={headerTemplate} closable={false} draggable={false} className="form-dialogs"  >
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
                                                                                <>
                                                                                <div className="flex">
                                                                                    {/* @ts-ignore */}
                                                                                    <Input className= {`${errormessage !== '' || validationErrorMessage!=='' ? 'border border-error outline-none  w-[352px] mb-2 mr-2' :"outline-none  w-[352px] mb-2 mr-2 " }`}  min={6} onChange={(e) => setUserName(e.target.value)} value={username || form.getValues('name')} onInput={()=> {
                                                                                            //@ts-ignore
                                                                                            handleValidations(event.target.value, "name")}} placeholder="Enter user name" />
                                                                                    {<Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={checkUsernameExists} disabled={isCheckingUsername  || username === ''|| validationErrorMessage!==''}>
                                                                                        {
                                                                                            isCheckingUsername ? <Loader /> : 'Edit Name'
                                                                                        }
                                                                                    </Button>}
                                                                                </div>
                                                                                {validationErrorMessage !== '' && <p className="shad-form_message">{validationErrorMessage}</p>}
                                                                                </>
                                                                            )
                                                                                : dialog == 'email' ? (
                                                                                    <div className="flex flex-col">
                                                                                        <p className="subheading_dialog">If you change this, an email will be sent at your new address to confirm it. The new address wil not became active until confirmed</p>
                                                                                        <div className="flex">
                                                                                            {/* @ts-ignore */}
                                                                                            <Input className={`outline-none w-[70%] mb-2 mr-2 ${validationErrorMessage !=='' ? 'border border-error': ''}`} disabled={otpField} min={6} onChange={(e) => setResetEmail(e.target.value)} value={resetEmail || form.getValues('email')} placeholder="Enter your email address" onInput={()=> handleValidations(event.target.value, "email")} />
                                                                                            {<Button type="submit" className="text-white w-[30%] bg-primary-500 rounded text-[14px] " onClick={verifyEmail} disabled={isVerifyingEmail || otpField || resetEmail === ''|| validationErrorMessage!==''}>
                                                                                                {
                                                                                                    isVerifyingEmail ? <Loader /> : 'Change email'
                                                                                                }
                                                                                            </Button>}
                                                                                        </div>
                                                                                        {validationErrorMessage !== '' && <p className="shad-form_message">{validationErrorMessage}</p>}
                                                                                        {otpField && <div className="flex">
                                                                                            <Input className={`outline-none  w-[70%] mb-2 mr-2 ${errormessage !== '' && 'border border-error'}`} min={6} onChange={(e) => setVerificationCode(e.target.value)} value={verificationCode} placeholder="Enter Verification Code" />
                                                                                            {<Button type="submit" className="text-white w-[30%] bg-primary-500 rounded text-[14px] " onClick={verifyEmailForDialogue} disabled={isVerifyingEmailForDialogue}>
                                                                                                {
                                                                                                    isVerifyingEmailForDialogue ? <Loader /> : 'Resend Email'
                                                                                                }
                                                                                            </Button>}
                                                                                        </div>}

                                                                                    </div>
                                                                                )
                                                                                    : dialog == 'success' ? (
                                                                                        <><p className="subheading_dialog">Check your current email for the verification link</p>
                                                                                            <Button type="submit" className="text-white w-[100%] bg-primary-500 rounded text-[14px] " onClick={verifyEmail} disabled={isVerifyingEmail}>
                                                                                                {   
                                                                                                    isVerifyingEmail ? <Loader /> : <span className="text-md font-bold font-inter text-white ">Resend email</span>
                                                                                                }
                                                                                            </Button></>
                                                                                    )
                                                                                        : (
                                                                                            <div className="flex flex-col gap-4">
                                                                                                <div className="flex flex-col gap-2">
                                                                                                    <FormLabel className="card_form_label flex items-center gap-2">Enter your current password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
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
                                                                                                    <FormLabel className="card_form_label flex items-center gap-2">Confirm new password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage></FormLabel>
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
                                                                                                {<Button type="submit" className="text-white w-[131px] bg-primary-500 rounded text-[14px] " onClick={checkPassword} disabled={isLoadingPassword || checkPasswordConditions()} >
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

                                                <div className="flex gap-2.5 mt-[34px]">
                                                    <Button type="submit" className="text-white w-[50%] h-9 bg-primary-500 rounded inter-bold-16" disabled={isUpdating && !removing}>
                                                        {
                                                            isUpdating && !removing ? <Loader /> : 'Save changes'
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

export default ProfileUpdated;