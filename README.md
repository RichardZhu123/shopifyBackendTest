# MEAN Authentication App for Shopify Backend Dev Challenge

API for registering users with mongodb and authentication using a JWT (json web token). This app uses passport and passport-jwt and uses a JWT strategy

### Version
1.0.0

### Usage

```bash
npm install
```

```bash
npm start
```
### API Usage

Field | Description
------|------------
**id** | The item's unique id.
**name** | Name of customer.
**email** | Email of customer.
**username** | Username of customer.
**title** | Name of product.
**price** | Price of product.
**inventory_count** | Number of product in inventory.
**excludeUnavailable** | Boolean describing whether unavailable inventory is to be excluded from search

All API calls must contain the following headers

Key | Value
----|------
Content-Type | application/json

All endpoints listed below contain the endpoint, a live endpoint on Heroku, and
a sample call.

### Add Product
```bash
POST /product/create       // Adds product to database
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/create
```javascript
{
  "title": "testProduct",
  "price": 3,
  "inventory_count": 3
}
```

### Fetch (Single) Product

```bash
POST /product/fetch       // Fetches product
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/fetch
```javascript
{
	"title": "testProduct"
}
```

### Fetch All Products
```bash
POST /product/fetchall       // Fetches all products
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/fetchall
```javascript
{
	"excludeUnavailable": true
}
```

### Purchase Product
```bash
POST /product/purchase       // Purchases product, decreasing inventory_count by 1
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/purchase
```javascript
{
	"title": "testProduct"
}
```

### View Cart
Fetch products contained in default user(username: test123)'s cart.
```bash
GET /product/viewCart       // Fetches cart
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/viewCart
```javascript
{ }
```

### Add to Cart
Adds item to cart, but the product stays in the inventory (inventory_count doesn't change)
```bash
POST /product/addToCart       // Adds item to cart
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/addToCart
```javascript
{
	"title": "testProduct"
}
```

### Checkout
Purchases all items in default user(username: test123)'s cart and empties the cart
```bash
POST /product/checkout       // Checkout of all items in cart
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/checkout
```javascript
{ }
```

### User Registration
```bash
POST /users/register       // Adds user to database
```

### User Authentication
```bash
POST /users/authenticate   // Gives back a token
```
