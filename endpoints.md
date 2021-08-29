
# API USAGE

This are the available security endpoints and the security levels of the DevLand API.

## Security legend:
| Level | Description |
| ----- | ----------- |
| 0 | Doesn't require authentication |
| 1 | Requires authentication and just the owner can access |
| 2 | Requires authentication, owner can access but can be completely or partially restricted for other users |
| 3 | Data is completely restricted for normal users (Just for internal usage) |

## Endpoints

| Method | Endpoint | Description | Secure |
| ------------- | ------------- | ----- | ------ |
| GET  | / | Get API information | 0 |
| GET | /auth | Generate stellar login for user authentication | 0 |
| GET | /auth/login | Login an existent account | 0 |
| GET  | /posts | Get the whole list of posts | 2 |
| GET  | /posts/:postID | Get post by its id | 0 |
| GET  | /users | Get whole list of users | 3 |
| GET  | /users/:shortID | Get user by its id | 2 |
| GET  | /users/profile | Gets user profile by session | 1 |
| POST | /posts | Create a new post | 1 |
| POST | /auth | Challenge validation and session creation with JWT | 0 |
| POST | /auth/register | Create a new account | 0 |
| PUT | /posts/:postID | Update Post by its id | 1 |
| DELETE | /posts/:postID | Delete Post by its id | 1 |