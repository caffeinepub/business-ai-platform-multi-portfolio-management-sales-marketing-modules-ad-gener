import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Copy, Check } from 'lucide-react';
import type { BusinessWorkspace, SalesItem, Campaign } from '../../backend';
import { generateMessageTemplate } from '../../lib/messageTemplates';

interface MessageTemplatesProps {
  workspace: BusinessWorkspace;
}

export default function MessageTemplates({ workspace }: MessageTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'sales-followup' | 'invoice-reminder' | 'customer-winback'>('sales-followup');
  const [selectedSalesItem, setSelectedSalesItem] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const salesItems = workspace.salesData?.items || [];
  const campaigns = workspace.marketingData?.campaigns || [];

  const selectedSalesItemData = salesItems.find(item => item.id.toString() === selectedSalesItem);
  const selectedCampaignData = campaigns.find(campaign => campaign.name === selectedCampaign);

  const templateText = generateMessageTemplate(
    selectedTemplate,
    workspace.businessName,
    selectedSalesItemData,
    selectedCampaignData
  );

  const handleCopy = async (template: string) => {
    try {
      await navigator.clipboard.writeText(templateText);
      setCopiedTemplate(template);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Templates</CardTitle>
        <CardDescription>
          Copy and personalize these templates for your business communications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Type</label>
            <Select value={selectedTemplate} onValueChange={(value: any) => setSelectedTemplate(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales-followup">Sales Follow-up</SelectItem>
                <SelectItem value="invoice-reminder">Invoice Reminder</SelectItem>
                <SelectItem value="customer-winback">Customer Win-back</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {salesItems.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sales Item (Optional)</label>
              <Select value={selectedSalesItem} onValueChange={setSelectedSalesItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {salesItems.map((item) => (
                    <SelectItem key={item.id.toString()} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {campaigns.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign (Optional)</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.name} value={campaign.name}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Template Preview</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(selectedTemplate)}
            >
              {copiedTemplate === selectedTemplate ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={templateText}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          These templates are for in-app use only. Copy and paste them into your preferred communication tool.
        </p>
      </CardContent>
    </Card>
  );
}
