export default {
  notFound(customMessage) {
    return {
      status: 404,
      message: customMessage || 'Not found',
    }
  },
  badRequest(customMessage) {
    return {
      status: 400,
      message: customMessage || 'Bad request',
    }
  },
  unauthorized(customMessage) {
    return {
      status: 401,
      message: customMessage || 'Unauthorized',
    }
  },
  forbidden(customMessage) {
    return {
      status: 403,
      message: customMessage || 'Forbidden',
    }
  },
  conflict(customMessage) {
    return {
      status: 409,
      message: customMessage || 'Conflict',
    }
  },
  internalServerError(customMessage) {
    return {
      status: 500,
      message: customMessage || 'Internal server error',
    }
  },
  serviceUnavailable(customMessage) {
    return {
      status: 503,
      message: customMessage || 'Service unavailable',
    }
  },
  badGateway(customMessage) {
    return {
      status: 502,
      message: customMessage || 'Bad gateway',
    }
  },
  gatewayTimeout(customMessage) {
    return {
      status: 504,
      message: customMessage || 'Gateway timeout',
    }
  },
  invalidToken(customMessage) {
    return {
      status: 401,
      message: customMessage || 'Invalid token',
    }
  },
  accessDenied(customMessage) {
    return {
      status: 403,
      message: customMessage || 'Access denied',
    }
  }
}
