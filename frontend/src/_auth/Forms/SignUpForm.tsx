import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthProvider";
import { z } from "zod";
import SvgComponent from "@/utils/SvgComponent";
import TooltipMessage from "@/components/shared/TooltipMessage";
import AppLogo from "@/components/shared/AppLogo";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { getHeroIcon } from "@/lib/HeroIcon";
import { useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckOutForm";

const SignUpForm = () => {
  const stripePromise = loadStripe('pk_test_51QNEM0EXM6E6dbLjiYTG1JCRfT2TAdosgJzd1SdfeiJAcnNoZy16BEUaJPauej6T98bfThimHTOVW3hBxqBUO0D400u9wZfbXQ');
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const [formState, setFormState] = useState('sign-up-form');
  const [subsbcriptionData, setSubsbcriptionData] = useState(null);

  const [planId, setPlanId] = useState('');
  const navigate = useNavigate();

  interface PricingPlan {
    name: string;
    price: string;
    features: string[];
    imageSrc: string;
    backgroundColor: string; // For dynamic background color
    buttonText: string;
    productId: string;
  }

  interface PricingCardProps {
    plan: PricingPlan;
  }
  const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    return (
      <div className="w-full md:w-1/2 lg:w-1/3 px-5 min-w-80">
        <div
          className={`hover-up-5 pt-8 pb-8 px-4 text-center rounded shadow bg-white `}
        >
          <img className="h-20 mb-6 mx-auto" src={plan.imageSrc} alt={plan.name} />
          <h3 className="mb-2 text-4xl font-bold font-heading ">{plan.name}</h3>
          <span className="text-4xl font-bold font-heading">{plan.price}</span>
          <p className="mt-2 mb-8">user per month</p>
          <div className="flex flex-col items-center mb-8">
            <ul className="">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex mb-3">
                  <svg
                    className="w-6 h-6 mr-2 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button className="block sm:inline-block py-4 px-6 text-xs text-white  text-center font-semibold leading-none bg-black hover:bg-primary-500 hover:text-white rounded" onClick={() => { setPlanId(plan?.productId); setFormState('payment_form') }}>
              Select Plan
            </button>

          </div>
        </div>
      </div>
    );
  };
  const pricingPlans = [
    {
      name: 'Startup',
      price: '$45.99',
      features: [
        '3 Emails',
        '1 Database',
        'Unlimited Domains',
        '10 GB Storage',
      ],
      imageSrc:
        'https://wp.alithemes.com/html/monst/assets/imgs/icons/startup.svg',
      backgroundColor: 'bg-white', // Can be bg-blue-500, bg-white, etc.
      buttonText: 'Start Free Trial',
      productId: 'prod_RFjsqoIg4jXUjZ',
    },
    {
      name: 'Agency',
      price: '$65.99',
      features: [
        '6 Emails',
        '4 Databases',
        'Unlimited Domains',
        '35 GB Storage',
      ],
      imageSrc:
        'https://wp.alithemes.com/html/monst/assets/imgs/icons/agency.svg',
      backgroundColor: 'bg-blue-500', // Background color
      buttonText: 'Start Free Trial',
      productId: 'prod_RFjsqoIg4jXUjZ',
    },
    {
      name: 'Enterprise',
      price: '$85.99',
      features: [
        '12 Emails',
        '8 Databases',
        'Unlimited Domains',
        '50 GB Storage',
      ],
      imageSrc:
        'https://wp.alithemes.com/html/monst/assets/imgs/icons/enterprise.svg',
      backgroundColor: 'bg-white',
      buttonText: 'Start Free Trial',
      productId: 'prod_RFjsqoIg4jXUjZ',
    },
  ];
  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema), mode: 'all',
    defaultValues: {
      username: "sushil",
      firstName: "sushil",
      lastName: "maurya",
      email: "sushil@yopmail.com",
      password: "Test@1234",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidationSchema>) {
    // @ts-ignore
    const newUser = await createUserAccount(values, ...subsbcriptionData);
    if (!newUser) {
      return toast({ variant: "destructive", title: "Signup Failed", description: "Something went wrong", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> })
    }
    if (newUser && newUser.code && newUser.code.includes('ERR')) {
      return toast({ variant: "destructive", title: "Signup Failed", description: newUser?.response?.data?.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
    }

    const session = true;
    if (!session) {
      return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" })
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      toast({ title: "Logged In Successfully" })
      navigate('/dashboard');
    } else { return toast({ variant: "destructive", title: "SigIn Failed", description: "Something went wrong" }) }

  }

  return (
    <Form {...form}>
      <div className="">
        <div className="flex align-middle text-center items-center justify-center mb-10">
          <AppLogo />
        </div>
        {formState === 'sign-up-form' ? (
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
              onSubmit={() => setFormState('select_pricing_plan')}
              className="space-y-1 flex flex-col w-full mt-4 signup_form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-5">Sign Up</h1>
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">Username</label>
                      <FormControl>
                        <div className={`p-inputgroup flex-1 inter-regular-14 form_labels`}>
                          <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error ? 'border-error' : ''}`}>
                            {getHeroIcon('UserIcon')}
                          </span>
                          <InputText
                            className={`${form.getFieldState(field.name).error ? 'border-error' : ''}`}
                            placeholder="Enter your username"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">Email</label>
                      <FormControl>
                        <div className={`p-inputgroup flex-1 inter-regular-14 form_labels`}>
                          <span className={`p-inputgroup-addon bg-white ${form.getFieldState(field.name).error ? 'border-error' : ''}`}>
                            <SvgComponent className="" svgName="mail" />
                          </span>
                          {/* @ts-ignore */}
                          <InputText
                            className={`${form.getFieldState(field.name).error ? 'border-error' : ''}`}
                            placeholder="Your Email Address"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                {/* First Name and Last Name */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="form_labels inter-regular-14">First Name</label>
                        <FormControl>
                          <Input className="shad-input" placeholder="Enter First Name" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="form_labels inter-regular-14">Last Name</label>
                        <FormControl>
                          <Input className="shad-input" placeholder="Enter Last Name" {...field} />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14 flex gap-2 align-middle items-center">
                        Password
                        <TooltipMessage title="password">
                          <i className="pi pi-info-circle mr-2 mt-1"></i>
                        </TooltipMessage>
                      </label>
                      <FormControl>
                        <Input
                          className="shad-input"
                          type="password"
                          placeholder="Enter Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="shad-button_primary">
                  {isCreatingUser ? (
                    <div className="flex-center gap-2">
                      <Loader />
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
            <p className="text-small-regular text-black text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 text-small-semibold ml-1">
                Log in
              </Link>
            </p>
          </Card>
        ) : formState === 'select_pricing_plan' ? (
          <>
            <div className="flex align-middle text-center items-center justify-center mb-10">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} />
              ))}
            </div>
          </>
        ) : formState === 'payment_form' ? (
          <>
            <div className="signup_form_container min-w-[550px]">
              <Elements stripe={stripePromise}>
                <CheckoutForm productId={planId} setSubsbcriptionData={setSubsbcriptionData} onSubmit={onSubmit} />
              </Elements>
            </div>
          </>
        ) : null}



      </div>
    </Form>
  );
};

export default SignUpForm;
