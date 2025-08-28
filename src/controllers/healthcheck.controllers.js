import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const healthcheck = (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: 'Service is up and running'
      }));
  } catch (error) {
    res.status(500).json(
      new ApiError(500, {
        message: 'Internal Server Error checked by Health Checker',
      }),
    );
  }
};

export { healthcheck };
