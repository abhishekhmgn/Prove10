const express = require('express');

const feedController = require('../controllers/avengers');

const router = express.Router();


router.get('/', feedController.getData);
router.get('/fetch', feedController.fetch);

router.post('/insert', feedController.insert);

module.exports = router;