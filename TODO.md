# Withdrawal System Implementation TODO

## Backend Updates
- [x] Update POST /withdrawals route to accept method, note, amount in request body
- [x] Add validations: balance >= amount, min amount $100, no duplicate pending requests
- [x] Log IP address and User-Agent on withdrawal request

## Frontend User Interface
- [ ] Enhance website/src/pages/Withdrawal.jsx: add "Withdraw Earnings" button that opens modal
- [ ] Modal should include: amount input, method selection (USDT, Bank, PayPal, etc.), note field
- [ ] Update WithdrawalButton.jsx to trigger modal instead of navigation

## Admin Panel
- [ ] Update frontend/src/pages/Withdrawals.jsx to use correct API endpoint (/withdrawals)
- [ ] Handle Complete/Failed status updates properly
- [ ] Ensure admin can approve/reject/complete/fail withdrawals

## User Details Page and Communication Feature
- [x] Create UserDetail.jsx page with comprehensive user information display
- [x] Add communication section for sending messages to users
- [x] Implement backend API endpoint for sending messages (/users/:userId/message)
- [x] Update UserDetail.css with responsive styling for the page
- [x] Integrate with existing admin routing and sidebar navigation
- [x] Fix API endpoint paths to match backend routing (/users instead of /admin/users)

## Testing
- [ ] Test user withdrawal request flow with modal
- [ ] Test admin approval/rejection/completion
- [ ] Verify balance deduction on completion
- [x] Test User Details page functionality and message sending feature - FIXED API endpoints, page loads correctly
