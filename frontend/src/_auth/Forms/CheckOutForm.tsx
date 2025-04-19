import React, { useState, useRef } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useCreateUserAccount } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthProvider";
import SvgComponent from "@/utils/SvgComponent";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";

interface CheckoutFormProps {
    productId: string;
    priceId: string;
    planName: string;
    planPrice: number;
    setSubsbcriptionData: (data: SubscriptionData) => void;
    formValues: {
        firstName: string;
        lastName: string;
        username: string;
        email: string | null;
        password: string;
    };
}

interface SubscriptionData {
    priceId: string;
    productId: string;
    paymentMethodId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
    productId, 
    priceId, 
    planName, 
    planPrice,
    setSubsbcriptionData, 
    formValues 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { checkAuthUser } = useUserContext();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Stripe.js is not loaded.");
            return;
        }

        const cardNumber = elements.getElement(CardNumberElement);
        const cardExpiry = elements.getElement(CardExpiryElement);
        const cardCvc = elements.getElement(CardCvcElement);

        if (!cardNumber || !cardExpiry || !cardCvc) {
            setErrorMessage("Card details are missing. Please enter all card details.");
            return;
        }

        try {
            // Create payment method
            const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumber,
                billing_details: {
                    name: `${formValues.firstName} ${formValues.lastName}`,
                    email: formValues.email,
                },
            });

            if (paymentError) {
                setErrorMessage(paymentError.message || "An error occurred while processing the payment method.");
                return;
            }

            if (!paymentMethod) {
                setErrorMessage("Failed to create payment method. Please try again.");
                return;
            }

            const subscriptionData: SubscriptionData = {
                priceId: priceId,
                productId: productId,
                paymentMethodId: paymentMethod.id,
            };

            setSubsbcriptionData(subscriptionData);

            const updatedFormValues = {
                ...formValues,
                ...subscriptionData,
                email: formValues.email || '',
            };
            const newUser = await createUserAccount(updatedFormValues);

            if (!newUser) {
                return toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: "Something went wrong during signup.",
                    duration: import.meta.env.VITE_TOAST_DURATION,
                    icon: <SvgComponent className="" svgName="close_toaster" />
                });
            }

            // Handle payment confirmation if required
            if (newUser.subscription?.requiresAction) {
                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                    newUser.subscription.clientSecret
                );

                if (confirmError) {
                    setErrorMessage(confirmError.message || "Payment confirmation failed.");
                    return;
                }

                if (paymentIntent.status === 'succeeded') {
                    toast({
                        title: "Payment Successful",
                        description: "Your subscription has been activated.",
                        duration: import.meta.env.VITE_TOAST_DURATION,
                        icon: <SvgComponent className="" svgName="checked" />
                    });
                }
            }

            // Check subscription status
            if (newUser.subscription?.subscriptionStatus === 'active') {
                toast({
                    title: "Subscription Active",
                    description: "Your subscription is now active.",
                    duration: import.meta.env.VITE_TOAST_DURATION,
                    icon: <SvgComponent className="" svgName="checked" />
                });
            }

            // Check if user is authenticated
            const isLoggedIn = await checkAuthUser();
            if (isLoggedIn) {
                navigate("/");
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setErrorMessage("An error occurred during checkout. Please try again.");
        }
    };

    return (
        <div className="p-6 w-[550px]">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Complete Your Purchase</h2>
            
            <Card className="mb-6">
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Plan</span>
                            <span className="font-medium">{planName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price</span>
                            <span className="font-medium">${planPrice.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${planPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                        </label>
                        <div className="border rounded-lg p-3 bg-gray-50">
                            <CardNumberElement className="w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiration Date
                            </label>
                            <div className="border rounded-lg p-3 bg-gray-50">
                                <CardExpiryElement className="w-full" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVC
                            </label>
                            <div className="border rounded-lg p-3 bg-gray-50">
                                <CardCvcElement className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-600 text-sm text-center">{errorMessage}</div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || isCreatingUser}
                    className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isCreatingUser ? (
                        <>
                            <ProgressSpinner style={{ width: '20px', height: '20px' }} className="mr-2" />
                            Processing...
                        </>
                    ) : (
                        'Pay Now'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;