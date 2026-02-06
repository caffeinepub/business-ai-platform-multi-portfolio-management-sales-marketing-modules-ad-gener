import type { Subscription, SubscriptionPlan } from '../backend';

export interface SubscriptionStatus {
  label: string;
  isExpired: boolean;
  daysRemaining: number | null;
  canCancel: boolean;
}

export function getSubscriptionStatus(subscription: Subscription): SubscriptionStatus {
  const now = Date.now() * 1000000; // Convert to nanoseconds
  const startDate = Number(subscription.startDate);
  const endDate = subscription.endDate ? Number(subscription.endDate) : null;
  
  let label = 'Unknown';
  let isExpired = false;
  let daysRemaining: number | null = null;
  let canCancel = false;

  switch (subscription.plan) {
    case 'freeTrial':
      label = 'Free Trial';
      if (endDate) {
        const remaining = endDate - now;
        daysRemaining = Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000000000)));
        isExpired = remaining <= 0;
      }
      canCancel = !isExpired;
      break;
    case 'monthly':
      label = 'Monthly';
      canCancel = true;
      break;
    case 'yearly':
      label = 'Yearly';
      canCancel = true;
      break;
    case 'canceled':
      label = 'Canceled';
      isExpired = true;
      break;
  }

  return {
    label,
    isExpired,
    daysRemaining,
    canCancel,
  };
}
