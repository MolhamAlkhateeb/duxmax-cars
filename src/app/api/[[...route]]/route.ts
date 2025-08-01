import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// Import route handlers
import { authRoutes } from '../auth/route';
import { listingsRoutes } from '../listings/route';
import { messagesRoutes } from '../messages/route';
import { usersRoutes } from '../users/route';

// Create Hono app
const app = new Hono().basePath('/api');

// Mount routes
app.route('/auth', authRoutes);
app.route('/listings', listingsRoutes);
app.route('/messages', messagesRoutes);
app.route('/users', usersRoutes);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    message: 'DuxMax API is running',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', message: 'API endpoint not found' }, 404);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
