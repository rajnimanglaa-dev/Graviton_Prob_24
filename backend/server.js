import http from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection, pool } from './config/db.js';
import { attachSocketServer } from './services/socketService.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);
attachSocketServer(server);

try {
  await checkDatabaseConnection();
  server.listen(env.port, () => logger.info('server_started', { port: env.port, environment: env.nodeEnv }));
} catch (error) {
  logger.error('database_connection_failed', { message: error.message });
  process.exitCode = 1;
  await pool.end();
}

async function shutdown(signal) {
  logger.info('server_stopping', { signal });
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
