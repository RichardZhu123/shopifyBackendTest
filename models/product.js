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
  const query = {title: title}
  Product.findOne(query, callback);
}

module.exports.addProduct = function(newProduct, callback){
  newProduct.save(callback);
}
