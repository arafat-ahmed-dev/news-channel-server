class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);

    this.statusCode = statusCode; // HTTP status code
    this.message = message; // Error message
    this.errors = errors; // Array of extra validation errors if any
    this.success = false; // Always false for errors
    this.data = null; // Data related to the error

    // ❌ Stack trace (only useful for debugging)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ❌ For invalid client request (400) Ex: Validation errors
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  // ❌ For unauthorized access (401) Ex: Invalid credentials
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  // ❌ For forbidden access (403) Ex: User not authorized
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  // ❌ When resource is not found (404) Ex: User not found
  static notFound(message = 'Not Found') {
    return new ApiError(404, message);
  }

  // ❌ For unexpected server errors (500) Ex: Internal server error
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

export { ApiError };
