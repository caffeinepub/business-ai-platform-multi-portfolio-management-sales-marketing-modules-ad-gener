# Specification

## Summary
**Goal:** Expand the admin-only Subscription Analytics dashboard with richer aggregate metrics and a detailed, searchable per-workspace subscription breakdown.

**Planned changes:**
- Backend: add an admin-only query returning per-workspace subscription summaries (business name, owner principal, plan/none, start/end dates, canceled-at, and a derived status such as No subscription, Active trial, Expired trial, Paid, Canceled), with unauthorized access failing consistently with existing admin-only endpoints.
- Backend: extend subscription analytics aggregates to include monthly vs yearly paid subscription percentages of total workspaces, plus a count of free trials expiring soon (within the next 48 hours).
- Frontend: update the Subscription Analytics page to keep existing high-level cards and add a detailed table with status labels for each workspace.
- Frontend: add client-side data exploration controls (business name search, and quick filters for All, No subscription, Free trial active, Free trial expired, Monthly, Yearly, Canceled) including an explicit empty state when no results match.

**User-visible outcome:** Admin users can view additional subscription metrics and a per-workspace subscription table, then search and filter the results to quickly explore workspace subscription status and plan details.
