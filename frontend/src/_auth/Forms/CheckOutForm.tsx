import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useCreateUserAccount, useGetStripeProductListing, useGetStripeProducts } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthProvider";
import SvgComponent from "@/utils/SvgComponent";

// Accept product as a prop
interface CheckoutFormProps {
    productId: string;
    setSubsbcriptionData: any;
    formValues: any;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ productId, setSubsbcriptionData, formValues }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast()
    const { mutateAsync: getStripeProductListing, isPending: isFetchingProductLists } = useGetStripeProductListing();
    const { mutateAsync: getStripeProductById, isPending: isFetchingProduct } = useGetStripeProducts();
    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
    const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(productId);
    const [productDetails, setProductDetails] = useState<any | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { checkAuthUser } = useUserContext();
    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await getStripeProductListing();
                setProducts(productList?.data?.products);
                if (productList.length > 0) {
                    setSelectedProductId(productList[0].id); // Set the first product as default
                }
            } catch (error) {
                console.error("Failed to fetch product list:", error);
            }
        };

        fetchProducts();
    }, [getStripeProductListing]);

    useEffect(() => {
        if (selectedProductId) {
            const fetchProductDetails = async () => {
                try {
                    const product = await getStripeProductById(selectedProductId);
                    setProductDetails(product?.data?.product);
                    setErrorMessage(null); // Clear any previous errors
                } catch (error) {
                    console.error("Failed to fetch product details:", error);
                    setErrorMessage("Failed to load product details. Please try again.");
                }
            };

            fetchProductDetails();
        }
    }, [selectedProductId, getStripeProductById]);

    const totalAmount = productDetails ? productDetails?.price?.unit_amount / 100 * (productDetails.quantity || 1) : 0;

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if dependencies are loaded and product is selected
        if (!stripe || !elements || !productDetails) {
            setErrorMessage("Stripe.js is not loaded or product details are missing.");
            return;
        }

        // Get elements for card details
        const cardNumber = elements.getElement(CardNumberElement);
        const cardExpiry = elements.getElement(CardExpiryElement);
        const cardCvc = elements.getElement(CardCvcElement);

        if (!cardNumber || !cardExpiry || !cardCvc) {
            setErrorMessage("Card details are missing. Please enter all card details.");
            return;
        }

        // Create a payment method using the card details
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumber, // Provide the CardNumberElement reference
        });

        console.log(paymentMethod, "paymentMethod")

        if (error) {
            setErrorMessage(error.message || "An error occurred while processing the payment method.");
            return;
        }

        // Now you have the paymentMethod object which contains card details securely
        const subscriptionData = {
            priceId: productDetails?.default_price,
            productId: selectedProductId,
            paymentMethodId: paymentMethod.id, // Send the PaymentMethod ID to your server
        };

        setSubsbcriptionData(subscriptionData);
        console.log(subscriptionData); // For debugging

        // Attempt to create a new user account with subscription data
        try {
            const updatedFormValues = { ...formValues, ...subscriptionData };
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

            if (newUser?.code?.includes('ERR')) {
                return toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: newUser?.response?.data?.message ?? "Unknown error.",
                    duration: import.meta.env.VITE_TOAST_DURATION,
                    icon: <SvgComponent className="" svgName="close_toaster" />
                });
            }

            // Check if session is valid
            const sessionValid = await checkAuthUser(); // Replace with actual session validation logic
            if (!sessionValid) {
                return toast({
                    variant: "destructive",
                    title: "Sign In Failed",
                    description: "Unable to authenticate user."
                });
            }

            toast({ title: "Logged In Successfully" });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error during signup or authentication", error);
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: "An unexpected error occurred. Please try again.",
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent className="" svgName="close_toaster" />
            });
        }
    };

    return (
        <div className="flex flex-col max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Checkout</h2>

            {/* Product Selection */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Product</h3>
                {isFetchingProductLists ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="space-y-2">
                        {products?.map((product) => (
                            <label
                                key={product.id}
                                className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                                <input
                                    type="radio"
                                    name="product"
                                    value={product.id}
                                    checked={selectedProductId === product.id}
                                    onChange={() => setSelectedProductId(product.id)}
                                    className="mr-3"
                                />
                                <span className="text-gray-800">{product.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            {isFetchingProduct ? (
                <p>Loading product details...</p>
            ) : productDetails ? (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h3>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Product Name</span>
                            <span className="text-gray-900">{productDetails.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Price</span>
                            <span className="text-gray-900">${productDetails.price?.unit_amount / 100}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-4">
                            <span className="text-gray-700">Total Amount</span>
                            <span className="text-green-600">${totalAmount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                errorMessage && <p className="text-red-600">{errorMessage}</p>
            )}

            {/* Payment Section */}
            <form onSubmit={handleSubmit} ref={formRef} className="mb-6">
                {/* Card Number Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="border-gray-300 rounded-lg bg-gray-50">
                        <CardNumberElement
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Card Expiry Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                        <div className="rounded-lg bg-gray-50">
                            <CardExpiryElement
                                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Card CVC Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <div className="rounded-lg bg-gray-50">
                            <CardCvcElement
                                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
                {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!stripe || isFetchingProduct || isFetchingProductLists}
                >
                    {isFetchingProduct || isFetchingProductLists || isCreatingUser ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;