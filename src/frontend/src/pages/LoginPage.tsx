import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/caffeine-ai-logo.dim_512x512.png" 
              alt="Caffeine AI" 
              className="h-20 w-20 rounded-xl"
            />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome to Caffeine AI</CardTitle>
            <CardDescription className="mt-2">
              Your all-in-one business AI platform for portfolios, sales, marketing, and more.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full"
            size="lg"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Sign in to get started'}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Secure authentication powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
