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
      name: "Basic Plan",
      price: "$25.00",
      features: [
        "Add websites",
        "Manage multiple post types",
        "Add unlimited pages",
        "Add and manage media",
        "Custom fields",
        "Manage SEO Schema",
      ],
      imageSrc:
        "/startup.svg", // Placeholder image, replace with relevant one
      backgroundColor: "bg-white",
      buttonText: "Choose Basic Plan",
      productId: 'prod_RFjsqoIg4jXUjZ',
    },
    {
      name: "Standard Plan",
      price: "$55.00",
      features: [
        "All features in Basic Plan",
        "Custom fields with support for images, GIFs, PDFs, and documents",
        "Add up to 3 websites",
        "Add and manage up to 3 users",
        "Share API data with frontend developers",
        "Customizable permissions for users",
      ],
      imageSrc:
        "/agency.svg", // Placeholder image, replace with relevant one
      backgroundColor: "bg-blue-500",
      buttonText: "Choose Standard Plan",
      productId: 'prod_RFjsqoIg4jXUjZ',
    },
    {
      name: "Premium Plan",
      price: "$75.00",
      features: [
        "All features in Standard Plan",
        "Unlimited websites",
        "Unlimited users",
        "Unlimited media",
        "Custom support feature",
        "In-app chat feature with push notifications",
      ],
      imageSrc:
        "/enterprise.svg", // Placeholder image, replace with relevant one
      backgroundColor: "bg-white",
      buttonText: "Choose Premium Plan",
      productId: 'prod_RFjsqoIg4jXUjZ'
    },
  ];
  
  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema), mode: 'all',
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });


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
                <CheckoutForm productId={planId} setSubsbcriptionData={setSubsbcriptionData} formValues={form.getValues()}  />
              </Elements>
            </div>
          </>
        ) : null}



      </div>
    </Form>
  );
};

export default SignUpForm;
