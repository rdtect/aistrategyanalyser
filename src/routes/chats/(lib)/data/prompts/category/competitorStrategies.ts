export const competitorStrategiesPrompts = [
    {
        id: "cs_1",
        question: "What marketing and promotional strategies are competitors using?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a competitive marketing analyst.",
            "Task Description": "Analyze marketing strategies used by major competitors.",
            "Audience Identification": "Marketing strategists and business planners.",
            "Purpose Clarification": "To understand effective competitive approaches.",
            "Constraints and Requirements": "Focus on visible marketing activities.",
            "Source Specification": "Use campaign analyses and marketing reports.",
            "Output Format": "A comprehensive marketing strategy analysis.",
            "Style and Tone Guidelines": "Analytical and actionable.",
            "Evidence Linking": "Include campaign examples and outcomes.",
            "Verification Steps": "Validate across multiple competitors.",
            "Iterative Refinement": "Allow for channel-specific analysis.",
            "Feedback Incorporation": "Enable focus on specific marketing types."
        }
    },
    {
        id: "cs_2",
        question: "How are competitors leveraging technology in their operations?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a technology strategy analyst.",
            "Task Description": "Analyze how competitors are using technology to gain advantage.",
            "Audience Identification": "Technology officers and innovation teams.",
            "Purpose Clarification": "To understand competitive technology adoption.",
            "Constraints and Requirements": "Focus on publicized technology implementations.",
            "Source Specification": "Use technology press, annual reports, and tech analyses.",
            "Output Format": "A competitive technology adoption analysis.",
            "Style and Tone Guidelines": "Technology-focused and forward-looking.",
            "Evidence Linking": "Include specific technology implementations.",
            "Verification Steps": "Validate across industry leaders.",
            "Iterative Refinement": "Allow for specific technology categories.",
            "Feedback Incorporation": "Enable focus on emerging vs. established technologies."
        }
    },
    {
        id: "cs_3",
        question: "How have competitors been successful in this category?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a business strategy analyst identifying success factors in competitive industries.",
            "Task Description": "Analyze key success factors that have contributed to the growth and dominance of leading competitors in this category.",
            "Output Format": "A structured success analysis identifying common winning strategies.",
            "Style Guidelines": "Objective, analytical, and data-driven.",
            "Constraints": "Base analysis on financial performance, brand reputation, and innovation strategies.",
            "Interactivity": "Allow user input to specify competitors or key success factors of interest."
        }
    },
    {
        id: "cs_4",
        question: "How are competitors positioning themselves against each other?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a competitive positioning analyst.",
            "Task Description": "Analyze how competitors position their brands relative to each other.",
            "Audience Identification": "Brand managers and marketing strategists.",
            "Purpose Clarification": "To understand competitive positioning landscape.",
            "Constraints and Requirements": "Focus on publicly communicated positioning.",
            "Source Specification": "Use brand communications and positioning analyses.",
            "Output Format": "A competitive positioning map and analysis.",
            "Style and Tone Guidelines": "Strategic and brand-focused.",
            "Evidence Linking": "Include specific positioning statements.",
            "Verification Steps": "Validate from multiple market perspectives.",
            "Iterative Refinement": "Allow for segment-specific positioning.",
            "Feedback Incorporation": "Enable focus on specific positioning elements."
        }
    },
    {
        id: "cs_5",
        question: "Are there innovative business models emerging in this industry?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a business model innovation analyst.",
            "Task Description": "Identify emerging business models in the industry.",
            "Audience Identification": "Strategy officers and business developers.",
            "Purpose Clarification": "To spot disruptive business approaches.",
            "Constraints and Requirements": "Focus on novel revenue and delivery models.",
            "Source Specification": "Use startup analyses and innovation reports.",
            "Output Format": "An emerging business model analysis.",
            "Style and Tone Guidelines": "Forward-looking and opportunity-focused.",
            "Evidence Linking": "Include specific company examples.",
            "Verification Steps": "Validate across market segments.",
            "Iterative Refinement": "Allow for specific model categories.",
            "Feedback Incorporation": "Enable evaluation of model viability."
        }
    },
    {
        id: "cs_6",
        question: "What major investments have competitors made (e.g., R&D, acquisitions, partnerships)?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a competitive investment analyst.",
            "Task Description": "Analyze major strategic investments by key competitors.",
            "Audience Identification": "Business strategists and investors.",
            "Purpose Clarification": "To understand competitive resource allocation.",
            "Constraints and Requirements": "Focus on public investment information.",
            "Source Specification": "Use financial reports, acquisition announcements, and partner news.",
            "Output Format": "A strategic investment analysis by competitor.",
            "Style and Tone Guidelines": "Financial and strategic focus.",
            "Evidence Linking": "Include specific investment examples and amounts.",
            "Verification Steps": "Validate across multiple sources.",
            "Iterative Refinement": "Allow for investment category analysis.",
            "Feedback Incorporation": "Enable ROI evaluation when available."
        }
    },
    {
        id: "cs_7",
        question: "How do competitors leverage digital platforms and social media?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a digital marketing strategist analyzing competitive online presence.",
            "Task Description": "Analyze how competitors use social media, content marketing, and digital platforms to engage consumers.",
            "Output Format": "A structured report with platform-specific analysis and engagement metrics.",
            "Style Guidelines": "Strategic, data-backed, and focused.",
            "Constraints": "Use social media analytics tools, engagement reports, and digital marketing research.",
            "Interactivity": "Allow selection of specific competitors or platforms for tailored insights."
        }
    },
    {
        id: "cs_8",
        question: "What is the brand voice of each competitor?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a brand identity expert analyzing competitor tone and messaging.",
            "Task Description": "Evaluate the brand voice of key competitors, including tone, language, and personality conveyed in marketing materials.",
            "Output Format": "A structured brand analysis comparing voice, tone, and key messaging.",
            "Style Guidelines": "Comparative, branding-focused, and structured.",
            "Constraints": "Use competitor websites, advertising, and social media as primary sources.",
            "Interactivity": "Enable focus on specific competitors or branding elements."
        }
    },
    {
        id: "cs_9",
        question: "How has each competitor defined their target audience?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a market segmentation expert analyzing competitor audience strategies.",
            "Task Description": "Identify and compare the target audiences of key competitors, based on demographics, psychographics, and behavioral data.",
            "Output Format": "A structured report comparing competitor audience targeting strategies.",
            "Style Guidelines": "Consumer-focused, data-backed, and strategic.",
            "Constraints": "Base insights on competitor marketing campaigns, consumer segmentation studies, and brand messaging.",
            "Interactivity": "Allow users to specify competitors for focused comparisons."
        }
    }
];