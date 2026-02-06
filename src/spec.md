# Specification

## Summary
**Goal:** Add business reporting, sales data management, and a rule-based AI Business Assistant experience (insights, guided actions, and copyable message templates) across the app.

**Planned changes:**
- Add backend Candid methods to create/update/delete SalesItem entries for the authenticated caller’s BusinessWorkspace with authorization checks consistent with existing workspace update methods.
- Add a backend query endpoint that computes reporting metrics (annual revenue, total losses/expenses, net profit/loss) deterministically from workspace data and returns an empty-data indicator when applicable.
- Add a new frontend Reports page with navigation route that displays revenue and profit/loss summaries and includes UI to add/edit/delete the underlying data used for report calculations.
- Add an “AI Business Assistant” insights UI that detects common workspace issues via rule-based analysis, shows severity + explanations, and provides step-by-step checklists linking to relevant areas (Sales, Portfolios, Marketing, Subscription, Reports).
- Add in-app copy-to-clipboard message templates (sales follow-up, invoice reminder, win-back), with basic personalization using workspace businessName and selected context when available.
- Apply a cohesive visual theme to Dashboard, Reports, and Assistant UI (styling consistency without changing the tech stack).

**User-visible outcome:** Users can manage sales items, view computed business report summaries, and use a rule-based assistant to identify gaps, follow guided fix steps, and copy personalized outreach templates—all within a cohesive, consistent UI.
