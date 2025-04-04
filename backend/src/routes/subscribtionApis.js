const express = require('express');
const { getPostById, getAllPosts, getAllPostTypesAndPages, getSubscriptionPostById } = require('../controllers/sharable/PostOperations.js');
const validateApiKey = require('../middleware/validateApiKeys.js');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Subscription API'S
 *     description: User must have an API key to access these resources
 */

/**
 * @swagger
 * /subscription-api/get-post/{post_id}:
 *   get:
 *     summary: Get a post by its ID
 *     description: Fetches a post using the provided post ID from the database.
 *     tags: [PostOperations]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The unique ID of the post to retrieve
 *         schema:
 *           type: string
 *       - in: query
 *         name: api_key
 *         required: true
 *         description: The API key used for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_id:
 *                   type: string
 *                   description: The unique ID of the post
 *                   example: "672878d9637cdd901d2f25d8"
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                   example: "Homepage"
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                   example: "<p>Lorem ipsum dolor sit amet...</p>"
 *       400:
 *         description: Invalid post ID
 *       401:
 *         description: Invalid or missing API key
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /subscription-api/get-all-post/{website_name}/{post_type}:
 *   get:
 *     summary: Get all posts of a specific website and post type
 *     description: Fetches all posts based on the provided website name and post type.
 *     tags: [PostOperations]
 *     parameters:
 *       - in: path
 *         name: website_name
 *         required: true
 *         description: The website name to fetch posts from
 *         schema:
 *           type: string
 *       - in: path
 *         name: post_type
 *         required: true
 *         description: The type of post (e.g., blog, news, etc.)
 *         schema:
 *           type: string
 *       - in: query
 *         name: api_key
 *         required: true
 *         description: The API key used for authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_id:
 *                     type: string
 *                     description: The unique ID of the post
 *                     example: "672878d9637cdd901d2f25d8"
 *                   title:
 *                     type: string
 *                     description: The title of the post
 *                     example: "Homepage"
 *                   content:
 *                     type: string
 *                     description: The content of the post
 *                     example: "<p>Lorem ipsum dolor sit amet...</p>"
 *       400:
 *         description: Invalid website name or post type
 *       401:
 *         description: Invalid or missing API key
 *       404:
 *         description: No posts found for the given website and post type
 *       500:
 *         description: Internal server error
 */
router.use(validateApiKey);  // Apply API key validation middleware
router.get('/get-post/:post_id', getSubscriptionPostById);
router.get('/get-all-post/:website_name/:post_type', getAllPosts);

module.exports = router;
