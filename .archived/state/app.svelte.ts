// Define interfaces first
export interface Chat {
    id: number;
    name: string;
    messages: Message[];
    createdAt: string;
    company: string;
    industry: string;
    region: string;
    context?: string;
}

export interface Message {
    id: number;
    content: string;
    timestamp: string;
    role: 'user' | 'assistant';
}

export interface AIConfig {
    model: string;
    temperature: number;
    maxTokens: number;
    webSearch: boolean;
}

export interface AnalysisState {
    isOpen: boolean;
    step: number;
    formData: {
        company: string;
        industry: string;
        region: string;
        selectedQuestions: Record<string, boolean>;
    };
}

// Create a reactive context
function createAppStore() {
    let chats = $state<Chat[]>([]);
    let currentChatId = $state(0);
    let isLoading = $state(false);
    let aiConfig = $state<AIConfig>({
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        webSearch: false
    });

    let analysisState = $state<AnalysisState>({
        isOpen: false,
        step: 1,
        formData: {
            company: '',
            industry: '',
            region: '',
            selectedQuestions: {}
        }
    });

    return {
        // Direct state exports
        get chats() { return chats; },
        get currentChatId() { return currentChatId; },
        get isLoading() { return isLoading; },
        get aiConfig() { return aiConfig; },
        get analysisState() { return analysisState; },

        openAnalysis() {
            analysisState = {
                ...analysisState,
                isOpen: true,
                step: 1,
                formData: {
                    company: '',
                    industry: '',
                    region: '',
                    selectedQuestions: {}
                }
            };
        },

        closeAnalysis() {
            analysisState = {
                ...analysisState,
                isOpen: false
            };
        }
    };
}

export const appStore = createAppStore();
