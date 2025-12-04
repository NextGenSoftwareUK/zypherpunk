import type { 
  OASISResult, 
  PrivacyDrop, 
  CreateDropRequest, 
  ClaimDropRequest, 
  DropStatus, 
  DropHistory,
  ProviderType 
} from '../types';
import { oasisWalletAPI } from '../api';

const API_BASE_URL = process.env.NEXT_PUBLIC_OASIS_API_URL || 'http://api.oasisplatform.world';
const USE_PROXY = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';
const PROXY_BASE_URL = '/api/proxy';

/**
 * Privacy Drop API Client
 * Implements unlinkable drop-claim mechanism for privacy-preserving value transfers
 * 
 * Features:
 * - Unlinkable sender-recipient relationship
 * - Nullifier-based double-claim prevention
 * - Optional password protection
 * - Encrypted claim codes
 * - Operational privacy (hides treasury patterns)
 */
class DropAPI {
  private baseUrl: string;
  private useProxy: boolean;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.useProxy = USE_PROXY;
  }

  private getAuthToken(): string | null {
    return oasisWalletAPI.getAuthToken() || null;
  }

  setAuthToken(token: string | null) {
    oasisWalletAPI.setAuthToken(token);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<OASISResult<T>> {
    try {
      const token = this.getAuthToken();
      const url = this.useProxy 
        ? `${PROXY_BASE_URL}/wallet/${endpoint}`
        : `${this.baseUrl}/api/wallet/${endpoint}`;
      
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as HeadersInit),
      });

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(url, {
        ...options,
        headers,
        mode: this.useProxy ? 'same-origin' : 'cors',
      });

      // Check content type before parsing
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      
      const responseText = await response.text();
      
      // Check if response is HTML (bot protection)
      if (responseText.trim().startsWith('<!') || responseText.trim().startsWith('<html')) {
        console.error('API returned HTML instead of JSON (bot protection?)');
        throw new Error('API returned HTML response. This may indicate bot protection or server error.');
      }

      if (!response.ok) {
        console.error('API error response:', responseText.substring(0, 200));
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText.substring(0, 100)}`);
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', responseText.substring(0, 200));
        throw new Error('Invalid JSON response from API');
      }
      
      return data as OASISResult<T>;
    } catch (error) {
      console.error('Drop API request failed:', error);
      return {
        isError: true,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        detailedMessage: error instanceof Error ? error.stack : undefined,
      };
    }
  }

  /**
   * Create a privacy drop
   * Decouples payment from receipt - sender creates drop, recipient claims independently
   * 
   * @param request Drop creation request
   * @returns Created drop with claim code
   */
  async createDrop(request: CreateDropRequest): Promise<OASISResult<PrivacyDrop>> {
    return this.request<PrivacyDrop>('privacy_drop/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Claim a privacy drop
   * Recipient claims drop using claim code - no link to sender on-chain
   * 
   * @param request Claim request with drop ID and claim code
   * @returns Transaction result
   */
  async claimDrop(request: ClaimDropRequest): Promise<OASISResult<Transaction>> {
    return this.request<Transaction>('privacy_drop/claim', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get drop status
   * Check if drop is active, claimed, expired, or cancelled
   * 
   * @param dropId Drop ID
   * @returns Drop status
   */
  async getDropStatus(dropId: string): Promise<OASISResult<DropStatus>> {
    return this.request<DropStatus>(`privacy_drop/status/${dropId}`);
  }

  /**
   * Get drop history
   * Returns drops created and claimed by the user
   * 
   * @param avatarId Avatar ID
   * @returns Drop history
   */
  async getDropHistory(avatarId: string): Promise<OASISResult<DropHistory>> {
    return this.request<DropHistory>(`privacy_drop/history/${avatarId}`);
  }

  /**
   * Cancel a drop
   * Cancel an active drop before it's claimed or expires
   * 
   * @param dropId Drop ID
   * @returns Success status
   */
  async cancelDrop(dropId: string): Promise<OASISResult<boolean>> {
    return this.request<boolean>(`privacy_drop/cancel/${dropId}`, {
      method: 'POST',
    });
  }

  /**
   * Validate claim code
   * Check if a claim code is valid without claiming
   * 
   * @param dropId Drop ID
   * @param claimCode Claim code
   * @param password Optional password
   * @returns Validation result
   */
  async validateClaimCode(
    dropId: string, 
    claimCode: string, 
    password?: string
  ): Promise<OASISResult<{ valid: boolean; drop?: DropStatus }>> {
    return this.request<{ valid: boolean; drop?: DropStatus }>('privacy_drop/validate', {
      method: 'POST',
      body: JSON.stringify({ dropId, claimCode, password }),
    });
  }
}

// Create and export singleton instance
export const dropAPI = new DropAPI();

