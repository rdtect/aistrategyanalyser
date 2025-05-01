let isAnalyzing = $state(false);
let analysisError = $state<string | null>(null);
let analysisProgress = $state<number>(0);
let analysisStage = $state<string>("idle");

// Getters
export function getIsAnalyzing() {
  return isAnalyzing;
}

export function getAnalysisError() {
  return analysisError;
}

export function getAnalysisProgress() {
  return analysisProgress;
}

export function getAnalysisStage() {
  return analysisStage;
}

// Setters for progress tracking
export function setAnalysisProgress(progress: number) {
  analysisProgress = Math.max(0, Math.min(100, progress));
}

export function setAnalysisStage(stage: string) {
  analysisStage = stage;
}

// Reset all analysis state
export function resetAnalysisState() {
  isAnalyzing = false;
  analysisError = null;
  analysisProgress = 0;
  analysisStage = "idle";
}

// Actions with built-in state management
export async function runAnalysis(callback: () => Promise<any>) {
  if (isAnalyzing) return { error: "Analysis already in progress" };

  isAnalyzing = true;
  analysisError = null;
  analysisProgress = 0;
  analysisStage = "starting";

  try {
    analysisStage = "processing";
    const result = await callback();
    analysisProgress = 100;
    analysisStage = "completed";
    return result;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    analysisError = errorMessage;
    analysisStage = "error";
    return { error: errorMessage };
  } finally {
    // Keep isAnalyzing true until explicitly reset if needed
    // This allows UI to show completion state before resetting
    setTimeout(() => {
      isAnalyzing = false;
    }, 500);
  }
}
