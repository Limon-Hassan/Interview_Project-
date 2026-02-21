let express = require('express');
const { GetNews } = require('../controller/newsController');
const { fetchAndSaveNews } = require('../controller/ApiConnectation');
let router = express.Router();

router.get('/save-news', fetchAndSaveNews);
router.get('/news', GetNews);

module.exports = router;
