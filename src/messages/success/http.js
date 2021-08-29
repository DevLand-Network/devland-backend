export default {
  ok(customMessage) {
    return {
      status: 200,
      message: 'Successful request.' || customMessage,
    }
  },
  created(customMessage) {
    return {
      status: 201,
      message: 'Resource created.' || customMessage,
    }
  },
  accepted(customMessage) {
    return {
      status: 202,
      message: 'Request accepted.' || customMessage,
    }
  },
  noContent(customMessage) {
    return {
      status: 204,
      message: 'No content.' || customMessage,
    }
  },
}
