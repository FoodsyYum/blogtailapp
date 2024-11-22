'use strict';

/**
 * node modules
 */

const router = require('express').Router();

/**
 * custom modules
 */

const logout = require('../controllers/logout_controller');

// POST route: Handles user logout.
router.post('/', logout);

module.exports = router;