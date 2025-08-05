import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { 
  createListingSchema, 
  updateListingSchema,
  listingFiltersSchema 
} from '@/schemas';
import { auth, User } from '@/lib/auth';

// Define the environment type for Hono context
type Env = {
  Variables: {
    user: User;
  };
};

const listingsRoutes = new Hono<Env>();

// Authentication middleware
const requireAuth = async (c: any, next: any) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    
    if (!session?.user) {
      return c.json({ error: 'Authentication required' }, 401);
    }
    
    // Add user to context
    c.set('user', session.user);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Get all listings with filters
listingsRoutes.get('/', zValidator('query', listingFiltersSchema), async (c) => {
  try {
    const filters = c.req.valid('query');
    
    // TODO: Implement listings search with filters using repository
    return c.json({
      message: 'Get listings endpoint - implementation pending',
      filters,
      listings: [],
      total: 0,
    });
  } catch (error) {
    console.error('Get listings error:', error);
    return c.json({ error: 'Failed to get listings' }, 500);
  }
});

// Get single listing by ID
listingsRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // TODO: Implement get listing by ID using repository
    return c.json({
      message: 'Get listing by ID endpoint - implementation pending',
      id,
      listing: null,
    });
  } catch (error) {
    console.error('Get listing error:', error);
    return c.json({ error: 'Failed to get listing' }, 500);
  }
});

// Create new listing
listingsRoutes.post('/', requireAuth, zValidator('json', createListingSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const user = c.get('user');
    
    // TODO: Implement create listing using repository
    // The user will be available as c.get('user')
    return c.json({
      message: 'Create listing endpoint - implementation pending',
      data: { ...data, userId: user.id },
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return c.json({ error: 'Failed to create listing' }, 500);
  }
});

// Update listing
listingsRoutes.put('/:id', requireAuth, zValidator('json', updateListingSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const user = c.get('user');
    
    // TODO: Implement update listing using repository
    // Should verify that the user owns the listing before updating
    return c.json({
      message: 'Update listing endpoint - implementation pending',
      id,
      data: { ...data, userId: user.id },
    });
  } catch (error) {
    console.error('Update listing error:', error);
    return c.json({ error: 'Failed to update listing' }, 500);
  }
});

// Delete listing
listingsRoutes.delete('/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');
    
    // TODO: Implement delete listing using repository
    // Should verify that the user owns the listing before deleting
    return c.json({
      message: 'Delete listing endpoint - implementation pending',
      id,
      userId: user.id,
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    return c.json({ error: 'Failed to delete listing' }, 500);
  }
});

// Get user's listings
listingsRoutes.get('/user/:userId', requireAuth, async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = c.get('user');
    
    // Ensure users can only access their own listings
    if (user.id !== userId) {
      return c.json({ error: 'Unauthorized access to user listings' }, 403);
    }
    
    // TODO: Implement get user listings using repository
    return c.json({
      message: 'Get user listings endpoint - implementation pending',
      userId,
      listings: [],
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    return c.json({ error: 'Failed to get user listings' }, 500);
  }
});

// Get featured listings
listingsRoutes.get('/featured', async (c) => {
  try {
    // TODO: Implement get featured listings using repository
    return c.json({
      message: 'Get featured listings endpoint - implementation pending',
      listings: [],
    });
  } catch (error) {
    console.error('Get featured listings error:', error);
    return c.json({ error: 'Failed to get featured listings' }, 500);
  }
});

export { listingsRoutes };
