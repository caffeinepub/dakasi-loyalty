# Dakasi Loyalty

## Current State
Any logged-in user goes to CustomerPage regardless of role. Admins can assign roles but only to users with loyalty data.

## Requested Changes (Diff)

### Add
- Backend: pendingUsers map, registerGuestVisit(), getPendingUsers()
- Frontend: PendingPage for guests waiting for admin approval
- AdminPage: Pending users section with Register button

### Modify
- App.tsx: Route guests to PendingPage, call registerGuestVisit on login
- AdminPage: Show pending users list

### Remove
- Nothing

## Implementation Plan
1. Add pendingUsers tracking to main.mo
2. Update backend.d.ts
3. Create PendingPage
4. Update App.tsx routing
5. Update AdminPage with pending section
6. Add new hooks to useQueries.ts
