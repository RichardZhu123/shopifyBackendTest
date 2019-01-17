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

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // number of seconds, about 1 week
        });


        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });

        res.json({success: true, msg: 'Login successful'});
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
