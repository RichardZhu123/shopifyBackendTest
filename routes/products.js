const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Product = require('../models/product');
const User = require('../models/user');

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

// Fetch Single Product
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
          title: product.title,
          price: product.price,
          inventory_count: product.inventory_count
        }
      });
    }

  });
});

// Fetch All Products
router.post('/fetchall', (req, res, next) => {
  const excludeUnavailable = req.body.excludeUnavailable;

  // Get all products, including unavailable ones
  if(!excludeUnavailable)
  {
    Product.getAllProducts((err, products) => {
      if(err) throw err;
      if(!products){
        return res.json({success: false, msg: 'No products in inventory'});
      }
      else {
        res.json({
          success: true,
          products: products
        });
      }

    });
  }
  // Get only available products
  else
  {
    Product.getAllAvailable((err, products) => {
      if(err) throw err;
      if(!products){
        return res.json({success: false, msg: 'No available products in inventory'});
      }
      else {
        res.json({
          success: true,
          product: products
        });
      }

    });
  }

  });

  // Purchase Single Product
  router.post('/purchase', (req, res, next) => {
    const title = req.body.title;

    Product.getProductByTitle(title, (err, product) => {
      if(err) throw err;
      if(!product || product.inventory_count <= parseInt(0)){
        return res.json({success: false, msg: 'Product not available'});
      }
      else {
        Product.purchase(title, (err, prod) => {
          if(err) throw err;
          res.json({
            success: true,
            product: {
              title: product.title,
              price: product.price,
              inventory_count: product.inventory_count-1
            }
          });
        });
      }

    });
  });


// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let currUser = req.user;
  res.json({
    name: user.name,
    itemsInCart: currUser.itemsInCart
  });
});

module.exports = router;
