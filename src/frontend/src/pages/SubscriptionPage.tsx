import { useGetBusinessWorkspace, useAssignSubscriptionPlan } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { Check, CreditCard } from 'lucide-react';
import { getSubscriptionStatus } from '../lib/subscription';
import { Badge } from '../components/ui/badge';
import { SubscriptionPlan } from '../backend';

export default function SubscriptionPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();
  const assignPlan = useAssignSubscriptionPlan();

  if (isLoading) {
    return <LoadingState message="Loading subscription..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load subscription" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const subscriptionStatus = workspace.subscription ? getSubscriptionStatus(workspace.subscription) : null;

  const handleStartTrial = async () => {
    try {
      await assignPlan.mutateAsync(SubscriptionPlan.freeTrial);
    } catch (error) {
      console.error('Failed to start trial:', error);
      alert('Failed to start trial');
    }
  };

  const handleActivatePlan = async (plan: SubscriptionPlan) => {
    try {
      await assignPlan.mutateAsync(plan);
    } catch (error) {
      console.error('Failed to activate plan:', error);
      alert('Failed to activate plan');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    try {
      await assignPlan.mutateAsync(SubscriptionPlan.canceled);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing
        </p>
      </div>

      {subscriptionStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Status</CardTitle>
              <Badge variant={subscriptionStatus.isExpired ? 'destructive' : 'default'}>
                {subscriptionStatus.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionStatus.daysRemaining !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-2xl font-bold">{subscriptionStatus.daysRemaining}</p>
              </div>
            )}
            {subscriptionStatus.canCancel && (
              <Button
                onClick={handleCancel}
                variant="destructive"
                disabled={assignPlan.isPending}
              >
                Cancel Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!subscriptionStatus && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Start Your Free Trial</CardTitle>
            <CardDescription>
              Try Caffeine AI free for 7 days. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartTrial} disabled={assignPlan.isPending} size="lg">
              Start 7-Day Free Trial
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CreditCard className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Monthly Plan</CardTitle>
            <CardDescription>Perfect for growing businesses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-4xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Unlimited portfolios</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Sales & marketing tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">AI ad generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button
              onClick={() => handleActivatePlan(SubscriptionPlan.monthly)}
              disabled={assignPlan.isPending}
              className="w-full"
              variant={subscriptionStatus?.label === 'Monthly' ? 'outline' : 'default'}
            >
              {subscriptionStatus?.label === 'Monthly' ? 'Current Plan' : 'Activate Monthly'}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CreditCard className="h-8 w-8 text-primary" />
              <Badge>Save 20%</Badge>
            </div>
            <CardTitle>Yearly Plan</CardTitle>
            <CardDescription>Best value for committed teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <span className="text-4xl font-bold">$470</span>
              <span className="text-muted-foreground">/year</span>
              <p className="text-sm text-muted-foreground mt-1">
                Save $118 compared to monthly
              </p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">20% discount</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Annual strategy review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Dedicated account manager</span>
              </li>
            </ul>
            <Button
              onClick={() => handleActivatePlan(SubscriptionPlan.yearly)}
              disabled={assignPlan.isPending}
              className="w-full"
              variant={subscriptionStatus?.label === 'Yearly' ? 'outline' : 'default'}
            >
              {subscriptionStatus?.label === 'Yearly' ? 'Current Plan' : 'Activate Yearly'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
