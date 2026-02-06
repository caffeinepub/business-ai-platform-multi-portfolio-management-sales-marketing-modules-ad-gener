import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LoadingState, ErrorState, EmptyState } from '../components/system/QueryState';
import { useGetSubscriptionAnalytics } from '../hooks/useQueries';
import { Users, TrendingUp, Clock, XCircle, UserX, Calendar, Percent } from 'lucide-react';
import { WorkspaceSubscriptionTable } from '../components/subscriptions/WorkspaceSubscriptionTable';
import { WorkspaceSubscriptionFilters, FilterType } from '../components/subscriptions/WorkspaceSubscriptionFilters';
import type { SubscriptionWorkspaceDetails } from '../backend';

export default function SubscriptionAnalyticsPage() {
  const { data: analytics, isLoading, error, refetch } = useGetSubscriptionAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredWorkspaces = useMemo(() => {
    if (!analytics?.subscriptionDetails) return [];

    let filtered = analytics.subscriptionDetails;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((workspace) =>
        workspace.businessName.toLowerCase().includes(query)
      );
    }

    // Apply status/plan filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((workspace) => {
        switch (activeFilter) {
          case 'noSubscription':
            return workspace.status === 'noSubscription';
          case 'activeTrial':
            return workspace.status === 'activeTrial';
          case 'expiredTrial':
            return workspace.status === 'expiredTrial';
          case 'monthly':
            return workspace.plan === 'monthly';
          case 'yearly':
            return workspace.plan === 'yearly';
          case 'canceled':
            return workspace.status === 'canceled';
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [analytics?.subscriptionDetails, searchQuery, activeFilter]);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading subscription analytics..." />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics';
    const isUnauthorized = errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins');
    
    if (isUnauthorized) {
      return (
        <div className="p-8">
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-warning" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                This page is only accessible to administrators. Please contact your system administrator if you believe you should have access.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div className="p-8">
        <ErrorState
          title="Failed to Load Analytics"
          message={errorMessage}
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const totalWorkspaces = Number(analytics.totalWorkspaces);
  const freeTrialCount = Number(analytics.freeTrialCount);
  const expiringFreeTrialCount = Number(analytics.expiringFreeTrialCount);
  const expiredFreeTrialCount = Number(analytics.expiredFreeTrialCount);
  const monthlyCount = Number(analytics.monthlyCount);
  const yearlyCount = Number(analytics.yearlyCount);
  const canceledCount = Number(analytics.canceledCount);
  const emptySubscriptionsCount = Number(analytics.emptySubscriptionsCount);
  const monthlyPercent = analytics.monthlyPercent.toFixed(1);
  const yearlyPercent = analytics.yearlyPercent.toFixed(1);

  const paidSubscriptions = monthlyCount + yearlyCount;
  const conversionRate = totalWorkspaces > 0 ? ((paidSubscriptions / totalWorkspaces) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Analytics</h1>
        <p className="text-muted-foreground">
          Overview of workspace subscriptions and plan distribution
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkspaces}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered workspaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trials Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringFreeTrialCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Within 48 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canceledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Canceled subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Breakdown of subscription plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Monthly</span>
              </div>
              <span className="text-sm font-bold">{monthlyCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Yearly</span>
              </div>
              <span className="text-sm font-bold">{yearlyCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Free Trial (All)</span>
              </div>
              <span className="text-sm font-bold">{freeTrialCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Canceled</span>
              </div>
              <span className="text-sm font-bold">{canceledCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                <span className="text-sm font-medium">No Subscription</span>
              </div>
              <span className="text-sm font-bold">{emptySubscriptionsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Free Trial Status</CardTitle>
            <CardDescription>Active and expired trial breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Active Trials</span>
              </div>
              <span className="text-sm font-bold">{expiringFreeTrialCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Expired Trials</span>
              </div>
              <span className="text-sm font-bold">{expiredFreeTrialCount}</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Free Trials</span>
                <span className="text-sm font-bold">{freeTrialCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Percentages</CardTitle>
            <CardDescription>Distribution of paid plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Monthly</span>
              </div>
              <span className="text-sm font-bold">{monthlyPercent}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Yearly</span>
              </div>
              <span className="text-sm font-bold">{yearlyPercent}%</span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Paid</span>
                <span className="text-sm font-bold">{paidSubscriptions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Subscription Details</CardTitle>
          <CardDescription>
            Detailed breakdown of all workspace subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorkspaceSubscriptionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {filteredWorkspaces.length === 0 ? (
            <EmptyState
              title="No workspaces found"
              description={
                searchQuery || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No workspace subscription data available.'
              }
            />
          ) : (
            <WorkspaceSubscriptionTable workspaces={filteredWorkspaces} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
