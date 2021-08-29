import Ajv from 'ajv'
const ajv = new Ajv()

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
    role: { type: 'string' },
    profileData: { type: 'object' },
  },
  required: ['shortID', 'firstName', 'lastName', 'publicKey', 'username', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false,
}

export const validateUserCreation = ajv.compile(newUserSchema)

// DD relational properties

export const profileData = {
  connections: {
    total: 0,
    list: [],
  },
  subscribers: {
    total: 0,
    list: [],
  },
  subscriptions: {
    total: 0,
    list: [],
  },
  posts: {
    total: 0,
    list: [],
  },
  comments: {
    total: 0,
    list: [],
  },
  likes: {
    total: 0,
    list: [],
  },
  sponsors: {
    total: 0,
    list: [],
  },
  courses: {
    total: 0,
    list: [],
  },
  groups: {
    total: 0,
    list: [],
  },
}