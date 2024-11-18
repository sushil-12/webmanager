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
        const { page = 1, limit = 10, search, filter } = req.query;
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
        let postsPromise;
        if (search) {
            postsPromise = Post.find(query)
                .where('post_type').equals(post_type)
                .where('deleted').equals(false)
                .where('domain').equals(website_name)
                .sort({ publicationDate: -1 })
                .exec();
        } else {
            postsPromise = Post.find(query)
                .where('post_type').equals(post_type)
                .where('deleted').equals(false)
                .where('domain').equals(website_name)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .sort({ publicationDate: -1 })
                .exec();
        }


        const publishedCountPromise = Post.countDocuments({ post_type, domain: website_name, status: 'published', deleted: false });
        const draftCountPromise = Post.countDocuments({ post_type, domain: website_name, status: 'draft', deleted: false });
        const allPostsCountPromise = Post.countDocuments({ post_type, domain: website_name, deleted: false });

        const [posts, publishedCount, draftCount, allPostsCount] = await Promise.all([postsPromise, publishedCountPromise, draftCountPromise, allPostsCountPromise]);

        const postIds = posts.filter(post => post.featuredImage).map(post => post.featuredImage);
        const images = await Media.find({ _id: { $in: postIds } }).select('url alt_text');

        const imagesData = images.map(media => ({
            id: media._id,
            url: media.url,
            alt_text: media.alt_text,
        }));

        const formattedPosts = await Promise.all(posts.map(async (post) => {
            const categories = await Promise.all(post.categories.map(async (item) => {
                try {
                    const category = await Category.findById(item).exec();
                    return category ? category.name : null;
                } catch (error) {
                    console.error(`Error fetching category with ID ${item}:`, error);
                    return null;
                }
            }));

            return {
                ...post._doc,
                id: post._id,
                images: imagesData.filter(img => img.id === post.featuredImage),
                categories,
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
                totalItems: filter == 'draft' ? draftCount : filter == 'trash' ? trashCount : filter == 'published' ? publishedCount : allPostsCount
            }
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

module.exports = {
    getPostById, getAllPosts, getAllPostTypesAndPages
};