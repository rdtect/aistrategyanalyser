export interface AnalysisOptions {
    marketStructure: boolean;
    competitivePosition: boolean;
}

export interface AnalysisContext {
    chatId: string;
    company: string;
    industry: string;
    region: string;
    context?: string;
}

export interface AnalysisProgress {
    progress: number;
    status: string;
    details?: Record<string, any>;
}

export type ProgressCallback = (
    progress: number, 
    status: string, 
    details?: Record<string, any>
) => void;

export interface RunAnalysisParams extends AnalysisContext {
    analysisOptions: AnalysisOptions;
    onProgress: ProgressCallback;
}