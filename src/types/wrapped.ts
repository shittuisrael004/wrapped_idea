export interface WrappedSummary {
  wallet: string;
  year: number;
  summary: {
    total_tx: number;
    active_days: number;
    total_gas_usd: string;
    peak_month: string; // NEW FIELD
  };
  favorites: {
    top_chain: string;
    top_chain_count: number;
  };
  persona: {
    title: string;
    description: string;
    color_theme: string;
  };
}