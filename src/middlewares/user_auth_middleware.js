'use strict';

/**
 * Middleware function to check if user is authenticated.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const userAuth = (req, res, next) => {

    // retrieves the 'userAuthenticated' property from the 'user' 'session' object. If the 'session.user' object is not defiened or is empty object ('{}'). This allows safe access to 'userAuthenticated' without throwing errors due to undefiened objects or peoperties.

    const { userAuthenticated } = req.session.user || {};

    // Handle case where user is authenticated
    if (userAuthenticated) return next();

    // Redirect to login page if user is not authenticated
    res.redirect('/login');
}

module.exports = userAuth;