// /api/test-covalent/route.ts
export async function GET() {
  const address = "0xd2A1E8f67f7BB10764c55AD51969817a6D91BD58"; // Your address
  const apiKey = process.env.COVALENT_API_KEY;
  
  const txRes = await fetch(
    `https://api.covalenthq.com/v1/base-mainnet/address/${address}/transactions_v3/?key=${apiKey}&page-size=100&page-number=0`
  );
  const tx = await txRes.json();
  
  return Response.json({ 
    total_items: tx.data?.items?.length,
    dates: tx.data?.items?.map((t: any) => t.block_signed_at) // Just the dates
  });
}