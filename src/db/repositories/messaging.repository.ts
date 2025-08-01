import { eq, and, desc, or } from 'drizzle-orm';
import type { Database } from '../index';
import {
  messages,
  conversations,
  type Message,
  type NewMessage,
  type Conversation,
} from '../schema';

export class MessagingRepository {
  constructor(private readonly db: Database) {}

  // Get conversation between two users for a listing
  async getConversation(
    listingId: string,
    buyerUserId: string,
    sellerUserId: string,
  ): Promise<Conversation | null> {
    const conversation = await this.db.query.conversations.findFirst({
      where: and(
        eq(conversations.listingId, listingId),
        eq(conversations.buyerUserId, buyerUserId),
        eq(conversations.sellerUserId, sellerUserId),
      ),
    });

    return conversation || null;
  }

  // Create or get conversation
  async createOrGetConversation(
    listingId: string,
    buyerUserId: string,
    sellerUserId: string,
  ): Promise<Conversation> {
    // Try to find existing conversation
    const existing = await this.getConversation(
      listingId,
      buyerUserId,
      sellerUserId,
    );

    if (existing) {
      return existing;
    }

    // Create new conversation
    const [conversation] = await this.db
      .insert(conversations)
      .values({
        listingId,
        buyerUserId,
        sellerUserId,
        lastMessageAt: new Date(),
      })
      .returning();

    if (!conversation) {
      throw new Error('Failed to create conversation');
    }

    return conversation;
  }

  // Send message
  async sendMessage(messageData: NewMessage): Promise<Message> {
    const [message] = await this.db
      .insert(messages)
      .values(messageData)
      .returning();

    if (!message) {
      throw new Error('Failed to send message');
    }

    // Update conversation last message time
    await this.db
      .update(conversations)
      .set({
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(conversations.listingId, message.listingId));

    return message;
  }

  // Get messages for a conversation
  async getConversationMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 50,
  ): Promise<Message[]> {
    const offset = (page - 1) * limit;

    // First verify user is part of the conversation
    const conversation = await this.db.query.conversations.findFirst({
      where: and(
        eq(conversations.id, conversationId),
        or(
          eq(conversations.buyerUserId, userId),
          eq(conversations.sellerUserId, userId),
        ),
      ),
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    return this.db.query.messages.findMany({
      where: eq(messages.listingId, conversation.listingId),
      orderBy: desc(messages.createdAt),
      limit,
      offset,
      with: {
        fromUser: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  // Get user's conversations
  async getUserConversations(userId: string): Promise<
    (Conversation & {
      listing: {
        id: string;
        title: string;
        images: unknown;
      };
      otherUser: {
        id: string;
        name: string | null;
        image: string | null;
      };
      lastMessage: Message | null;
    })[]
  > {
    const userConversations = await this.db.query.conversations.findMany({
      where: or(
        eq(conversations.buyerUserId, userId),
        eq(conversations.sellerUserId, userId),
      ),
      orderBy: desc(conversations.lastMessageAt),
      with: {
        listing: {
          columns: {
            id: true,
            title: true,
            images: true,
          },
        },
        buyerUser: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        sellerUser: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get last messages for each conversation
    const conversationsWithLastMessage = await Promise.all(
      userConversations.map(async conversation => {
        const lastMessage = await this.db.query.messages.findFirst({
          where: eq(messages.listingId, conversation.listingId),
          orderBy: desc(messages.createdAt),
        });

        return {
          ...conversation,
          otherUser:
            conversation.buyerUserId === userId
              ? conversation.sellerUser
              : conversation.buyerUser,
          lastMessage: lastMessage || null,
        };
      }),
    );

    return conversationsWithLastMessage;
  }

  // Mark messages as read
  async markMessagesAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    // Get conversation to verify access
    const conversation = await this.db.query.conversations.findFirst({
      where: and(
        eq(conversations.id, conversationId),
        or(
          eq(conversations.buyerUserId, userId),
          eq(conversations.sellerUserId, userId),
        ),
      ),
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Mark unread messages as read
    await this.db
      .update(messages)
      .set({
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(messages.listingId, conversation.listingId),
          eq(messages.toUserId, userId),
          eq(messages.isRead, false),
        ),
      );
  }

  // Get unread message count for user
  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await this.db
      .select({ count: messages.id })
      .from(messages)
      .where(and(eq(messages.toUserId, userId), eq(messages.isRead, false)));

    return result.length;
  }

  // Delete conversation (soft delete by marking inactive)
  async deleteConversation(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const [result] = await this.db
      .update(conversations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(conversations.id, conversationId),
          or(
            eq(conversations.buyerUserId, userId),
            eq(conversations.sellerUserId, userId),
          ),
        ),
      )
      .returning({ id: conversations.id });

    return !!result;
  }
}
