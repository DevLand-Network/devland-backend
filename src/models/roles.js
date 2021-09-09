export const roles = {
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

export const getRole = (roleName) => {
  const role = roles[roleName];
  if (!role) {
    throw new Error(`Role ${roleName} does not exist`);
  }
  return role;
};
