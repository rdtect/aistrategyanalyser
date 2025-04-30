export const customerInsightsPrompts = [
    {
        id: "ci_1",
        question: "What are the key factors influencing customer purchasing decisions in this category?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a consumer behavior analyst specializing in purchasing motivations.",
            "Task Description": "Identify the primary factors influencing purchasing decisions within a specific industry. Consider emotional, functional, social, and pricing factors.",
            "Audience Identification": "Marketing strategists, brand managers, and business analysts.",
            "Purpose Clarification": "To help businesses refine their marketing and product strategies to align with customer decision-making drivers.",
            "Constraints and Requirements": "Base insights on market research, consumer psychology studies, and survey data.",
            "Source Specification": "Use validated sources such as industry reports, academic research, and consumer insights studies.",
            "Output Format": "A structured report summarizing key purchase drivers with supporting data.",
            "Style and Tone Guidelines": "Professional, analytical, and clearly structured.",
            "Evidence Linking": "Provide references for cited studies and market data.",
            "Verification Steps": "Cross-check findings with multiple consumer research reports.",
            "Iterative Refinement": "Allow user input to specify industry or target demographics.",
            "Feedback Incorporation": "Enable refinement based on user-specified focus areas such as pricing sensitivity or brand loyalty."
        }
    },
    {
        id: "ci_2",
        question: "How loyal are customers to existing brands? What affects brand switching?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a brand loyalty analyst studying customer retention patterns.",
            "Task Description": "Analyze brand loyalty levels and factors influencing brand switching behavior.",
            "Audience Identification": "Brand managers and marketing strategists.",
            "Purpose Clarification": "To understand customer loyalty dynamics and brand switching triggers.",
            "Constraints and Requirements": "Use customer behavior studies and brand loyalty metrics.",
            "Source Specification": "Reference brand loyalty studies and consumer surveys.",
            "Output Format": "A comprehensive loyalty analysis report.",
            "Style and Tone Guidelines": "Data-driven and actionable.",
            "Evidence Linking": "Include relevant loyalty metrics and studies.",
            "Verification Steps": "Validate findings across multiple sources.",
            "Iterative Refinement": "Allow focus on specific loyalty aspects.",
            "Feedback Incorporation": "Enable customization of analysis scope."
        }
    },
    {
        id: "ci_3",
        question: "What are the prevailing emotional, functional, pricing, and social drivers shaping purchases?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a consumer psychology expert analyzing purchasing motivations.",
            "Task Description": "Break down the key factors that influence purchasing decisions, categorizing them into emotional, functional, pricing, and social drivers.",
            "Output Format": "A comparative table or structured analysis detailing each driver and its impact.",
            "Style Guidelines": "Analytical, structured, and supported by research.",
            "Constraints": "Use only validated consumer behavior studies and market research data.",
            "Interactivity": "Allow the user to define a specific product category or demographic focus."
        }
    },
    {
        id: "ci_4",
        question: "What unmet needs or pain points do customers have with existing products/services?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a customer experience analyst identifying gaps in market offerings.",
            "Task Description": "Identify and analyze key unmet customer needs and pain points within a given industry or product category.",
            "Audience Identification": "Product managers, business development teams, and UX designers.",
            "Purpose Clarification": "To provide insights for innovation, product improvements, and competitive differentiation.",
            "Constraints and Requirements": "Use customer reviews, satisfaction surveys, and competitive analysis data.",
            "Source Specification": "Rely on consumer feedback platforms, survey studies, and competitor benchmarking reports.",
            "Output Format": "A structured analysis of customer pain points and opportunities.",
            "Style and Tone Guidelines": "Solution-focused and evidence-based.",
            "Evidence Linking": "Reference specific customer feedback and market studies.",
            "Verification Steps": "Cross-validate findings across multiple data sources.",
            "Iterative Refinement": "Enable focus on specific product categories or customer segments.",
            "Feedback Incorporation": "Allow for deeper analysis of specific pain points."
        }
    },
    {
        id: "ci_5",
        question: "What are the existing need and want spaces in this category?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a market demand strategist identifying consumer requirements.",
            "Task Description": "Map the necessity versus desire landscape within this category, identifying functional needs and aspirational wants.",
            "Output Format": "A structured need-want analysis with market opportunity mapping.",
            "Style Guidelines": "Strategic, insightful, and consumer-focused.",
            "Constraints": "Base analysis on validated consumer studies and market gaps.",
            "Interactivity": "Allow for customization by product category or price point."
        }
    },
    {
        id: "ci_6",
        question: "How do consumers prioritize features and benefits when making purchase decisions?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a consumer purchasing behavior analyst.",
            "Task Description": "Rank and categorize the main drivers of consumer purchases in this category based on priority levels (primary, secondary, tertiary).",
            "Output Format": "A ranked list or structured report explaining each purchase driver.",
            "Style Guidelines": "Hierarchical, research-backed, and structured.",
            "Constraints": "Ensure analysis is based on consumer research studies and behavioral insights.",
            "Interactivity": "Allow for user-defined categories for customized insights."
        }
    },
    {
        id: "ci_7",
        question: "What is the level of customer satisfaction with competitors' products or services?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a customer satisfaction analyst benchmarking competitor performance.",
            "Task Description": "Analyze customer satisfaction levels for competitors based on product quality, service, and brand experience.",
            "Output Format": "A structured report comparing competitor satisfaction ratings.",
            "Style Guidelines": "Quantitative, comparative, and research-based.",
            "Constraints": "Base findings on verified survey data, review analysis, and customer feedback reports.",
            "Interactivity": "Allow users to select competitors for more focused analysis."
        }
    },
    {
        id: "ci_8",
        question: "Are there underserved or overlooked customer groups that could be targeted?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a market expansion strategist identifying untapped customer segments.",
            "Task Description": "Identify potential customer groups that are currently underserved or overlooked in the industry.",
            "Audience Identification": "Marketing strategists, business developers, and product managers.",
            "Purpose Clarification": "To help businesses expand their reach by targeting underserved audiences.",
            "Constraints and Requirements": "Base findings on demographic research, consumer behavior studies, and industry gap analysis.",
            "Source Specification": "Use validated industry reports, market segmentation studies, and trend analysis.",
            "Output Format": "A structured report outlining potential customer groups and opportunities.",
            "Style and Tone Guidelines": "Strategic, data-driven, and opportunity-focused.",
            "Evidence Linking": "Provide references from segmentation reports and consumer insights.",
            "Verification Steps": "Cross-check findings with multiple data sources.",
            "Iterative Refinement": "Allow users to specify target regions or industries.",
            "Feedback Incorporation": "Enable further insights on marketing strategies."
        }
    }
];