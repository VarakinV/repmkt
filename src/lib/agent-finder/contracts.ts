export const LISTING_PROVIDERS = ["REALTOR_CA", "REALTOR_COM", "ZILLOW"] as const;
export type ListingProviderValue = (typeof LISTING_PROVIDERS)[number];

export const SEARCH_MODES = ["MARKET", "CUSTOM_URL"] as const;
export type SearchModeValue = (typeof SEARCH_MODES)[number];

export type AgentFinderMarketOption = {
  id: string;
  label: string;
  countryCode: string;
  regionCode: string;
  city: string;
  provider: ListingProviderValue;
  startUrl: string;
};

export type AgentFinderLeadView = {
  id: string;
  rank: number | null;
  agentName: string;
  firstName: string | null;
  lastName: string | null;
  brokerageName: string | null;
  listingAddress: string | null;
  listingUrl: string | null;
  listed: string | null;
  phone: string | null;
  email: string | null;
  emailVerified: boolean;
  emailVerificationStatus: string;
  emailSource: string | null;
  confidenceScore: number;
  agentWebsite: string | null;
  brokerageWebsite: string | null;
};

export type AgentFinderJobView = {
  id: string;
  status: string;
  mode: SearchModeValue;
  provider: ListingProviderValue;
  countryCode: string;
  regionCode: string;
  city: string;
  maxListings: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  resultSummary: Record<string, unknown> | null;
  leads: AgentFinderLeadView[];
};

export type CreateAgentFinderJobInput = {
  mode: SearchModeValue;
  marketId?: string;
  provider?: ListingProviderValue;
  customStartUrl?: string;
  countryCode: string;
  regionCode: string;
  city: string;
  maxListings: number;
};