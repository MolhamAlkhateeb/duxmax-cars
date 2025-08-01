import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema,
} from '@/schemas';

const authRoutes = new Hono();

// Register endpoint
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // TODO: Implement user registration with Better Auth
    // For now, return success response
    return c.json({
      message: 'User registration endpoint - implementation pending',
      data,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login endpoint
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // TODO: Implement user login with Better Auth
    return c.json({
      message: 'User login endpoint - implementation pending',
      data,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 401);
  }
});

// Logout endpoint
authRoutes.post('/logout', async (c) => {
  try {
    // TODO: Implement logout with Better Auth
    return c.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// Forgot password endpoint
authRoutes.post('/forgot-password', zValidator('json', forgotPasswordSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    
    // TODO: Implement forgot password with Better Auth
    return c.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
      data,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Failed to send reset email' }, 500);
  }
});

// Get current user endpoint
authRoutes.get('/me', async (c) => {
  try {
    // TODO: Implement get current user with Better Auth
    return c.json({ 
      message: 'Get current user endpoint - implementation pending',
      user: null 
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

export { authRoutes };
