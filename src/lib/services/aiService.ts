import type { Chat } from '$lib/data/sampleChats';

export interface BrandInfo {
	brand: string;
	category: string;
	region: string;
}

/**
 * Generates an AI response based on the current chat and user message
 */
export async function generateAIResponse(chat: Chat, userMessage: string): Promise<string> {
	// Parse brand information from the chat name
	const brandInfo = parseBrandInfo(chat.name);

	// Generate a response based on the brand information and user message
	return constructResponse(brandInfo, userMessage);
}

function parseBrandInfo(chatName: string): BrandInfo {
	const parts = chatName.split(',');
	return {
		brand: parts[0] || 'Unknown Brand',
		category: parts[1] || 'Unknown Category',
		region: parts[2] || 'Global'
	};
}

function constructResponse(brandInfo: BrandInfo, userMessage: string): string {
	const { brand, category, region } = brandInfo;
	const lowerCaseMessage = userMessage.toLowerCase();

	// Check for specific query types and return appropriate responses
	if (lowerCaseMessage.includes('market') && lowerCaseMessage.includes('performance')) {
		return `
# ${brand} Market Performance in ${region}

## Market Share
${brand} currently holds approximately 28% market share in the ${category} market in ${region}, showing a 2.3% increase year-over-year.

## Key Performance Indicators
- **Revenue Growth**: 7.2% increase in Q2 2023
- **Unit Sales**: 12.5 million units, up 5.8% from previous year
- **Average Selling Price**: $67.50, a 1.5% increase
- **Online Sales**: 42% of total revenue, up from 35% last year

## Competitive Position
${brand} maintains its position as the ${
			Math.random() > 0.5 ? 'market leader' : 'second largest player'
		} in ${region}, ahead of competitors like ${
			brand === 'Nike'
				? 'Adidas and Puma'
				: brand === 'Adidas'
					? 'Nike and New Balance'
					: 'Nike and Adidas'
		}.

## Recent Challenges
- Supply chain disruptions affecting inventory levels
- Increased competition from direct-to-consumer brands
- Rising manufacturing costs impacting margins

Would you like more specific information about any aspect of ${brand}'s market performance?
`;
	}

	if (lowerCaseMessage.includes('innovation') || lowerCaseMessage.includes('strategy')) {
		return `
# ${brand}'s Innovation Strategy in ${category}

## Strategic Focus Areas
1. **Sustainable Materials**: Investing in eco-friendly manufacturing processes and materials
2. **Digital Integration**: Embedding smart technology in ${category} products
3. **Customization**: Expanding made-to-order and personalization options
4. **Manufacturing Innovation**: Implementing 3D printing and automated production

## Recent Innovations
- **${brand} EcoFlex**: New sustainable material reducing carbon footprint by 35%
- **${brand} Connect**: Digital platform connecting products to mobile applications
- **${brand} Custom Studio**: AI-powered design tool for personalized products

## R&D Investment
${brand} has increased its R&D spending by 15% year-over-year, with approximately 8.5% of revenue dedicated to innovation initiatives.

## Strategic Partnerships
- Collaboration with tech companies for digital integration
- University research partnerships for material science advancements
- Startup acquisitions to accelerate innovation pipeline

Would you like more details on any specific aspect of ${brand}'s innovation strategy?
`;
	}

	if (lowerCaseMessage.includes('consumer') || lowerCaseMessage.includes('customer')) {
		return `
# ${brand} Consumer Insights in ${region}

## Target Demographics
- **Primary**: 18-34 year olds (62% of customer base)
- **Secondary**: 35-45 year olds (24% of customer base)
- **Emerging**: 13-17 year olds (fastest growing segment)

## Consumer Behavior Trends
1. **Omnichannel Shopping**: 78% of customers research online before purchasing
2. **Sustainability Focus**: 65% consider environmental impact in purchasing decisions
3. **Brand Loyalty**: 42% are repeat customers, with average lifetime value of $850
4. **Social Influence**: 53% discover products through social media

## Customer Satisfaction
- Net Promoter Score: 72 (industry average: 65)
- Customer retention rate: 68%
- Most valued attributes: quality (76%), style (68%), innovation (54%)

## Regional Variations
${region}-specific consumers show particular interest in ${
			region === 'Global'
				? 'versatility and value'
				: region === 'North America'
					? 'performance and technology'
					: region === 'Europe'
						? 'sustainability and design'
						: region === 'Asia'
							? 'status and exclusivity'
							: 'affordability and durability'
		}.

Would you like more specific information about ${brand}'s consumer segments or marketing strategies?
`;
	}

	// Default response for other queries
	return `
# ${brand} ${category} Analysis for ${region}

Thank you for your question about ${brand} in the ${category} market. 

To provide you with the most relevant insights, could you specify what aspect of ${brand}'s business you're most interested in:

1. **Market performance and competitive landscape**
2. **Innovation strategy and product development**
3. **Consumer insights and target demographics**
4. **Marketing and brand positioning**
5. **Supply chain and distribution**
6. **Sustainability initiatives**

I can provide detailed analysis on any of these areas for ${brand} in the ${region} ${category} market.
`;
}
