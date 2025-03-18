// Define the expected form data structure for the page
export interface ActionData {
  error?: string;
  values?: {
    name?: string;
    company?: string;
    industry?: string;
    region?: string;
  };
}
