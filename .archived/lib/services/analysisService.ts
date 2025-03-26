import categoryQuestions from "$lib/data/category_question_prompts.json";
import type { AnalysisOptions, RunAnalysisParams } from "../types/analysis";
import chatStore from "$lib/components/chat/Chat.svelte.ts";

export const analysisService = {
  async runAnalysis({
    chatId,
    company,
    industry,
    region,
    context,
    analysisOptions,
    onProgress,
  }: RunAnalysisParams) {
    const questions = this.getRelevantQuestions(analysisOptions);
    let progress = 0;
    const totalQuestions = questions.length;

    for (const question of questions) {
      // Update progress
      progress += 100 / totalQuestions;
      onProgress(progress, "Analyzing", { question: question.question });

      // Build context-aware prompt
      const prompt = this.buildContextualPrompt({
        question,
        company,
        industry,
        region,
        context,
      });

      // Generate and save response
      await chatStore.handleMessageSubmit(prompt);

      // Small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return true;
  },

  buildContextualPrompt({
    question,
    company,
    industry,
    region,
    context,
  }: {
    question: { question: string };
    company: string;
    industry: string;
    region: string;
    context?: string;
  }) {
    return `Analyzing ${company} in the ${industry} industry, ${region} region.
                ${context ? `Additional context: ${context}\n` : ""}
                ${question.question}`;
  },

  getRelevantQuestions(options: AnalysisOptions) {
    const questions = [];
    if (options.marketStructure) {
      questions.push(...categoryQuestions["Market Structure Analysis"]);
    }
    if (options.competitivePosition) {
      questions.push(
        ...categoryQuestions["Competitor Profiling & Benchmarking"],
      );
    }
    return questions;
  },
};
