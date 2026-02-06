import type { BusinessWorkspace } from '../backend';
import type { SubscriptionStatus } from './subscription';

export interface AssistantIssue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  explanation: string;
  checklist: Array<{
    action: string;
    route?: string;
  }>;
}

export function analyzeWorkspace(
  workspace: BusinessWorkspace,
  subscriptionStatus: SubscriptionStatus | null
): AssistantIssue[] {
  const issues: AssistantIssue[] = [];

  // Check subscription status
  if (subscriptionStatus?.isExpired) {
    issues.push({
      severity: 'critical',
      title: 'Subscription Expired',
      explanation: 'Your subscription has expired. Upgrade to continue using all features.',
      checklist: [
        {
          action: 'Review available subscription plans',
          route: '/subscription',
        },
        {
          action: 'Choose a plan that fits your business needs',
          route: '/subscription',
        },
        {
          action: 'Activate your subscription to restore full access',
          route: '/subscription',
        },
      ],
    });
  } else if (subscriptionStatus && subscriptionStatus.daysRemaining !== null && subscriptionStatus.daysRemaining <= 2) {
    issues.push({
      severity: 'warning',
      title: 'Trial Expiring Soon',
      explanation: `Your free trial expires in ${subscriptionStatus.daysRemaining} day${subscriptionStatus.daysRemaining !== 1 ? 's' : ''}. Upgrade to avoid interruption.`,
      checklist: [
        {
          action: 'Review your trial usage and benefits',
          route: '/subscription',
        },
        {
          action: 'Select a paid plan to continue after trial',
          route: '/subscription',
        },
      ],
    });
  }

  // Check for sales data
  const salesItems = workspace.salesData?.items || [];
  if (salesItems.length === 0) {
    issues.push({
      severity: 'warning',
      title: 'No Sales Data Tracked',
      explanation: 'Start tracking sales to generate revenue reports and business insights.',
      checklist: [
        {
          action: 'Navigate to the Reports page',
          route: '/reports',
        },
        {
          action: 'Add your first sales item with name, status, and amount',
          route: '/reports',
        },
        {
          action: 'Review your generated business report',
          route: '/reports',
        },
      ],
    });
  }

  // Check for portfolios
  const portfolios = workspace.portfolioData?.portfolioTypes || [];
  if (portfolios.length === 0) {
    issues.push({
      severity: 'info',
      title: 'No Portfolios Created',
      explanation: 'Create portfolios to organize and showcase your business offerings.',
      checklist: [
        {
          action: 'Go to the Portfolios page',
          route: '/portfolios',
        },
        {
          action: 'Create your first portfolio with a name and description',
          route: '/portfolios',
        },
        {
          action: 'Add impact data if applicable to your business',
          route: '/portfolios',
        },
      ],
    });
  }

  // Check for marketing campaigns
  const campaigns = workspace.marketingData?.campaigns || [];
  if (campaigns.length === 0) {
    issues.push({
      severity: 'info',
      title: 'No Marketing Campaigns',
      explanation: 'Generate AI-powered advertisements to promote your business.',
      checklist: [
        {
          action: 'Visit the Ad Generator',
          route: '/ad-generator',
        },
        {
          action: 'Enter your product/service details and target audience',
          route: '/ad-generator',
        },
        {
          action: 'Generate and save ad variations',
          route: '/ad-generator',
        },
        {
          action: 'Review your campaigns in Marketing',
          route: '/marketing',
        },
      ],
    });
  }

  return issues;
}
