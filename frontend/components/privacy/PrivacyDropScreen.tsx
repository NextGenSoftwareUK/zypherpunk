'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Copy, CheckCircle2, AlertCircle, QrCode, Clock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dropAPI } from '@/lib/api/dropApi';
import { useWalletStore } from '@/lib/store';
import { formatBalance } from '@/lib/utils';
import type { Wallet, ProviderType, PrivacyDrop, CreateDropRequest } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PrivacyDropScreenProps {
  wallet: Wallet;
  onBack: () => void;
  onSuccess?: () => void;
}

export const PrivacyDropScreen: React.FC<PrivacyDropScreenProps> = ({
  wallet,
  onBack,
  onSuccess,
}) => {
  const { loadWallets, user } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [expiresInHours, setExpiresInHours] = useState('24');
  const [password, setPassword] = useState('');
  const [memo, setMemo] = useState('');
  const [purpose, setPurpose] = useState<'reward' | 'refund' | 'bonus' | 'reimbursement' | 'payout' | 'gift'>('gift');
  const [showPassword, setShowPassword] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdDrop, setCreatedDrop] = useState<PrivacyDrop | null>(null);
  const [showQR, setShowQR] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const isValidAmount = numAmount > 0 && numAmount <= (wallet.balance || 0);
  const canCreate = isValidAmount && !isLoading;

  const handleMax = () => {
    setAmount(wallet.balance.toString());
  };

  const handleCreate = async () => {
    setError(null);

    if (!isValidAmount) {
      setError('Invalid amount');
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateDropRequest = {
        fromWalletAddress: wallet.walletAddress,
        fromProviderType: wallet.providerType,
        amount: numAmount,
        expiresInHours: parseInt(expiresInHours) || 24,
        password: usePassword ? password : undefined,
        memo: memo || undefined,
        purpose,
      };

      const result = await dropAPI.createDrop(request);

      if (result.isError) {
        setError(result.message || 'Failed to create privacy drop');
        return;
      }

      if (result.result) {
        setCreatedDrop(result.result);
        // Reload wallets to update balance
        if (user?.id) {
          loadWallets(user.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create drop');
    } finally {
      setIsLoading(false);
    }
  };

  const copyClaimCode = () => {
    if (createdDrop?.claimCode) {
      navigator.clipboard.writeText(createdDrop.claimCode);
      // Show temporary success message
    }
  };

  const copyDropId = () => {
    if (createdDrop?.dropId) {
      navigator.clipboard.writeText(createdDrop.dropId);
    }
  };

  const formatExpirationDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (createdDrop) {
    return (
      <div className="min-h-screen bg-zypherpunk-bg text-zypherpunk-text p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCreatedDrop(null);
              setAmount('');
              setPassword('');
              setMemo('');
              onSuccess?.();
            }}
            className="text-zypherpunk-text hover:bg-zypherpunk-surface"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-zypherpunk-primary" />
            <h1 className="text-2xl font-bold">Privacy Drop Created</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Success Message */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-zypherpunk-primary" />
              <div>
                <h2 className="text-xl font-bold">Drop Created Successfully!</h2>
                <p className="text-sm text-zypherpunk-text-muted">
                  The drop is unlinkable - recipient cannot trace it back to you
                </p>
              </div>
            </div>
          </Card>

          {/* Drop Details */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-zypherpunk-primary" />
              Drop Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zypherpunk-text-muted">Amount</span>
                <span className="font-semibold">{formatBalance(createdDrop.amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zypherpunk-text-muted">Provider</span>
                <span className="font-semibold">{createdDrop.providerType.replace('OASIS', '')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zypherpunk-text-muted">Expires</span>
                <span className="font-semibold">{formatExpirationDate(createdDrop.expiresAt)}</span>
              </div>
              {createdDrop.memo && (
                <div className="flex items-center justify-between">
                  <span className="text-zypherpunk-text-muted">Memo</span>
                  <span className="font-semibold text-sm">{createdDrop.memo}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Claim Code */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-zypherpunk-accent" />
              Claim Code
            </h3>
            <p className="text-sm text-zypherpunk-text-muted mb-4">
              Share this code with the recipient. They can claim the drop using this code.
              The code is encrypted and cannot be linked back to you.
            </p>
            
            <div className="bg-zypherpunk-bg border border-zypherpunk-border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono break-all text-zypherpunk-text flex-1">
                  {createdDrop.claimCode}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyClaimCode}
                  className="text-zypherpunk-accent hover:bg-zypherpunk-surface"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowQR(true)}
                className="flex-1 bg-zypherpunk-primary/20 hover:bg-zypherpunk-primary/30 border border-zypherpunk-primary/40 text-zypherpunk-primary"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Show QR Code
              </Button>
              <Button
                onClick={copyClaimCode}
                variant="outline"
                className="flex-1 border-zypherpunk-border text-zypherpunk-text"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </Card>

          {/* Drop ID (for tracking) */}
          <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Drop ID</p>
                <p className="text-xs text-zypherpunk-text-muted">For your reference only</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-zypherpunk-text-muted">
                  {createdDrop.dropId.substring(0, 16)}...
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyDropId}
                  className="text-zypherpunk-text-muted hover:text-zypherpunk-text"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy Notice */}
          <Card className="bg-zypherpunk-primary/10 border-zypherpunk-primary/30 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-zypherpunk-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-zypherpunk-primary mb-1">
                  Privacy Guaranteed
                </p>
                <p className="text-xs text-zypherpunk-text-muted">
                  The recipient cannot trace this drop back to your wallet or identity.
                  The claim is completely unlinkable from the creation.
                </p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => {
              setCreatedDrop(null);
              setAmount('');
              setPassword('');
              setMemo('');
              onSuccess?.();
            }}
            className="w-full bg-zypherpunk-primary/20 hover:bg-zypherpunk-primary/30 border border-zypherpunk-primary/40 text-zypherpunk-primary"
          >
            Done
          </Button>
        </div>

        {/* QR Code Dialog */}
        <Dialog open={showQR} onOpenChange={setShowQR}>
          <DialogContent className="bg-zypherpunk-surface border-zypherpunk-border">
            <DialogHeader>
              <DialogTitle className="text-zypherpunk-text">Claim Code QR</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={createdDrop.claimCode} size={256} />
              </div>
              <p className="text-sm text-zypherpunk-text-muted text-center">
                Scan this QR code to claim the drop
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Create Privacy Drop</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Privacy Notice */}
        <Card className="bg-zypherpunk-primary/10 border-zypherpunk-primary/30 p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-zypherpunk-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-zypherpunk-primary mb-1">
                Unlinkable Privacy Drops
              </p>
              <p className="text-xs text-zypherpunk-text-muted">
                Create a drop that recipients can claim without linking back to you.
                Perfect for rewards, refunds, bonuses, and private payouts.
              </p>
            </div>
          </div>
        </Card>

        {/* Amount */}
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zypherpunk-text-muted">
              Amount
            </label>
            <button
              onClick={handleMax}
              className="text-xs text-zypherpunk-accent hover:underline"
            >
              Max
            </button>
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text text-2xl"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zypherpunk-text-muted">
              Balance: {formatBalance(wallet.balance || 0)}
            </span>
          </div>
        </Card>

        {/* Expiration */}
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
          <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
            Expires In (Hours)
          </label>
          <Select value={expiresInHours} onValueChange={setExpiresInHours}>
            <SelectTrigger className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zypherpunk-surface border-zypherpunk-border">
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="6">6 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="48">48 hours</SelectItem>
              <SelectItem value="168">7 days</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Purpose */}
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
          <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
            Purpose
          </label>
          <Select value={purpose} onValueChange={(v) => setPurpose(v as typeof purpose)}>
            <SelectTrigger className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zypherpunk-surface border-zypherpunk-border">
              <SelectItem value="gift">Gift</SelectItem>
              <SelectItem value="reward">Reward</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
              <SelectItem value="reimbursement">Reimbursement</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Memo */}
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
          <label className="text-sm font-medium text-zypherpunk-text-muted mb-2 block">
            Memo (Optional)
          </label>
          <Input
            value={memo}
            onChange={(e) => setMemo(e.target.value.substring(0, 500))}
            placeholder="Private message (encrypted)"
            className="bg-zypherpunk-bg border-zypherpunk-border text-zypherpunk-text"
            maxLength={500}
          />
        </Card>

        {/* Password Protection */}
        <Card className="bg-zypherpunk-surface border-zypherpunk-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-sm font-medium text-zypherpunk-text-muted">
                Password Protection
              </label>
              <p className="text-xs text-zypherpunk-text-muted">
                Require password to claim (optional)
              </p>
            </div>
            <input
              type="checkbox"
              checked={usePassword}
              onChange={(e) => setUsePassword(e.target.checked)}
              className="w-4 h-4 rounded border-zypherpunk-border bg-zypherpunk-bg"
            />
          </div>
          {usePassword && (
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
          )}
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/50 p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!canCreate}
          className="w-full bg-zypherpunk-primary/20 hover:bg-zypherpunk-primary/30 border border-zypherpunk-primary/40 text-zypherpunk-primary font-semibold py-6 text-lg disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zypherpunk-primary"></div>
              <span>Creating Drop...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Create Privacy Drop</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

