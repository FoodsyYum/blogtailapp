'use strict';

/**
 * node modules
 */

const router = require('express').Router();

/**
 * custom modules
 */
const {
    renderSettings,
    updateBasicInfo
} = require('../controllers/settings_controller');

// GET route: Render the settings page.
router.get('/', renderSettings);

// PUT route: Update user basic info
router.put('/basic_info', updateBasicInfo);


module.exports = router;