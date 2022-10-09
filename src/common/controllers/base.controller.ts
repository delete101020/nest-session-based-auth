import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBadRequestResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 400 },
      error: { type: 'string', example: 'Bad Request' },
      message: { type: 'string', example: 'Bad Request' },
      errors: { type: 'array', example: ['email must be an email'] },
      path: { type: 'string', example: '/api/v1/auth/forgot-password' },
    },
  },
})
@ApiUnauthorizedResponse({
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 401 },
      error: { type: 'string', example: 'Unauthorized' },
      message: { type: 'string', example: 'Unauthorized' },
      errors: { type: 'array', example: [] },
      path: { type: 'string', example: '/api/v1/auth/password' },
    },
  },
})
export class BaseController {}
