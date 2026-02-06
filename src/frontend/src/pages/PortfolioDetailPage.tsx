import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBusinessWorkspace, useUpdatePortfolioData } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import PortfolioForm from '../components/portfolios/PortfolioForm';
import type { PortfolioType, PortfolioData } from '../backend';

export default function PortfolioDetailPage() {
  const { portfolioId } = useParams({ from: '/portfolios/$portfolioId' });
  const navigate = useNavigate();
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();
  const updatePortfolio = useUpdatePortfolioData();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading portfolio..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load portfolio" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const portfolios = workspace.portfolioData?.portfolioTypes || [];
  const index = parseInt(portfolioId);
  const portfolio = portfolios[index];

  if (!portfolio) {
    return <ErrorState message="Portfolio not found" />;
  }

  const handleUpdate = async (updatedPortfolio: PortfolioType) => {
    const newPortfolioData: PortfolioData = {
      portfolioTypes: portfolios.map((p, i) => (i === index ? updatedPortfolio : p)),
    };
    await updatePortfolio.mutateAsync(newPortfolioData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/portfolios' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolios
        </Button>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Portfolio' : portfolio.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <PortfolioForm
              initialData={portfolio}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isSubmitting={updatePortfolio.isPending}
            />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-base">{portfolio.description}</p>
              </div>

              {portfolio.impactPortfolioData && (
                <div className="space-y-4 p-6 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold">Impact Portfolio Data</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Social Impact Score</p>
                      <p className="text-2xl font-bold">{Number(portfolio.impactPortfolioData.socialImpactScore)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Environmental Impact Score</p>
                      <p className="text-2xl font-bold">{Number(portfolio.impactPortfolioData.environmentalImpactScore)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Impact Details</p>
                    <p className="text-base">{portfolio.impactPortfolioData.impactDetails}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
