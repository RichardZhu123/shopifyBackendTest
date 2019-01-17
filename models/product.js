const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Product Schema
const ProductSchema = mongoose.Schema({
  title: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  inventory_count:{
    type: Number,
    required: true
  }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function(id, callback){
  Product.findById(id, callback);
}

module.exports.getProductByTitle = function(title, callback){
  const query = {title: title};
  Product.findOne(query, callback);
}

module.exports.getAllProducts = function(callback){
  Product.find({}, callback).select("-_id -__v");
}

module.exports.getAllAvailable = function(callback){
  Product.find({inventory_count: { $gt: 0}}, callback).select("-_id -__v");
}

module.exports.purchase = function(title){
  const query = {title: title};
  const update = {$inc: { "price": 1 }};
  Product.update(query, update, {multi: true});
}

module.exports.addProduct = function(newProduct, callback){
  newProduct.save(callback);
}
