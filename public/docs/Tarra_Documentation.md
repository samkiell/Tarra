Project Tarra
Waitlist & Referral Engine

Canonical Engineering Reference

Status: Final
Owner: Tarra
Candidate Engineer: Samkiel
Purpose: This document is the single source of truth for the Tarra Waitlist System.
All implementation decisions must align with this document.
If anything conflicts, this document wins.

1. Problem We Are Solving

Tarra is building the operating system for campus commerce, starting with OAU.

Before launch, we need a system that:

Captures real student intent

Enforces identity and uniqueness

Tracks referrals accurately

Prevents obvious fraud

Scales cleanly

Feels fast and trustworthy

This is not a marketing page.
This is infrastructure for growth.

2. Non-Negotiable Constraints

These are hard rules. Do not debate them in code.

Framework: Next.js

Server-Side Rendering is required for SEO

Database: MongoDB

Standalone microservice

Not connected to the main app API

Hosting: Vercel

Styling: Tailwind CSS

Target Users: OAU students only

Contest Context: ₦50,000 referral contest

Quality Bar: “Good enough” fails

3. System Architecture Overview

This system has four major surfaces:

Public Landing Page

Join / Check Status Flow

User Dashboard

Admin Dashboard (Fraud Review)

Each surface is simple on purpose.
Complexity lives in logic, not UI.

4. Database Design
Collection: waitlist_users

Every user must map to exactly one document.

Fields

id (String)

System-generated unique identifier

full_name (String)

email (String)

Must end with @student.oauife.edu.ng

One email = one user

phone_number (String)

Nigerian format only

Exactly 11 digits

Must start with: 080, 081, 090, or 070

One phone number = one user

interests (Array of Strings)

Allowed values only:

Buyer

Seller

Service Provider

referred_by (String | null)

Stores referral code from ?ref=CODE

created_at (Timestamp)

Uniqueness Rules

Email must be unique

Phone number must be unique

A user cannot refer themselves

If any of these break, the system is wrong.

5. Referral System (Core Engine)
Referral Capture

The site must accept URLs like:

https://tarra.ng?ref=SAMKIEL


The ref value must be stored immediately in:

Session cookie or local storage

Referral Attribution

When a user completes signup:

Read the stored ref

Save it to referred_by

If the referral code belongs to the same user:

Ignore it silently

No alerts. No errors. No drama.

6. Join Flow (Smart Recognition)
Trigger

User clicks Join

Case 1: New User

Validate email domain

Validate phone number

Save user to database

Create session cookie

Redirect to dashboard

Case 2: Existing User

Do not throw an error

Show a friendly success message:

“Welcome back! Taking you to your dashboard…”

Recreate session cookie

Redirect to dashboard

Duplicates are handled quietly.
Friction is the enemy.

7. Check Status Flow (Recovery Path)
UI Requirement

A small link under the Join button:

Already joined? Check Status.

Logic

User enters phone number

System checks database

If Found

Create session cookie

Redirect to dashboard

If Not Found

Do not show a red error

Show a gentle message:

“Looks like you’re new. Let’s get you on the list.”

Redirect back to Join

This flow exists because students change phones and clear cache.

8. User Dashboard
Route
/status/[USER_ID]


Protected route.
No session, no access.

Dashboard Content

Greeting

Hello {First Name}


Include a “Verified Student” badge.

Referral Count

You have referred X people.


Referral Link

Display unique referral URL

Include copy-to-clipboard button

Leaderboard

Top 10 recruiters

First name + referral count

Logout Button (Mandatory)

Deletes session cookie

Redirects to home page

Shared phones are common.
Logout is not optional.

9. Public Landing Page Requirements
SEO (Mandatory)

Title:

Tarra | The Official OAU Marketplace


Meta Description:

Buy, Sell, and Connect. The safest way to trade products, discover campus brands, and book services in OAU. Join the waitlist.


Open Graph tags for WhatsApp and Twitter

Hero Section

Headline:

Everything You Need. All in One Place.


Sub-headline:

Buy and sell products, discover campus brands, and book essential services.


Primary CTA:

Join with School Email (Google Auth)

Secondary CTA:

Manual email + phone input

Core Pillars

Three cards:

Marketplace

Brands

Services

No clutter. No gimmicks.

10. Security & Anti-Abuse
IP Rate Limiting

Limit join requests to:

5 per hour per IP

This blocks bots but allows shared Wi-Fi.

Self-Referral Prevention

If a user clicks their own referral link:

Ignore the referral code

No errors. No warnings.

11. Admin Dashboard (Fraud Detection)
Route
/admin


Protected by a simple hard-coded PIN.

Views
Master List

All users

Sorted by referral count (descending)

Drill-Down View

Clicking a referral count opens:

List of referred users

First name

Phone number

Date referred

This is for manual audits.
No automation. No guesswork.

12. Engineering Philosophy

Speed matters

Correctness matters more

Silent success beats loud failure

Clean code is part of the product

Edge cases are not edge cases at this scale

If something feels clever, it is probably wrong.

13. Final Rule

If Gemini, a human, or future you is unsure what to do:

Read this file again.

This document is the contract.