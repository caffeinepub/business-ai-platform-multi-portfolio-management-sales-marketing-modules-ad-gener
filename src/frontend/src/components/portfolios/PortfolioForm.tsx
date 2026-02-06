import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import type { PortfolioType } from '../../backend';

interface PortfolioFormProps {
  initialData?: PortfolioType;
  onSubmit: (portfolio: PortfolioType) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function PortfolioForm({ initialData, onSubmit, onCancel, isSubmitting }: PortfolioFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isImpact, setIsImpact] = useState(!!initialData?.impactPortfolioData);
  const [socialScore, setSocialScore] = useState(
    initialData?.impactPortfolioData ? Number(initialData.impactPortfolioData.socialImpactScore) : 0
  );
  const [environmentalScore, setEnvironmentalScore] = useState(
    initialData?.impactPortfolioData ? Number(initialData.impactPortfolioData.environmentalImpactScore) : 0
  );
  const [impactDetails, setImpactDetails] = useState(
    initialData?.impactPortfolioData?.impactDetails || ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const portfolio: PortfolioType = {
      name: name.trim(),
      description: description.trim(),
      impactPortfolioData: isImpact
        ? {
            socialImpactScore: BigInt(socialScore),
            environmentalImpactScore: BigInt(environmentalScore),
            impactDetails: impactDetails.trim(),
          }
        : undefined,
    };

    await onSubmit(portfolio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Portfolio Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Product Portfolio, Impact Initiative"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this portfolio..."
          rows={3}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isImpact"
          checked={isImpact}
          onCheckedChange={(checked) => setIsImpact(checked as boolean)}
        />
        <Label htmlFor="isImpact" className="cursor-pointer">
          This is an Impact Portfolio
        </Label>
      </div>

      {isImpact && (
        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
          <h4 className="font-medium">Impact Portfolio Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="socialScore">Social Impact Score (0-100)</Label>
            <Input
              id="socialScore"
              type="number"
              min="0"
              max="100"
              value={socialScore}
              onChange={(e) => setSocialScore(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="environmentalScore">Environmental Impact Score (0-100)</Label>
            <Input
              id="environmentalScore"
              type="number"
              min="0"
              max="100"
              value={environmentalScore}
              onChange={(e) => setEnvironmentalScore(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactDetails">Impact Details</Label>
            <Textarea
              id="impactDetails"
              value={impactDetails}
              onChange={(e) => setImpactDetails(e.target.value)}
              placeholder="Describe the social and environmental impact..."
              rows={3}
              required
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Portfolio'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
