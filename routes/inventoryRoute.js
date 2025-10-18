const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const { handleErrors } = require('../utilities');


router.get('/type/:classificationID', handleErrors(invController.buildByClassificationId));

router.get('/detail/:invID', handleErrors(invController.buildByItemId));

router.get('/triggerError', handleErrors(invController.triggerError));

module.exports = router;