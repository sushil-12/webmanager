import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCreateUserAccount } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import SvgComponent from "@/utils/SvgComponent";
import TooltipMessage from "@/components/shared/TooltipMessage";
import AppLogo from "@/components/shared/AppLogo";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { getHeroIcon } from "@/lib/HeroIcon";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckOutForm";
import { checkEmail, checkUsername } from "@/lib/appwrite/api";
import PricingSection from "@/_landing-page/components/PricingSection";

const SignUpForm = () => {
  const stripePromise = loadStripe(
    'pk_test_51RAmPNREgYeUYuR3s2IzSgKFnB4k1cWf7bjFAHgT3OW4QOQEICZFpXqzm6eGINLiXfbp5EJFznMUMqjnSDWRCWRM00PCrygtGf'
  );
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const [formState, setFormState] = useState("sign-up-form");
  const [subsbcriptionData, setSubsbcriptionData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPricing, setShowPricing] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{
    planId: string;
    priceId: string;
    planName: string;
    price: number;
    billingInterval: 'monthly' | 'annually';
    apiCallsLimit: number;
    websiteLimit: number;
    features: string[];
  } | null>(null);

  useEffect(() => {
    // Check if user came from landing page with a selected plan
    if (location.state?.plan) {
      setShowPricing(false);
      setSelectedPlan(location.state.plan);
    }
  }, [location.state]);

  const form = useForm<z.infer<typeof signUpValidationSchema>>({
    resolver: zodResolver(signUpValidationSchema),
    mode: "all",
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const checkEmailExists = async () => {
    const email = form.getValues("email");
    if (!email) return;
    try {
      const result = await checkEmail(email);
      console.log(result?.data?.data?.message, result);

      if (result?.data?.data?.status === "error") {
        console.error("Error:", result?.data?.data?.message);
        return;
      } else {
        if (!result?.data?.data?.isEmailAvailable) {
          console.log(result?.data?.data?.message);
          form.setError("email", { message: result?.data?.data?.message });
          console.log(form.formState, "FORMSTATE");
        } else {
          form.clearErrors("email");
        }
      }
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const checkUsernameExists = async () => {
    const usernameValue = form.getValues("username");
    const result = await checkUsername(usernameValue);
    if (!result?.data?.data?.isUsernameAvailable) {
      console.log(result?.data?.data?.message);
      form.setError("username", { message: result?.data?.data?.message });
      console.log(form.formState, "FORMSTATE");
    } else {
      form.clearErrors("email");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form.formState, "FORMSTATE", showPricing, form.formState.isValid);
      if (showPricing) {
        setFormState("select_pricing_plan");
      } else {
        setFormState("payment_form");
      }
  };
  console.log(selectedPlan, "SELECTED PLAN");
  return (
    <Form {...form}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div
          className="flex align-middle text-center items-center justify-center mb-10 cursor-pointer"
          onClick={() => navigate("/landing-page")}
        >
          <AppLogo />
        </div>
        {formState === "sign-up-form" ? (
          <Card
            className="w-full max-w-md"
            pt={{
              root: { className: "login_cards rounded-xl shadow-lg" },
              title: {
                className: "text-main-bg-900 card_headings inter-regular-32",
              },
            }}
          >
            <form
              onSubmit={handleFormSubmit}
              className="space-y-1 flex flex-col w-full mt-4 signup_form_container"
            >
              <div className="flex flex-col gap-5">
                <h1 className="text-main-bg-900 card_headings inter-regular-32 mb-5 text-center">
                  Sign Up
                </h1>
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <label className="form_labels inter-regular-14">
                        Username
                      </label>
                      <FormControl>
                        <div
                          className={`p-inputgroup flex-1 inter-regular-14 form_labels`}
                        >
                          <span
                            className={`p-inputgroup-addon bg-white ${
                              form.getFieldState(field.name).error
                                ? "border-error"
                                : ""
                            }`}
                          >
                            {getHeroIcon("UserIcon")}
                          </span>
                          <InputText
                            className={`${
                              form.getFieldState(field.name).error
                                ? "border-error"
                                : ""
                            }`}
                            placeholder="Enter your username"
                            {...field}
                            onBlur={() => checkUsernameExists()}
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
                      <label className="form_labels inter-regular-14">
                        Email
                      </label>
                      <FormControl>
                        <div
                          className={`p-inputgroup flex-1 inter-regular-14 form_labels`}
                        >
                          <span
                            className={`p-inputgroup-addon bg-white ${
                              form.getFieldState(field.name).error
                                ? "border-error"
                                : ""
                            }`}
                          >
                            <SvgComponent className="" svgName="mail" />
                          </span>
                          {/* @ts-ignore */}
                          <InputText
                            className={`${
                              form.getFieldState(field.name).error
                                ? "border-error"
                                : ""
                            }`}
                            placeholder="Your Email Address"
                            {...field}
                            onBlur={() => checkEmailExists()}
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
                        <label className="form_labels inter-regular-14">
                          First Name
                        </label>
                        <FormControl>
                          <Input
                            className="shad-input"
                            placeholder="Enter First Name"
                            {...field}
                          />
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
                        <label className="form_labels inter-regular-14">
                          Last Name
                        </label>
                        <FormControl>
                          <Input
                            className="shad-input"
                            placeholder="Enter Last Name"
                            {...field}
                          />
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
              <Link
                to="/login"
                className="text-primary-500 text-small-semibold ml-1"
              >
                Log in
              </Link>
            </p>
          </Card>
        ) : formState === "select_pricing_plan" && showPricing ? (
          <div className="w-full max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Select the perfect plan for your needs</p>
            </div>
            <PricingSection />
          </div>
        ) : formState === "payment_form" ? (
          <div className="w-full max-w-2xl">
            <Card className="shadow-lg">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  productId={selectedPlan?.planId || ""}
                  priceId={selectedPlan?.priceId || ""}
                  planName={selectedPlan?.planName || ""}
                  planPrice={selectedPlan?.price || 0}
                  setSubsbcriptionData={setSubsbcriptionData} // @ts-ignore
                  formValues={form.getValues()} // @ts-ignore
                />
              </Elements>
            </Card>
          </div>
        ) : null}
      </div>
    </Form>
  );
};

export default SignUpForm;
