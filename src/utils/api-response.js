class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400; // true if status < 400
    this.statusCode = statusCode; // HTTP status code
    this.message = message; // Short message about the response
    this.data = data || null; // Actual response data
  }

  // ✅ When request is successful (default: 200) Ex: Get data
  static success(res, data, message = 'Success', statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, data, message));
  }

  // ✅ When a new resource is created (default: 201) Ex: Create data
  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json(new ApiResponse(201, data, message));
  }
}

export { ApiResponse };
