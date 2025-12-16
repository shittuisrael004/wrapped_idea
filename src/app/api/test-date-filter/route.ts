import { NextResponse } from 'next/server';

export async function GET() {
  const address = "0xF6795a9E2E9ae0F96CD46b3F9b3F1d24EaD77638";
  const apiKey = process.env.COVALENT_API_KEY;
  
  const tests = [
    {
      name: "No filter",
      url: `https://api.covalenthq.com/v1/base-mainnet/address/${address}/transactions_v3/?key=${apiKey}&page-size=5`
    },
    {
      name: "from-date / to-date",
      url: `https://api.covalenthq.com/v1/base-mainnet/address/${address}/transactions_v3/?key=${apiKey}&page-size=5&from-date=2025-01-01&to-date=2025-12-31`
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const res = await fetch(test.url);
      const json = await res.json();
      
      results.push({
        name: test.name,
        status: res.status,
        items_returned: json.data?.items?.length || 0,
        first_date: json.data?.items?.[0]?.block_signed_at || null,
        error: json.error_message || null
      });
    } catch (err) {
      results.push({
        name: test.name,
        error: String(err)
      });
    }
  }
  
  return NextResponse.json({ results });
}