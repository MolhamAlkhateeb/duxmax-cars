import { z } from 'zod';

// Send message schema
export const sendMessageSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  toUserId: z.string().uuid('Invalid user ID'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

// Get conversation messages schema
export const getMessagesSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

// Mark as read schema
export const markAsReadSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;
export type GetMessagesData = z.infer<typeof getMessagesSchema>;
export type MarkAsReadData = z.infer<typeof markAsReadSchema>;
