"use client";

import Link from "next/link";
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import { useState, useRef, useEffect } from "react";

interface AccountCardProps {
  id: string;
  name: string;
  nickname: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  hidden: boolean;
  institution: string;
  institutionLogo: string | null;
  url?: string | null;
  balance: {
    current: number;
    available: number | null;
    limit: number | null;
  };
  onBalanceUpdate?: () => void;
  isMasked?: boolean;
  onToggleMask?: () => void;
}

export function AccountCard({
  id,
  name,
  nickname,
  type,
  subtype,
  mask,
  hidden,
  balance,
  institution,
  institutionLogo,
  url,
  onBalanceUpdate,
  isMasked = false,
  onToggleMask,
}: AccountCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChange, setLastChange] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(hidden);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname || "");
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [newBalance, setNewBalance] = useState(balance.current.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const isManual = institution === "Manual Account";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isManual) {
      setShowBalanceDialog(true);
      return;
    }

    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/accounts/${id}/refresh`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh account");
      }

      const data = await response.json();
      setLastChange(data.change);

      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
    } catch (error) {
      console.error("Error refreshing account:", error);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setLastChange(null), 5000);
    }
  };

  const handleUpdateManualBalance = async (e: React.FormEvent) => {
    console.log("handleUpdateManualBalance");
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log("Updating manual balance:", {
        accountId: id,
        newBalance: parseFloat(newBalance),
        isManual,
      });

      setIsRefreshing(true);
      const response = await fetch(`/api/accounts/manual`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: id,
          balance: parseFloat(newBalance),
        }),
      });

      console.log("Update response:", {
        status: response.status,
        ok: response.ok,
        data: await response.clone().json(),
      });

      if (!response.ok) {
        throw new Error("Failed to update balance");
      }

      setShowBalanceDialog(false);
      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
    } catch (error) {
      console.error("Error updating manual account balance:", error);
      alert("Failed to update balance. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/accounts/${id}/toggle-visibility`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle account visibility");
      }

      const data = await response.json();
      setIsHidden(data.hidden);

      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
    } catch (error) {
      console.error("Error toggling account visibility:", error);
    }
  };

  const handleStartEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveNickname = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/accounts/${id}/update-nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: newNickname.trim() || null }),
      });

      if (!response.ok) {
        throw new Error("Failed to update nickname");
      }

      if (onBalanceUpdate) {
        onBalanceUpdate();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  const handleCancelEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewNickname(nickname || "");
    setIsEditing(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSaveNickname(e as unknown as React.MouseEvent);
    }
  };

  const isNegative = balance.current < 0;
  const isCredit = type.toLowerCase() === "credit";
  const utilization =
    isCredit && balance.limit
      ? (Math.abs(balance.current) / balance.limit) * 100
      : null;

  const formatBalance = (amount: number | null) => {
    if (amount === null) return "-";
    return isMasked ? "••••••" : `$${amount.toFixed(2)}`;
  };

  return (
    <Link
      href={`/accounts/${id}`}
      className="block transition-transform hover:scale-102"
    >
      <div className="relative p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Header with Logo, Name, and Buttons */}
        <div className="flex items-start justify-between mb-2 pr-16">
          <div className="flex items-center gap-2 min-w-0">
            {institutionLogo && (
              <img
                src={institutionLogo}
                alt={institution}
                className="w-6 h-6 flex-shrink-0 object-contain"
              />
            )}
            <div className="min-w-0">
              {isEditing ? (
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.preventDefault()}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-lg font-semibold px-2 py-1 border rounded w-full"
                    placeholder={name}
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="p-1 text-green-600 hover:text-green-700"
                    title="Save nickname"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Cancel"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold truncate">
                        {nickname || name}
                      </h3>
                      {url && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Open reference URL"
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {nickname && (
                      <p className="text-sm text-gray-500 truncate">{name}</p>
                    )}
                  </div>
                  <button
                    onClick={handleStartEditing}
                    className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                    title="Edit nickname"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-600 truncate">
                {type} {subtype && `- ${subtype}`}
              </p>
              {mask && (
                <p className="text-sm text-gray-500 truncate">****{mask}</p>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleToggleVisibility}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              title={isHidden ? "Show account" : "Hide account"}
            >
              {isHidden ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh balance"
            >
              <ArrowPathIcon
                className={`w-5 h-5 text-gray-500 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Balance Information */}
        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Current Balance</span>
            <div className="text-right">
              <p
                className={`text-xl font-bold ${
                  isNegative ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formatBalance(balance.current)}
              </p>
              {lastChange !== null && !isMasked && (
                <p
                  className={`text-sm ${
                    lastChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {lastChange >= 0 ? "+" : ""}$
                  {lastChange.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
          </div>

          {balance.available !== null && (
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm text-gray-600">Available</span>
              <p className="text-sm text-gray-900">
                {formatBalance(balance.available)}
              </p>
            </div>
          )}
        </div>

        {/* Credit Card Utilization */}
        {isCredit && balance.limit && !isMasked && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Credit Used</span>
              <span>{utilization?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  utilization && utilization > 70
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(utilization || 0, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Limit: ${balance.limit.toLocaleString()}
            </p>
          </div>
        )}

        {showBalanceDialog && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <h2 className="text-xl font-semibold mb-4">Update Balance</h2>
              <form
                onSubmit={handleUpdateManualBalance}
                className="space-y-4"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Balance
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {url && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reference URL</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span className="text-sm">Open URL</span>
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBalanceDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateManualBalance}
                    disabled={isRefreshing}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isRefreshing ? "Updating..." : "Update Balance"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
