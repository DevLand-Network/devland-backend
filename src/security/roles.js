// Platform roles are a set of roles that are defined by the platform.

import commonErrors from '../messages/error/http.js';
import { roles } from '../models/roles.js';

const { forbidden } = commonErrors;

// This middleware ensures that the user has the required admin role to access the next resource.

export const protectByAccessLevel3 = (req, res, next) => {
  const { user } = req;
  if (user.role && user.role.permissionLevel >= roles.admin.permissionLevel) {
    next();
  } else {
    res.status(403).send(forbidden("This key doesn't have permission to access this resource."));
  }
};

// This middleware ensures that the user has the required moderator role to access the next resource.

export const protectByAccessLevel2 = (req, res, next) => {
  const { user } = req;
  if (user.role && user.role.permissionLevel >= roles.moderator.permissionLevel) {
    next();
  } else {
    res.status(403).send(forbidden("This key doesn't have permission to access this resource."));
  }
};
