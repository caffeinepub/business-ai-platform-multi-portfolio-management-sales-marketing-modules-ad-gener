import { useState } from 'react';
import { useGetBusinessWorkspace, useGenerateAd } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LoadingState, ErrorState } from '../components/system/QueryState';
import { Sparkles, Wand2 } from 'lucide-react';
import { generateAdVariations } from '../lib/adGeneration';
import { getSubscriptionStatus } from '../lib/subscription';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdGeneratorPage() {
  const { data: workspace, isLoading, error, refetch } = useGetBusinessWorkspace();
  const generateAd = useGenerateAd();
  
  const [productService, setProductService] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [channel, setChannel] = useState('social-media');
  const [variations, setVariations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load workspace" retry={refetch} />;
  }

  if (!workspace) {
    return <ErrorState message="Workspace not found" />;
  }

  const subscriptionStatus = workspace.subscription ? getSubscriptionStatus(workspace.subscription) : null;
  const canGenerate = !subscriptionStatus?.isExpired;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    try {
      const generated = generateAdVariations({
        productOrService: productService,
        audience,
        tone,
        channel,
      });
      setVariations(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (variation: string) => {
    if (!canGenerate) return;
    
    try {
      await generateAd.mutateAsync({
        adCopy: variation,
        productOrService: productService,
        audience,
        tone,
        channel,
      });
      alert('Advertisement saved successfully!');
    } catch (error) {
      console.error('Failed to save ad:', error);
      alert('Failed to save advertisement');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Ad Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate compelling advertisement copy powered by AI
        </p>
      </div>

      {!canGenerate && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Required</AlertTitle>
          <AlertDescription>
            Your trial has expired. Please activate a subscription to continue generating advertisements.
            <Button asChild variant="outline" size="sm" className="ml-4">
              <Link to="/subscription">Manage Subscription</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
            <CardDescription>
              Provide information about your product and target audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productService">Product or Service</Label>
              <Input
                id="productService"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="e.g., Cloud-based project management software"
                disabled={!canGenerate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., Small business owners, tech startups"
                disabled={!canGenerate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone} disabled={!canGenerate}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={channel} onValueChange={setChannel} disabled={!canGenerate}>
                <SelectTrigger id="channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="display">Display Ads</SelectItem>
                  <SelectItem value="search">Search Ads</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!productService || !audience || isGenerating || !canGenerate}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Variations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Variations</CardTitle>
            <CardDescription>
              {variations.length > 0 
                ? `${variations.length} variations generated`
                : 'Your ad variations will appear here'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {variations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fill in the details and click Generate to create ad variations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {variations.map((variation, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader>
                      <CardTitle className="text-base">Variation {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{variation}</p>
                      <Button
                        onClick={() => handleSave(variation)}
                        disabled={generateAd.isPending || !canGenerate}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        {generateAd.isPending ? 'Saving...' : 'Save to Campaign'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
