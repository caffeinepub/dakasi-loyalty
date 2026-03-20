# Dakasi Loyalty

## Current State
The app has a full loyalty stamp system with admin portal. Admins can view customers by their principal ID, add stamps, redeem vouchers, manage roles, and register pending users. Customer names are not currently displayed or stored by admins.

## Requested Changes (Diff)

### Add
- Backend: `setUserProfileByAdmin(user, profile)` — admin-only function to set a customer's name
- Frontend: Name input field in the Pending Registrations tab when registering a user
- Frontend: Display customer name (if set) above the principal ID in the Customers tab
- Frontend: Inline name edit button per customer card in the Customers tab

### Modify
- `registerUser` on backend: also save a name profile if provided
- Admin customer cards: show customer name prominently, principal as secondary label
- Search in Customers tab: also filter by name

### Remove
- Nothing removed

## Implementation Plan
1. Add `setUserProfileByAdmin` to backend Motoko
2. Add `useSetUserProfileByAdmin` hook in useQueries.ts
3. Update Pending tab: add name input, pass name on register
4. Update Customer cards: show name if available, add edit name inline
5. Update search to include name
