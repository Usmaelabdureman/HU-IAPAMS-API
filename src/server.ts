import { Server } from 'http';
import app from './app';
import config from './app/config';
import connectDB from './app/utils/db';

const port = config.port || 9000;

let server: Server;

async function main() {
  try {
    await connectDB();
    
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', () => {
  console.log('Unhandled rejection detected. shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught exception detected. shutting down...');
  process.exit(1);
});

main();