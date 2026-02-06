import { useState } from 'react';
import { useGetBusinessWorkspace } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingState, ErrorState, EmptyState } from '../components/system/QueryState';
import { Plus, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

export default function SalesPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (isLoading) {
    return <LoadingState message="Loading sales data..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load sales data" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const salesItems = workspace.salesData?.items || [];
  const filteredItems = statusFilter === 'all' 
    ? salesItems 
    : salesItems.filter(item => item.status === statusFilter);

  if (salesItems.length === 0) {
    return (
      <EmptyState
        title="No sales items yet"
        description="Start tracking your sales pipeline by creating your first sales item."
        action={
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Sales Item
          </Button>
        }
      />
    );
  }

  const statuses = Array.from(new Set(salesItems.map(item => item.status)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sales Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Pipeline</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sales items match the selected filter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
