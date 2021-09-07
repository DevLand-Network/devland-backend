// Platform roles are a set of roles that are defined by the platform.

import commonErrors from '../messages/error/http.js';

const { forbidden } = commonErrors;

const roles = {
  admin: {
    name: 'admin',
    description: 'Administrator',
    permissionLevel: 3,
  },
  moderator: {
    name: 'moderator',
    description: 'Moderator',
    permissionLevel: 2,
  },
  user: {
    name: 'user',
    description: 'User',
    permissionLevel: 1,
  },
  guest: {
    name: 'guest',
    description: 'Guest',
    permissionLevel: 0,
  },
};

export const roleMiddleware = (req, res, next) => {
  const { user } = req;
  if (user.role && user.role.permissionLevel >= roles.admin.permissionLevel) {
    next();
  } else {
    res.status(403).send(forbidden("This key doesn't have permission to access this resource."));
  }
};

export const getRole = (roleName) => {
  return roles[roleName];
};
