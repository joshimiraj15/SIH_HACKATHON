const express = require('express');
const router = express.Router();
const { getAllBuyers, createBuyer } = require('../controllers/buyerController');

router.route('/')
  .get(getAllBuyers)
  .post(createBuyer);

module.exports = router;
