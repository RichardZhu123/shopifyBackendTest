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


```bash
POST /product/fetch       // Fetches product
```
Live endpoint: https://shopifybackendtest.herokuapp.com/product/create
```javascript
{
	"title": "testProduct"
}
```

### User Registration/Authentication
```bash
POST /users/register       // Adds user to database
```

```bash
POST /users/authenticate   // Gives back a token
```

```bash
GET /users/profile         // Needs valid json web token to access (not relevant to challenge)
```
