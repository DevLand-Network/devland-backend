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
    quantity: 0,
    list: [],
  },
  subscribers: {
    quantity: 0,
    list: [],
  },
  subscriptions: {
    quantity: 0,
    list: [],
  },
  posts: {
    quantity: 0,
    list: [],
  },
  comments: {
    quantity: 0,
    list: [],
  },
  likes: {
    quantity: 0,
    list: [],
  },
  sponsors: {
    quantity: 0,
    list: [],
  },
  courses: {
    quantity: 0,
    list: [],
  },
  groups: {
    quantity: 0,
    list: [],
  },
}