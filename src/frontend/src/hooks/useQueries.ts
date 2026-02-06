import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BusinessWorkspace, PortfolioData, SubscriptionPlan, SubscriptionAnalytics, SalesItem, BusinessReport } from '../backend';

export function useGetBusinessWorkspace() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<BusinessWorkspace>({
    queryKey: ['businessWorkspace'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBusinessWorkspace();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetCallerUserProfile() {
  const { data: workspace, isLoading, isFetched } = useGetBusinessWorkspace();
  
  return {
    data: workspace && workspace.businessName !== 'Anonymous' ? { name: workspace.businessName } : null,
    isLoading,
    isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      const workspace: BusinessWorkspace = {
        owner: (await actor.getBusinessWorkspace()).owner,
        businessName: profile.name,
        salesData: undefined,
        marketingData: undefined,
        portfolioData: undefined,
        subscription: undefined,
      };
      
      await actor.persistWorkspace(workspace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
    },
  });
}

export function useUpdateWorkspace() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspace: BusinessWorkspace) => {
      if (!actor) throw new Error('Actor not available');
      
      // For updates, we need to use the specialized update methods
      // This is a wrapper that will be called by specific update hooks
      return workspace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
    },
  });
}

export function useUpdatePortfolioData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolioData: PortfolioData) => {
      if (!actor) throw new Error('Actor not available');
      
      const currentWorkspace = await actor.getBusinessWorkspace();
      const anonymizedWorkspace: BusinessWorkspace = {
        owner: currentWorkspace.owner,
        businessName: 'Anonymous',
        salesData: currentWorkspace.salesData,
        marketingData: currentWorkspace.marketingData,
        portfolioData: currentWorkspace.portfolioData,
        subscription: currentWorkspace.subscription,
      };
      
      await actor.updatePortfolioDataWorkspaces(anonymizedWorkspace, portfolioData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
    },
  });
}

export function useGenerateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      adCopy: string;
      productOrService: string;
      audience: string;
      tone: string;
      channel: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      const currentWorkspace = await actor.getBusinessWorkspace();
      const anonymizedWorkspace: BusinessWorkspace = {
        owner: currentWorkspace.owner,
        businessName: 'Anonymous',
        salesData: currentWorkspace.salesData,
        marketingData: currentWorkspace.marketingData,
        portfolioData: currentWorkspace.portfolioData,
        subscription: currentWorkspace.subscription,
      };
      
      return actor.generateAiAdWorkspaces(
        anonymizedWorkspace,
        params.adCopy,
        params.productOrService,
        params.audience,
        params.tone,
        params.channel
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
    },
  });
}

export function useAssignSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignSubscriptionPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
    },
  });
}

export function useGetSubscriptionAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SubscriptionAnalytics>({
    queryKey: ['subscriptionAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSubscriptionAnalytics();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetBusinessReport() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<BusinessReport | null>({
    queryKey: ['businessReport'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBusinessReport();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useAddSalesItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<SalesItem, 'id'>) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addSalesItem({ ...item, id: 0n } as SalesItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
      queryClient.invalidateQueries({ queryKey: ['businessReport'] });
    },
  });
}

export function useUpdateSalesItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: SalesItem) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateSalesItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
      queryClient.invalidateQueries({ queryKey: ['businessReport'] });
    },
  });
}

export function useDeleteSalesItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteSalesItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessWorkspace'] });
      queryClient.invalidateQueries({ queryKey: ['businessReport'] });
    },
  });
}
