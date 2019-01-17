const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Product = require('../models/product');

// Register
router.post('/register', (req, res, next) => {
  var emptyArr = ['test'];
  emptyArr.length = 0;
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    numItemsInCart: 0,
    itemsInCart: emptyArr
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg: 'Failed to register user'})
    } else {
      res.json({success: true, msg: 'User registered'})
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

      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// View Contents of Cart
router.get('/viewCart', (req, res, next) => {
  // let currUser = req.user; // For user implementation (not implemented)
  User.getUserByUsername("test123", (err, currUser) => { // Get user attached to cart
    if(err) throw err;
    res.json({
      success: true,
      // name: currUser.name, // Not shown for Shopify test purposes
      itemsInCart: currUser.itemsInCart
    });
  }); // Default user for testing purposes

});

// Add product to cart
router.post('/addToCart', (req, res, next) => {
  // let user = req.user; // For user implementation (not implemented)
  const title = req.body.title;

  User.getUserByUsername("test123", (err, user) => { // Get user who owns cart
    if(err) throw err;
      Product.getProductByTitle(title, (err, currProduct) => {
        User.addToCart(currProduct, user, (err, currUser) => { // Add product to user's cart
          if(currProduct.inventory_count <= 0){
            res.json({success: false, msg: 'Product not in stock'})
          }
          else {
            res.json({
              success: true,
              // name: currUser.name, // Not shown for Shopify test purposes
              itemsInCart: user.itemsInCart
            });
          }
        })
      });

  }); // Default user for testing purposes

});

// Checkout cart
router.post('/checkout', (req, res, next) => {
  // let user = req.user; // For user implementation (not implemented)

  User.getUserByUsername("test123", (err, currUser) => { // Get user who owns cart
    if(err) throw err;
      User.checkout(currUser, (err, user) => {
        if(err){
          res.json({
            success: false,
            itemsInCart: user.itemsInCart,
            msg: 'Checkout Unsuccessful'
          })
        }
        else {
          res.json({
            success: true,
            // name: currUser.name, // Not shown for Shopify test purposes
            itemsInCart: user.itemsInCart,
            msg: 'Checkout Successful'
          });
        }
      });
    }); // Default user for testing purposes
  });

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
