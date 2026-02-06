import { useGetBusinessWorkspace, useGetBusinessReport } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LoadingState, ErrorState, EmptyState } from '../components/system/QueryState';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import SalesItemsTable from '../components/sales/SalesItemsTable';
import SalesItemDialog from '../components/sales/SalesItemDialog';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import PageSection from '../components/layout/PageSection';

export default function ReportsPage() {
  const { data: workspace, isLoading: workspaceLoading, error: workspaceError, refetch: refetchWorkspace } = useGetBusinessWorkspace();
  const { data: report, isLoading: reportLoading, error: reportError, refetch: refetchReport } = useGetBusinessReport();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const isLoading = workspaceLoading || reportLoading;
  const error = workspaceError || reportError;

  if (isLoading) {
    return <LoadingState message="Loading business reports..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load reports" retry={() => { refetchWorkspace(); refetchReport(); }} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const salesItems = workspace.salesData?.items || [];
  const hasData = salesItems.length > 0;

  const annualRevenue = report?.annualRevenue || 0;
  const gainsLosses = report?.gainsLosses || 0;
  const profitLoss = report?.profitLoss || 0;

  return (
    <div className="space-y-8">
      <PageSection
        title="Business Reports"
        subtitle="Track your revenue, expenses, and overall business performance"
        action={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Sales Item
          </Button>
        }
      />

      {/* Report Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${annualRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasData ? 'All-time revenue' : 'No sales data yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gains/Losses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${gainsLosses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total expenses tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${profitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Items Management */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Items</CardTitle>
          <CardDescription>
            Manage the sales entries that power your business reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <SalesItemsTable items={salesItems} />
          ) : (
            <EmptyState
              title="No sales items yet"
              description="Add your first sales item to start tracking revenue and generating reports"
              action={
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  Add Sales Item
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <SalesItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="create"
      />
    </div>
  );
}
