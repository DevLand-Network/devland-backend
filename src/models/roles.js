import { getCollection } from '../storage/database.js';

export const roles = {
  superUser: {
    name: 'Super User',
    description: 'superUser',
    permissionLevel: 4,
  },
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

export const createUser = async (user) => {
  const usersCol = await getCollection('users');
  const userDoc = await usersCol.findOne({ $or: [{ username: user.username }, { publicKey: user.publicKey }] });
  if (userDoc) {
    throw new Error(`User ${user.username} or ${user.publicKey} already exists`);
  }
  const superUser = await usersCol.insertOne(user);
  return superUser;
};
