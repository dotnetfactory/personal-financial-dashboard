"use client";

import Link from "next/link";
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

interface AccountCardProps {
  id: string;
  name: string;
  type: string;
  subtype: string | null;
  mask: string | null;
  hidden: boolean;
  institution: string;
  institutionLogo: string | null;
  balance: {
    current: number;
    available: number | null;
    limit: number | null;
  };
  onBalanceUpdate?: () => void;
}

export function AccountCard({
  id,
  name,
  type,
  subtype,
  mask,
  hidden,
  balance,
  institution,
  institutionLogo,
  onBalanceUpdate,
}: AccountCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChange, setLastChange] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(hidden);

  const isNegative = balance.current < 0;
  const isCredit = type.toLowerCase() === "credit";
  const utilization =
    isCredit && balance.limit
      ? (Math.abs(balance.current) / balance.limit) * 100
      : null;

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
              <h3 className="text-lg font-semibold truncate">{name}</h3>
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
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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
                $
                {Math.abs(balance.current).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {lastChange !== null && (
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
                $
                {balance.available.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}
        </div>

        {/* Credit Card Utilization */}
        {isCredit && balance.limit && (
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
      </div>
    </Link>
  );
}
