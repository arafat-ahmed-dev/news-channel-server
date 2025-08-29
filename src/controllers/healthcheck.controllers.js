import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { checkEmailHealth } from '../utils/mail.js';
import { checkDatabaseHealth } from '../database/index.js';

const healthcheck = asyncHandler(async (req, res) => {
  // Check email and database health in parallel for better performance
  const [emailHealth, databaseHealth] = await Promise.all([
    checkEmailHealth(),
    checkDatabaseHealth(),
  ]);

  // Determine overall service health
  const isServiceHealthy =
    emailHealth.status === 'healthy' && databaseHealth.status === 'healthy';

  const healthStatus = {
    service: isServiceHealthy ? 'healthy' : 'degraded',
    components: {
      email: emailHealth,
      database: databaseHealth,
    },
    timestamp: new Date().toISOString(),
    message: isServiceHealthy
      ? 'All services are operational'
      : 'Some services are experiencing issues',
  };

  // Determine status code based on overall health
  const statusCode = isServiceHealthy ? 200 : 503;
  const responseMessage = isServiceHealthy
    ? 'Health check completed successfully'
    : 'Health check completed - some services degraded';

  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, healthStatus, responseMessage));
});
export { healthcheck };
