import Joi, { Root as joiRoot, StringSchema } from '@hapi/joi'
import { isValidId } from './validation'

export interface RequestValidation extends joiRoot {
  id: () => StringSchema
}

const RequestValidation: RequestValidation = Joi.extend((joi) => {

  return {
    type: 'id',
    base: joi.string(),
    messages: {
      'id.invalid': '"{{#label}}" is not valid id',
    },
    validate(value, helpers) {
      if (isValidId(value)) {
        return value
      }
      
      return { value, errors: helpers.error('id.invalid') } 
    },
  }
})

export default RequestValidation
