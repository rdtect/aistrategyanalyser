

//create types for chat and message
export interface Message {
	id: number;
	sender: 'user' | 'ai';
	timestamp: string;
	content: string;
	status?: 'sending' | 'sent' | 'error';
}

export interface Chat {
	id: number;
	name: string; // Format: Brand,Category,Region
	messages: Message[];
	createdAt: string;
}

/**
 * Sample chat data for demonstration purposes
 */
export const sampleChats: Chat[] = [
	{
		id: 0,
		name: 'Nike,Athletic Footwear,North America',
		createdAt: '2023-10-15T14:30:00Z',
		messages: [
			{
				id: 0,
				sender: 'user',
				timestamp: '2:30 PM',
				content: "Can you analyze Nike's position in the athletic footwear market in North America?"
			},
			{
				id: 1,
				sender: 'ai',
				timestamp: '2:30 PM',
				content: `
# Nike in North American Athletic Footwear

## Market Position
Nike remains the dominant player in North American athletic footwear with approximately 35% market share. Their closest competitors are Adidas (15%), Brooks (8%), and New Balance (7%).

## Key Strengths
- Strong brand recognition and loyalty
- Extensive product range covering all price points
- Innovative technology (Air, React, ZoomX)
- Powerful marketing and athlete endorsements
- Expanding direct-to-consumer channels

## Challenges
- Increasing competition from specialized brands
- Supply chain disruptions affecting inventory
- Pressure to maintain sustainability commitments
- Balancing premium positioning with mass market appeal

Would you like more specific information about Nike's competitive landscape, consumer trends, or growth opportunities?
				`
			}
		]
	},
	{
		id: 1,
		name: 'Starbucks,Coffee Shops,Global',
		createdAt: '2023-10-20T09:15:00Z',
		messages: [
			{
				id: 0,
				sender: 'user',
				timestamp: '9:15 AM',
				content:
					'What are the current trends in the global coffee shop market that Starbucks should be aware of?'
			},
			{
				id: 1,
				sender: 'ai',
				timestamp: '9:15 AM',
				content: `
# Global Coffee Shop Trends for Starbucks

## Key Market Trends
1. **Sustainability Focus**: Consumers increasingly demand ethically sourced beans and eco-friendly packaging
2. **Specialty Coffee Growth**: Premium, single-origin offerings growing at 13% annually
3. **Digital Integration**: Mobile ordering and loyalty programs driving 24% of transactions
4. **Alternative Milks**: Plant-based options now requested in 25% of milk-based beverages
5. **"Third Place" Evolution**: Post-pandemic shift in how consumers use coffee shops as workspaces

## Regional Variations
- **North America**: Cold brew and ready-to-drink categories expanding rapidly
- **Europe**: Specialty coffee culture challenging chain dominance
- **Asia-Pacific**: Tea-coffee fusion drinks gaining popularity
- **Latin America**: Local chain growth presenting new competition

## Strategic Implications
Starbucks should consider strengthening its sustainability messaging, expanding specialty offerings, and continuing to innovate in its digital ecosystem to maintain market leadership.

Would you like me to elaborate on any specific trend or region?
				`
			}
		]
	},
	{
		id: 2,
		name: 'Tesla,Electric Vehicles,Europe',
		createdAt: '2023-11-05T16:45:00Z',
		messages: [
			{
				id: 0,
				sender: 'user',
				timestamp: '4:45 PM',
				content: 'How is Tesla performing in the European electric vehicle market?'
			},
			{
				id: 1,
				sender: 'ai',
				timestamp: '4:45 PM',
				content: `
# Tesla in the European EV Market

## Market Performance
Tesla currently holds approximately 13.5% market share in Europe's battery electric vehicle (BEV) market, making it the second-largest player behind Volkswagen Group (15.8%).

## Regional Strengths
- **Norway & Netherlands**: Strong market leadership with 20%+ share
- **Germany**: Growing presence despite domestic competition
- **UK**: Leading import brand in the electric segment

## Competitive Landscape
- **Traditional Manufacturers**: VW Group, Stellantis, and Renault Group rapidly expanding EV offerings
- **Chinese Entrants**: BYD, NIO, and Xpeng increasing European presence
- **Premium Segment**: Competition from Audi e-tron, Mercedes EQ, and BMW i series

## Challenges
1. Local manufacturing capacity constraints
2. Adapting to European consumer preferences
3. Navigating complex regulatory environment across countries
4. Expanding charging infrastructure in partnership with governments

Would you like more specific information about Tesla's performance in particular European markets or competitive dynamics?
				`
			}
		]
	}
];
