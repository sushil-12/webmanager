const validator = require('validator');
const { CustomError } = require('../utils/responseHandler');

class AuthValidator {
    static validateRegistration(body) {
        const { username, password, email, firstName, lastName, id } = body;

        if(id){
            if (!username || !email || !firstName) {
                throw new CustomError(400, 'All fields are required');
            } 
        }else{
            if (!username || !password || !email || !firstName) {
                throw new CustomError(400, 'All fields are required');
            }
        }
        
        if (password && password.length < 8) {
            throw new CustomError(400, 'Password must be at least 8 characters long');
        }
        
        if (!validator.isEmail(email)) {
            throw new CustomError(400, 'Invalid email format');
        }

    }

    static validateLogin(body) {
        const { username, password, email } = body;

        if (!((username && password) || (email && password))) {
            throw new CustomError(400, 'Username or email and password are required');
        }

        if (email && !validator.isEmail(email)) {
            throw new CustomError(400, 'Invalid email format');
        }
    }
}

module.exports = AuthValidator;