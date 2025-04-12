const jwt = require("jsonwebtoken");
const fs = require("fs");
const handlebars = require("handlebars");
const { Readable } = require("stream");
const User = require("../../models/User");
const {
  CustomError,
  ErrorHandler,
  ResponseHandler,
} = require("../../utils/responseHandler");
const Permission = require("../../models/Permission");
const Role = require("../../models/Role");
const { HTTP_STATUS_CODES } = require("../../constants/error_message_codes");
const path = require("path");
const Sidebar = require("../../models/Sidebar");
const AuthValidator = require("../../validator/AuthValidator");
const cloudinary = require("../../config/cloudinary");
const Website = require("../../models/Websites");
const Post = require("../../models/Post");
const { createSlug } = require("../../utils/helper");
const {
  logWebsiteCreation,
  logWebsiteUpdate,
  logWebsiteDeletion,
  logContentCreation,
  logContentUpdate,
  logContentDeletion,
  logSettingsUpdate,
  logAnalyticsUpdate,
  logIntegrationAdded,
  logIntegrationRemoved,
  logBackupCreated,
  logBackupRestored
} = require('../../utils/websiteActivityLogger');

const createOrEditWebsite = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const created_by = decodedToken.userId;

    const { icon, business_name, url, description, id, menus } = req.body; // Extract website data from request body

    if (id) {
      // Edit website if id is provided
      const existingWebsite = await Website.findById(id);
      if (!existingWebsite) {
        return ResponseHandler.error(res, { message: 'Website not found' }, HTTP_STATUS_CODES.NOT_FOUND);
      }

      // Store old data for comparison
      const oldData = {
        business_name: existingWebsite.business_name,
        url: existingWebsite.url,
        description: existingWebsite.description,
        settings: existingWebsite.settings
      };

      // Update the website fields
      existingWebsite.business_name = business_name;
      existingWebsite.url = url;
      existingWebsite.description = description;
      existingWebsite.created_by = created_by;
      if (menus) {
        existingWebsite.menus = menus;
      }

      if (icon == "") {
        existingWebsite.icon = "";
      }

      if (icon) {
        const base64String = icon;
        const buffer = Buffer.from(base64String, "base64");
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        // Upload the profile picture to cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error, result) => {
              if (error) {
                console.error("Upload error:", error);
                reject(error);
              } else {
                existingWebsite.icon = result.secure_url;
                console.log("Uploaded profile pic:", result.secure_url);
                resolve();
              }
            }
          );

          readableStream.pipe(uploadStream);
        });

        await uploadPromise;
      }

      await existingWebsite.save();

      // Log website update with field changes
      await logWebsiteUpdate(req, id, oldData, {
        business_name,
        url,
        description,
        // settings
      }, 'success');

      ResponseHandler.success(res, { message: 'Website updated successfully' }, HTTP_STATUS_CODES.OK);
    } else {
      // Create new website
      const newWebsite = new Website({
        icon,
        business_name,
        url,
        description,
        menus,
        created_by,
      });
      if (icon) {
        const base64String = icon;
        const buffer = Buffer.from(base64String, "base64");
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        // Upload the profile picture to cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error, result) => {
              if (error) {
                console.error("Upload error:", error);
                reject(error);
              } else {
                newWebsite.icon = result.secure_url;
                console.log("Uploaded profile pic:", result.secure_url);
                resolve();
              }
            }
          );

          readableStream.pipe(uploadStream);
        });

        await uploadPromise;
      }

      // Save the website
      await newWebsite.save();

      // Log website creation with initial data
      await logWebsiteCreation(req, newWebsite._id, 'success', {
        business_name,
        url,
        description,
        // settings
      });

      ResponseHandler.success(res, { message: 'Website created successfully' }, HTTP_STATUS_CODES.OK);
    }
  } catch (error) {
    // Log error for website creation/update
    if (req.body.id) {
      await logWebsiteUpdate(req, req.body.id, {}, {}, 'error', { error: error.message });
    } else {
      await logWebsiteCreation(req, null, 'error', { error: error.message });
    }
    ErrorHandler.handleError(error, res);
  }
};

const listWebsites = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId).populate("role");

    const { page = 1, limit = 10, search, filterBy } = req.query;
    let query = {};
    if (user?.role?.name == "admin") {
      query = {
        created_by: userId,
      };
    }

    if (search) {
      query.business_name = { $regex: new RegExp(search, "i") };
    }
    const websites = await Website.find(query).select(
      "icon business_name description url"
    );
    const userPermittedWebsite = user.permissions
      ? Object.keys(user.permissions)
      : [];

    const websitesData = websites.map((website) => ({
      id: website._id,
      ...website._doc, // Spread the remaining fields from the document
    }));

    let websitesList = [];

    if (user?.role?.name !== "admin" && user?.role?.name !== "super_admin") {
      const filteredWebsites = websitesData?.filter((website) =>
        userPermittedWebsite?.includes(website._id.toHexString())
      );
      websitesList = filteredWebsites;
    } else {
      websitesList = websitesData;
    }
    // Return the list of websites
    ResponseHandler.success(
      res,
      { websites: websitesList },
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};

const listWebsitesWithMenus = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId).populate("role");
    let websites;
    let query = {};
    if (user?.role?.name == "admin") {
        websites = await Website.find(
            { created_by: userId },
            "icon business_name description url menus"
          ); // Limit fields to be retrieved
    }
    else{
        websites = await Website.find({ },  "icon business_name description url menus"); // Limit fields to be retrieved
    }
     
   
    const userPermittedWebsite = user.permissions
      ? Object.keys(user.permissions)
      : [];

    const websitesData = websites.map((website) => ({
      id: website._id,
      ...website._doc, // Spread the remaining fields from the document
    }));

    let websitesList = [];

    if (user?.role?.name !== "admin" && user?.role?.name !== "super_admin") {
      const filteredWebsites = websitesData?.filter((website) =>
        userPermittedWebsite?.includes(website._id.toHexString())
      );
      websitesList = filteredWebsites;
    } else {
      websitesList = websitesData;
    }
    ResponseHandler.success(
      res,
      { websites: websitesList },
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};

const getWebsite = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const website_id = req.params.website_id;
    const website = await Website.findById(website_id);
    if (!website) {
      throw new CustomError(404, "User not found");
    }

    const websiteData = {
      id: website._id,
      ...website._doc,
    };

    ResponseHandler.success(res, websiteData, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const deleteWebsite = async (req, res) => {
  try {
    const { website_id } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.userId;

    const website = await Website.findById(website_id);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (website.created_by.toString() !== currentUserId && req.user.role.name !== 'super_admin') {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    const deletedWebsiteName = website.business_name;
    await Website.findByIdAndDelete(website_id);
    await Post.deleteMany({ domain: createSlug(deletedWebsiteName, "_") });

    // Log website deletion
    await logWebsiteDeletion(req, website_id, 'success', {
      business_name: deletedWebsiteName,
      url: website.url
    });

    ResponseHandler.success(res, { message: 'Website deleted successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logWebsiteDeletion(req, website_id, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const updateWebsiteSettings = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { settings } = req.body;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    // Store old settings for comparison
    const oldSettings = { ...website.settings };
    
    // Update settings
    website.settings = settings;
    await website.save();

    // Log settings update with field changes
    await logSettingsUpdate(req, websiteId, 'general', oldSettings, settings, 'success');

    ResponseHandler.success(res, { website }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logSettingsUpdate(req, req.params.websiteId, 'general', {}, {}, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const updateWebsiteAnalytics = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { analytics } = req.body;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    // Store old analytics for comparison
    const oldAnalytics = { ...website.analytics };
    
    // Update analytics
    website.analytics = analytics;
    await website.save();

    // Log analytics update with field changes
    await logAnalyticsUpdate(req, websiteId, 'general', oldAnalytics, analytics, 'success');

    ResponseHandler.success(res, { website }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logAnalyticsUpdate(req, req.params.websiteId, 'general', {}, {}, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const addWebsiteIntegration = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { integrationType, integrationData } = req.body;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    website.integrations[integrationType] = integrationData;
    await website.save();

    // Log integration addition
    await logIntegrationAdded(req, websiteId, integrationType, 'success', {
      integrationData: Object.keys(integrationData)
    });

    ResponseHandler.success(res, { website }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logIntegrationAdded(req, req.params.websiteId, req.body.integrationType, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const removeWebsiteIntegration = async (req, res) => {
  try {
    const { websiteId, integrationType } = req.params;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    delete website.integrations[integrationType];
    await website.save();

    // Log integration removal
    await logIntegrationRemoved(req, websiteId, integrationType);

    ResponseHandler.success(res, { website }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logIntegrationRemoved(req, req.params.websiteId, req.params.integrationType, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const createWebsiteBackup = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { backupType } = req.body;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    // TODO: Implement actual backup creation logic

    // Log backup creation
    await logBackupCreated(req, websiteId, backupType);

    ResponseHandler.success(res, { message: 'Backup created successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logBackupCreated(req, req.params.websiteId, req.body.backupType, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const restoreWebsiteBackup = async (req, res) => {
  try {
    const { websiteId, backupId } = req.params;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check permissions
    if (req.user.role.name !== 'super_admin' && website.created_by !== req.userId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    // TODO: Implement actual backup restoration logic

    // Log backup restoration
    await logBackupRestored(req, websiteId, 'full');

    ResponseHandler.success(res, { message: 'Backup restored successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logBackupRestored(req, req.params.websiteId, 'full', 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  createOrEditWebsite,
  listWebsites,
  getWebsite,
  listWebsitesWithMenus,
  deleteWebsite,
  updateWebsiteSettings,
  updateWebsiteAnalytics,
  addWebsiteIntegration,
  removeWebsiteIntegration,
  createWebsiteBackup,
  restoreWebsiteBackup
};
