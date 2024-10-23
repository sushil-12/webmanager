import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { resetPasswordValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useResetPasswordAccount } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import SvgComponent from "@/utils/SvgComponent";
import AppLogo from "@/components/shared/AppLogo";
import PasswordStrength from "@/components/shared/PasswordStrength";
import { checkPasswordStrength } from "@/lib/utils";
import Alert from "@/components/shared/Alert";
import TooltipMessage from "@/components/shared/TooltipMessage";


const ResetPasswordForm = () => {
    const { toast } = useToast();
    let { token } = useParams();
    const [success, setSuccess] = useState(false)
    const { mutateAsync: resetPassword, isPending: isResetting } = useResetPasswordAccount();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setshowconfirmPassword] = useState(false);
    const recaptchaRef = useRef(null);
    const [isAlertMessage, setIsAlertMessage] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState('');
    const [alertMessage, setAlertMesssage] = useState('');

    const resetReCAPTCHA = () => {
        if (recaptchaRef.current) {
            // @ts-ignore
            recaptchaRef.current.reset();
        }
    };


    const checkPasswordConditions = () => {
        // @ts-ignore
        if (form.getValues('password') == form.getValues('confirm_password') && Object.values(checkPasswordStrength(form.getValues('confirm_password'))).every(value => value) && Object.values(checkPasswordStrength(form.getValues('password'))).every(value => value)) {
            return false;
        }
        return true;
    }
    const form = useForm<z.infer<typeof resetPasswordValidationSchema>>({
        resolver: zodResolver(resetPasswordValidationSchema), mode: 'all',
        defaultValues: {
            form_type: 'reset_password_form',
            password: "",
            confirm_password: '',
            reset_token: token,
        },
    });
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof resetPasswordValidationSchema>) {
        console.log(values)
        form.setValue('recaptcha_key', recaptchaValue)
        const session = await resetPassword({
            password: values.password,
            reset_token: token || '',
            form_type: 'reset_password_form',
            recaptcha_key: recaptchaValue
        });



        if (!session) {
            return toast({
                variant: "destructive",
                title: "Reset Failed",
                description: "Something went wrong"
                , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />

            });
        }
        const response_data = session?.data?.data;
        console.log(response_data)
        if (session?.response?.data?.status == 'restrict') {
            if (session?.response?.data?.errors == 403) {
               
                resetReCAPTCHA();
                setRecaptchaValue('');
                setIsAlertMessage(true);
                setAlertMesssage(session?.response?.data?.message?.toast_message)
                return;
            }
            return
        }
        if (session?.response?.data?.status == 'error') {
            return toast({
                variant: "destructive",
                title: session?.response?.data?.message
                , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />
            });  
        }
        if (response_data.password_reset) {
            setSuccess(true);
        } else {
            return toast({
                variant: "destructive",
                title: "Something went wrong"
                , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />
            });
        }

    }

    return (
        <Form {...form}>
            <div className="">
                <div className="flex align-middle text-center items-center justify-center mb-10">
                    <AppLogo />
                </div>
                {success && (
                    <Card
                        className=""
                        pt={{
                            root: { className: "reset_card login_cards rounded-xl" },
                            title: {
                                className: "text-main-bg-900 card_headings inter-regular-32",
                            },
                        }}
                    >

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container"
                        >
                            <div className="flex flex-col gap-8">
                                <h1 className="text-main-bg-900 leading-10 inter-regular-32 text-center">{`Password successfully updated!`}</h1>
                                <SvgComponent className="h-16 w-16 self-center" svgName="check" />
                                <Button
                                    type="submit"
                                    className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button h-10"
                                    onClick={() => navigate('/login')}
                                    disabled={isResetting}
                                >
                                    {isResetting && isResetting ? (
                                        <div className="flex-center gap-2">
                                            <Loader />
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
                {!success && (
                    <Card
                        className=""
                        pt={{
                            root: { className: "login_cards rounded-xl" },
                            title: {
                                className: "text-main-bg-900 card_headings inter-regular-32",
                            },
                        }}
                    >

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-1 flex flex-col  w-full mt-4 form_container"
                        >
                            <div className="flex flex-col gap-5 mb-6">
                                <h1 className="text-main-bg-900 card_headings  inter-regular-32 mb-5">{`Reset Password`}</h1>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14 flex items-center gap-2">
                                                New Password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage>
                                            </label>

                                            <FormControl>
                                                <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels">
                                                    <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error ? 'border-error' : ''}`} >
                                                        <SvgComponent className="" svgName="key-password" />
                                                    </span>
                                                    <InputText
                                                        size="sm"
                                                        className={`${form.getFieldState(field.name).error ? 'border-error no-right-border  border-right-none' : ' border-right-none no-right-border '}`}
                                                        type={showPassword ? 'text' : 'password'}

                                                        placeholder="Password"
                                                        {...field}
                                                    />
                                                    <span className={`p-inputgroup-addon add_icon w-10 cursor-pointer bg-white ${form.getFieldState(field.name).error ? 'border-error' : ''}`} onClick={() => setShowPassword(!showPassword)} >
                                                        <SvgComponent className="" svgName={!showPassword ? 'open_eye' : 'close_eye'} />
                                                    </span>
                                                </div>
                                            </FormControl>

                                            {form.getValues('password') !== '' && <PasswordStrength passStrength={checkPasswordStrength(form.getValues('password'))} /> }
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <label className="form_labels inter-regular-14 flex items-center gap-2">
                                                Confirm Password  <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage>
                                            </label>
                                            <FormControl>
                                                <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels">
                                                    <span className={`p-inputgroup-addon bg-white border-1 ${form.getFieldState(field.name).error || form.getValues('confirm_password') !== form.getValues('password') ? 'border-error' : ''}`} >
                                                        <SvgComponent className="" svgName="key-password" />
                                                    </span>
                                                    <InputText
                                                        size="sm"
                                                        type={showconfirmPassword ? 'text' : 'password'}
                                                        className={`${form.getFieldState(field.name).error || form.getValues('confirm_password') !== form.getValues('password') ? 'border-error border-right-none' : ' border-right-none'}`}
                                                        placeholder="Confirm Password"
                                                        {...field}
                                                    />
                                                    <span className={`p-inputgroup-addon add_icon w-10 cursor-pointer bg-white ${form.getFieldState(field.name).error || form.getValues('confirm_password') !== form.getValues('password') ? 'border-error' : ''}`} onClick={() => setshowconfirmPassword(!showconfirmPassword)} >
                                                        <SvgComponent className="" svgName={!showconfirmPassword ? 'open_eye' : 'close_eye'} />
                                                    </span>
                                                </div>
                                            </FormControl>
                                            {form.getValues('confirm_password') !== '' && <PasswordStrength passStrength={checkPasswordStrength(form.getValues('confirm_password'))} /> }
                                            {form.getValues('confirm_password') !== '' && form.getValues('confirm_password') !== form.getValues('password') &&
                                                <section className='flex gap-2 items-center' style={{marginTop:'-1px'}} >
                                                    <span>
                                                        <SvgComponent className="" svgName="error_password" />
                                                    </span>
                                                    <p className='password_error'>{'Password do not match'}</p>
                                                </section>
                                            }
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {isAlertMessage && <Alert message={alertMessage} height="38px" width="320px" type="error" />}
                            <Button
                                type="submit"
                                className="bg-main-bg-900 inter-regular-14 text-white action_button h-10 mt-32"
                                disabled={isResetting || isResetting || checkPasswordConditions() }
                            >
                                {isResetting && isResetting ? (
                                    <div className="flex-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Reset password"
                                )}
                            </Button>
                        </form>
                    </Card>
                )}

            </div>
        </Form>
    );
};

export default ResetPasswordForm;