'use strict';

/**
 * custom modules
 */
const User = require('../models/user_model');
const uploadToCloudinary = require('../config/cloudinary_config');

/**
 * Retrieves settings for the current user and renders the settings page.
 * 
 * @async
 * @function renderSettings
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} Throws an error if there's an issue during the process.
 */

const renderSettings = async (req, res) => {
    try {

        // Retrieve logged cient username
        const { username } = req.session.user;

        // Retrieve current user
        const currentUser = await User.findOne({ username });

        // Render the settings page
        res.render('./pages/settings', {
            sessionUser: req.session.user,
            currentUser
        });

    } catch (error) {

        // Log error
        console.error('Error rendering settings page:', error.message);
        throw error;

    }
}

/**
 * Updates basic informatioon of the logged-in user such as name, username, email, bio, and profile photo.
 * 
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} Throws an error if there's an issue during the process.
 */

const updateBasicInfo = async (req, res) => {
    try {

        // Retrieve logged client username from session
        const { username: sessionUsername } = req.session.user;

        // Retrieve current user based on session username
        const currentUser = await User.findOne({ username: sessionUsername })
            .select('profilePhoto name username email bio');

        // Destructure properties from request body
        const {
            profilePhoto,
            name,
            username,
            email,
            bio
        } = req.body;

        // Handle case where new email is alreay associated with an account
        if (email) {
            if (await User.exists({ email })) {
                return res.status(400).json({ message: 'Sorry, an account is already associated with this email address.' });
            }

            // Update email of the current user
            currentUser.email = email;
        }

        // Handle case where new username is already taken
        if (username) {
            if (await User.exists({ username })) {
                return res.status(400).json({ message: 'Sorry, that username is already taken. Please choose a different one.' });
            }

            // Update username of the current user and session user
            currentUser.username = username;
            req.session.user.username = username;
        }

        // If profile photo is provided, upload it to cloudinary and update user's profile photo
        if (profilePhoto) {
            const public_id = currentUser.username;
            const imageURL = await uploadToCloudinary(profilePhoto, public_id);

            currentUser.profilePhoto = {
                url: imageURL,
                public_id
            }

            req.session.user.profilePhoto = imageURL;
        }

        // Update name and bio of the current user and session user
        currentUser.name = name;
        req.session.user.name = name;
        currentUser.bio = bio;

        // Save updated user information to the database
        await currentUser.save();

        // Send success status
        res.sendStatus(200);

    } catch (error) {

        // Log error
        console.error('Error updating basic info: ', error.message);
        throw WebTransportError;

    }
}

module.exports = {
    renderSettings,
    updateBasicInfo
};