interface AnalysisQuestion {
    id: string;
    question: string;
    prompt: string;
    answer?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
}

interface AnalysisStateType {
    step: number;
    companyInfo: {
        company: string;
        region: string;
        industry: string;
        context: string;
    };
    selectedQuestions: Record<string, boolean>;
    analysisProgress: {
        questions: AnalysisQuestion[];
        currentIndex: number;
        completed: number;
        total: number;
    };
}

import categoryQuestionPrompts from '$lib/data/category_question_prompts.json';

function findQuestionById(id: string): { question: string; prompt: string } {
    for (const [category, questions] of Object.entries(categoryQuestionPrompts)) {
        const question = questions.find(q => q.id === id);
        if (question) {
            return {
                question: question.question,
                prompt: `
                    Role: ${question.prompt['Role Definition']}
                    
                    Context:
                    Company: ${analysisState.companyInfo.company}
                    Industry: ${analysisState.companyInfo.industry}
                    Region: ${analysisState.companyInfo.region}
                    Additional Context: ${analysisState.companyInfo.context}
                    
                    Question: ${question.question}
                    Task: ${question.prompt['Task Description']}
                    
                    Format your response as follows:
                    ${question.prompt['Output Format']}
                `.trim()
            };
        }
    }
    throw new Error(`Question with ID ${id} not found`);
}

function createPrompt(basePrompt: string, companyInfo: AnalysisStateType['companyInfo']): string {
    return `
        Company: ${companyInfo.company}
        Industry: ${companyInfo.industry}
        Region: ${companyInfo.region}
        Context: ${companyInfo.context}
        
        ${basePrompt}
    `.trim();
}

export const analysisState = $state<AnalysisStateType>({
    step: 1,
    companyInfo: {
        company: '',
        region: '',
        industry: '',
        context: ''
    },
    selectedQuestions: {},
    analysisProgress: {
        questions: [],
        currentIndex: 0,
        completed: 0,
        total: 0
    }
});

export async function initializeAnalysis(): Promise<number> {
    const selectedQuestionIds = Object.entries(analysisState.selectedQuestions)
        .filter(([, selected]) => selected)
        .map(([id]) => id);

    // Prepare questions first
    const preparedQuestions = selectedQuestionIds.map(id => {
        const questionData = findQuestionById(id);
        return {
            id,
            question: questionData.question,
            prompt: createPrompt(questionData.prompt, analysisState.companyInfo),
            status: 'pending'
        };
    });

    // Create new chat immediately
    const newChat: Chat = {
        id: Math.max(...chats.map(c => c.id), 0) + 1,
        name: `Analysis: ${analysisState.companyInfo.company}`,
        messages: [{
            id: 0,
            content: `# Starting Analysis for ${analysisState.companyInfo.company}
                     \nPreparing ${preparedQuestions.length} questions...`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
            status: 'sent'
        }],
        createdAt: new Date().toISOString(),
        company: analysisState.companyInfo.company,
        industry: analysisState.companyInfo.industry,
        region: analysisState.companyInfo.region
    };

    // Update state
    chats = [...chats, newChat];
    currentChatId = newChat.id;

    // Update analysis progress state
    analysisState.analysisProgress = {
        questions: preparedQuestions,
        currentIndex: 0,
        completed: 0,
        total: selectedQuestionIds.length
    };

    return newChat.id;
}

import type { Chat } from '$lib/data/sampleChats';

// Create reactive state with runes
let chats = $state<Chat[]>([]);
let currentChatId = $state(0);

// Derived state for current chat
const currentChat = $derived(chats.find(chat => chat.id === currentChatId));

export async function processAnalysis() {
    const { questions } = analysisState.analysisProgress;
    const results = await Promise.all(
        questions.map(async (question) => {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: question.prompt }],
                    context: analysisState.companyInfo
                })
            });
            
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            return {
                question: question.question,
                answer: data.response
            };
        })
    );

    // Create new chat
    const newChat: Chat = {
        id: Math.max(...chats.map(c => c.id), 0) + 1,
        name: `Analysis: ${analysisState.companyInfo.company}`,
        messages: [{
            id: 0,
            content: `# Company Analysis: ${analysisState.companyInfo.company}

## Company Information
- Industry: ${analysisState.companyInfo.industry}
- Region: ${analysisState.companyInfo.region}

## Analysis Results
${results.map(r => `
### ${r.question}
${r.answer}
`).join('\n')}`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString(),
            status: 'sent'
        }],
        createdAt: new Date().toISOString(),
        company: analysisState.companyInfo.company,
        industry: analysisState.companyInfo.industry,
        region: analysisState.companyInfo.region
    };

    // Update state directly
    chats = [...chats, newChat];
    currentChatId = newChat.id;

    return newChat.id;
}
