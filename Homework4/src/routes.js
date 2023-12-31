const express = require('express');
const router = express.Router();

const apiRouter = require('./api/APIRoutes');
const frontendRouter = require('./frontend/frontEndRoutes');

router.use(frontendRouter);
router.use('/api', apiRouter);


module.exports = router;