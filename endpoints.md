
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
| GET  | /users | Get whole list of users | 3 |
| GET  | /users/profile | Gets user profile by session | 1 |
| GET  | /users/:shortID | Get user by its id | 2 |
| GET  | /users/:shortID/posts | Get the whole list of posts for this user | 2 |
| GET  | /users/:shortID/posts/:postID | Get post by its id or slug for this user | 0 |
| POST | /users/:shortID/posts | Create a new post for this user | 1 |
| POST | /auth | Challenge validation and session creation with JWT | 0 |
| POST | /auth/register | Create a new account | 0 |
| PUT | /users/:shortID/posts/:postID | Update Post by its id or slug for this user | 1 |
| DELETE | /users/:shortID/posts/:postID | Delete Post by its id or slug for this user | 1 |

## Security reference diagram

![diagram](https://i.imgur.com/xBhUVJN.png)