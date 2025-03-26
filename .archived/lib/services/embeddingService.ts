import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { supabase } from './supabase';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

/**
 * Generate embeddings for text using OpenAI
 */
export async function generateEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Store a document with its embedding in Supabase
 */
export async function storeDocumentWithEmbedding(
  content: string,
  metadata: Record<string, any>,
  namespace: string = 'default'
) {
  console.log('Storing document (stubbed):', { content, metadata, namespace });
  return null;
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  query: string,
  namespace: string = 'default',
  matchThreshold: number = 0.7,
  limit: number = 5
) {
  console.log('Searching documents (stubbed):', { query, namespace, matchThreshold, limit });
  return [];
}
