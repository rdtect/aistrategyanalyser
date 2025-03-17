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
	company: string;
	industry: string;
	context?: string;
	region: string;
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
		company: 'Nike',
		industry: 'Athletic Footwear',
		region: 'South India',
		context:
			"Analysis of Nike's market position, strengths, and challenges in the North American athletic footwear market.",
		name: 'Nike | Athletic Footwear | North America',
		createdAt: '2023-10-15T14:30:00Z',
		messages: [
			{
				id: 0,
				sender: 'user',
				timestamp: '2:30 PM',
				content: "Can you analyze Nike's position in the athletic footwear market in North America?"
			},
			
		]
	},
	{
		id: 1,
		company: 'the whole truth',
		industry: 'protein and energy bars',
		region: 'India',
		name: 'the whole truth | protein and energy bars | India',
		createdAt: '2023-10-15T14:30:00Z',
		createdAt: '2023-10-20T09:15:00Z',
		messages: [
			{
				id: 0,
				sender: 'user',
				timestamp: '9:15 AM',
				content: "Can you analyze the whole truth's position in the protein and energy bars market in India?"
			},
		]
	},
	{
		id: 2,
		company: 'Tesla',
		industry: 'Electric Vehicles',
		region: 'Europe',
		context:
			"Analysis of Tesla's performance and competitive position in the European electric vehicle market.",
		name: 'Tesla | Electric Vehicles | Europe',
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
