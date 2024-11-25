const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const { ResponseHandler, ErrorHandler } = require('../../utils/responseHandler');

const stripe = require('stripe')('sk_test_51QNEM0EXM6E6dbLjCD0WIp2zrGohhNUVamDFJzarS2pp8tau3kPs7pe0JZSx06vClK8Z5TgEEANWx5r8ycMeElfx00tteOA91u'); // Replace with your actual secret key

const listProducts = async (req, res) => {
    try {
        const products = await stripe.products.list({
            limit: 10, // Adjust the limit as per your requirement
        });
        const productData = products?.data;

        ResponseHandler.success(res, { products:productData }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params; // Assuming the product ID is sent in the URL path

        if (!productId) {
            return ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { message: 'This link has been expired or not exists. Please generate a new one.' });
        }

        // Retrieve the product
        const product = await stripe.products.retrieve(productId);

        // Retrieve the price using the default_price ID
        const price = product.default_price
            ? await stripe.prices.retrieve(product.default_price)
            : null;

        // Construct the response
        const productWithPrice = {
            ...product,
            price: price ? {
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                recurring: price.recurring || null,
            } : null,
        };

        ResponseHandler.success(res, { product: productWithPrice }, HTTP_STATUS_CODES.OK);

    } catch (error) {
        console.error('Error fetching product:', error.message);
        ErrorHandler.handleError(error, res);
    }
};

module.exports = { listProducts, getProductById }