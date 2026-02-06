import { useState } from 'react';
import { useGetBusinessWorkspace, useUpdatePortfolioData } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState, EmptyState } from '../components/system/QueryState';
import { Plus, Briefcase, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PortfolioForm from '../components/portfolios/PortfolioForm';
import type { PortfolioType, PortfolioData } from '../backend';

export default function PortfoliosPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();
  const updatePortfolio = useUpdatePortfolioData();
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading portfolios..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load portfolios" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const portfolios = workspace.portfolioData?.portfolioTypes || [];

  const handleCreate = async (portfolio: PortfolioType) => {
    const newPortfolioData: PortfolioData = {
      portfolioTypes: [...portfolios, portfolio],
    };
    await updatePortfolio.mutateAsync(newPortfolioData);
    setIsCreating(false);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    const newPortfolioData: PortfolioData = {
      portfolioTypes: portfolios.filter((_, i) => i !== index),
    };
    await updatePortfolio.mutateAsync(newPortfolioData);
  };

  if (portfolios.length === 0 && !isCreating) {
    return (
      <EmptyState
        title="No portfolios yet"
        description="Create your first portfolio to start managing your business projects and impact initiatives."
        action={
          <Button onClick={() => setIsCreating(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Portfolio
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolios</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business portfolios and impact initiatives
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Portfolio
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
              isSubmitting={updatePortfolio.isPending}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {portfolios.map((portfolio, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Briefcase className="h-8 w-8 text-primary" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(index)}
                  disabled={updatePortfolio.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4">{portfolio.name}</CardTitle>
              <CardDescription>{portfolio.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolio.impactPortfolioData && (
                <div className="space-y-2 mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Impact Scores</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Social:</span>{' '}
                      <span className="font-medium">{Number(portfolio.impactPortfolioData.socialImpactScore)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Environmental:</span>{' '}
                      <span className="font-medium">{Number(portfolio.impactPortfolioData.environmentalImpactScore)}</span>
                    </div>
                  </div>
                </div>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link to="/portfolios/$portfolioId" params={{ portfolioId: index.toString() }}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
