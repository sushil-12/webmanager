const jwt = require('jsonwebtoken');
const fs = require('fs');
const handlebars = require('handlebars');
const { Readable } = require('stream');
const User = require('../../models/User');
const { CustomError, ErrorHandler, ResponseHandler } = require('../../utils/responseHandler');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');
const bcrypt = require('bcrypt');
const { HTTP_STATUS_CODES } = require('../../constants/error_message_codes');
const sendMail = require('../../utils/sendMail');
const { generateRandomString } = require('../auth/authController');
const path = require('path');
const Sidebar = require('../../models/Sidebar');
const AuthValidator = require('../../validator/AuthValidator');
const cloudinary = require('../../config/cloudinary');
const Website = require('../../models/Websites');
const {
    logUserCreation,
    logUserUpdate,
    logUserDeletion,
    logRoleChange,
    logPermissionUpdate,
    logTeamMemberAdded,
    logTeamMemberRemoved,
    logTeamRoleChange
} = require('../../utils/userActivityLogger');


const defaultSidebarJson = {
  "comman": [
    {
      "id": "7dg9i97e9",
      "imgURL": "dashboard",
      "route": "/dashboard",
      "label": "Dashboard",
      "subcategory": []
    },
  ],
  "websites": {
  }
}

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId).populate('role').populate('permissions');
    if (!user) {
      throw new CustomError(404, 'User not found');
    }


    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      bio: user.bio,
      profile_pic: user.profile_pic,
      lastName: user.lastName,
      role: user.role?.name,
      permissions: user.permissions,
      isEmailVerified: user?.isEmailVerified,
      temp_email: user?.temp_email

    };
    console.log("USER TEMP EMAIL", user?.temp_email)

    ResponseHandler.success(res, userProfile, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }
    user.staySignedIn = false;
    user.save();

    ResponseHandler.success(res, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const sendOtpVerificationOnEmail = async (req, res) => {
  try {
    const { email, form_type, verification_code } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Generate OTP here
    const otp = generateRandomString(6); // You need to implement generateOTP function

    if (form_type == 'send_mail') {
      const userEXIST = await User.findOne({ email: email }).exec();

      if (userEXIST) {
        ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'verification_code', message: "It looks like this email is already taken" }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
      }

      try {
        const templateFilePath = path.join(__dirname, '..', '..', 'email-templates', 'send-email-verification.hbs');
        const templateFile = fs.readFileSync(templateFilePath, 'utf8');
        const template = handlebars.compile(templateFile);
        const app_logo = `${process.env.APP_LOGO_PATH}`
        const app_name = process.env.APP_NAME;
        const verificationLink = `${process.env.FRONTEND_APP_URL}verify-email/${encodeURIComponent(otp)}/${encodeURIComponent(user._id)}/${btoa(email)}`;
        const verificationLinkExpiryTime = user.otpExpiry = new Date(Date.now() + parseInt(process.env.VERIFICATION_LINK_EXPIRY_TIME));


        const mailOptions = {
          from: `"${app_name}" <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: 'Email reset',
          html: template({ app_logo, app_name, verificationLink })
        };

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_DURATION));
        user.isEmailVerified = false;
        user.temp_email = email;
        user.verificationLinkExpiryTime = verificationLinkExpiryTime;
        await user.save();

        // Send email
        sendMail(mailOptions)
          .then(async () => {
            ResponseHandler.success(res, { email_sent: true, otp: otp, message: "Verification code sent successfully" }, HTTP_STATUS_CODES.OK);
          })
          .catch((error) => {
            ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { field_error: 'email', email_sent: false, message: "Failed to send verification code" }, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
          });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    } else {
      if (verification_code !== user.otp) {
        ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'verification_code', message: "Wrong Code" }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
      } else {
        user.otp = otp;
        user.save();
        ResponseHandler.success(res, { verified: true, message: "Email verified successfully" }, HTTP_STATUS_CODES.OK);
      }
    }

  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const checkPassword = async (req, res) => {
  try {
    const { password } = req.body; // Assuming the password is sent in the request body

    // Extracting the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      ResponseHandler.error(res, HTTP_STATUS_CODES.UNAUTHORIZED, { field_error: 'password', message: "Your password seems incorrect! Please try again." }, HTTP_STATUS_CODES.UNAUTHORIZED); return;
    }

    // If passwords match, return a success response
    ResponseHandler.success(res, { message: 'Password is correct' }, 200);
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};

const saveSidebarData = async (req, res) => {
  try {
    const jsonData = req.body;
    const jsonString = JSON.stringify(jsonData, null, 2);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Check if a sidebar with the same userId exists
    const existingSidebar = await Sidebar.findOne({ userId });

    if (existingSidebar) {
      // If sidebar with same userId exists, update its items
      existingSidebar.items = jsonString;
      await existingSidebar.save();

      ResponseHandler.success(res, { message: 'Sidebar Updated Successfully', sidebar: JSON.parse(existingSidebar.items[0]) }, HTTP_STATUS_CODES.OK);
    } else {
      // If sidebar with userId doesn't exist, create a new sidebar object
      const sidebar = new Sidebar({
        userId: userId,
        items: jsonString
      });

      // Save the Sidebar object to the database
      await sidebar.save();

      ResponseHandler.success(res, { message: 'Sidebar Created Successfully', sidebar: JSON.parse(sidebar.items[0]) }, HTTP_STATUS_CODES.CREATED);
    }
  } catch (error) {
    ResponseHandler.error(res, HTTP_STATUS_CODES.BAD_REQUEST, error.message, HTTP_STATUS_CODES.BAD_REQUEST);
  }
};


const getSidebarData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    let sidebar = await Sidebar.findOne({ userId });
    if (sidebar == null || sidebar == '') {
      sidebar = defaultSidebarJson;
    }

    ResponseHandler.success(res, { sidebar }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    // Handle errors
    console.error('Error fetching sidebar data:', error);
    ResponseHandler.error(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};


const cancelEmailChangeRequest = async (req, res) => {
  try {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    user.isEmailVerified = true;
    user.temp_email = '';
    await user.save();
    // If passwords match, return a success response
    ResponseHandler.success(res, { message: 'Email Change request has been cancelled successfully!' }, 200);
  } catch (error) {
    // Handle errors
    ErrorHandler.handleError(error, res);
  }
};


const createOrEditUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const created_by = decodedToken.userId;

    AuthValidator.validateRegistration(req.body);
    const { username, password, email, firstName, lastName, id, profile_pic, permissions, user_type } = req.body;
    const userRole = await Role.findOne({ name: user_type });
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (id) {
      // Edit user if id is provided
      const existingUser = await User.findById(id).populate('role');
      if (!existingUser) {
        return ResponseHandler.error(res, { message: 'User not found' }, HTTP_STATUS_CODES.NOT_FOUND);
      }

      // Store old data for comparison
      const oldData = {
        username: existingUser.username,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role.name,
        permissions: existingUser.permissions || {},
        profile_pic: existingUser.profile_pic
      };

      // Prepare new data for comparison
      const newData = {
        username,
        email,
        firstName,
        lastName,
        role: user_type,
        permissions: permissions || {},
        profile_pic: profile_pic || existingUser.profile_pic
      };

      // Log role change if role is being updated
      if (userRole && existingUser.role._id.toString() !== userRole._id.toString()) {
        await logRoleChange(req, id, existingUser.role.name, user_type);
      }

      // Update the user fields
      existingUser.username = username;
      if (hashedPassword) existingUser.password = hashedPassword;
      existingUser.email = email;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.role = userRole;
      existingUser.temp_email = '';
      existingUser.permissions = permissions || null;

      if (profile_pic === '') {
        existingUser.profile_pic = '';
      } else if (profile_pic) {
        const base64String = profile_pic;
        const buffer = Buffer.from(base64String, 'base64');
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' },
            (error, result) => {
              if (error) {
                console.error('Upload error:', error);
                reject(error);
              } else {
                existingUser.profile_pic = result.secure_url;
                console.log('Uploaded profile pic:', result.secure_url);
                resolve();
              }
            }
          );

          readableStream.pipe(uploadStream);
        });

        await uploadPromise;
      }

      await existingUser.save();
      
      // Log user update with field changes
      await logUserUpdate(req, id, oldData, newData, 'success');

      ResponseHandler.success(res, { message: 'User updated successfully' }, HTTP_STATUS_CODES.OK);
    } else {
      const duplicateUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (duplicateUser) {
        let conflictField = '';
        if (duplicateUser.username === username) {
          conflictField = 'Username';
        } else if (duplicateUser.email === email) {
          conflictField = 'Email';
        }
        return ResponseHandler.error(res, HTTP_STATUS_CODES.CONFLICT, `${conflictField} already exists`, HTTP_STATUS_CODES.CONFLICT);
      }

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        permissions,
        isEmailVerified: true,
        temp_email: '',
        role: userRole,
        created_by
      });

      // Save the user
      await newUser.save();

      // Log user creation
      await logUserCreation(req, newUser._id, 'success', {
        username,
        email,
        role: user_type,
        permissions
      });

      // Handle profile picture upload
      if (profile_pic) {
        const base64String = profile_pic;
        const buffer = Buffer.from(base64String, 'base64');
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' },
            (error, result) => {
              if (error) {
                console.error('Upload error:', error);
                reject(error);
              } else {
                newUser.profile_pic = result.secure_url;
                console.log('Uploaded profile pic:', result.secure_url);
                resolve();
              }
            }
          );

          readableStream.pipe(uploadStream);
        });

        await uploadPromise;
        await newUser.save();
      }

      ResponseHandler.success(res, { message: 'User created successfully' }, HTTP_STATUS_CODES.OK);
    }
  } catch (error) {
    // Log error for user creation/update
    if (req.body.id) {
      await logUserUpdate(req, req.body.id, {}, {}, 'error', { error: error.message });
    } else {
      await logUserCreation(req, null, 'error', { error: error.message });
    }
    ErrorHandler.handleError(error, res);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = req.params.user_id;
    const user = await User.findById(userId).populate('role');
    if (!user) {
      throw new CustomError(404, 'User not found');
    }


    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      bio: user.bio,
      profile_pic: user.profile_pic,
      lastName: user.lastName,
      role: user.role?.name,
      permissions: user?.permissions,
      isEmailVerified: user?.isEmailVerified,
      temp_email: user?.temp_email

    };

    ResponseHandler.success(res, userProfile, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};

const getAllUser = async (req, res) => {
  try {
    // Extract and parse query parameters
    const { page = 1, limit = 10, search } = req.query;
    // Get the user_id from the route params (the ID of the user who created the records)
    const createdBy = req.userId;
    const user = await User.findById(createdBy).populate('role');
    
    let query = {
      deleted_at: null, // Exclude deleted users
    };

    const userRole = await Role.findOne({"name": "user"});
    // Add role-based filtering
    if (user?.role?.name !== 'super_admin') {
      query.created_by = createdBy;
      query.role = userRole?._id;
    }

    // Build the search query
    if (search) {
      query.$or = [
        { username: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } },
        { firstName: { $regex: new RegExp(search, 'i') } },
        { lastName: { $regex: new RegExp(search, 'i') } }
      ];
    }

    // Convert page and limit to numbers and ensure they are valid
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    // Get total count for pagination
    const totalDocuments = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    // Fetch users with pagination and search query
    const users = await User.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .populate('role')
      .limit(limitNumber)
      .sort({ createdAt: -1 }); // Add sorting by creation date

    // Fetch all websites and create a lookup for website info
    const websites = await Website.find().select('icon business_name');
    const websitesData = websites.map(website => ({
      id: website._id,
      ...website._doc,
    }));

    // Helper function to get website icon or name
    const getWebsiteNameAndIcon = (websiteId, findWhat) => {
      const website = websitesData.find(site => site.id.toString() === websiteId.toString());
      if (!website) return null;
      return findWhat === 'icon' ? website.icon : website.business_name;
    };

    // Map user data with permissions and website details
    const userData = users.map(user => {
      let permissions = user.permissions || {};
      if (user.role !== 'admin') {
        if (permissions && Object.keys(permissions).length > 0) {
          Object.keys(permissions).forEach(key => {
            const permissionObject = permissions[key];
            const websiteName = getWebsiteNameAndIcon(key, 'business_name');
            const websiteIcon = getWebsiteNameAndIcon(key, 'icon');

            if (websiteName && websiteIcon) {
              permissions[key] = {
                ...permissionObject,
                name: websiteName,
                icon: websiteIcon
              };
            } else {
              delete permissions[key];
            }
          });
        } else {
          permissions = {};
        }
      } else {
        permissions = null;
      }

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        bio: user.bio,
        profile_pic: user.profile_pic,
        lastName: user.lastName,
        role: user?.role?.name,
        permissions: permissions,
        isEmailVerified: user?.isEmailVerified,
        temp_email: user?.temp_email
      };
    });

    // Pagination information
    const paginationInfo = {
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalItems: totalDocuments,
    };

    // Send success response
    ResponseHandler.success(res, { userData, pagination: paginationInfo }, 200);
  } catch (error) {
    ErrorHandler.handleError(error, res);
  }
};


const deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = req.params.user_id;

    const user = await User.findById(user_id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Log user deletion
    await logUserDeletion(req, user_id, 'success', {
      username: user.username,
      email: user.email
    });

    // Soft delete the user
    const deletedUser = await User.findByIdAndUpdate(user_id, { deleted_at: Date.now() });
    if (!deletedUser) {
      throw new CustomError(404, 'User not found');
    }

    ResponseHandler.success(res, { message: 'User deleted successfully' }, 200);
  } catch (error) {
    await logUserDeletion(req, req.params.user_id, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const addTeamMember = async (req, res) => {
  try {
    const { websiteId, userId, role } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.userId;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check if user has permission to add team members
    if (website.created_by.toString() !== currentUserId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    const user = await User.findById(userId);
    if (!user) {
      return ResponseHandler.error(res, 'User not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Add user to team
    if (!website.teamMembers.includes(userId)) {
      website.teamMembers.push(userId);
      await website.save();

      // Log team member addition
      await logTeamMemberAdded(req, websiteId, userId, 'success', { role });
    }

    ResponseHandler.success(res, { message: 'Team member added successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logTeamMemberAdded(req, req.body.websiteId, req.body.userId, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const removeTeamMember = async (req, res) => {
  try {
    const { websiteId, userId } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.userId;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check if user has permission to remove team members
    if (website.created_by.toString() !== currentUserId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    // Remove user from team
    website.teamMembers = website.teamMembers.filter(member => member.toString() !== userId);
    await website.save();

    // Log team member removal
    await logTeamMemberRemoved(req, websiteId, userId);

    ResponseHandler.success(res, { message: 'Team member removed successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logTeamMemberRemoved(req, req.params.websiteId, req.params.userId, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

const updateTeamMemberRole = async (req, res) => {
  try {
    const { websiteId, userId } = req.params;
    const { role } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.userId;

    const website = await Website.findById(websiteId);
    if (!website) {
      return ResponseHandler.error(res, 'Website not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Check if user has permission to update team member roles
    if (website.created_by.toString() !== currentUserId) {
      return ResponseHandler.error(res, 'Unauthorized', HTTP_STATUS_CODES.FORBIDDEN);
    }

    const user = await User.findById(userId);
    if (!user) {
      return ResponseHandler.error(res, 'User not found', HTTP_STATUS_CODES.NOT_FOUND);
    }

    // Update team member role
    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log team role change
    await logTeamRoleChange(req, websiteId, userId, oldRole, role);

    ResponseHandler.success(res, { message: 'Team member role updated successfully' }, HTTP_STATUS_CODES.OK);
  } catch (error) {
    await logTeamRoleChange(req, req.params.websiteId, req.params.userId, null, null, 'error', { error: error.message });
    ErrorHandler.handleError(error, res);
  }
};

module.exports = {
  getProfile, checkPassword, sendOtpVerificationOnEmail, logout, getSidebarData, saveSidebarData, cancelEmailChangeRequest, createOrEditUser, getUserProfile, getAllUser, deleteUser, addTeamMember, removeTeamMember, updateTeamMemberRole
};
