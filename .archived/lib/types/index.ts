// Chat-related types
export interface Message {
	id: number;
	sender: 'user' | 'ai';
	timestamp: string;
	content: string;
}

export interface Chat {
	id: number;
	name: string; // Format: Brand,Category,Region
	messages: Message[];
	createdAt: string;
}

// Brand-related types
export interface BrandInfo {
	brand: string;
	category: string;
	region: string;
}
