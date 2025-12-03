# TODO: Fix TypeScript Type Incompatibility

## Tasks
- [x] Update VirtualOfficeView.tsx User interface to match Dashboard.tsx (add currentRoom and role, change status to 'online' | 'busy' | 'away')
- [x] Update VirtualOfficeView.tsx mockUsers to use 'online' instead of 'available'
- [x] Update VirtualOffice.tsx statusColor to handle 'online' as green
- [x] Simplify Dashboard.tsx Room interface to match VirtualOfficeView.tsx (remove usersInside, maxUsers, usersts, userRole)
- [x] Update Dashboard.tsx rooms array to remove extra fields
- [x] Update Dashboard.tsx handleUpdateRoom to update capacity instead of maxUsers
