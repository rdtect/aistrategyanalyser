import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { ChatContext } from "$lib/types";
import {
  type CategoryQuestions,
  type Question,
} from "../../data/category_question_prompts";
import { v4 as uuidv4 } from "uuid";
import { triggerAutomatedAnalysis } from "./AutomatedAnalysis.svelte.ts";
import {
  runAnalysis,
  setAnalysisStage,
  setAnalysisProgress,
  resetAnalysisState,
} from "./analysisState.svelte"; // Import state functions
import { chatManager } from "../../ChatManager.svelte.ts"; // Import chatManager
import { logError } from "$lib/utils/errorHandler";

// --- Constants ---
export const NAVIGATION_DELAY_MS = 1000; // Delay before redirecting
export const MAX_QUESTIONS_PER_CATEGORY = 5;

// --- Static Data ---
// Note: Consider moving these to $lib/data if they grow or are used elsewhere
export const steps = [
  { id: 0, name: "Welcome", fields: ["name", "company", "industry", "region"] },
  { id: 1, name: "Context", fields: ["additionalInfo", "competitors"] },
  { id: 2, name: "Framework", fields: ["framework"] },
  { id: 3, name: "Questions", fields: ["questions"] },
  { id: 4, name: "Review", fields: [] }, // No specific fields to validate here, just review
];

export const frameworkOptionsData = [
  {
    id: "all",
    name: "Include All Questions",
    description: "Select all strategic questions across frameworks.",
    icon: null,
  },
  {
    id: "porters",
    name: "Porter's Five Forces",
    description: "Analyze competitive forces within an industry.",
    icon: null,
  },
  {
    id: "pestle",
    name: "PESTLE Analysis",
    description: "Examine macro-environmental factors affecting the business.",
    icon: null,
  },
  {
    id: "swot",
    name: "SWOT Analysis",
    description: "Identify Strengths, Weaknesses, Opportunities, and Threats.",
    icon: null,
  },
  {
    id: "value_chain",
    name: "Value Chain Analysis",
    description: "Map out primary and support activities creating value.",
    icon: null,
  },
  {
    id: "mckinsey",
    name: "McKinsey 7-S Framework",
    description:
      "Assess organizational effectiveness through seven key elements.",
    icon: null,
  },
  {
    id: "resource_based",
    name: "Resource-Based View (RBV)",
    description: "Evaluate competitive advantage based on internal resources.",
    icon: null,
  },
  {
    id: "ansoff",
    name: "Ansoff Matrix",
    description:
      "Explore strategies for growth (market penetration, development, etc.).",
    icon: null,
  },
  {
    id: "bcg",
    name: "BCG Matrix",
    description: "Portfolio analysis based on market growth and share.",
    icon: null,
  },
  {
    id: "scenario",
    name: "Scenario Planning",
    description: "Prepare for different potential future environments.",
    icon: null,
  },
  {
    id: "blue_ocean",
    name: "Blue Ocean Strategy",
    description: "Create uncontested market space.",
    icon: null,
  },
  {
    id: "vrio",
    name: "VRIO Framework",
    description: "Assess resources for sustainable competitive advantage.",
    icon: null,
  },
  {
    id: "balanced_scorecard",
    name: "Balanced Scorecard",
    description: "Measure performance across multiple perspectives.",
    icon: null,
  },
];

export const industryOptionsData = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Energy",
  "Transportation",
  "Telecommunications",
  "Media & Entertainment",
  "Construction",
  "Hospitality",
  "Education",
  "Agriculture",
  "Pharmaceutical",
  "Automotive",
  "Aerospace & Defense",
  "Consulting",
  "Real Estate",
  "Consumer Goods",
  "Utilities",
  "Government",
  "Non-profit",
  "Other",
];

export const regionOptionsData = [
  "Global",
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East & Africa",
  "USA",
  "Canada",
  "UK",
  "Germany",
  "France",
  "China",
  "Japan",
  "India",
  "Australia",
  "Brazil",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Saudi Arabia",
  "UAE",
  "Other",
];

// --- TEMP TYPE ---
type AnalysisContext = any; // TODO: Define or import the actual AnalysisContext type

// --- Factory Function ---
export function createAnalysisWizard(initialContext?: Partial<ChatContext>) {
  // --- Dependencies (Placeholder for external state/functions) ---
  // TODO: These need to be managed externally or passed into the factory
  // let isAnalyzing = $state(false);
  // let analysisError = $state<string | null>(null);
  // let triggerAutomatedAnalysis = async () => { console.warn("triggerAutomatedAnalysis not implemented"); return { error: null }; };
  // let updateChatContext = async (id: string, context: ChatContext) => { console.warn("updateChatContext not implemented"); };
  // let updateSelectedQuestions = async (id: string, questions: string[]) => { console.warn("updateSelectedQuestions not implemented"); };
  // ---

  // --- Internal Reactive State ---
  const state = $state({
    analysisName: initialContext?.name ?? "",
    nameManuallyEdited: !!initialContext?.name,
    context: {
      id: initialContext?.id ?? "", // Should probably be set on creation, not here
      name: initialContext?.name ?? "", // Keep in sync with analysisName?
      company: initialContext?.company ?? "",
      industry: initialContext?.industry ?? "",
      region: initialContext?.region ?? "Global",
      additionalInfo: initialContext?.additionalInfo ?? "",
      competitors: initialContext?.competitors ?? [],
    } as ChatContext, // Ensure type safety
    customIndustry: "",
    customRegion: "",
    selectedFramework: "all", // Default to 'all'
    step: 0,
    isSubmitting: false, // Used by handleSubmit
    error: "", // Internal validation error state
    competitorInput: "",
    windowHeight: browser ? window.innerHeight : 800,
    selectedQuestions: {} as Record<string, boolean>,
    showProgress: false, // Used by handleSubmit
    progressMessage: "Creating your analysis...", // Used by handleSubmit
    showNameModal: false,
  });

  // --- Derived State (Internal) ---
  const derived = {
    get showCustomIndustry() {
      return state.context.industry === "Other";
    },
    get showCustomRegion() {
      return state.context.region === "Other";
    },
    get isFirstStep() {
      return state.step === 0;
    },
    get isLastStep() {
      return state.step === steps.length - 1;
    },
    get allFrameworkOption() {
      return frameworkOptionsData.find((opt) => opt.id === "all");
    },
    get selectedQuestionsCount() {
      return Object.values(state.selectedQuestions).filter(Boolean).length;
    },
  };

  // --- Internal Helper Functions (Not Exported within factory's return) ---
  function autoDeriveName() {
    const nameParts = [];
    if (state.context.company) nameParts.push(state.context.company);
    if (state.context.industry && state.context.industry !== "Other")
      nameParts.push(state.context.industry);
    else if (state.customIndustry) nameParts.push(state.customIndustry);
    if (
      state.context.region &&
      state.context.region !== "Other" &&
      state.context.region !== "Global"
    )
      nameParts.push(state.context.region);
    else if (state.customRegion) nameParts.push(state.customRegion);
    if (state.selectedFramework !== "all") {
      const framework = frameworkOptionsData.find(
        (f) => f.id === state.selectedFramework,
      );
      if (framework) nameParts.push(framework.name);
    }
    state.analysisName =
      nameParts.length > 0 ? nameParts.join(" | ") : "New Strategic Analysis";
    state.context.name = state.analysisName; // Keep context name in sync?
  }

  function generateWelcomeMessage(
    finalContext: ChatContext,
    finalSelectedQuestionIds: string[],
    categories: Array<{ name: string; questions: Question[] }>,
  ): string {
    let welcomeMessage = `# Starting Strategic Analysis: ${state.analysisName}\n\n`;
    welcomeMessage += `Based on the information provided:\n`;
    if (finalContext.company)
      welcomeMessage += `- **Company:** ${finalContext.company}\n`;
    if (finalContext.industry)
      welcomeMessage += `- **Industry:** ${finalContext.industry}\n`;
    if (finalContext.region)
      welcomeMessage += `- **Region:** ${finalContext.region}\n`;
    if (finalContext.competitors && finalContext.competitors.length > 0)
      welcomeMessage += `- **Competitors:** ${finalContext.competitors.join(", ")}\n`;
    if (finalContext.additionalInfo)
      welcomeMessage += `- **Additional Context:** ${finalContext.additionalInfo}\n`;

    welcomeMessage += `\nSelected framework: **${frameworkOptionsData.find((f) => f.id === state.selectedFramework)?.name || "All Questions"}**`;

    if (finalSelectedQuestionIds.length > 0) {
      welcomeMessage += `\nFocusing on the following ${finalSelectedQuestionIds.length} questions:\n`;
      const questionsToDisplay: string[] = [];
      for (const category of categories) {
        for (const q of category.questions) {
          if (finalSelectedQuestionIds.includes(q.id)) {
            const questionText = q.question || `Question ID: ${q.id}`;
            questionsToDisplay.push(questionText);
            if (questionsToDisplay.length >= 5) break;
          }
        }
        if (questionsToDisplay.length >= 5) break;
      }
      questionsToDisplay.forEach((qText) => (welcomeMessage += `- ${qText}\n`));
      if (finalSelectedQuestionIds.length > 5)
        welcomeMessage += `- ...and more.\n`;
    } else {
      welcomeMessage += `\nNo specific questions selected initially.\n`;
    }

    welcomeMessage += `\nI will now begin the analysis.`;
    return welcomeMessage;
  }

  function validateStep(): boolean {
    const currentStepFields = steps[state.step]?.fields ?? [];
    state.error = ""; // Reset error

    if (currentStepFields.includes("name") && !state.analysisName.trim()) {
      state.error = "Analysis name is required.";
      return false;
    }
    if (
      currentStepFields.includes("company") &&
      !state.context.company?.trim()
    ) {
      state.error = "Company name is required.";
      return false;
    }
    if (
      currentStepFields.includes("industry") &&
      state.context.industry === ""
    ) {
      state.error = "Industry selection is required.";
      return false;
    }
    if (
      currentStepFields.includes("industry") &&
      state.context.industry === "Other" &&
      !state.customIndustry.trim()
    ) {
      state.error = "Please specify the custom industry.";
      return false;
    }
    if (currentStepFields.includes("region") && state.context.region === "") {
      state.error = "Region selection is required.";
      return false;
    }
    if (
      currentStepFields.includes("region") &&
      state.context.region === "Other" &&
      !state.customRegion.trim()
    ) {
      state.error = "Please specify the custom region.";
      return false;
    }
    if (
      currentStepFields.includes("framework") &&
      state.selectedFramework === ""
    ) {
      state.error = "Framework selection is required.";
      return false;
    }
    if (
      currentStepFields.includes("questions") &&
      derived.selectedQuestionsCount === 0
    ) {
      state.error = "Please select at least one question.";
      return false;
    }
    // Add other field validations as needed

    return true;
  }

  // --- Exposed Methods ---
  function isCurrentStep(index: number): boolean {
    return state.step === index;
  }

  function handleNameInput(newName: string) {
    state.analysisName = newName;
    state.nameManuallyEdited = true;
  }

  function generateName() {
    state.nameManuallyEdited = false;
    autoDeriveName(); // Call internal helper
  }

  function addCompetitor() {
    if (
      state.competitorInput &&
      !(state.context.competitors ?? []).includes(state.competitorInput)
    ) {
      state.context.competitors = [
        ...(state.context.competitors ?? []),
        state.competitorInput,
      ];
      state.competitorInput = ""; // Clear input
    }
  }

  function removeCompetitor(competitorToRemove: string) {
    state.context.competitors = (state.context.competitors ?? []).filter(
      (c) => c !== competitorToRemove,
    );
  }

  function setStep(index: number): void {
    if (validateStep()) {
      // Validate before changing step
      state.step = index;
    }
  }

  function selectFramework(id: string) {
    state.selectedFramework = id;
    state.selectedQuestions = {}; // Reset questions on framework change
  }

  function nextStep() {
    if (validateStep()) {
      state.step++;
      if (
        state.step === 3 &&
        (!state.nameManuallyEdited || !state.analysisName.trim())
      ) {
        generateName();
      }
    }
  }

  function prevStep() {
    state.step--;
  }

  function toggleQuestion(id: string) {
    const current = state.selectedQuestions[id];
    // Ensure derived.selectedQuestionsCount updates by creating a new object
    state.selectedQuestions = { ...state.selectedQuestions, [id]: !current };
  }

  function handleContextChange(newContext: Partial<ChatContext>) {
    // Merge partial updates carefully
    state.context = { ...state.context, ...newContext };
    // If name is updated externally, mark as manually edited? Or sync with analysisName?
    if (
      newContext.name !== undefined &&
      newContext.name !== state.analysisName
    ) {
      state.analysisName = newContext.name;
      state.nameManuallyEdited = true;
    }
  }

  function handleCustomIndustryChange(value: string) {
    state.customIndustry = value;
  }

  function handleCustomRegionChange(value: string) {
    state.customRegion = value;
  }

  function handleCompetitorInputChange(newValue: string) {
    state.competitorInput = newValue;
  }

  async function handleSubmit(categoriesData: CategoryQuestions) {
    if (!validateStep()) return;

    const result = await runAnalysis(async () => {
      state.isSubmitting = true; // Keep internal wizard submit state
      state.error = "";
      setAnalysisStage("creating_chat");
      state.showProgress = true; // Show progress indicator from wizard state
      state.progressMessage = "Creating your analysis chat...";
      setAnalysisProgress(10);

      try {
        const contextToSend = {
          ...state.context,
          industry:
            state.context.industry === "Other"
              ? state.customIndustry
              : state.context.industry,
          region:
            state.context.region === "Other"
              ? state.customRegion
              : state.context.region,
        };
        const finalContext = JSON.parse(JSON.stringify(contextToSend));
        const finalSelectedQuestionIds = Object.entries(state.selectedQuestions)
          .filter(([, isSelected]) => isSelected)
          .map(([id]) => id);
        const finalAnalysisName =
          state.analysisName || "New Strategic Analysis";

        // **Transform categoriesData object into the expected array format**
        const categoriesArray = Object.entries(categoriesData).map(
          ([name, questions]) => ({
            name,
            questions,
          }),
        );

        // Create the chat using chatManager.createChat
        const newChatId = (await chatManager.createChat(finalAnalysisName))?.id; // Call service and get ID
        if (!newChatId) {
          throw new Error("Failed to create chat or get new chat ID.");
        }
        setAnalysisProgress(30);

        // Add welcome message using chatManager.sendMessage
        setAnalysisStage("adding_welcome");
        state.progressMessage = "Preparing chat...";
        // Pass the transformed array
        const welcomeMessage = generateWelcomeMessage(
          finalContext,
          finalSelectedQuestionIds,
          categoriesArray, // Use the transformed array
        );
        try {
          await chatManager.sendMessage(welcomeMessage);
        } catch (messageError) {
          console.warn("Error adding welcome message:", messageError);
        }
        setAnalysisProgress(50);

        // Set the newly created chat as active using chatManager.selectChat
        await chatManager.selectChat(newChatId);

        // Trigger the actual multi-question analysis
        setAnalysisStage("running_analysis");
        state.progressMessage = "Running automated analysis...";
        // We don't need to track progress inside triggerAutomatedAnalysis separately
        // runAnalysis handles the overall processing state.
        const analysisResult = await triggerAutomatedAnalysis(); // Call the actual analysis

        if (analysisResult?.error) {
          console.error(
            "Error reported during automated analysis:",
            analysisResult.error,
          );
          // Throw an error to be caught by runAnalysis wrapper
          throw new Error(analysisResult.error);
        }

        setAnalysisProgress(90);
        setAnalysisStage("redirecting");
        state.progressMessage = "Redirecting to your new analysis...";

        // Return chat ID for navigation after success
        return { newChatId };
      } catch (err) {
        console.error("Error during handleSubmit process:", err);
        state.error = err instanceof Error ? err.message : String(err);
        // Re-throw the error so runAnalysis can catch it and set the final state
        throw err;
      } finally {
        // Reset wizard-specific submission/progress state
        state.isSubmitting = false;
        state.showProgress = false;
      }
    });

    // Handle navigation or final state based on runAnalysis result
    if (result && !result.error && result.newChatId) {
      const navigateToChat = (id: string) => {
        const url = `/chats/${id}`; // Removed ?startAnalysis=true query param
        console.log("Navigating to:", url);
        goto(url);
      };
      // Delay navigation slightly to allow UI update
      setTimeout(() => {
        navigateToChat(result.newChatId);
        // Optionally reset analysis state after navigation starts
        // resetAnalysisState();
      }, NAVIGATION_DELAY_MS);
    } else if (result?.error) {
      // Error already handled by runAnalysis setting analysisState
      // state.error might have been set in the catch block above too
      console.error("handleSubmit failed:", result.error);
    }
  }

  // --- Return the public API ---
  return {
    // Read-only reactive state (access via wizard.state.propName)
    get state() {
      return state;
    },
    // Read-only derived state (access via wizard.derived.propName)
    get derived() {
      return derived;
    },

    // Methods to interact with the wizard
    isCurrentStep,
    handleNameInput,
    generateName,
    addCompetitor,
    removeCompetitor,
    setStep,
    selectFramework,
    nextStep,
    prevStep,
    toggleQuestion,
    handleContextChange,
    handleCompetitorInputChange,
    handleCustomIndustryChange,
    handleCustomRegionChange,
    handleSubmit,
    // TODO: Expose any other methods needed by the component
    // e.g., maybe a reset method?
  };
}

// --- Type Export (Optional but recommended) ---
export type AnalysisWizardApi = ReturnType<typeof createAnalysisWizard>;

/** Initialize: Load frameworks (e.g., from API or sample data) */
// REMOVED Erroneous duplicate function from end of file
/*
export async function initializeAnalysisCreation(): Promise<void> { ... }
*/

/** Reset state for a new analysis */
