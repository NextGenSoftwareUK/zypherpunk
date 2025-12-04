/**
 * CoinGecko API Integration
 * 
 * Note: CoinGecko free tier has rate limits:
 * - 10-50 calls/minute (depending on plan)
 * - Consider adding caching for production use
 * 
 * API Documentation: https://www.coingecko.com/en/api/documentation
 */

import { ProviderType } from './types';
import { normalizeProviderType } from './providerTypeMapper';

/**
 * Maps ProviderType to CoinGecko coin IDs
 * Only includes providers that have their own actual CoinGecko listings
 * Providers without listings will return null
 */
const providerToCoinGeckoId: Partial<Record<ProviderType, string>> = {
  [ProviderType.SolanaOASIS]: 'solana',
  [ProviderType.EthereumOASIS]: 'ethereum',
  [ProviderType.PolygonOASIS]: 'matic-network',
  [ProviderType.ArbitrumOASIS]: 'arbitrum',
  [ProviderType.ZcashOASIS]: 'zcash',
  [ProviderType.StarknetOASIS]: 'starknet',
  [ProviderType.RadixOASIS]: 'radix',
  [ProviderType.AvalancheOASIS]: 'avalanche-2',
  [ProviderType.BaseOASIS]: 'base',
  [ProviderType.EOSIOOASIS]: 'eos',
  [ProviderType.TelosOASIS]: 'telos',
  [ProviderType.LoomOASIS]: 'loom-network',
  [ProviderType.TONOASIS]: 'the-open-network',
  [ProviderType.StellarOASIS]: 'stellar',
  [ProviderType.BlockStackOASIS]: 'stacks',
  [ProviderType.HashgraphOASIS]: 'hedera-hashgraph',
  [ProviderType.ElrondOASIS]: 'elrond-erd-2',
  [ProviderType.TRONOASIS]: 'tron',
  [ProviderType.CosmosBlockChainOASIS]: 'cosmos',
  [ProviderType.RootstockOASIS]: 'rootstock',
  [ProviderType.ChainLinkOASIS]: 'chainlink',
  [ProviderType.CardanoOASIS]: 'cardano',
  [ProviderType.PolkadotOASIS]: 'polkadot',
  [ProviderType.BitcoinOASIS]: 'bitcoin',
  [ProviderType.NEAROASIS]: 'near',
  [ProviderType.SuiOASIS]: 'sui',
  [ProviderType.AptosOASIS]: 'aptos',
  [ProviderType.OptimismOASIS]: 'optimism',
  [ProviderType.BNBChainOASIS]: 'binancecoin',
  [ProviderType.FantomOASIS]: 'fantom',
  [ProviderType.HoloOASIS]: 'holo',
  // Note: AztecOASIS, MidenOASIS, and other providers without their own tokens are intentionally excluded
};

/**
 * Get CoinGecko coin ID for a provider type
 * Returns null if the provider doesn't have its own CoinGecko listing
 */
export function getCoinGeckoId(providerType: ProviderType): string | null {
  const normalized = normalizeProviderType(providerType);
  const coinId = providerToCoinGeckoId[normalized] || null;
  console.log(`🔍 getCoinGeckoId: ${providerType} -> ${normalized} -> ${coinId}`);
  return coinId;
}

/**
 * Check if a provider has price data available on CoinGecko
 */
export function hasCoinGeckoPriceData(providerType: ProviderType): boolean {
  return getCoinGeckoId(providerType) !== null;
}

/**
 * CoinGecko API response types
 */
export interface CoinGeckoPriceData {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap?: number;
  };
}

export interface CoinGeckoCoinData {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
  };
}

export interface CoinGeckoMarketChartData {
  prices: Array<[number, number]>; // [timestamp, price]
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}

/**
 * Fetch current price and 24h change from CoinGecko
 */
export async function fetchCoinGeckoPrice(coinId: string): Promise<{ price: number; change24h: number; marketCap?: number } | null> {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
    console.log(`📊 Fetching price from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error (${response.status}):`, errorText);
      throw new Error(`CoinGecko API error: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data: CoinGeckoPriceData = await response.json();
    console.log(`📊 CoinGecko price response for ${coinId}:`, data);
    
    const coinData = data[coinId];

    if (!coinData) {
      console.warn(`No price data found for ${coinId} in response. Available keys:`, Object.keys(data));
      return null;
    }

    const result = {
      price: coinData.usd,
      change24h: coinData.usd_24h_change || 0,
      marketCap: coinData.usd_market_cap,
    };
    
    console.log(`✅ Parsed price data for ${coinId}: $${result.price}, 24h change: ${result.change24h}%`);
    return result;
  } catch (error) {
    console.error('Failed to fetch CoinGecko price:', error);
    return null;
  }
}

/**
 * Fetch detailed coin data including market cap
 */
export async function fetchCoinGeckoCoinData(coinId: string): Promise<CoinGeckoCoinData | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoCoinData = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch CoinGecko coin data:', error);
    return null;
  }
}

/**
 * Fetch market chart data from CoinGecko
 * @param coinId CoinGecko coin ID
 * @param days Number of days (1, 7, 30, 90, 180, 365, max)
 */
export async function fetchCoinGeckoMarketChart(
  coinId: string,
  days: number | 'max' = 1
): Promise<CoinGeckoMarketChartData | null> {
  try {
    const daysParam = days === 'max' ? 'max' : days.toString();
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${daysParam}`;
    console.log(`📊 Fetching market chart from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinGecko API error (${response.status}):`, errorText);
      throw new Error(`CoinGecko API error: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data: CoinGeckoMarketChartData = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      console.warn(`No price data in response for ${coinId}`);
      return null;
    }
    
    console.log(`✅ Received ${data.prices.length} price points for ${coinId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch CoinGecko market chart:', error);
    return null;
  }
}

/**
 * Convert time frame to CoinGecko days parameter
 */
export function timeFrameToDays(timeFrame: '1H' | '1D' | '1W' | '1M' | 'YTD' | 'ALL'): number | 'max' {
  switch (timeFrame) {
    case '1H':
      return 1; // Use 1 day for hourly view (CoinGecko doesn't support hourly directly)
    case '1D':
      return 1;
    case '1W':
      return 7;
    case '1M':
      return 30;
    case 'YTD':
      return 180; // Approximate YTD
    case 'ALL':
      return 'max';
    default:
      return 1;
  }
}

/**
 * Format price history data for chart
 */
export function formatPriceHistory(
  marketChartData: CoinGeckoMarketChartData,
  timeFrame: '1H' | '1D' | '1W' | '1M' | 'YTD' | 'ALL'
): Array<{ time: string; price: number }> {
  const { prices } = marketChartData;
  
  if (!prices || prices.length === 0) {
    console.warn('No price data in marketChartData');
    return [];
  }
  
  console.log(`📈 Formatting ${prices.length} price points for ${timeFrame} timeframe`);
  
  // Validate and clean price data
  const validPrices = prices
    .filter(([timestamp, price]) => {
      if (!timestamp || !price || isNaN(timestamp) || isNaN(price)) {
        return false;
      }
      if (price <= 0 || price > 1e10) {
        console.warn(`Invalid price detected: ${price} at timestamp ${timestamp}`);
        return false;
      }
      return true;
    })
    .map(([timestamp, price]) => [timestamp, Number(price)] as [number, number]);
  
  if (validPrices.length === 0) {
    console.warn('No valid price data after filtering');
    return [];
  }

  // For hourly view, sample every hour from 1 day of data
  if (timeFrame === '1H') {
    const hourlyData: Array<{ time: string; price: number }> = [];
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    // Filter prices from the last 24 hours
    const recentPrices = validPrices.filter(([timestamp]) => timestamp >= oneDayAgo);
    
    if (recentPrices.length === 0) {
      // Fallback: use last 24 data points
      const last24 = validPrices.slice(-24);
      return last24.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric' }),
        price: Number(price.toFixed(2)),
      }));
    }
    
    // Sample hourly data
    for (let i = 23; i >= 0; i--) {
      const targetTime = now - i * 60 * 60 * 1000;
      // Find closest price point
      const closest = recentPrices.reduce((prev, curr) => {
        return Math.abs(curr[0] - targetTime) < Math.abs(prev[0] - targetTime) ? curr : prev;
      });
      hourlyData.push({
        time: new Date(closest[0]).toLocaleTimeString('en-US', { hour: 'numeric' }),
        price: Number(Number(closest[1]).toFixed(2)),
      });
    }
    return hourlyData;
  }

  // For other time frames, sample data points intelligently
  let sampleSize: number;
  switch (timeFrame) {
    case '1D':
      sampleSize = 24; // Hourly points for 1 day
      break;
    case '1W':
      sampleSize = 48; // ~3.5 hours per point
      break;
    case '1M':
      sampleSize = 30; // Daily points for 1 month
      break;
    case 'YTD':
    case 'ALL':
      sampleSize = 100; // More points for longer timeframes
      break;
    default:
      sampleSize = 24;
  }
  
  const step = Math.max(1, Math.floor(validPrices.length / sampleSize));
  
  // Sample data points and ensure we have the first and last
  const sampled = validPrices
    .filter((_, index) => index % step === 0 || index === validPrices.length - 1)
    .map(([timestamp, price]) => ({
      time: formatTimestamp(timestamp, timeFrame),
      price: Number(price.toFixed(2)), // Ensure price is a proper number
    }));
  
  // Remove duplicates by time
  const unique = sampled.reduce((acc, curr) => {
    if (!acc.find(item => item.time === curr.time)) {
      acc.push(curr);
    }
    return acc;
  }, [] as Array<{ time: string; price: number }>);
  
  return unique;
}

/**
 * Format timestamp based on time frame
 */
function formatTimestamp(timestamp: number, timeFrame: '1H' | '1D' | '1W' | '1M' | 'YTD' | 'ALL'): string {
  const date = new Date(timestamp);
  
  switch (timeFrame) {
    case '1H':
    case '1D':
      return date.toLocaleTimeString('en-US', { hour: 'numeric' });
    case '1W':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '1M':
    case 'YTD':
    case 'ALL':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    default:
      return date.toLocaleTimeString('en-US', { hour: 'numeric' });
  }
}

