import Ajv from 'ajv'
const ajv = new Ajv()
const schema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    date: {
      type: 'string',
    },
    content: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    description: { type: 'string' },
    shortID: { type: 'string' },
  },
  required: ['title', 'date', 'content', 'shortID'],
  additionalProperties: false,
}

export const validate = ajv.compile(schema)
