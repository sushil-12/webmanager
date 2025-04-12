const User = require('../models/User');
const { ResponseHandler, ErrorHandler } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/error_message_codes');
const { logLogin, logLogout, logPasswordReset } = require('../utils/userActivityLogger');

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            await logLogin(req, 'error', { email, error: 'User not found' });
            return ResponseHandler.error(res, 'Invalid credentials', HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await logLogin(req, 'error', { email, error: 'Invalid password' });
            return ResponseHandler.error(res, 'Invalid credentials', HTTP_STATUS_CODES.UNAUTHORIZED);
        }

        const token = user.generateAuthToken();

        // Log successful login
        await logLogin(req, 'success', { email });

        ResponseHandler.success(res, { token, user }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        await logLogin(req, 'error', { error: error.message });
        ErrorHandler.handleError(error, res);
    }
};

// Logout
const logout = async (req, res) => {
    try {
        // Log logout
        await logLogout(req, 'success');

        ResponseHandler.success(res, { message: 'Logged out successfully' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        await logLogout(req, 'error', { error: error.message });
        ErrorHandler.handleError(error, res);
    }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            await logPasswordReset(req, 'error', { email, error: 'User not found' });
            return ResponseHandler.error(res, 'User not found', HTTP_STATUS_CODES.NOT_FOUND);
        }

        // Generate reset token and save to user
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // TODO: Send reset email with token

        // Log password reset request
        await logPasswordReset(req, 'success', { email });

        ResponseHandler.success(res, { message: 'Password reset email sent' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        await logPasswordReset(req, 'error', { error: error.message });
        ErrorHandler.handleError(error, res);
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            await logPasswordReset(req, 'error', { error: 'Invalid or expired token' });
            return ResponseHandler.error(res, 'Invalid or expired token', HTTP_STATUS_CODES.BAD_REQUEST);
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Log successful password reset
        await logPasswordReset(req, 'success', { email: user.email, action: 'password_reset_completed' });

        ResponseHandler.success(res, { message: 'Password reset successful' }, HTTP_STATUS_CODES.OK);
    } catch (error) {
        await logPasswordReset(req, 'error', { error: error.message });
        ErrorHandler.handleError(error, res);
    }
};

module.exports = {
    login,
    logout,
    requestPasswordReset,
    resetPassword
}; 