import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

export type FilterType = 'all' | 'noSubscription' | 'activeTrial' | 'expiredTrial' | 'monthly' | 'yearly' | 'canceled';

interface WorkspaceSubscriptionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function WorkspaceSubscriptionFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: WorkspaceSubscriptionFiltersProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'noSubscription', label: 'No Subscription' },
    { value: 'activeTrial', label: 'Active Trial' },
    { value: 'expiredTrial', label: 'Expired Trial' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'canceled', label: 'Canceled' },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by business name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
