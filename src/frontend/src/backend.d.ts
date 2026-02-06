import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PortfolioData {
    portfolioTypes: Array<PortfolioType>;
}
export type Time = bigint;
export interface ImpactPortfolioData {
    environmentalImpactScore: bigint;
    impactDetails: string;
    socialImpactScore: bigint;
}
export interface PortfolioType {
    name: string;
    description: string;
    impactPortfolioData?: ImpactPortfolioData;
}
export interface BusinessWorkspace {
    portfolioData?: PortfolioData;
    marketingData?: MarketingData;
    subscription?: Subscription;
    owner: Principal;
    businessName: string;
    salesData?: SalesData;
}
export interface SubscriptionAnalytics {
    emptySubscriptionsCount: bigint;
    monthlyCount: bigint;
    totalWorkspaces: bigint;
    monthlyPercent: number;
    workspacesExpiringFreeTrials: Array<SubscriptionWorkspaceDetails>;
    canceledCount: bigint;
    yearlyPercent: number;
    freeTrialCount: bigint;
    subscriptionDetails: Array<SubscriptionWorkspaceDetails>;
    expiredFreeTrialCount: bigint;
    expiringFreeTrialCount: bigint;
    yearlyCount: bigint;
}
export interface Advertisement {
    createdAt: Time;
    tone: string;
    audience: string;
    adCopy: string;
    productOrService: string;
    channel: string;
}
export interface SubscriptionWorkspaceDetails {
    status: SubscriptionStatus;
    endDate?: Time;
    owner: Principal;
    plan: SubscriptionPlan;
    businessName: string;
    canceledAt?: Time;
    startDate: Time;
}
export interface Subscription {
    endDate?: Time;
    plan: SubscriptionPlan;
    canceledAt?: Time;
    startDate: Time;
}
export interface SalesData {
    items: Array<SalesItem>;
}
export interface MarketingData {
    campaigns: Array<Campaign>;
}
export interface Campaign {
    endDate: Time;
    name: string;
    advertisements: Array<Advertisement>;
    startDate: Time;
}
export interface SalesItem {
    status: string;
    name: string;
    amount: number;
}
export enum SubscriptionPlan {
    canceled = "canceled",
    monthly = "monthly",
    yearly = "yearly",
    freeTrial = "freeTrial"
}
export enum SubscriptionStatus {
    canceled = "canceled",
    paid = "paid",
    activeTrial = "activeTrial",
    expiredTrial = "expiredTrial",
    noSubscription = "noSubscription"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignSubscriptionPlan(plan: SubscriptionPlan): Promise<void>;
    generateAiAdWorkspaces(anonymizedState: BusinessWorkspace, adCopy: string, productOrService: string, audience: string, tone: string, channel: string): Promise<BusinessWorkspace>;
    getAllWorkspacesSortedByBusinessName(): Promise<Array<BusinessWorkspace>>;
    getBusinessWorkspace(): Promise<BusinessWorkspace>;
    getCallerUserRole(): Promise<UserRole>;
    getSubscriptionAnalytics(): Promise<SubscriptionAnalytics>;
    isCallerAdmin(): Promise<boolean>;
    persistWorkspace(workspace: BusinessWorkspace): Promise<void>;
    updatePortfolioDataWorkspaces(anonymizedState: BusinessWorkspace, newPortfolioData: PortfolioData): Promise<BusinessWorkspace>;
}
