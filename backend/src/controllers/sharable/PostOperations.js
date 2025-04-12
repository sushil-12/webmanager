const { default: mongoose, isObjectIdOrHexString } = require("mongoose");
const Post = require("../../models/Post");
const { CustomError, ResponseHandler, ErrorHandler } = require("../../utils/responseHandler");
const Media = require("../../models/Media");
const Category = require("../../models/Category");
const Domain = require("../../models/Domain");
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
const Website = require("../../models/Websites");
const { createSlug, formatString } = require("../../utils/helper");
const { callDynamicFunction } = require("../../plugins/DynamicLoader");
const { logger } = require("../../logger");
const PostMeta = require("../../models/PostMeta");
const fs = require('fs').promises;


const parseFields = (fields) => {
    if (!fields) return null;
    return fields.split(',').join(' ');
};
function extractRelevantFields(metaData) {
    return metaData.map(field => {
        const { label, name, repeatable, value } = field;
        return { label, name, repeatable, value };
    });
}

const getPostById = async (req, res) => {
    try {
        const postId = req.params.post_id;
        const requestedFields = parseFields(req.query._fields);

        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        // Fetch post data from the database
        let post = await Post.findById(postId).lean();  // Using .lean() for better performance
        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        // Fetch featured image from Media collection
        if(post.featuredImage !== '' && isObjectIdOrHexString(post.featuredImage)){
            const images = await Media.find({ _id: post.featuredImage }).select('url alt_text').lean();
            if (images && images.length > 0) {
                post.featuredImage = images[0];
            } else {
                post.featuredImage = [];  // Empty array or handle no image scenario
            }
        }

        // Fetch and extract post meta data if available
        let postMeta;
        if (post?.postMeta) {
            const postMetaData = await PostMeta.findById(post.postMeta).select('formData').lean();
            postMeta = extractRelevantFields(postMetaData?.formData);
        }

        // Send success response
        ResponseHandler.success(res, { post, metaData: postMeta }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};


const getAllPosts = async (req, res) => {
    try {
        const { post_type, website_name } = req.params;
        const { page = 1, limit = 10, search, filter, fields } = req.query;

        const query = {};
        if (search && search !== '') {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } },
            ];
        }
        if (filter && filter !== 'All') {
            switch (filter) {
                case 'trash':
                    query.status = 'trash';
                    break;
                case 'draft':
                    query.status = 'draft';
                    break;
                case 'published':
                    query.status = 'published';
                    break;
                default:
                    break;
            }
        }

        // Add additional filtering
        query.post_type = post_type;
        query.domain = website_name;
        query.deleted = false;

        // Determine fields to select
        const requiredFields = ['categories']; // Fields necessary for processing
        const fieldsToSelect = fields
            ? [...new Set(fields.split(',').concat(requiredFields))].join(' ') // Merge user-specified fields with required fields
            : '-comments -seoData'; // Default excluded fields

        // Fetch posts with pagination and sorting
        const postsPromise = Post.find(query)
            .select(fieldsToSelect)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ publicationDate: -1 })
            .lean(); // Use lean() for better performance

        // Fetch counts for different statuses
        const publishedCountPromise = Post.countDocuments({ post_type, domain: website_name, status: 'published', deleted: false });
        const draftCountPromise = Post.countDocuments({ post_type, domain: website_name, status: 'draft', deleted: false });
        const allPostsCountPromise = Post.countDocuments({ post_type, domain: website_name, deleted: false });

        const [posts, publishedCount, draftCount, allPostsCount] = await Promise.all([
            postsPromise,
            publishedCountPromise,
            draftCountPromise,
            allPostsCountPromise,
        ]);

        // Fetch related media
        const postIdsWithImages = posts.filter(post => post.featuredImage).map(post => post.featuredImage);
        const images = await Media.find({ _id: { $in: postIdsWithImages } }).select('url alt_text').lean();

        const imagesData = images.map(media => ({
            id: media._id.toString(),
            url: media.url,
            alt_text: media.alt_text,
        }));

        // Fetch postMeta for each post if included
        const formattedPosts = await Promise.all(posts.map(async (post) => {
            const categories = Array.isArray(post.categories)
                ? await Promise.all(post.categories.map(async (item) => {
                    try {
                        const category = await Category.findById(item).exec();
                        return category ? category.name : null;
                    } catch (error) {
                        console.error(`Error fetching category with ID ${item}:`, error);
                        return null;
                    }
                }))
                : []; // Fallback to an empty array if categories is missing or not an array

            let postMetaData = null;
            if (post.postMeta) {
                postMetaData = await PostMeta.findById(post.postMeta).lean();
            }

            let imageData = '';
            if (post.featuredImage) {
                const image = imagesData.find(img => img.id === post.featuredImage);
                imageData = image || '';
            }

            return {
                ...post,
                id: post._id,
                featuredImage: imageData,
                categories,
                postMeta: postMetaData,
            };
        }));

        const totalPages = Math.ceil(allPostsCount / limit);

        ResponseHandler.success(res, {
            posts: formattedPosts,
            totalCount: allPostsCount,
            draft_posts: draftCount,
            published_posts: publishedCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                totalItems: filter === 'draft' ? draftCount : filter === 'trash' ? trashCount : filter === 'published' ? publishedCount : allPostsCount,
            },
        }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getAllPostTypesAndPages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const { type, website_name } = req.params;
        const domainHeader = website_name;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } },
                { content: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const domain = await Domain.findOne({ name: domainHeader });
        const domain_id = domain ? domain._id : null;
        let posts;

        if (type === 'page') {
            posts = await Post.find()
                .where('post_type').equals('page')
                .where('domain').equals(domainHeader)
                .limit(parseInt(limit))
                .select('title');
        } else {
            posts = await Post.find()
                .where('post_type').equals(type)
                .where('domain').equals(domainHeader)
                .limit(parseInt(limit))
                .select('title');
            posts = sidebar[0].menus.filter(item => item.type === 'custom_post')
            // Selecting only the 'label' field
        }

        // Transform the posts array if needed
        const transformedPosts = posts.map(item => ({
            value: type === 'page' ? item._id : createSlug(item.label),
            label: item.label || item.title,
        }));

        const totalCount = await Post.countDocuments(query);

        ResponseHandler.success(res, { posts: transformedPosts, totalCount, currentPage: parseInt(page) }, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

const getSubscriptionPostById = async (req, res) => {
    try {
        const postId = req.params.post_id;
        const requestedFields = parseFields(req.query._fields);
        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new CustomError(400, 'Invalid post ID');
        }

        // Fetch post data from the database
        let post = await Post.findById(postId).lean();
        if (!post) {
            throw new CustomError(404, 'Post not found');
        }

        // Fetch featured image from Media collection
        if(post.featuredImage !== '' && isObjectIdOrHexString(post.featuredImage)){
            const images = await Media.find({ _id: post.featuredImage }).select('url alt_text').lean();
            if (images && images.length > 0) {
                post.featuredImage = images[0];
            } else {
                post.featuredImage = null;
            }
        }

        // Fetch and extract post meta data if available
        let postMeta;
        if (post?.postMeta) {
            const postMetaData = await PostMeta.findById(post.postMeta).select('formData').lean();
            postMeta = extractRelevantFields(postMetaData?.formData);
        }

        // Organize meta data into sections
        const organizedMeta = {};
        if (postMeta) {
            postMeta.forEach(section => {
                if (section.value && section.value[0]) {
                    organizedMeta[section.name] = {
                        label: section.label,
                        value: section.value[0]
                    };
                }
            });
        }

        // Customize the response for subscription API
        const customizedResponse = {
            // Basic post information
            basic: {
                id: post._id,
                title: post.title,
                type: post.post_type,
                content: post.content,
                status: post.status,
                slug: post.slug,
                publishedAt: post.publicationDate,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            },
            
            // SEO information
            seo: {
                title: post.seoData?.seoTitle || '',
                description: post.seoData?.seoDescription || '',
                url: post.seoData?.seoUrl || '',
                filePath: post.seoData?.seoFilePath || ''
            },
            
            // Media information
            media: {
                featuredImage: post.featuredImage ? {
                    url: post.featuredImage.url,
                    alt: post.featuredImage.alt_text
                } : null
            },
            
            // Categories and tags
            taxonomies: {
                categories: post.categories || [],
                tags: post.tags || []
            },
            
            // Meta data organized by sections
            meta: organizedMeta
        };

        // Send success response
        ResponseHandler.success(res, customizedResponse, 200);
    } catch (error) {
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    getPostById, getAllPosts, getAllPostTypesAndPages, getSubscriptionPostById
};