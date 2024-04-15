const express = require('express');
const router = express.Router();
const {test,scrapeSearchResults, getBookDetailsM1}=require('../controllers/dataController');
const cors = require('cors')
router.use(
    cors({
        // credentials:true,
        origin:'http:localhost:5173'
    })
)


router.get('/test',test);
router.get('/search/:query',scrapeSearchResults);
router.get('/book/:md5',getBookDetailsM1);


module.exports= router;

