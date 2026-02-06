import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import DashboardPage from './pages/DashboardPage';
import PortfoliosPage from './pages/PortfoliosPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import SalesPage from './pages/SalesPage';
import MarketingPage from './pages/MarketingPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import AdGeneratorPage from './pages/AdGeneratorPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionAnalyticsPage from './pages/SubscriptionAnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import AssistantPage from './pages/AssistantPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <ProfileSetupModal />
      <AuthenticatedLayout>
        <Outlet />
      </AuthenticatedLayout>
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const portfoliosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolios',
  component: PortfoliosPage,
});

const portfolioDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolios/$portfolioId',
  component: PortfolioDetailPage,
});

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: SalesPage,
});

const marketingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketing',
  component: MarketingPage,
});

const campaignDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketing/$campaignId',
  component: CampaignDetailPage,
});

const adGeneratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ad-generator',
  component: AdGeneratorPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: SubscriptionPage,
});

const subscriptionAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-analytics',
  component: SubscriptionAnalyticsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const assistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assistant',
  component: AssistantPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  portfoliosRoute,
  portfolioDetailRoute,
  salesRoute,
  marketingRoute,
  campaignDetailRoute,
  adGeneratorRoute,
  subscriptionRoute,
  subscriptionAnalyticsRoute,
  reportsRoute,
  assistantRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
