
const express = require('express');
const { getAllDomain } = require('../controllers/common/DomainOperation');
const { createEditNavigationItem, getAllNavigationItems, getNavigationItemById, quickEditNavItem } = require('../controllers/common/NavigationController');
const { submitContactDetails } = require('../controllers/common/CommanController');
const router = express.Router();
const checkFormTypeMiddleware = require('../middleware/checkFormTypeMiddleware');
const { listProducts, getProductById } = require('../controllers/protected/StripeController');

router.get('/get-all-domains',getAllDomain );
// API routes
router.post('/create-or-edit/navigation-items', createEditNavigationItem);
router.get('/navigation-items', getAllNavigationItems);
router.get('/navigation-items/:navigation_item_id', getNavigationItemById);
router.patch('/navigation-item-quick-edit/:id', quickEditNavItem);

// router.post('/contact', checkFormTypeMiddleware, submitContactDetails);
router.post('/contact',  submitContactDetails);


// Stripe API's
router.get('/list-products', listProducts);
router.get('/get-product/:productId', getProductById);
module.exports = router;