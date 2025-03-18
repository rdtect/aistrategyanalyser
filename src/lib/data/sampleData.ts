// Sample chat data for POC
export const sampleChats = [
  {
    id: "1",
    name: "Apple Inc. Strategy Analysis",
    createdAt: new Date(2023, 2, 15),
    company: "Apple",
    industry: "Technology",
    region: "Global",
  },
  {
    id: "2",
    name: "Tesla Market Position",
    createdAt: new Date(2023, 3, 20),
    company: "Tesla",
    industry: "Automotive",
    region: "North America",
  },
  {
    id: "3",
    name: "Unilever Competitive Analysis",
    createdAt: new Date(2023, 4, 5),
    company: "Unilever",
    industry: "Consumer Goods",
    region: "Europe",
  },
];

// Sample messages for each chat
export const sampleMessages = {
  "1": [
    {
      id: "101",
      content: "What are Apple's key competitive advantages?",
      sender: "user",
      timestamp: new Date(2023, 2, 15, 10, 30),
      status: "sent",
    },
    {
      id: "102",
      content:
        "Apple's key competitive advantages include:\n\n1. **Strong Brand Value**: Apple has built one of the world's most valuable brands, creating deep customer loyalty.\n\n2. **Ecosystem Integration**: The seamless integration between Apple devices (iPhone, iPad, Mac, Watch) creates high switching costs for consumers.\n\n3. **Vertical Integration**: Apple controls both hardware and software, allowing for optimization that competitors can't match.\n\n4. **Premium Positioning**: Their focus on the high-end market segment generates industry-leading profit margins.\n\n5. **Innovation Culture**: Consistent focus on user experience and design thinking.\n\n6. **Retail Strategy**: Company-owned stores provide direct customer relationships and superior product presentation.\n\n7. **Supply Chain Mastery**: Advanced supply chain management gives Apple negotiating power with suppliers.\n\nThese advantages have allowed Apple to maintain premium pricing while building a deeply loyal customer base.",
      sender: "ai",
      timestamp: new Date(2023, 2, 15, 10, 31),
      status: "sent",
    },
  ],
  "2": [
    {
      id: "201",
      content: "Analyze Tesla's position in the EV market",
      sender: "user",
      timestamp: new Date(2023, 3, 20, 14, 15),
      status: "sent",
    },
    {
      id: "202",
      content:
        "# Tesla's Position in the EV Market: 4C Analysis\n\n## Company\n- **First-mover advantage** in premium EV segment\n- **Vertical integration** across manufacturing, software, charging network\n- **Strong brand identity** associated with innovation and sustainability\n- **Direct-to-consumer sales model** eliminates dealer markups\n\n## Customers\n- **Early adopters** and tech enthusiasts form core customer base\n- **Environmentally conscious** luxury and upper-middle-class consumers\n- **Expanding to mainstream** market with Model 3 and Model Y\n\n## Competition\n- **Traditional automakers** (VW Group, GM, Ford) investing heavily in EVs\n- **New EV startups** (Rivian, Lucid) targeting luxury segments\n- **Chinese manufacturers** (BYD, NIO) gaining market share globally\n\n## Capabilities\n- **Battery technology leadership** with superior range and efficiency\n- **Software expertise** enabling OTA updates and autonomous features\n- **Supercharger network** provides competitive advantage in infrastructure\n- **Manufacturing innovations** including gigafactories and megacasting\n\nTesla currently leads the global EV market with approximately 18-20% market share, though this is declining as competition intensifies. Their technology advantage remains strong but narrowing as competitors invest billions in EV development.",
      sender: "ai",
      timestamp: new Date(2023, 3, 20, 14, 17),
      status: "sent",
    },
  ],
  "3": [
    {
      id: "301",
      content: "What strategies should Unilever adopt to compete with P&G?",
      sender: "user",
      timestamp: new Date(2023, 4, 5, 9, 45),
      status: "sent",
    },
    {
      id: "302",
      content:
        "# Unilever vs P&G: Strategic Recommendations\n\n## 1. Strengthen Sustainable Positioning\n- Leverage Unilever's stronger sustainability credentials (Sustainable Living Plan)\n- Create clearer differentiation from P&G through environmental leadership\n- Develop more plastic-free packaging innovations\n\n## 2. Accelerate Digital Transformation\n- Increase direct-to-consumer channels and e-commerce capabilities\n- Enhance data analytics to better understand consumer preferences\n- Invest in personalization technology\n\n## 3. Portfolio Optimization\n- Divest slower-growing food brands to focus on higher-margin personal care\n- Pursue strategic acquisitions in premium beauty and home care segments\n- Streamline brand portfolio to reduce internal competition\n\n## 4. Geographic Expansion Strategy\n- Double down on emerging markets where Unilever outperforms P&G\n- Tailor products for specific regional needs (especially India and Southeast Asia)\n- Develop market-specific innovations rather than global platforms\n\n## 5. Innovation Focus\n- Create dedicated innovation hubs focusing on natural/clean ingredients\n- Accelerate product development cycles to match P&G's pace\n- Partner with startups for disruptive innovation\n\nBy emphasizing sustainability leadership, geographic advantages, and portfolio optimization, Unilever can leverage its unique strengths while addressing gaps relative to P&G's scale and R&D capabilities.",
      sender: "ai",
      timestamp: new Date(2023, 4, 5, 9, 48),
      status: "sent",
    },
  ],
};
