const express = require('express');
const router = express.Router();
const newsControllers = require('../controllers/newsController');
const upload = require('../middlewares/uploadFile');
const authenticate = require('../middlewares/authenticate');

router.get('/all', newsControllers.allNews);
router.get('/random', newsControllers.randomNews);
router.get('/trending', newsControllers.getTrendingNews);
router.get('/:id', newsControllers.getNews);
router.post('/relate', newsControllers.getRelateNews);
router.post('/recent', newsControllers.getRecentNews);
router.post('/room/:name', newsControllers.getNewsByRoom);
router.post('/test', newsControllers.testRoute);

router.use(authenticate);
router.post('/', upload.single('thumbnail'), newsControllers.createNews);
router.put('/:id', newsControllers.updateNews);

module.exports = router;