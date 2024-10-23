import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { forgotPassword, loginInValidationSchema, signInValidationSchema, verifyAccount } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useRef, useState } from "react";
import { messages } from "@/constants/message";
import SvgComponent from "@/utils/SvgComponent";
import AppLogo from "@/components/shared/AppLogo";
import Alert from "@/components/shared/Alert";
import { checkCookieExists, checkPasswordStrength, getCookieValue } from "@/lib/utils";
// @ts-ignore
import Reaptcha from 'reaptcha';
import PasswordStrength from "@/components/shared/PasswordStrength";
import TooltipMessage from "@/components/shared/TooltipMessage";



const SignInForm = () => {

  const location = useLocation();
  const { pathname } = location;
  const form_state = (pathname === '/verify-account') ? 'verify_account_form' : (pathname === '/forgot-password') ? 'forgot_password_form' : 'login_form';

  const { toast } = useToast();
  const recaptchaRef = useRef(null);
  const resetReCAPTCHA = () => {
    if (recaptchaRef.current) {
      // @ts-ignore
      recaptchaRef.current.reset();
    }
  };
  const [state, setState] = useState<FormState>("login_form");
  const [timeLeft, setTimeLeft] = useState(10);
  const [running, setRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [isAlertMessage, setIsAlertMessage] = useState(false);
  const [isPromptErrorMessage, setIsPromptErrorMessage] = useState(false);
  const [setErrorFields, setSetErrorFields] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [alertMessage, setAlertMesssage] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState('');

  const [captchaVerification, setCaptchaVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaErrorMessage, setCaptchaErrorMessage] = useState(false);


  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const navigate = useNavigate();
  const [reCAPTCHALoaded, setReCAPTCHALoaded] = useState(false);
  const [toastLoacation, setToastLocation] = useState('normal');
  const [reload, setReload] = useState(true);
  function onChange(value: string) {
    setCaptchaVerification(true);
    form.setValue('recaptcha_key', value)
    setRecaptchaValue(value);
    setCaptchaErrorMessage(false);
  }

  useEffect(() => {
    if (state !== 'verify_account_form') {
      setState(form_state)
    }
    let interval: any;
    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(interval);
      setTimerFinished(true);
      form.setValue('form_type', 'login_form');
      form.setValue('verification_code', 'xxxxxx');
      resetReCAPTCHA();
      setRecaptchaValue('');
      form.setError('verification_code', {
        message: `Verification code expired. Please generate new.`
      },);

    }
    return () => clearInterval(interval);
  }, [state, pathname, running, timeLeft, location, reload])

  useEffect(() => {
    console.log(pathname, location, reCAPTCHALoaded)
    if (state !== 'verify_account_form') {
      const last_state = (pathname === '/verify-account') ? 'verify_account_form' : (pathname === '/forgot-password') ? 'forgot_password_form' : 'login_form';
      setState(last_state)
      form.setValue('form_type', last_state)
    }
  }, [location, pathname])

  useEffect(() => { console.log(reload, "fgfhfh") }, [reload])
  // Define type for the state
  type FormState =
    | "login_form"
    | "verify_account_form"
    | "forgot_password_form";

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const titles: Record<FormState, string> = {
    login_form: "Login",
    verify_account_form: "Verify Account",
    forgot_password_form: "Forgot Password",
  };
  const validationSchema = {
    login_form: loginInValidationSchema,
    verify_account_form: verifyAccount,
    forgot_password_form: forgotPassword,
  };

  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(validationSchema[state]),
    defaultValues: {
      form_type: state,
      email: "he0803testing@gmail.com",
      password: "Test@1234",
      staySignedIn: 'yes',
      verification_code: '',
      recaptcha_key: '',
    },
  });
  console.log(isUserLoading, "iseUserLoading", form);

  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof signInValidationSchema>) {
    setIsAlertMessage(false);
    setSetErrorFields(false);
    form.setValue('recaptcha_key', recaptchaValue)
    console.log("TETSUUUU", form_state)
    if (form.getValues('form_type') !== 'verify_account_form' && form.getValues('form_type') !== 'forgot_password_form') {
      if (!captchaVerification || recaptchaValue == '') {
        setCaptchaErrorMessage(true);
        return;
      }
    }
    if (checkCookieExists('isRestricted')) {
      console.log(timeLeft, "kshd")
      setSetErrorFields(true);
      setIsAlertMessage(true);
      setIsPromptErrorMessage(false)
      // @ts-ignore
      const message = checkCookieExists('isRestrictedMessage') ? getCookieValue('isRestrictedMessage') || "Your account is restricted." : 'Your account is restricted.';
      setAlertMesssage(`${message}`);
      return;
    }

    const session = await signInAccount({
      // @ts-ignore
      email: values.email,
      password: values.password,
      staySignedIn: values.staySignedIn,
      form_type: values.form_type,
      verification_code: values.verification_code,
      recaptcha_key: recaptchaValue
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "SignIn Failed",
        description: messages.default_error
        , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />
      });
    }
    if (session?.response?.data?.status == 'error') {
      setSetErrorFields(true);
      resetReCAPTCHA();
      setRecaptchaValue('');
      console.log(session?.response?.data)
      if (session?.response?.data?.message?.field_error == 'password') {
        setIsPromptErrorMessage(true);
        const attemptsRemaining = session?.response?.data?.message?.attempts_remaining;
        const attemptMessage = attemptsRemaining !== undefined ? `<strong>Attempts remaining: ${attemptsRemaining}</strong>` : '';
        setPromptMessage(`${session?.response?.data?.message?.message} ${attemptMessage}`);
        form.setError(session?.response?.data?.message?.field_error, { message: session?.response?.data?.message?.message })
      }
      else {
        form.setError(session?.response?.data?.message?.field_error, { message: `${session?.response?.data?.message?.message}` });
        if (session?.response?.data?.message?.field_error == 'verification_code') {
          setState('verify_account_form');
          form.setValue('form_type', 'verify_account_form')
        }
      }

      return;
    }

    if (session?.response?.data?.status == 'restrict') {
      const restrictedTill = session?.response?.data?.message?.restricted_till;
      if (session?.response?.data?.errors == 403) {
        setToastLocation('recaptcha');
        setReload(!reload);
        resetReCAPTCHA();
        setRecaptchaValue('');
      }

      if (restrictedTill) {
        const expirationDate: Date = new Date(Date.now() + restrictedTill);
        console.log(expirationDate);
        document.cookie = `isRestricted=true; expires=${expirationDate.toUTCString()}; path=/;`;
        document.cookie = `isRestrictedMessage=${session?.response?.data?.message?.toast_message}; expires=${expirationDate.toUTCString()}; path=/; `;

      }
      setIsAlertMessage(true);
      setAlertMesssage(session?.response?.data?.message?.toast_message)
      if (session?.response?.data?.message?.field_error == 'password') {
        setIsPromptErrorMessage(true);
        const attemptsRemaining = session?.response?.data?.message?.attempts_remaining;
        const attemptMessage = attemptsRemaining !== undefined ? `<strong>Attempts remaining: ${attemptsRemaining}</strong>` : '';
        setPromptMessage(`${session?.response?.data?.message?.message} ${attemptMessage}`);
        form.setError(session?.response?.data?.message?.field_error, { message: session?.response?.data?.message?.message })

      }
      form.setError(session?.response?.data?.message?.field_error, { message: session?.response?.data?.message?.message })
      return;
    }


    if (state == 'login_form' || form.getValues('form_type') == 'login_form') {
      const response_data = session?.data?.data;
      if (response_data?.email_sent) {
        setRunning(true)
        form.clearErrors('verification_code');
        form.setValue('verification_code', '')
        setState('verify_account_form');
        form.setValue('form_type', 'verify_account_form')
        setTimeLeft(120)
        setTimerFinished(false)
        return toast({ description: "Verification Code Sent Succesfully", variant: "default", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
      }
    }
    if (state == 'forgot_password_form') {
      const response_data = session?.data?.data;
      if (response_data?.reset_link_sent) {
        setCaptchaErrorMessage(false);
        resetReCAPTCHA();
        setRecaptchaValue('');
        navigate('/login');
        return toast({ description: "Reset link sent Succesfully", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
      } else {
        return toast({ variant: "destructive", title: "Something went wrong!", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
      }
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      toast({ description: "Logged In Successfully", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> });
      navigate("/dashboard");
    } else {
      const statuscode = session?.response?.data?.statusCode;
      const message = session?.response?.data?.message;
      const title = session?.response?.data?.status;

      return toast({
        variant: "destructive",
        title: title,
        description: message + "(" + statuscode + ")"
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
        <Card
          className=""
          pt={{
            root: { className: "login_cards rounded-xl" },
            title: {
              className: "text-main-bg-900 card_headings inter-regular-32",
            },
          }}
        >
          {state === "login_form" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings  inter-regular-32 mb-5">{`${titles[state]}`} </h1>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    console.log(form.getFieldState(field.name).error || isAlertMessage || setErrorFields, "form.getFieldState(field.name).error || isAlertMessage || setErrorFields")
                    return (
                      <FormItem>
                        <label className="form_labels inter-regular-14">
                          Email
                        </label>
                        <FormControl>
                          <div className={`p-inputgroup flex-1 inter-regular-14 form_labels`}>
                            <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`} >
                              <SvgComponent className="" svgName="mail" />
                            </span>
                            {/* @ts-ignore */}
                            <InputText
                              className={`${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`}
                              placeholder="Your Email Address"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14 flex gap-2 align-middle items-center">
                        Password <TooltipMessage title="password"><i className="pi pi-info-circle mr-2 mt-1"></i> </TooltipMessage>
                      </label>
                      <FormControl>
                        <div className="p-inputgroup inputgroup-no-right-border flex-1 inter-regular-14 form_labels">
                          <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`} >
                            <SvgComponent className="" svgName="key-password" />
                          </span>
                          <InputText
                            size="sm"
                            type={showPassword ? 'text' : 'password'}
                            style={{ borderRight: 'none !important' }}
                            className={`${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error border-right-none' : ' border-right-none'}`}
                            placeholder="Your Password"
                            {...field}
                          />
                          <span className={`p-inputgroup-addon w-10 cursor-pointer bg-white ${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`} onClick={() => setShowPassword(!showPassword)} >
                            <SvgComponent className="" svgName={!showPassword ? 'open_eye' : 'close_eye'} />
                          </span>
                        </div>

                      </FormControl>

                      {
                        !isAlertMessage && isPromptErrorMessage ? (
                          <div className="shad-form_message toaster-alert" dangerouslySetInnerHTML={{ __html: promptMessage }}></div>
                        ) : (
                          form.formState.errors.password ? (
                            <PasswordStrength passStrength={checkPasswordStrength(form.getValues('password'))} />
                          ) : null
                        )
                      }
                    </FormItem>
                  )}
                />
              </div>
              {/* @ts-ignore */}
              {isAlertMessage && toastLoacation == 'normal' && <Alert message={alertMessage} height="38px" width="320px" type="error" />}
              {isAlertMessage && toastLoacation == 'recaptcha' && <Alert message={alertMessage} height="38px" width="320px" type="error" />}
              <p className="text-small-regular text-dark-2 text-right navi" >
                <Link
                  to='/forgot-password'
                  onClick={() => { setState('forgot_password_form'); resetReCAPTCHA(); setCaptchaErrorMessage(false); setAlertMesssage(''); form.setValue('form_type', 'forgot_password_form') }}
                  className="text-main-bg-900 inter-regular-14 p-0 mt-[12px]"
                >
                  Forgot password?
                </Link>
              </p>
              <Reaptcha
                ref={recaptchaRef}
                className="w-full mt-4 recaptcha"
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onLoad={() => { setReCAPTCHALoaded(true); }}
                onVerify={onChange}
              />
              {captchaErrorMessage && <FormMessage className="shad-form_message recaptcha">Please fill out the ReCAPTCHA.</FormMessage>}

              <FormField
                control={form.control}
                name="staySignedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center align-middle mt-5">
                        <Checkbox
                          inputId="staySignedIn"
                          className="form_check"
                          checked={form.getValues("staySignedIn") === 'yes'}
                          onChange={() => {
                            const newValue = form.getValues("staySignedIn") === 'yes' ? 'no' : 'yes';
                            form.setValue("staySignedIn", newValue);
                            field.onChange(newValue);
                            console.log(form, form.getValues("staySignedIn") === 'yes')
                          }}
                        />

                        <label
                          htmlFor="staySignedIn"
                          className="ml-2 inter-regular-14 text-light-5 "
                        >
                          Stay singed in for a week
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-main-bg-900 inter-regular-14 text-white mt-3 action_button h-10"
                disabled={isSigningIn || isUserLoading}
              >
                {isSigningIn ? (
                  <div className="flex-center gap-4">
                    <Loader />
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          )}
          {state === "forgot_password_form" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-5">{`${titles[state]}`}</h1>
                {/*  */}
                <div className="col">

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <label className="form_labels inter-regular-14">
                          Email
                        </label>
                        <FormControl>
                          <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                            <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`} >
                              <SvgComponent className="" svgName="mail" />
                            </span>
                            {/* @ts-ignore */}
                            <InputText
                              className={`${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`}
                              placeholder="Your Email Address"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}

                  />
                  {/* @ts-ignore */}
                  {isAlertMessage && toastLoacation == 'normal' && <Alert message={alertMessage} height="38px" width="320px" type="error" />}
                </div>

                {isAlertMessage && toastLoacation == 'recaptcha' && <Alert message={alertMessage} height="38px" width="320px" type="error" />}

                <Button
                  type="submit"
                  className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                  disabled={isSigningIn || isUserLoading}
                >
                  {isSigningIn ? (
                    <div className="flex-center gap-4">
                      <Loader />
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}
          {state === "verify_account_form" && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 flex flex-col  w-full mt-4 form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-3">{`${titles[state]}`}</h1>
                <p className="form_labels inter-regular-14 font-medium">
                  Please, enter the verification code we sent to your email address.
                </p>
                <FormField
                  control={form.control}
                  name="verification_code"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        <div className="flex justify-between">
                          <span className="self-center">Verification Code</span>
                          <span className="flex gap-1">{!timerFinished ? (<><span className="self-center"><SvgComponent className="h-auto" svgName={`${minutes == 0 && seconds < 21 ? "clockexpired" : "timer"}`} /> </span><span className="inter-regular-14"> {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span></>) : (<><span className="self-center"><SvgComponent className="h-auto" svgName="clockexpired" /></span><span className="inter-regular-14"> {`00:00`}</span></>)}</span>
                        </div>
                      </label>
                      <FormControl>
                        <div className="p-inputgroup flex-1 inter-regular-14 form_labels">
                          <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`} >
                          </span>
                          <InputText
                            maxLength={6}
                            className={`${form.getFieldState(field.name).error || isAlertMessage || setErrorFields ? 'border-error' : ''}`}
                            readOnly={timerFinished}
                            placeholder="Enter verfication code "
                            {...field}
                            onInput={() => { console.log(form.formState, "FORM BURTTON"), form.clearErrors('verification_code'); }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />
                {!timerFinished ? (<Button
                  type="submit"
                  className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <div className="flex-center gap-4 h-10">
                      <Loader />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>) : (
                  <>
                    <Reaptcha
                      ref={recaptchaRef}
                      className="w-full mt-4 recaptcha"
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onLoad={() => { setReCAPTCHALoaded(true); }}
                      onVerify={onChange}
                    />
                    {captchaErrorMessage && <FormMessage className="shad-form_message recaptcha">Please fill out the ReCAPTCHA.</FormMessage>}
                    {isAlertMessage && toastLoacation == 'recaptcha' && <Alert message={alertMessage} height="38px" width="320px" type="error" />}
                    <Button
                      type="submit"
                      // onClick={(e) => {e.preventDefault();e.target.click}}
                      className="bg-main-bg-900 inter-regular-14 text-white h-10 "
                      disabled={isSigningIn || !captchaVerification}
                    >
                      {isSigningIn ? (
                        <div className="flex-center gap-4 h-10">
                          <Loader />
                        </div>
                      ) : (
                        "Generate Code"
                      )}
                    </Button>
                  </>
                )}


              </div>
            </form>
          )}
        </Card>
      </div>
    </Form>
  );
};

export default SignInForm;
