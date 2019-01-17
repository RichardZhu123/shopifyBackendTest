const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Product = require('../models/product');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  numItemsInCart:{
    type: Number,
    required: true
  },
  itemsInCart:{
    type: Object,
    required: false
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// Add a product to user's cart
module.exports.addToCart = function(currProduct, currUser, callback){
  var newItemsInCart = currUser.itemsInCart;
  newItemsInCart.push(currProduct);
  const query = {_id: currUser._id};
  const update = { $set: {itemsInCart: newItemsInCart}, $inc: {numItemsInCart: 1}};
  if(currProduct.inventory_count <= 0) {
    User.update(query, callback);
  }  else {
      User.update(query, update, callback);
  }
}

// Purchase and clear contents of user's cart
module.exports.checkout = function(currUser, callback){
  newItemsInCart = currUser.itemsInCart;
  const query = {_id: currUser._id};
  const update = { $set: {itemsInCart: [], numItemsInCart: 0}};
  // Purchase each item in cart
  if(newItemsInCart != null)
  {
    for (var i = 0; i < newItemsInCart.length; i++){
      Product.purchase(newItemsInCart[i].title, (err, prod) => {
        if(err) throw err;
      });
    }
  }
  User.update(query, update, callback); // Remove all items in cart
}


module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
