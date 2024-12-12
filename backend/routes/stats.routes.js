// routes/stats.routes.js
const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.get('/', protect, isAdmin, getAdminStats);

module.exports = router;