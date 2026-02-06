import { useGetBusinessWorkspace } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState, EmptyState } from '../components/system/QueryState';
import { Plus, Megaphone } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function MarketingPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();

  if (isLoading) {
    return <LoadingState message="Loading campaigns..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load campaigns" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const campaigns = workspace.marketingData?.campaigns || [];

  if (campaigns.length === 0) {
    return (
      <EmptyState
        title="No campaigns yet"
        description="Create your first marketing campaign to start organizing your advertisements and marketing efforts."
        action={
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Campaign
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Manage your marketing campaigns and advertisements
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Megaphone className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>
                {campaign.advertisements.length} advertisement{campaign.advertisements.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Start:</span>{' '}
                  {new Date(Number(campaign.startDate) / 1000000).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">End:</span>{' '}
                  {new Date(Number(campaign.endDate) / 1000000).toLocaleDateString()}
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/marketing/$campaignId" params={{ campaignId: index.toString() }}>
                  View Campaign
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
