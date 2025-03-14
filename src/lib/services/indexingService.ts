import { storeDocumentWithEmbedding } from './embeddingService';
import { categoryQuestions } from '$lib/data/category_question_prompts.json';

/**
 * Index the pre-defined analysis questions and their explanations
 */
export async function indexAnalysisQuestions() {
  try {
    // Flatten all questions from all categories
    const allQuestions = Object.entries(categoryQuestions).flatMap(
      ([category, questions]) => questions.map(q => ({ category, ...q }))
    );
    
    const totalQuestions = allQuestions.length;
    let indexed = 0;
    
    for (const { category, id, question, description } of allQuestions) {
      // Store each question with its category as context
      await storeDocumentWithEmbedding(
        `Category: ${category}\nQuestion: ${question}\nDescription: ${description || 'This question helps analyze the ' + category.toLowerCase() + ' aspects of a company.'}`,
        {
          category,
          questionId: id,
          type: 'analysis_question'
        },
        'analysis_framework'
      );
      
      indexed++;
      console.log(`Indexed ${indexed}/${totalQuestions} questions`);
    }
    
    return { success: true, indexed, total: totalQuestions };
  } catch (error) {
    console.error('Error indexing analysis questions:', error);
    return { success: false, error: error.message, indexed: 0, total: 0 };
  }
}

/**
 * Index sample company data for better responses
 */
export async function indexSampleCompanyData(companies) {
  try {
    let indexed = 0;
    
    for (const company of companies) {
      await storeDocumentWithEmbedding(
        `Company: ${company.name}\nIndustry: ${company.industry}\nRegion: ${company.region}\nProfile: ${company.description}`,
        {
          company: company.name,
          industry: company.industry,
          region: company.region,
          type: 'company_profile'
        },
        company.name
      );
      
      indexed++;
      console.log(`Indexed ${indexed}/${companies.length} companies`);
    }
    
    return { success: true, indexed, total: companies.length };
  } catch (error) {
    console.error('Error indexing company data:', error);
    return { success: false, error: error.message, indexed: 0, total: 0 };
  }
}

/**
 * Index analysis results for RAG
 */
export async function indexAnalysisResult(
  question: string,
  answer: string,
  metadata: {
    company: string;
    industry: string;
    region: string;
    category: string;
    questionId: string;
  }
) {
  try {
    await storeDocumentWithEmbedding(
      `Question: ${question}\nAnswer: ${answer}`,
      {
        ...metadata,
        type: 'analysis_result'
      },
      metadata.company
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error indexing analysis result:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get indexing status
 */
export async function getIndexingStatus() {
  try {
    // This could be stored in Supabase or another persistent store
    // For now, we'll just return a mock status
    return {
      questions: {
        total: Object.values(categoryQuestions).flat().length,
        indexed: 0 // This would be fetched from the database in a real implementation
      },
      companies: {
        total: 3, // Sample companies
        indexed: 0 // This would be fetched from the database in a real implementation
      }
    };
  } catch (error) {
    console.error('Error getting indexing status:', error);
    throw error;
  }
}
