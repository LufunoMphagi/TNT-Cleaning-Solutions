# TNT Cleaning Solutions

Full-stack cleaning service website built with Vinext and Cloudflare Workers, D1 and R2.

Developed by [Mphagi Technologies](https://mphagitech.co.za/) · [Lufuno Mphagi on GitHub](https://github.com/lufunomphagi).

## Business details

- Email: cleaningsolutionstnt@gmail.com
- Calls and WhatsApp: 083 284 7316 / 073 760 7697
- Hours: 08:00–17:00, every day
- Service area: Gauteng

These are the default contact settings; authorised staff can update them in the portal.

## Working features

- Persistent booking, quotation and contact requests with server validation.
- Private bearer-link request tracking and customer quote acceptance/decline.
- Private image uploads (JPG/PNG/WebP, 5 MB per photo, 4 customer photos).
- Server-authorised staff dashboard; owner access configured by OWNER_EMAIL.
- Booking statuses, rescheduling, staff assignment and job completion reports.
- Customer request histories, service and price editing, service image uploads.
- Weekly, fortnightly and calendar-month follow-up booking creation.
- Quote totals and terms, printable customer request/quotation, CSV exports.
- Business contact, WhatsApp, coverage, hours and social link settings.
- Notification outbox with automatic delivery when configured; manual email drafts otherwise.
- Audit trail for staff changes.

## Launch configuration

1. Sign in as the site owner and open Staff portal in the footer.
2. Review the preconfigured TNT contact details and add privacy contact/retention details under Settings.
3. Add confirmed prices, or leave services quote-based.
4. Add staff members. Portal administrators can access all customer records. Private Sites also require platform visitor permission.
5. Configure RESEND_API_KEY and EMAIL_FROM (a verified sender) as hosting runtime secrets. OWNER_EMAIL is already set in hosting. Redeploy after changing runtime configuration.
6. Check the Notifications tab; retry pending messages when email delivery is configured.
7. The current private audience is preserved. The owner must explicitly request public access before customers outside the allowlist can visit.

No payment gateway or paid subscription charging is included. Recurring visits create separate pending bookings for management review. Automatic reminder scheduling is not configured.

## Development and verification

Use the Sites install/build/preview workflow. Apply pending Drizzle migrations to the local D1 database for browser tests. Hosted publication applies committed migrations automatically.

- `node tests/integration.mjs` runs isolated API integration tests using actual local D1 and R2 emulation; no hosted records or outbound emails are created.
- `npx tsc --noEmit` checks TypeScript.
- `node --check public/app.js` checks browser JavaScript.

Local development secrets belong in ignored `.dev.vars`. Never commit credentials. `.env.example` documents configuration names.

## GitHub

[Repository](https://github.com/LufunoMphagi/TNT-Cleaning-Solutions) · [Website](https://tnt-cleaning-solutions.groovynorth.chatgpt.site)

The repository includes a GitHub Actions workflow for JavaScript syntax, TypeScript, isolated integration tests and the production build. Hosting secrets and customer database/photo contents are excluded from Git. A source push alone does not publish a new Sites version.
