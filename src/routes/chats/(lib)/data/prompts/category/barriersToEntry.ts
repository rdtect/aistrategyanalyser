export const barriersToEntryPrompts = [
    {
        id: "be_1",
        question: "What are the primary barriers to entry in this market?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a market entry analyst identifying competitive barriers.",
            "Task Description": "Analyze the key barriers preventing new companies from entering this industry, including regulatory, financial, technological, and market-based challenges.",
            "Audience Identification": "Entrepreneurs, investors, and business strategists.",
            "Purpose Clarification": "To help businesses understand industry challenges before entering the market.",
            "Constraints and Requirements": "Base analysis on industry reports, regulatory frameworks, and competitive landscapes.",
            "Source Specification": "Use government regulations, market research reports, and industry analysis studies.",
            "Output Format": "A structured report categorizing major barriers to entry.",
            "Style and Tone Guidelines": "Business-oriented, research-backed, and clearly structured.",
            "Evidence Linking": "Provide supporting citations from authoritative industry sources.",
            "Verification Steps": "Cross-check barriers with multiple industry sources.",
            "Iterative Refinement": "Allow user input to specify industries or geographic regions.",
            "Feedback Incorporation": "Enable further refinement based on user-specified concerns."
        }
    },
    {
        id: "be_2",
        question: "How do regulatory and legal factors, economic downturns, and technological disruption affect competition?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a business environment analyst assessing external market forces.",
            "Task Description": "Analyze how regulations, economic fluctuations, and technological advancements impact competition within a specific industry.",
            "Audience Identification": "Corporate strategists, compliance officers, and market analysts.",
            "Purpose Clarification": "To provide insights into external pressures shaping competitive landscapes.",
            "Constraints and Requirements": "Base insights on government regulations, economic indicators, and technological innovation reports.",
            "Source Specification": "Use validated sources such as economic reports, industry regulations, and market intelligence.",
            "Output Format": "A structured report detailing regulatory, economic, and technological impacts on competition.",
            "Style and Tone Guidelines": "Strategic, analytical, and fact-driven.",
            "Evidence Linking": "Cite relevant industry reports and regulatory frameworks.",
            "Verification Steps": "Validate findings against multiple economic and industry studies.",
            "Iterative Refinement": "Allow users to specify focus areas (e.g., legal risks, recession impacts, or tech disruptions).",
            "Feedback Incorporation": "Enable refinement based on specific business concerns."
        }
    },
    {
        id: "be_3",
        question: "What geopolitical and social movements have influenced this category in the past decade?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a geopolitical and social trend analyst.",
            "Task Description": "Evaluate how geopolitical events and social movements have shaped industry trends, consumer behavior, and market competition over the past decade.",
            "Audience Identification": "Corporate strategists, policymakers, and global market analysts.",
            "Purpose Clarification": "To provide insights into external social and political factors influencing the market.",
            "Constraints and Requirements": "Base analysis on validated geopolitical events, social trend research, and industry impact studies.",
            "Source Specification": "Use reputable news sources, academic research, and industry analyses.",
            "Output Format": "A structured report connecting key events to market impacts.",
            "Style and Tone Guidelines": "Objective, fact-based, and historically contextualized.",
            "Evidence Linking": "Connect specific events to documented market changes.",
            "Verification Steps": "Cross-validate impacts across multiple sources.",
            "Iterative Refinement": "Allow focus on specific time periods or regions.",
            "Feedback Incorporation": "Enable exploration of specific social or political trends."
        }
    },
    {
        id: "be_4",
        question: "What potential substitutes exist for products or services in this category?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a competitive market analyst assessing product substitution risks.",
            "Task Description": "Identify potential substitutes for existing products or services within this category and analyze their competitive threat levels.",
            "Output Format": "A structured analysis listing substitutes, their advantages, and their impact on market dynamics.",
            "Style Guidelines": "Clear, analytical, and market-focused.",
            "Constraints": "Base analysis on market research and competitive intelligence.",
            "Interactivity": "Enable focus on specific product categories or market segments."
        }
    }
];
