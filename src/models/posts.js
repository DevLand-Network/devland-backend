import Ajv from 'ajv'
const ajv = new Ajv()

const createSchema = {
  type: 'object',
  properties: {
    owner: {
      type: 'string',
      minLength: 1
    },
    title: { type: 'string' },
    slug: {
      type: 'string',
      minLength: 1
    },
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
    needsSubscription: {
      type: 'boolean',
    },
    isPublished: {
      type: 'boolean',
    },
  },
  required: ['title', 'createdAt', 'updatedAt', 'content', 'shortID', 'owner', 'slug'],
  additionalProperties: false,
}

const updateSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    createdAt: {
      type: 'string',
    },
    slug: {
      type: 'string',
      minLength: 1
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
    needsSubscription: {
      type: 'boolean',
    },
    isPublished: {
      type: 'boolean',
    },
  },
  required: ['title', 'createdAt', 'updatedAt', 'content', 'shortID', 'owner', 'slug'],
  additionalProperties: false,
}

export const validateCreation = ajv.compile(createSchema)
export const validateUpdate = ajv.compile(updateSchema)
