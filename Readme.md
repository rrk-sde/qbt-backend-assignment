## API Reference

### User Routes

| Endpoint                  | Method | Description                         |
| :------------------------ | :----- | :---------------------------------- |
| `/details/:user_id`       | GET    | Get user details by `user_id`.     |
| `/update/:user_id`        | PUT    | Update user details by `user_id`.  |
| `/image/:user_id`         | GET    | Get user image by `user_id`.       |
| `/insert`                 | POST   | Insert a new user with optional profile image upload. |
| `/delete/:user_id`        | DELETE | Delete user by `user_id`.          |
| `/login`                  | POST   | Authenticate and login a user.     |

### Usage

To use these routes in your application, make sure to configure your Express.js app to use the `userRoutes`:

```javascript
const express = require('express');
const app = express();
const userRoutes = require('./userRoutes'); // Import your routes here

// ...

app.use('/', userRoutes); // Mount the routes at the desired base URL

// ...
