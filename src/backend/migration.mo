import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {
  type SubscriptionPlan = {
    #freeTrial;
    #monthly;
    #yearly;
    #canceled;
  };

  type Subscription = {
    plan : SubscriptionPlan;
    startDate : Int;
    endDate : ?Int;
    canceledAt : ?Int;
  };

  type Advertisement = {
    adCopy : Text;
    productOrService : Text;
    audience : Text;
    tone : Text;
    channel : Text;
    createdAt : Int;
  };

  type Campaign = {
    name : Text;
    startDate : Int;
    endDate : Int;
    advertisements : [Advertisement];
  };

  type MarketingData = {
    campaigns : [Campaign];
  };

  type ImpactPortfolioData = {
    socialImpactScore : Nat;
    environmentalImpactScore : Nat;
    impactDetails : Text;
  };

  type PortfolioType = {
    name : Text;
    description : Text;
    impactPortfolioData : ?ImpactPortfolioData;
  };

  type PortfolioData = {
    portfolioTypes : [PortfolioType];
  };

  type SalesItemOld = {
    name : Text;
    status : Text;
    amount : Float;
  };

  type SalesDataOld = {
    items : [SalesItemOld];
  };

  type BusinessWorkspaceOld = {
    owner : Principal;
    businessName : Text;
    salesData : ?SalesDataOld;
    marketingData : ?MarketingData;
    portfolioData : ?PortfolioData;
    subscription : ?Subscription;
  };

  type OldActor = {
    workspaces : Map.Map<Principal, BusinessWorkspaceOld>;
  };

  type SalesItemNew = {
    id : Nat;
    name : Text;
    status : Text;
    amount : Float;
  };

  type SalesDataNew = {
    items : [SalesItemNew];
  };

  type BusinessWorkspaceNew = {
    owner : Principal;
    businessName : Text;
    salesData : ?SalesDataNew;
    marketingData : ?MarketingData;
    portfolioData : ?PortfolioData;
    subscription : ?Subscription;
  };

  type NewActor = {
    workspaces : Map.Map<Principal, BusinessWorkspaceNew>;
    nextSalesItemId : Nat;
  };

  func convertSalesData(oldSalesData : ?SalesDataOld) : ?SalesDataNew {
    switch (oldSalesData) {
      case (null) { null };
      case (?data) {
        ?{
          data with
          items = data.items.map(
            func(item) {
              {
                item with
                id = 0; // Temporary id for legacy items
              };
            }
          );
        };
      };
    };
  };

  func convertWorkspace(oldWorkspace : BusinessWorkspaceOld) : BusinessWorkspaceNew {
    {
      oldWorkspace with
      salesData = convertSalesData(oldWorkspace.salesData);
    };
  };

  public func run(old : OldActor) : NewActor {
    let updatedWorkspaces = old.workspaces.map<Principal, BusinessWorkspaceOld, BusinessWorkspaceNew>(
      func(_p, workspace) {
        convertWorkspace(workspace);
      }
    );
    {
      workspaces = updatedWorkspaces;
      nextSalesItemId = 0;
    };
  };
};
