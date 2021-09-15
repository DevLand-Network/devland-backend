import Ajv from 'ajv';
const ajv = new Ajv();

const newUserSchema = {
  type: 'object',
  properties: {
    shortID: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    username: { type: 'string' },
    publicKey: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    role: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        permissionLevel: { type: 'number' },
      },
    },
    avatar: { type: 'string' },
    config: {
      type: 'object',
      properties: {
        lang: { type: 'string' },
        ads: { type: 'boolean' },
        notificationRules: { type: 'array' },
        contentRules: { type: 'array' },
      },
    },
    followers: { type: 'number' },
    following: { type: 'number' },
    posts: { type: 'number' },
    subscriptions: { type: 'number' },
    followers_url: { type: 'string' },
    following_url: { type: 'string' },
    posts_url: { type: 'string' },
    subscriptions_url: { type: 'string' },
  },
  required: ['shortID', 'firstName', 'lastName', 'publicKey', 'username', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false,
};

export const validateUserCreation = ajv.compile(newUserSchema);

// DD relational properties

// Content rules is defined on security/contentRules.js

export const profileData = (name, lastName) => ({
  avatar: name && lastName ? `https://ui-avatars.com/api/?name=${name}+${lastName}` : '',
  config: {
    lang: 'en',
    contentRules: [],
    ads: true,
    notificationRules: [],
  },
  followers: 0,
  following: 0,
  subscriptions: 0,
  posts: 0,
  followers_url: '',
  following_url: '',
  subscriptions_url: '',
  posts_url: '',
});
