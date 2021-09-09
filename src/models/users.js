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
    role: { type: 'object' },
    profileData: { type: 'object' },
    avatar: { type: 'string' },
  },
  required: ['shortID', 'firstName', 'lastName', 'publicKey', 'username', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false,
};

export const validateUserCreation = ajv.compile(newUserSchema);

// DD relational properties

export const profileData = {
  config: {
    lang: 'en',
    contentRules: [],
    ads: true,
    notifications: [],
  },
  followers: 0,
  following: 0,
  subscriptions: 0,
  posts: 0,
  followers_url: '',
  following_url: '',
  subscriptions_url: '',
  posts_url: '',
};
