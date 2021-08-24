import Ajv from 'ajv'
const ajv = new Ajv()

const newUserSchema = {
  type: 'object',
  properties: {
    shortID: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    role: { type: 'string' },
  },
  required: ['shortID', 'name', 'email', 'password', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false,
}

export const validateUserCreation = ajv.compile(newUserSchema)
