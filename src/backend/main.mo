import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type SubscriptionPlan = {
    #freeTrial;
    #monthly;
    #yearly;
    #canceled;
  };

  module SubscriptionPlan {
    public func compare(plan1 : SubscriptionPlan, plan2 : SubscriptionPlan) : Order.Order {
      switch (plan1, plan2) {
        case (#freeTrial, #freeTrial) { #equal };
        case (#monthly, #monthly) { #equal };
        case (#yearly, #yearly) { #equal };
        case (#canceled, #canceled) { #equal };
        case (#freeTrial, _) { #less };
        case (_, #freeTrial) { #greater };
        case (#monthly, _) { #less };
        case (_, #monthly) { #greater };
        case (#yearly, _) { #less };
        case (_, #yearly) { #greater };
      };
    };
  };

  public type Subscription = {
    plan : SubscriptionPlan;
    startDate : Time.Time;
    endDate : ?Time.Time;
    canceledAt : ?Time.Time;
  };

  module Subscription {
    public func compare(sub1 : Subscription, sub2 : Subscription) : Order.Order {
      switch (SubscriptionPlan.compare(sub1.plan, sub2.plan)) {
        case (#equal) {
          if (sub1.startDate < sub2.startDate) { #less } else if (sub1.startDate > sub2.startDate) { #greater } else { #equal };
        };
        case (order) { order };
      };
    };
  };

  public type BusinessWorkspace = {
    owner : Principal;
    businessName : Text;
    salesData : ?SalesData;
    marketingData : ?MarketingData;
    portfolioData : ?PortfolioData;
    subscription : ?Subscription;
  };

  public type SalesData = {
    items : [SalesItem];
  };

  public type SalesItem = {
    id : Nat;
    name : Text;
    status : Text;
    amount : Float;
  };

  public type Advertisement = {
    adCopy : Text;
    productOrService : Text;
    audience : Text;
    tone : Text;
    channel : Text;
    createdAt : Time.Time;
  };

  public type MarketingData = {
    campaigns : [Campaign];
  };

  public type Campaign = {
    name : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    advertisements : [Advertisement];
  };

  public type PortfolioData = {
    portfolioTypes : [PortfolioType];
  };

  public type PortfolioType = {
    name : Text;
    description : Text;
    impactPortfolioData : ?ImpactPortfolioData;
  };

  public type ImpactPortfolioData = {
    socialImpactScore : Nat;
    environmentalImpactScore : Nat;
    impactDetails : Text;
  };

  public type BusinessReport = {
    annualRevenue : Float;
    gainsLosses : Float;
    profitLoss : Float;
  };

  module BusinessWorkspace {
    public func compareByBusinessName(workspace1 : BusinessWorkspace, workspace2 : BusinessWorkspace) : Order.Order {
      Text.compare(workspace1.businessName, workspace2.businessName);
    };
  };

  let workspaces = Map.empty<Principal, BusinessWorkspace>();
  var nextSalesItemId = 0;

  let anonymousWorkspace = {
    owner = Principal.fromText("2vxsx-fae");
    businessName = "Anonymous";
    salesData = null;
    marketingData = null;
    portfolioData = null;
    subscription = null;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func generateAiAdWorkspaces(
    anonymizedState : BusinessWorkspace,
    adCopy : Text,
    productOrService : Text,
    audience : Text,
    tone : Text,
    channel : Text,
  ) : async BusinessWorkspace {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate advertisements.");
    };

    if (anonymizedState.owner != Principal.fromText("2vxsx-fae") and anonymizedState.owner != caller) {
      Runtime.trap("Unauthorized: Can only generate ads for your own workspace.");
    };

    let newAd : Advertisement = {
      adCopy;
      productOrService;
      audience;
      tone;
      channel;
      createdAt = Time.now();
    };

    let updatedMarketingData = mergeAdsToMarketingData(anonymizedState.marketingData, newAd);

    {
      owner = Principal.fromText("2vxsx-fae");
      businessName = "Anonymous";
      salesData = anonymizedState.salesData;
      marketingData = ?updatedMarketingData;
      portfolioData = anonymizedState.portfolioData;
      subscription = anonymizedState.subscription;
    };
  };

  func mergeAdsToMarketingData(originalData : ?MarketingData, newAd : Advertisement) : MarketingData {
    switch (originalData) {
      case (null) {
        {
          campaigns = [
            {
              name = "Default Campaign";
              startDate = Time.now();
              endDate = Time.now() + 30_000_000_000;
              advertisements = [newAd];
            },
          ];
        };
      };
      case (?marketingData) {
        {
          campaigns = marketingData.campaigns.concat([
            {
              name = "Default Campaign";
              startDate = Time.now();
              endDate = Time.now() + 30_000_000_000;
              advertisements = [newAd];
            },
          ]);
        };
      };
    };
  };

  public shared ({ caller }) func updatePortfolioDataWorkspaces(anonymizedState : BusinessWorkspace, newPortfolioData : PortfolioData) : async BusinessWorkspace {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update portfolio data.");
    };

    if (anonymizedState.owner != Principal.fromText("2vxsx-fae") and anonymizedState.owner != caller) {
      Runtime.trap("Unauthorized: Can only update portfolio data for your own workspace");
    };

    {
      owner = Principal.fromText("2vxsx-fae");
      businessName = "Anonymous";
      salesData = anonymizedState.salesData;
      marketingData = anonymizedState.marketingData;
      portfolioData = ?newPortfolioData;
      subscription = anonymizedState.subscription;
    };
  };

  public query ({ caller }) func getBusinessWorkspace() : async BusinessWorkspace {
    switch (workspaces.get(caller)) {
      case (?workspace) { workspace };
      case (null) { anonymousWorkspace };
    };
  };

  public query ({ caller }) func getAllWorkspacesSortedByBusinessName() : async [BusinessWorkspace] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all workspaces");
    };
    workspaces.values().toArray().sort(BusinessWorkspace.compareByBusinessName);
  };

  public shared ({ caller }) func assignSubscriptionPlan(plan : SubscriptionPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can change their plan");
    };

    switch (workspaces.get(caller)) {
      case (?workspace) {
        let newSubscription : Subscription = {
          plan;
          startDate = Time.now();
          endDate = if (plan == #freeTrial) { ?(Time.now() + 7 * 24 * 60 * 1000000000) } else { null };
          canceledAt = null;
        };
        let updatedWorkspace = {
          owner = caller;
          businessName = workspace.businessName;
          salesData = workspace.salesData;
          marketingData = workspace.marketingData;
          portfolioData = workspace.portfolioData;
          subscription = ?newSubscription;
        };

        workspaces.add(caller, updatedWorkspace);
      };
      case (null) {
        Runtime.trap("No workspace found for principal");
      };
    };
  };

  public shared ({ caller }) func persistWorkspace(workspace : BusinessWorkspace) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can persist their workspace");
    };

    if (workspace.owner != caller) {
      Runtime.trap("Unauthorized: Can only persist your own workspace");
    };

    switch (workspaces.get(caller)) {
      case (?_) {
        Runtime.trap("Workspace already exists for principal: " # workspace.owner.toText());
      };
      case (null) {
        // Security: Prevent users from setting paid subscriptions during workspace creation
        // Only null or freeTrial subscriptions are allowed for new workspaces
        switch (workspace.subscription) {
          case (null) {
            // No subscription is fine
            workspaces.add(caller, workspace);
          };
          case (?subscription) {
            switch (subscription.plan) {
              case (#freeTrial) {
                // Free trial is allowed
                workspaces.add(caller, workspace);
              };
              case (#monthly or #yearly or #canceled) {
                Runtime.trap("Unauthorized: Cannot create workspace with paid or canceled subscription. Use assignSubscriptionPlan instead.");
              };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getSubscriptionAnalytics() : async SubscriptionAnalytics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access subscription analytics");
    };

    calculateSubscriptionAnalytics();
  };

  public type SubscriptionStatus = {
    #noSubscription;
    #activeTrial;
    #expiredTrial;
    #paid;
    #canceled;
  };

  type SubscriptionWorkspaceDetails = {
    businessName : Text;
    owner : Principal;
    plan : SubscriptionPlan;
    startDate : Time.Time;
    endDate : ?Time.Time;
    canceledAt : ?Time.Time;
    status : SubscriptionStatus;
  };

  public type SubscriptionAnalytics = {
    totalWorkspaces : Nat;
    freeTrialCount : Nat;
    expiringFreeTrialCount : Nat;
    expiredFreeTrialCount : Nat;
    monthlyCount : Nat;
    yearlyCount : Nat;
    canceledCount : Nat;
    emptySubscriptionsCount : Nat;
    monthlyPercent : Float;
    yearlyPercent : Float;
    workspacesExpiringFreeTrials : [SubscriptionWorkspaceDetails];
    subscriptionDetails : [SubscriptionWorkspaceDetails];
  };

  func calculateSubscriptionAnalytics() : SubscriptionAnalytics {
    var freeTrialCount = 0;
    var expiringFreeTrialCount = 0;
    var expiredFreeTrialCount = 0;
    var monthlyCount = 0;
    var yearlyCount = 0;
    var canceledCount = 0;
    var emptySubscriptionsCount = 0;
    let totalWorkspaces = workspaces.size();

    let currentTime = Time.now();
    let twoDaysInNanos : Int = 2 * 24 * 60 * 60 * 1000000000;

    let details = List.empty<SubscriptionWorkspaceDetails>();

    let workspacesExpiringFreeTrialsList = List.empty<SubscriptionWorkspaceDetails>();

    for ((_, workspace) in workspaces.entries()) {
      let detailsRecord = processWorkspaceForAnalytics(
        workspace,
        currentTime,
        twoDaysInNanos,
        freeTrialCount,
        expiringFreeTrialCount,
        expiredFreeTrialCount,
        monthlyCount,
        yearlyCount,
        canceledCount,
        emptySubscriptionsCount,
        workspacesExpiringFreeTrialsList,
      );
      details.add(detailsRecord);
    };

    let monthlyPercent = if (totalWorkspaces > 0) { monthlyCount.toFloat() / totalWorkspaces.toFloat() * 100.0 } else {
      0.0;
    };
    let yearlyPercent = if (totalWorkspaces > 0) { yearlyCount.toFloat() / totalWorkspaces.toFloat() * 100.0 } else {
      0.0;
    };

    {
      totalWorkspaces;
      freeTrialCount;
      expiringFreeTrialCount;
      expiredFreeTrialCount;
      monthlyCount;
      yearlyCount;
      canceledCount;
      emptySubscriptionsCount;
      monthlyPercent;
      yearlyPercent;
      workspacesExpiringFreeTrials = workspacesExpiringFreeTrialsList.toArray();
      subscriptionDetails = details.toArray();
    };
  };

  func processWorkspaceForAnalytics(
    workspace : BusinessWorkspace,
    currentTime : Time.Time,
    twoDaysInNanos : Int,
    freeTrialCount : Nat,
    expiringFreeTrialCount : Nat,
    expiredFreeTrialCount : Nat,
    monthlyCount : Nat,
    yearlyCount : Nat,
    canceledCount : Nat,
    emptySubscriptionsCount : Nat,
    workspacesExpiringFreeTrials : List.List<SubscriptionWorkspaceDetails>,
  ) : SubscriptionWorkspaceDetails {
    switch (workspace.subscription) {
      case (null) {
        createSubscriptionWorkspaceDetails(
          workspace,
          #freeTrial,
          0,
          null,
          null,
          #noSubscription,
        );
      };
      case (?subscription) {
        switch (subscription.plan) {
          case (#freeTrial) {
            let mutFreeTrialCount = freeTrialCount + 1;

            let status = switch (subscription.endDate) {
              case (?endDate) {
                if (endDate > currentTime) {
                  let timeRemaining = endDate - currentTime;

                  let status = if (timeRemaining <= twoDaysInNanos) {
                    let mutExpiringFreeTrialCount = expiringFreeTrialCount + 1;
                    #activeTrial;
                  } else { #activeTrial };

                  if (timeRemaining <= twoDaysInNanos) {
                    workspacesExpiringFreeTrials.add(
                      createSubscriptionWorkspaceDetails(
                        workspace,
                        subscription.plan,
                        subscription.startDate,
                        subscription.endDate,
                        subscription.canceledAt,
                        status,
                      ),
                    );
                  };

                  status;
                } else {
                  let mutExpiredFreeTrialCount = expiredFreeTrialCount + 1;
                  #expiredTrial;
                };
              };
              case (null) { #activeTrial };
            };

            createSubscriptionWorkspaceDetails(
              workspace,
              subscription.plan,
              subscription.startDate,
              subscription.endDate,
              subscription.canceledAt,
              status,
            );
          };
          case (#monthly) {
            let mutMonthlyCount = monthlyCount + 1;
            createSubscriptionWorkspaceDetails(
              workspace,
              subscription.plan,
              subscription.startDate,
              subscription.endDate,
              subscription.canceledAt,
              #paid,
            );
          };
          case (#yearly) {
            let mutYearlyCount = yearlyCount + 1;
            createSubscriptionWorkspaceDetails(
              workspace,
              subscription.plan,
              subscription.startDate,
              subscription.endDate,
              subscription.canceledAt,
              #paid,
            );
          };
          case (#canceled) {
            let mutCanceledCount = canceledCount + 1;
            createSubscriptionWorkspaceDetails(
              workspace,
              subscription.plan,
              subscription.startDate,
              subscription.endDate,
              subscription.canceledAt,
              #canceled,
            );
          };
        };
      };
    };
  };

  func createSubscriptionWorkspaceDetails(
    workspace : BusinessWorkspace,
    plan : SubscriptionPlan,
    startDate : Time.Time,
    endDate : ?Time.Time,
    canceledAt : ?Time.Time,
    status : SubscriptionStatus,
  ) : SubscriptionWorkspaceDetails {
    {
      businessName = workspace.businessName;
      owner = workspace.owner;
      plan;
      startDate;
      endDate;
      canceledAt;
      status;
    };
  };

  public query ({ caller }) func getSalesData() : async ?SalesData {
    switch (workspaces.get(caller)) {
      case (?workspace) { workspace.salesData };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateSalesItem(updatedItem : SalesItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update sales items");
    };

    switch (workspaces.get(caller)) {
      case (?workspace) {
        switch (workspace.salesData) {
          case (?salesData) {
            let updatedItems = salesData.items.map(
              func(item) {
                if (item.id == updatedItem.id) {
                  updatedItem;
                } else {
                  item;
                };
              }
            );

            let updatedSalesData : SalesData = {
              items = updatedItems;
            };

            let updatedWorkspace : BusinessWorkspace = {
              owner = workspace.owner;
              businessName = workspace.businessName;
              salesData = ?updatedSalesData;
              marketingData = workspace.marketingData;
              portfolioData = workspace.portfolioData;
              subscription = workspace.subscription;
            };

            workspaces.add(caller, updatedWorkspace);
          };
          case (null) {
            Runtime.trap("No sales data found for principal");
          };
        };
      };
      case (null) {
        Runtime.trap("No workspace found for principal");
      };
    };
  };

  public shared ({ caller }) func deleteSalesItem(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sales items");
    };

    switch (workspaces.get(caller)) {
      case (?workspace) {
        switch (workspace.salesData) {
          case (?salesData) {
            let filteredSalesItems = salesData.items.filter(
              func(item) {
                item.id != itemId;
              }
            );
            let updatedSalesData : SalesData = {
              items = filteredSalesItems;
            };

            let updatedWorkspace : BusinessWorkspace = {
              owner = workspace.owner;
              businessName = workspace.businessName;
              salesData = ?updatedSalesData;
              marketingData = workspace.marketingData;
              portfolioData = workspace.portfolioData;
              subscription = workspace.subscription;
            };

            workspaces.add(caller, updatedWorkspace);
          };
          case (null) {
            Runtime.trap("No sales data found for principal");
          };
        };
      };
      case (null) {
        Runtime.trap("No workspace found for principal");
      };
    };
  };

  public query ({ caller }) func getBusinessReport() : async ?BusinessReport {
    switch (workspaces.get(caller)) {
      case (?workspace) {
        switch (workspace.salesData) {
          case (?salesData) {
            let annualRevenue = salesData.items.foldLeft(
              0.0,
              func(acc, item) { acc + item.amount },
            );

            let report : BusinessReport = {
              annualRevenue;
              gainsLosses = 0.0;
              profitLoss = 0.0;
            };
            ?report;
          };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func addSalesItem(item : SalesItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add sales items");
    };

    switch (workspaces.get(caller)) {
      case (?workspace) {
        let newItem = { item with id = nextSalesItemId };
        nextSalesItemId += 1;

        let updatedSalesData : SalesData = {
          items = switch (workspace.salesData) {
            case (?existingData) { existingData.items.concat([newItem]) };
            case (null) { [newItem] };
          };
        };

        let updatedWorkspace : BusinessWorkspace = {
          owner = workspace.owner;
          businessName = workspace.businessName;
          salesData = ?updatedSalesData;
          marketingData = workspace.marketingData;
          portfolioData = workspace.portfolioData;
          subscription = workspace.subscription;
        };

        workspaces.add(caller, updatedWorkspace);
      };
      case (null) {
        Runtime.trap("No workspace found for principal");
      };
    };
  };
};
