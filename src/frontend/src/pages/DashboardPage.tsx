import { Link } from '@tanstack/react-router';
import { useGetBusinessWorkspace } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { Briefcase, TrendingUp, Megaphone, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { getSubscriptionStatus } from '../lib/subscription';

export default function DashboardPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();

  if (isLoading) {
    return <LoadingState message="Loading your workspace..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load workspace" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const subscriptionStatus = workspace.subscription ? getSubscriptionStatus(workspace.subscription) : null;
  const portfolioCount = workspace.portfolioData?.portfolioTypes.length || 0;
  const salesCount = workspace.salesData?.items.length || 0;
  const campaignCount = workspace.marketingData?.campaigns.length || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border">
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {workspace.businessName}
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your portfolios, track sales, run marketing campaigns, and generate AI-powered advertisements—all in one place.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link to="/assistant">
                  <Bot className="mr-2 h-5 w-5" />
                  AI Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ad-generator">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Ads
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/assets/generated/caffeine-ai-hero.dim_1600x900.png"
              alt="Business Dashboard"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {subscriptionStatus && (
        <Card className={subscriptionStatus.isExpired ? 'border-destructive' : ''}>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>
              {subscriptionStatus.label} {subscriptionStatus.daysRemaining !== null && `• ${subscriptionStatus.daysRemaining} days remaining`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant={subscriptionStatus.isExpired ? 'default' : 'outline'}>
              <Link to="/subscription">
                Manage Subscription
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active portfolio{portfolioCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tracked item{salesCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active campaign{campaignCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Ads</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workspace.marketingData?.campaigns.reduce((acc, c) => acc + c.advertisements.length, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Generated advertisement{workspace.marketingData?.campaigns.reduce((acc, c) => acc + c.advertisements.length, 0) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Bot className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Get personalized insights and guidance to grow your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/assistant">Open Assistant</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <TrendingUp className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Track Sales</CardTitle>
            <CardDescription>
              Monitor your sales pipeline and manage opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/sales">Go to Sales</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Megaphone className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Marketing Campaigns</CardTitle>
            <CardDescription>
              Create campaigns and manage your marketing efforts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/marketing">Go to Marketing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
