import { json } from '@sveltejs/kit';
import { 
  indexAnalysisQuestions, 
  indexSampleCompanyData,
  getIndexingStatus 
} from '$lib/services/indexingService';

export async function GET() {
  try {
    const status = await getIndexingStatus();
    return json(status);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { action, data } = await request.json();
    
    switch (action) {
      case 'indexQuestions':
        const questionsResult = await indexAnalysisQuestions();
        return json(questionsResult);
        
      case 'indexCompanies':
        const companiesResult = await indexSampleCompanyData(data.companies);
        return json(companiesResult);
        
      default:
        return json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
