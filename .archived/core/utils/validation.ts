import { z } from 'zod';
import { createValidationError } from './errorHandler';

export const messageSchema = z.object({
  content: z.string()
    .min(1, 'Message content cannot be empty')
    .max(4000, 'Message content is too long'),
  sender: z.enum(['user', 'ai', 'system']),
  timestamp: z.string().datetime().optional(),
  status: z.enum(['pending', 'complete', 'error']).optional(),
  id: z.string().optional()
});

export const chatSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Chat name is required'),
  company: z.string().optional(),
  industry: z.string().optional(),
  region: z.string().optional(),
  messages: z.array(messageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const settingsSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).max(8000)
});

export async function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createValidationError('Validation failed', {
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    throw error;
  }
}