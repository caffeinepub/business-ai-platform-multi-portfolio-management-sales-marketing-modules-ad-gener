import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBusinessWorkspace } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function CampaignDetailPage() {
  const { campaignId } = useParams({ from: '/marketing/$campaignId' });
  const navigate = useNavigate();
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();

  if (isLoading) {
    return <LoadingState message="Loading campaign..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load campaign" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const campaigns = workspace.marketingData?.campaigns || [];
  const index = parseInt(campaignId);
  const campaign = campaigns[index];

  if (!campaign) {
    return <ErrorState message="Campaign not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/marketing' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <div>
              <span className="font-medium">Start:</span>{' '}
              {new Date(Number(campaign.startDate) / 1000000).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End:</span>{' '}
              {new Date(Number(campaign.endDate) / 1000000).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Advertisements</h2>
          <Badge variant="secondary">
            {campaign.advertisements.length} ad{campaign.advertisements.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {campaign.advertisements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No advertisements in this campaign yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaign.advertisements.map((ad, adIndex) => (
              <Card key={adIndex}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Advertisement {adIndex + 1}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{ad.channel}</Badge>
                        <Badge variant="outline">{ad.tone}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ad Copy</p>
                    <p className="text-base">{ad.adCopy}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product/Service:</span>{' '}
                      <span className="font-medium">{ad.productOrService}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Audience:</span>{' '}
                      <span className="font-medium">{ad.audience}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(Number(ad.createdAt) / 1000000).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
