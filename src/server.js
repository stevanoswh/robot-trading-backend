import http from 'http';
import app from './app.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[API] listening at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('✋ SIGINT received – shutting down');
  server.close(() => process.exit(0));
});
