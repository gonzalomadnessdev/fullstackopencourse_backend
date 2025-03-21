class ApiHttpException extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiHttpException'
  }
}

module.exports = ApiHttpException