import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { searchSimilarDocuments, storeDocumentWithEmbedding } from './embeddingService';

interface DocumentWithContent {
    content: string;
    // Add other properties if needed
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function generateAIResponse(message: string, context?: any) {
    try {
        // Extract company, industry, and region from context if available
        const company = context?.company || '';
        const industry = context?.industry || '';
        const region = context?.region || '';
        const namespace = company || 'default';
        
        // Step 1: Find similar messages/documents using vector search if we have a company
        let similarDocuments: DocumentWithContent[] = [];
        let enhancedContext = '';
        
        if (company) {
            try {
                similarDocuments = await searchSimilarDocuments(
                    message,
                    namespace,
                    0.7,  // Similarity threshold
                    3     // Top 3 results
                );
                
                // Build context from similar documents
                enhancedContext = similarDocuments
                    .map(doc => doc.content)
                    .join('\n\n');
            } catch (error) {
                console.error('Error searching similar documents:', error);
                // Continue without vector search results
            }
        }
        
        // Step 2: Build system prompt with enhanced context
        const systemPrompt = `You are an AI strategy analyst assistant specializing in business analysis.
${company ? `You are currently analyzing ${company} in the ${industry} industry, ${region} region.` : ''}
${enhancedContext ? `\nHere is some relevant context from previous analyses:\n${enhancedContext}` : ''}
Provide detailed, data-driven insights based on the question.`;

        // Step 3: Generate response
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or your preferred model
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: context && !enhancedContext ? 
                        `Context: ${JSON.stringify(context)}\n\nQuestion: ${message}` : 
                        message
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const response = completion.choices[0].message.content;
        
        // Step 4: Store this Q&A pair for future reference if we have company context
        if (company) {
            try {
                await storeDocumentWithEmbedding(
                    `Question: ${message}\nAnswer: ${response}`,
                    {
                        company,
                        industry,
                        region,
                        type: 'qa'
                    },
                    namespace
                );
            } catch (error) {
                console.error('Error storing Q&A with embedding:', error);
                // Continue even if storage fails
            }
        }

        return response;
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw new Error('Failed to generate AI response');
    }
}
