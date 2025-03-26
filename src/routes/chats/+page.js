/** @type {import('./$types').PageLoad} */
export async function load({ parent, fetch, depends }) {
  // Mark this module as depending on the chats data
  // Use the proper dependency format with colon
  depends("app:chats");

  // Wait for layout data (sample chats)
  const layoutData = await parent();

  console.log(
    "Page load - received sample chats:",
    layoutData.sampleChats ? layoutData.sampleChats.length : 0,
  );

  // This will make the layout data available to the page
  return {
    sampleChats: layoutData.sampleChats || [],
  };
}
