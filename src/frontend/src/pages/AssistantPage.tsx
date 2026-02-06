import { useGetBusinessWorkspace } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { getSubscriptionStatus } from '../lib/subscription';
import { analyzeWorkspace } from '../lib/assistantInsights';
import PageSection from '../components/layout/PageSection';
import MessageTemplates from '../components/assistant/MessageTemplates';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function AssistantPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();

  if (isLoading) {
    return <LoadingState message="Loading AI Assistant..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load assistant" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const subscriptionStatus = workspace.subscription ? getSubscriptionStatus(workspace.subscription) : null;
  const issues = analyzeWorkspace(workspace, subscriptionStatus);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <PageSection
        title="AI Business Assistant"
        subtitle="Get insights, guidance, and actionable recommendations to grow your business"
      />

      {/* All Good State */}
      {issues.length === 0 && (
        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">All Systems Go!</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Your business is running smoothly. Here's what you can do next:
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Generate More Ads</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/ad-generator">
                      Go to Ad Generator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add Sales Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/reports">
                      Go to Reports
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Review Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/reports">
                      View Reports
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      {issues.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Detected Issues</h2>
          {issues.map((issue, index) => (
            <Card key={index} className={issue.severity === 'critical' ? 'border-destructive' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        {getSeverityBadge(issue.severity)}
                      </div>
                      <CardDescription>{issue.explanation}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="checklist" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      View Action Steps ({issue.checklist.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        {issue.checklist.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mt-0.5">
                              {itemIndex + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">{item.action}</p>
                              {item.route && (
                                <Button asChild size="sm" variant="outline">
                                  <Link to={item.route}>
                                    Go to {item.route.split('/')[1] || 'page'}
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Templates */}
      <MessageTemplates workspace={workspace} />
    </div>
  );
}
