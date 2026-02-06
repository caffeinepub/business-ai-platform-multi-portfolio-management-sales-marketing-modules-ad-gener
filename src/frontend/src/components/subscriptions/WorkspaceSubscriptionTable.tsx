import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';
import type { SubscriptionWorkspaceDetails, SubscriptionPlan } from '../../backend';

interface WorkspaceSubscriptionTableProps {
  workspaces: SubscriptionWorkspaceDetails[];
}

function formatDate(time: bigint | undefined): string {
  if (!time) return 'None';
  const date = new Date(Number(time) / 1000000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatPlan(plan: SubscriptionPlan): string {
  switch (plan) {
    case 'freeTrial':
      return 'Free Trial';
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    case 'canceled':
      return 'Canceled';
    default:
      return 'None';
  }
}

function truncatePrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-6)}`;
}

export function WorkspaceSubscriptionTable({ workspaces }: WorkspaceSubscriptionTableProps) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Canceled At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces.map((workspace, index) => (
            <TableRow key={`${workspace.owner.toString()}-${index}`}>
              <TableCell className="font-medium">{workspace.businessName}</TableCell>
              <TableCell className="font-mono text-xs" title={workspace.owner.toString()}>
                {truncatePrincipal(workspace.owner.toString())}
              </TableCell>
              <TableCell>{formatPlan(workspace.plan)}</TableCell>
              <TableCell>
                <SubscriptionStatusBadge status={workspace.status} />
              </TableCell>
              <TableCell>{formatDate(workspace.startDate)}</TableCell>
              <TableCell>{formatDate(workspace.endDate)}</TableCell>
              <TableCell>{formatDate(workspace.canceledAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
