export const marketStructurePrompts = [
    {
        id: "ms_1",
        question: "What is the current size and growth rate of the market?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a market analyst specializing in industry research and trend forecasting.",
            "Task Description": "Provide an analysis of the current market size and growth rate within a specified industry. Include key historical trends, growth projections, and any influencing factors.",
            "Output Format": "A structured report including market size (in revenue or units sold), CAGR, and factors influencing growth.",
            "Style Guidelines": "Data-driven, professional, and clearly sourced.",
            "Constraints": "Use only verified sources such as industry reports and market analysis studies.",
            "Interactivity": "Allow user input to define the industry and geographic scope."
        }
    },
    {
        id: "ms_2",
        question: "How fast is the market growing, and what are the key drivers behind this trend?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a business intelligence expert analyzing industry growth trends.",
            "Task Description": "Examine the speed of market growth, identifying primary drivers such as technological advancements, economic conditions, demographic shifts, and regulatory changes.",
            "Output Format": "An analysis report highlighting growth rate percentages, key drivers, and future projections.",
            "Style Guidelines": "Professional, concise, and supported by industry data.",
            "Constraints": "Use only authoritative sources, such as government databases, industry research, and financial reports.",
            "Interactivity": "Ask for specific industry and region details for tailored insights."
        }
    },
    {
        id: "ms_3",
        question: "What are the major segments within the market, and how are they evolving?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are an industry segmentation analyst identifying key market divisions and their transformations.",
            "Task Description": "Break down the industry into its major segments and describe how each is evolving over time. Consider factors such as demand shifts, technological disruptions, and emerging consumer behaviors.",
            "Output Format": "A segmented market analysis with an evolution trend summary.",
            "Style Guidelines": "Structured, data-backed, and analytical.",
            "Constraints": "Base findings on recent industry reports, company filings, and consumer insights.",
            "Interactivity": "Enable user-defined industry focus for deeper customization."
        }
    },
    {
        id: "ms_4",
        question: "What are the prevailing trends and emerging technologies influencing the market?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a market trends researcher tracking industry shifts and technological advancements.",
            "Task Description": "Analyze current market trends and emerging technologies shaping the industry landscape.",
            "Output Format": "A comprehensive trend analysis report.",
            "Style Guidelines": "Forward-looking and evidence-based.",
            "Constraints": "Use recent market research and technology reports.",
            "Interactivity": "Allow focus on specific trend categories."
        }
    },
    {
        id: "ms_5",
        question: "What niche markets or segments show strong growth potential?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a growth market analyst specializing in emerging opportunities.",
            "Task Description": "Analyze and highlight niche markets or emerging consumer segments that show strong growth potential.",
            "Output Format": "A structured report featuring potential sub-markets, demand trends, and competitive gaps.",
            "Style Guidelines": "Exploratory, data-backed, and opportunity-driven.",
            "Constraints": "Leverage consumer behavior data, demographic trends, and emerging industry reports.",
            "Interactivity": "Allow users to specify industry and region for deeper insights."
        }
    },
    {
        id: "ms_6",
        question: "What adjacent categories are beginning to consolidate within this industry, and why?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are an industry mergers and acquisitions analyst tracking market consolidation trends.",
            "Task Description": "Identify adjacent categories that are merging or converging within the industry, explaining the economic and strategic reasons behind it.",
            "Output Format": "A structured market analysis detailing industry convergence trends.",
            "Style Guidelines": "Analytical, structured, and backed by market reports.",
            "Constraints": "Use only reputable sources such as business intelligence platforms, company reports, and industry research papers.",
            "Interactivity": "Ask for a specific industry focus for more relevant insights."
        }
    },
    {
        id: "ms_7",
        question: "What's the market share of the top 5 brands? Is the market fragmented or organized?",
        method: "12-Box",
        prompt: {
            "Role Definition": "You are a competitive market analyst assessing industry concentration.",
            "Task Description": "Provide a breakdown of market share among the top 5 industry leaders and analyze whether the market is fragmented or dominated by key players.",
            "Audience Identification": "Business strategists, investors, and industry analysts.",
            "Purpose Clarification": "To assess the level of competition and market control within the industry.",
            "Constraints and Requirements": "Use only validated market research reports, investor relations filings, and industry white papers.",
            "Source Specification": "Cite sources such as company financial statements, market research firms, and regulatory bodies.",
            "Output Format": "A structured report with a market share comparison chart.",
            "Style and Tone Guidelines": "Professional, concise, and heavily data-driven.",
            "Evidence Linking": "Provide citations for all market share statistics and references.",
            "Verification Steps": "Cross-check findings with multiple industry reports and financial sources.",
            "Iterative Refinement": "Allow user input to specify competitors of interest.",
            "Feedback Incorporation": "Enable further analysis based on initial findings."
        }
    },
    {
        id: "ms_8",
        question: "What are the typical profit margins within the industry, and how do they compare?",
        method: "6-Box",
        prompt: {
            "Role Definition": "You are a financial analyst specializing in industry profitability metrics.",
            "Task Description": "Analyze profit margins across major industry players and compare them to industry benchmarks.",
            "Output Format": "A financial overview including gross, operating, and net margins.",
            "Style Guidelines": "Professional, quantitative, and sourced from financial data.",
            "Constraints": "Use only validated sources such as financial reports, industry benchmarks, and market research.",
            "Interactivity": "Allow users to specify competitors and financial metrics of interest."
        }
    }
];