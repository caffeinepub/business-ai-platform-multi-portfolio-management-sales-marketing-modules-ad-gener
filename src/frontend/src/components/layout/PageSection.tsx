import { ReactNode } from 'react';

interface PageSectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageSection({ title, subtitle, action }: PageSectionProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
