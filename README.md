# infotrack-test
Junior Developer Technical Test – Purchase Team

# Property Normalization Demo

## How to Run
### Backend
1. Navigate to `/server`
2. Run `dotnet run`
3. API available at http://localhost:5076
4. Swagger UI at http://localhost:5076/swagger

### Frontend
1. Navigate to `/client`
2. Run `npm install` - required only on the initial setup.
3. Run `npm run dev`
4. Open browser at http://localhost:5173

## Time Spent
Approx. 3 hours with overnight research on project setup and testing tasks.

## Assumptions
- Only one external payload at a time. It doesn't process multiple properties in bulk.
- Volume/Folio are numeric strings.
- Modal edits only update local state (no persistence). No database involved.

## Approach & Trade-offs
- Simple state management for the demo. No Redux Toolkit involved.
- Frontend bootstrapped with Vite instead of NextJS for faster development and simpler configuration.
- Validation done client-side; server trusts payload. (i.e., Input validation for volume and folio is handled in the frontend. The backend assumes the payload is valid, which simplifies server logic but would need additional validation in a production system.)
- Did not implement DB persistence.

## AI Assistance
- GitHub Copilot was used to generate TypeScript types and some function signatures, helping to speed up setup.
- SQL queries were generated with assistance from ChatGPT and manually reviewed for accuracy.
- Despite AI suggestions, all mapping functions, API calls, and UI behavior were reviewed and tested by hand to ensure correctness and meet the requirements.
