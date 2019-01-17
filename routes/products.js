const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Product = require('../models/product');

// Add Product
router.post('/create', (req, res, next) => {
  let newProduct = new Product({
    title: req.body.title,
    price: req.body.price,
    inventory_count: req.body.inventory_count
  });

  Product.addProduct(newProduct, (err, user) => {
    if(err){
      res.json({success: false, msg: 'Failed to add new product'})
    } else {
      res.json({success: true, msg: 'Product added!'})
    }
  });
});

// Fetch Product
router.post('/fetch', (req, res, next) => {
  const title = req.body.title;

  Product.getProductByTitle(title, (err, product) => {
    if(err) throw err;
    if(!product){
      return res.json({success: false, msg: 'Product not found'});
    }
    else {
      res.json({
        success: true,
        product: {
          id: product._id,
          title: product.title,
          price: product.price,
          inventory_count: product.inventory_count
        }
      });
    }

  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
