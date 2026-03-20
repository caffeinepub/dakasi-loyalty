# Dakasi Loyalty - Admin Portal Enhancement

## Current State
AdminPage.tsx has a basic admin view with pending registrations and customer list. Actions: add stamp, redeem voucher, role change.

## Requested Changes (Diff)

### Add
- Stats overview cards (total customers, stamps issued, active vouchers)
- Tabbed navigation: Overview | Customers | Pending
- Customer search/filter
- Customer name from profile when available

### Modify
- AdminPage: full portal layout with tabs, stats, search

### Remove
- Nothing

## Implementation Plan
1. Add tab navigation with Overview, Customers, Pending tabs
2. Overview tab: stat cards (customers, stamps, active vouchers, redeemed vouchers)
3. Customers tab: search input + enhanced customer cards with name
4. Pending tab: existing pending registration flow
5. Preserve all current actions
