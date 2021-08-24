import Ajv from 'ajv'
const ajv = new Ajv()

const createSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    content: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    description: { type: 'string' },
    shortID: { type: 'string' },
    visibility: {
      type: 'string',
      enum: ['public', 'private', 'unlisted'],
    },
  },
  required: ['title', 'createdAt', 'updatedAt', 'content', 'shortID'],
  additionalProperties: false,
}

const updateSchema = { ...createSchema, required: ['updatedAt'] }

export const validateCreation = ajv.compile(createSchema)
export const validateUpdate = ajv.compile(updateSchema)
