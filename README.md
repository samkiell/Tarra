# Tarra Waitlist & Referral Engine

Tarra is a centralized commerce platform for the Obafemi Awolowo University (OAU) community. This project implements the waitlist system designed to capture student intent, manage a ₦50,000 referral contest, and enforce identity verification through official campus email domains and Nigerian phone number validation.

## Lead Engineer
Developed by **SAMKIEL** — [samkiel.dev](https://samkiel.dev)

## Technical Stack & Architecture

- **Framework**: Next.js 16 (App Router) using TypeScript for type-safe server and client logic.
- **Database**: MongoDB with Mongoose for schema-based data modeling and validation.
- **Styling**: Tailwind CSS for a minimalist, neutral UI focused on high readability and performance.
- **Authentication**: Stateless session management using HTTP-only cookies to support shared-device workflows common in campus environments.
- **API**: Next.js Route Handlers for registration, session recovery, and administrative data aggregation.

## Referral Logic

1. **Capture**: The system monitors URL parameters for a `ref` key on the entry landing page.
2. **Persistence**: If found, the referral ID is stored in `localStorage` to survive session interruptions.
3. **Attribution**: During waitlist signup, the stored ID is sent in the payload. The server validates the existence of the referrer and saves the relationship in the `referred_by` field.
4. **Recognition**: Returning users are automatically recognized; the system re-issues a session cookie and prevents duplicate referral attribution for the same user.

## Fraud Mitigation

- **Email Restriction**: Only emails ending in `@student.oauife.edu.ng` are accepted.
- **Phone Uniqueness**: Nigerian format validation (11 digits, specific prefixes) is enforced with a database-level unique index.
- **Self-Referral Prevention**: Server-side checks strip referral IDs that match the registering user's own identity.
- **Idempotency**: "Welcome back" logic prevents spamming the signup endpoint to inflate referral counts.

## Administrative Auditing

- **Audit Dashboard (`/admin`)**: A protected view that aggregates all users sorted by total referral count.
- **Drill-Down Verification**: Clicking a referral count exposes a detailed list of referred users, including their phone numbers and exact registration timestamps to identify bot-like behavior or clusters.
- **Data Export**: A secure JSON/CSV export endpoint is provided for offline auditing and verification of contest winners.

## Deployment Instructions (Vercel)

1. **Push to GitHub/GitLab**: Ensure local environment files are excluded via `.gitignore`.
2. **Import Project**: Link the repository in the Vercel Dashboard.
3. **Configure Environment Variables**: Add `MONGODB_URI`, `NEXT_PUBLIC_BASE_URL`, `ADMIN_PIN`, and `ADMIN_EXPORT_TOKEN` in the Vercel dashboard.
4. **Build Settings**: Use the default Next.js build settings (`npm run build`).
5. **Deployment**: Trigger the deployment. The App Router handles the edge runtime aspects automatically.
