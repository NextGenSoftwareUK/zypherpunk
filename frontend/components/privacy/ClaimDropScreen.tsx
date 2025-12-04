'use client';

import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle2, AlertCircle, ScanLine, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dropAPI } from '@/lib/api/dropApi';
import { useWalletStore } from '@/lib/store';
import { formatBalance } from '@/lib/utils';
import type { Wallet, ProviderType, DropStatus, ClaimDropRequest, Transaction } from '@/lib/types';

interface ClaimDropScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const ClaimDropScreen: React.FC<ClaimDropScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const { wallets, user, loadWallets } = useWalletStore();
  const [dropId, setDropId] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | ''>('');
  const [selectedWalletAddress, setSelectedWalletAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropInfo, setDropInfo] = useState<DropStatus | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Get available wallets for claiming
  const availableWallets = Object.values(wallets).flat().filter(w => w.balance !== undefined);

  const canClaim = dropId.length > 0 && claimCode.length > 0 && selectedWalletAddress.length > 0 && !isLoading;

  const handleValidate = async () => {
    if (!dropId || !claimCode) {
      setError('Please enter drop ID and claim code');
      return;
    }

    setIsValidating(true);
    setError(null);
    setDropInfo(null);

    try {
      const result = await dropAPI.validateClaimCode(dropId, claimCode, password || undefined);

      if (result.isError) {
        setError(result.message || 'Invalid claim code');
        return;
      }

      if (result.result?.valid && result.result.drop) {
        setDropInfo(result.result.drop);
        // Auto-select wallet matching the drop's provider type
        const matchingWallet = availableWallets.find(
          w => w.providerType === result.result.drop?.providerType
        );
        if (matchingWallet) {
          setSelectedProvider(matchingWallet.providerType);
          setSelectedWalletAddress(matchingWallet.walletAddress);
        }
      } else {
        setError('Invalid claim code or drop has expired');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate claim code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClaim = async () => {
    if (!dropId || !claimCode || !selectedWalletAddress || !selectedProvider) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: ClaimDropRequest = {
        dropId,
        claimCode,
        password: password || undefined,
        toWalletAddress: selectedWalletAddress,
        toProviderType: selectedProvider as ProviderType,
      };

      const result = await dropAPI.claimDrop(request);

      if (result.isError) {
        setError(result.message || 'Failed to claim drop');
        return;
      }

      // Success
      setSuccess(true);
      setTransactionHash(result.result?.transactionHash || null);

      // Reload wallets to update balance
      if (user?.id) {
        loadWallets(user.id);
      }

      // Reset form after delay
      setTimeout(() => {
        setDropId('');
        setClaimCode('');
        setPassword('');
        setDropInfo(null);
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim drop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zypherpunk-bg text-zypherpunk-text p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-zypherpunk-text hover:bg-zypherpunk-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-zypherpunk-primary" />
          <h1 className="text-2xl font-bold">Claim Privacy Drop</h1>
        </div>
      </div>

      {success ? (
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-zypherpunk-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zypherpunk-text mb-2">Drop Claimed!</h2>
          <p className="text-zypherpunk-text-muted mb-4">
            The funds have been transferred to your wallet
          </p>
          {transactionHash && (
            <p className="text-sm text-zypherpunk-accent font-mono break-all">
              {transactionHash}
            </p>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Privacy Notice */}
          <Card className="bg-zypherpunk-primary/10 border-zypherpunk-primary/30 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-zypherpunk-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zypherpunk-primary mb-1">
                  Unlinkable Claim
                </p>
                <p className="text-xs text-zypherpunk-text-muted">
                  Claiming this drop does not reveal who sent it. Your privacy is protected.
                </p>
              </div>
            </div>
          </Card>

          {/* Drop ID */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
            <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
              Drop ID
            </label>
            <Input
              value={dropId}
              onChange={(e) => {
                setDropId(e.target.value);
                setDropInfo(null);
                setError(null);
              }}
              placeholder="Enter drop ID"
              className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text font-mono"
            />
          </Card>

          {/* Claim Code */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
            <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
              Claim Code
            </label>
            <div className="relative">
              <Input
                value={claimCode}
                onChange={(e) => {
                  setClaimCode(e.target.value);
                  setDropInfo(null);
                  setError(null);
                }}
                placeholder="Enter claim code"
                className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text font-mono pr-10"
              />
              <button
                type="button"
                onClick={handleValidate}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zypherpunk-accent hover:text-zypherpunk-primary"
                disabled={isValidating || !dropId || !claimCode}
              >
                <ScanLine className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zypherpunk-text-muted mt-2">
              Enter the claim code provided by the sender
            </p>
          </Card>

          {/* Password (if required) */}
          {dropInfo && (
            <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
              <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
                Password (if required)
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password if drop is password-protected"
                  className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zypherpunk-text-muted hover:text-zypherpunk-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Card>
          )}

          {/* Drop Info (after validation) */}
          {dropInfo && (
            <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-zypherpunk-primary" />
                Drop Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zypherpunk-text-muted">Amount</span>
                  <span className="font-semibold">{formatBalance(dropInfo.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zypherpunk-text-muted">Provider</span>
                  <span className="font-semibold">{dropInfo.providerType.replace('OASIS', '')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zypherpunk-text-muted">Status</span>
                  <span className={`font-semibold ${
                    dropInfo.status === 'active' ? 'text-zypherpunk-primary' : 'text-zypherpunk-text-muted'
                  }`}>
                    {dropInfo.status}
                  </span>
                </div>
                {dropInfo.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-zypherpunk-text-muted">Expires</span>
                    <span className="font-semibold text-sm">
                      {new Date(dropInfo.expiresAt * 1000).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Recipient Wallet */}
          {dropInfo && (
            <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
              <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
                Claim To Wallet
              </label>
              <Select
                value={selectedWalletAddress}
                onValueChange={(value) => {
                  setSelectedWalletAddress(value);
                  const wallet = availableWallets.find(w => w.walletAddress === value);
                  if (wallet) {
                    setSelectedProvider(wallet.providerType);
                  }
                }}
              >
                <SelectTrigger className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text">
                  <SelectValue placeholder="Select wallet to receive funds" />
                </SelectTrigger>
                <SelectContent className="bg-zypherpunk-surface border-zypherpunk-border">
                  {availableWallets
                    .filter(w => !dropInfo || w.providerType === dropInfo.providerType)
                    .map((wallet) => (
                      <SelectItem key={wallet.walletId} value={wallet.walletAddress}>
                        <div className="flex items-center justify-between w-full">
                          <span>{wallet.providerType.replace('OASIS', '')}</span>
                          <span className="text-xs text-zypherpunk-text-muted ml-2">
                            {formatBalance(wallet.balance || 0)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {dropInfo && selectedProvider && selectedProvider !== dropInfo.providerType && (
                <p className="text-xs text-red-400 mt-2">
                  Wallet provider must match drop provider ({dropInfo.providerType.replace('OASIS', '')})
                </p>
              )}
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/50 p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </Card>
          )}

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={!canClaim || (dropInfo && selectedProvider !== dropInfo.providerType)}
            className="w-full bg-zypherpunk-primary/20 hover:bg-zypherpunk-primary/30 border border-zypherpunk-primary/40 text-zypherpunk-primary font-semibold py-6 text-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zypherpunk-primary"></div>
                <span>Claiming...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Claim Drop</span>
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

