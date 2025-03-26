/**
 * MemoryExtractionService - Service for extracting memories from various sources
 * Uses AI to identify important information and insights
 */
import type { MemoryItem, MemoryCategory } from '../types/memory';
import type { Chat, Message } from '$lib/types/chat';

/**
 * Class for extracting memories from different sources
 */
export class MemoryExtractionService {
  /**
   * Extract memories from a chat conversation
   */
  async extractFromChat(chat: Chat): Promise<MemoryItem[]> {
    try {
      // In a real implementation, this would use AI to extract insights
      // For now, we'll use a simple heuristic approach
      const extractedMemories: MemoryItem[] = [];
      
      // Process AI messages to extract potential insights
      chat.messages.forEach(message => {
        if (message.sender === 'ai') {
          this.extractFromMessage(message, chat.id, extractedMemories);
        }
      });
      
      return extractedMemories;
    } catch (error) {
      console.error('Error extracting memories from chat:', error);
      return [];
    }
  }
  
  /**
   * Extract memories from a single message
   */
  private extractFromMessage(
    message: Message, 
    chatId: string, 
    extractedMemories: MemoryItem[]
  ): void {
    // Split content by paragraphs
    const paragraphs = message.content.split('\n\n');
    
    paragraphs.forEach(paragraph => {
      // Skip short paragraphs
      if (paragraph.length < 50) return;
      
      // Skip paragraphs that are likely not insights
      if (paragraph.startsWith('I ') || paragraph.startsWith('You ')) return;
      
      // Determine the category based on content
      const category = this.determineCategory(paragraph);
      
      // Extract tags from content
      const tags = this.extractTags(paragraph);
      
      // Create a memory
      const memoryId = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const newMemory: MemoryItem = {
        id: memoryId,
        content: paragraph.trim(),
        category,
        source: 'chat',
        tags: [...tags, 'auto-extracted'],
        createdAt: now,
        updatedAt: now,
        metadata: {
          chatId,
          messageId: message.id,
          extractionMethod: 'auto'
        }
      };
      
      extractedMemories.push(newMemory);
    });
  }
  
  /**
   * Determine the category of a memory based on its content
   */
  private determineCategory(content: string): MemoryCategory {
    const lowerContent = content.toLowerCase();
    
    // Check for questions
    if (lowerContent.includes('?') || 
        lowerContent.includes('what') || 
        lowerContent.includes('how') || 
        lowerContent.includes('why')) {
      return 'question';
    }
    
    // Check for action items
    if (lowerContent.includes('should') || 
        lowerContent.includes('need to') || 
        lowerContent.includes('must') || 
        lowerContent.includes('recommend')) {
      return 'action';
    }
    
    // Check for references
    if (lowerContent.includes('according to') || 
        lowerContent.includes('research shows') || 
        lowerContent.includes('study') || 
        lowerContent.includes('report')) {
      return 'reference';
    }
    
    // Check for facts
    if (lowerContent.includes('is') || 
        lowerContent.includes('are') || 
        lowerContent.includes('was') || 
        lowerContent.includes('were')) {
      return 'fact';
    }
    
    // Default to insight
    return 'insight';
  }
  
  /**
   * Extract potential tags from content
   */
  private extractTags(content: string): string[] {
    const tags: Set<string> = new Set();
    
    // Extract industry-specific terms
    const industryTerms = [
      'marketing', 'sales', 'finance', 'operations', 
      'strategy', 'technology', 'innovation', 'competition',
      'market', 'customer', 'product', 'service'
    ];
    
    industryTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        tags.add(term);
      }
    });
    
    // Extract key phrases (simplified approach)
    const keyPhrases = content.match(/[A-Z][a-z]+ [a-z]+/g) || [];
    keyPhrases.forEach(phrase => {
      if (phrase.length > 10) {
        tags.add(phrase.toLowerCase());
      }
    });
    
    return Array.from(tags).slice(0, 5); // Limit to 5 tags
  }
  
  /**
   * Extract memories from a document
   * This would be implemented in a real application
   */
  async extractFromDocument(documentContent: string, documentId: string): Promise<MemoryItem[]> {
    // Placeholder for document extraction logic
    return [];
  }
}

// Export a singleton instance
export const memoryExtractionService = new MemoryExtractionService();