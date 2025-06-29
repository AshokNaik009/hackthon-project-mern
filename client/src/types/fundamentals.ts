export interface HealthRating {
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  color: 'green' | 'blue' | 'yellow' | 'red';
  description: string;
}

export interface KeyRatios {
  pe: number | string;
  pb: number | string;
  roe: number | string;
  roa: number | string;
  debtToEquity: number | string;
  currentRatio: number | string;
}

export interface Margins {
  gross: number | string;
  operating: number | string;
  net: number | string;
}

export interface Growth {
  revenue: number | string;
  earnings: number | string;
}

export interface FundamentalData {
  symbol: string;
  healthScore: number;
  healthRating: HealthRating;
  keyRatios: KeyRatios;
  margins: Margins;
  growth: Growth;
  lastUpdate: string;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  industry: string;
  sector: string;
  country: string;
  marketCap: number;
  website: string;
  logo: string;
  phone: string;
  description: string;
  lastUpdate: string;
}

export interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  url: string;
  image: string;
  source: string;
  datetime: number;
  publishedAt: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  category: string;
  impactScore: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
}

export interface NewsData {
  symbol: string;
  dateRange: {
    from: string;
    to: string;
  };
  totalArticles: number;
  news: NewsArticle[];
  statistics: {
    sentiment: SentimentStats;
    categories: Record<string, number>;
    averageImpactScore: string;
  };
  lastUpdate: string;
}