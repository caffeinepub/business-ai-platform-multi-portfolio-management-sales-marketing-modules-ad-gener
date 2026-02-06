import { Badge } from '../ui/badge';
import { SubscriptionStatus } from '../../backend';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
}

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const getVariantAndLabel = () => {
    switch (status) {
      case 'noSubscription':
        return { variant: 'secondary' as const, label: 'No Subscription' };
      case 'activeTrial':
        return { variant: 'default' as const, label: 'Active Trial' };
      case 'expiredTrial':
        return { variant: 'destructive' as const, label: 'Expired Trial' };
      case 'paid':
        return { variant: 'default' as const, label: 'Paid' };
      case 'canceled':
        return { variant: 'outline' as const, label: 'Canceled' };
      default:
        return { variant: 'secondary' as const, label: 'Unknown' };
    }
  };

  const { variant, label } = getVariantAndLabel();

  return (
    <Badge variant={variant} className="font-medium">
      {label}
    </Badge>
  );
}
