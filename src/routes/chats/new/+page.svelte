<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { ActionData } from "./$types";
  import { Accordion } from "@skeletonlabs/skeleton-svelte";
  import { ProgressRing } from "@skeletonlabs/skeleton-svelte";
  import categoryQuestionPrompts from "$lib/data/category_question_prompts.json";

  let { form } = $props<{ form: ActionData }>();

  // State management
  let currentStep = $state(1);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let selectedQuestions = $state<Record<string, boolean>>({});
  let processingQuestions = $state(false);
  let currentQuestionIndex = $state(0);
  let totalQuestions = $state(0);
  let questionProgress = $state(0);

  // Form fields
  let company = $state(form?.values?.company ?? "");
  let industry = $state(form?.values?.industry ?? "");
  let region = $state(form?.values?.region ?? "");
  let context = $state("");

  // Auto-derive analysis name from fields
  const name = $derived(
    company && industry && region
      ? `${company} ${industry} Analysis - ${region}`
      : company
        ? `${company} Analysis${industry ? ` - ${industry}` : ""}${region ? ` (${region})` : ""}`
        : "New Strategy Analysis"
  );

  // Track if form is valid
  const isStep1Valid = $derived(
    company.trim() && industry.trim() && region.trim()
  );

  const isStep2Valid = $derived(Object.values(selectedQuestions).some(Boolean));

  // Handle form steps
  function nextStep() {
    if (currentStep < 3) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  // Handle form submission for final step
  async function submitAnalysis() {
    isLoading = true;

    try {
      // First, create the new chat
      const formData = new FormData();
      formData.append("name", name);
      formData.append("company", company);
      formData.append("industry", industry);
      formData.append("region", region);
      formData.append("context", context);

      // Add selected questions
      const questionIds = Object.entries(selectedQuestions)
        .filter(([, selected]) => selected)
        .map(([id]) => id);

      formData.append("selectedQuestions", JSON.stringify(questionIds));

      const response = await fetch("?/createChat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create analysis");
      }

      const data = await response.json();
      const chatId = data.chatId;

      // Now process each selected question with OpenAI
      processingQuestions = true;
      totalQuestions = questionIds.length;
      currentQuestionIndex = 0;

      for (const questionId of questionIds) {
        currentQuestionIndex++;
        questionProgress = Math.round(
          (currentQuestionIndex / totalQuestions) * 100
        );

        // Find the question details
        let questionText = "Unknown question";
        let promptData = null;

        // Look up the question in the category prompts
        for (const [category, questions] of Object.entries(
          categoryQuestionPrompts
        )) {
          const question = questions.find((q) => q.id === questionId);
          if (question) {
            questionText = question.question;
            promptData = question;
            break;
          }
        }

        if (!promptData) {
          console.error(`Question with ID ${questionId} not found`);
          continue;
        }

        // Create the user message for this question
        try {
          // First, add the user question to the chat
          const userMessageResponse = await fetch(
            `/api/messages?chatId=${chatId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userMessage: questionText,
                aiResponse: "Processing...",
              }),
            }
          );

          if (!userMessageResponse.ok) {
            console.error(
              `Failed to add user message for question: ${questionText}`
            );
          }

          // Then, send the actual prompt to the AI API
          const aiResponse = await fetch("/api/ai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: questionText,
              prompt: promptData.prompt,
              context: {
                company,
                industry,
                region,
                additionalContext: context,
              },
              chatId,
              webSearch: true, // Enable web search for better responses
            }),
          });

          if (!aiResponse.ok) {
            console.error(
              `Failed to process question ${questionId}: ${questionText}`
            );
          }

          // No need to wait for response - we'll let it process in the background
          // The responses will be added to the chat thread
        } catch (err) {
          console.error(`Error processing question ${questionId}:`, err);
        }

        // Add a small delay between questions to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Navigate to the new chat to see results
      goto(`/chats/${chatId}`);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to create analysis";
      console.error("Error creating analysis:", err);
    } finally {
      isLoading = false;
      processingQuestions = false;
    }
  }
</script>

<div class="container h-full flex flex-col p-4">
  <header class="mx-2 mb-4">
    <h1 class="text-2xl font-bold">
      {#if currentStep === 1}
        Company Information
      {:else if currentStep === 2}
        Select Questions
      {:else}
        Creating Analysis
      {/if}
    </h1>
    <div
      class="flex justify-between bg-primary-500/20 p-2 rounded-lg items-center mt-2"
    >
      <p class="text-surface-300">Step {currentStep} of 3</p>

      <!-- Navigation buttons moved up -->
      <div class="flex gap-2">
        {#if currentStep > 1}
          <button class="btn btn-sm preset-filled" onclick={prevStep}>
            Back
          </button>
        {:else}
          <a href="/chats" class="btn btn-sm preset-filled"> Cancel </a>
        {/if}

        {#if currentStep < 3}
          <button
            class="btn btn-sm preset-filled outline-secondary-500 bg-primary-300"
            onclick={nextStep}
            disabled={(currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid)}
          >
            <span>Next</span>
            <span>&rarr;</span>
          </button>
        {:else}
          <button
            class="btn btn-sm preset-filled bg-primary-300"
            onclick={submitAnalysis}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Analysis"}
          </button>
        {/if}
      </div>
    </div>
  </header>

  <div class="flex-1 overflow-y-auto">
    <div
      class="w-full max-w-[calc(100%-2rem)] md:max-w-[calc(100%-4rem)] mx-auto"
      style="max-width: 768px;"
    >
      <!-- Step 1: Company Information -->
      {#if currentStep === 1}
        <div class="w-full card p-4 preset-glass-surface space-y-4">
          <!-- Display derived analysis name and timestamp -->
          <div class="card preset-filled-surface">
            <div class="flex justify-between items-center">
              <p class="font-semibold">{name.toUpperCase()}</p>
              <p class="text-xs text-right text-surface-400">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          <div class="form-field">
            <label class="label">
              <span>Company</span>
              <input
                class="input bg-surface-200-700-token border border-surface-300-600-token"
                type="text"
                bind:value={company}
                required
              />
            </label>
          </div>

          <div class="form-field">
            <label class="label">
              <span>Industry</span>
              <input
                class="input bg-surface-200-700-token border border-surface-300-600-token"
                type="text"
                bind:value={industry}
                required
              />
            </label>
          </div>

          <div class="form-field">
            <label class="label">
              <span>Region</span>
              <input
                class="input bg-surface-200-700-token border border-surface-300-600-token"
                type="text"
                bind:value={region}
                required
              />
            </label>
          </div>

          <div class="form-field">
            <label class="label">
              <span>Additional Context (optional)</span>
              <textarea
                class="textarea bg-surface-200-700-token border border-surface-300-600-token"
                bind:value={context}
                rows="4"
              ></textarea>
            </label>
          </div>
        </div>

        <!-- Step 2: Question Selection -->
      {:else if currentStep === 2}
        <div class="w-full card p-6 bg-secondary-900/20 rounded-xl">
          <p class="mb-4">Select questions to include in your analysis:</p>

          <Accordion collapsible multiple>
            {#each Object.entries(categoryQuestionPrompts) as [category, questions]}
              <Accordion.Item value={category} controlHover="bg-primary-200/10">
                {#snippet lead()}<span class="badge preset-filled">
                    {questions.filter((q) => selectedQuestions[q.id]).length}
                  </span>{/snippet}
                {#snippet control()}{category}{/snippet}
                {#snippet panel()}
                  <div class="space-y-2 p-2 align-center text-center">
                    {#each questions as { id, question } (id)}
                      <label class="flex items-start gap-2">
                        <input
                          type="checkbox"
                          bind:checked={selectedQuestions[id]}
                          class="checkbox"
                        />
                        <span>{question}</span>
                      </label>
                      <hr />
                    {/each}
                  </div>
                {/snippet}
              </Accordion.Item>
            {/each}
          </Accordion>
        </div>

        <!-- Step 3: Progress and Confirmation -->
      {:else if currentStep === 3}
        <div class="w-full max-w-md mx-auto card p-6 preset-glass-surface">
          <div class="card p-4 preset-filled-surface mb-6">
            <h4 class="h4 mb-2">Analysis Details</h4>
            <div class="space-y-1">
              <p><strong>Analysis:</strong> {name}</p>
              <p><strong>Company:</strong> {company}</p>
              <p><strong>Industry:</strong> {industry}</p>
              <p><strong>Region:</strong> {region}</p>
              <p>
                <strong>Questions:</strong>
                {Object.values(selectedQuestions).filter(Boolean).length} selected
              </p>
              <p><strong>Created:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>

          <div class="flex flex-col items-center gap-4">
            {#if error}
              <div class="alert preset-filled-error">
                <span>Error: {error}</span>
              </div>
            {:else if processingQuestions}
              <ProgressRing
                value={questionProgress}
                strokeWidth="4px"
                meterStroke="stroke-primary-500"
                trackStroke="stroke-surface-500/30"
                strokeLinecap="round"
                showLabel={true}
              />

              <div class="text-center">
                <p class="font-semibold">Processing questions</p>
                <p class="text-sm text-surface-400">
                  Question {currentQuestionIndex} of {totalQuestions}
                </p>
              </div>
            {:else}
              <ProgressRing
                value={isLoading ? 75 : 100}
                strokeWidth="4px"
                meterStroke="stroke-primary-500"
                trackStroke="stroke-surface-500/30"
                strokeLinecap="round"
                showLabel={true}
              />

              <p class="text-center">
                {isLoading
                  ? "Creating your analysis..."
                  : "Ready to create your analysis"}
              </p>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
