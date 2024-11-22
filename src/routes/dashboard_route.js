'use strict';

/**
 * node modules
 */

const router = require('express').Router();

/**
 * custom modules
 */
const renderDashboard = require('../controllers/dashboard_controller');

// GET route: Render dashboard.
router.get('/', renderDashboard);

module.exports = router;