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
5. To send from cleaningsolutionstnt@gmail.com, enable the Gmail API in a Google Cloud project and authorise that mailbox with the gmail.send scope. Configure GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN as hosting runtime secrets; GMAIL_FROM defaults to the TNT mailbox. Use a production OAuth configuration rather than a short-lived testing authorisation. Do not paste credentials into chat or commit them. Redeploy after configuration. Alternatively, use the existing Resend adapter with a verified sender. OWNER_EMAIL is already configured.
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

## Approved launch rules

- All services are quote-based.
- At least 24 hours before the start of the requested booking window.
- Daily availability, including public holidays, subject to TNT confirmation.
- Free cancellation/rescheduling with at least 24 hours’ notice; contact TNT for later changes. Any charge must be agreed before application.
- Travel charges and location restrictions must appear in the quotation before acceptance.

Initial administrator: Thabang, cleaningsolutionstnt@gmail.com. The private Site access policy must also allow this email before he can visit.

## Retention operations

Photos on closed cases are due for deletion after 90 days; completed, cancelled and declined request records and related notification copies after 365 days. Accepted quotations remain unresolved until staff close them. Staff must review the Privacy & retention tab regularly and explicitly run cleanup; no automatic background deletion is configured. Mark a case for a documented ongoing obligation to exclude it from routine cleanup. These operational defaults are not a legal compliance certification.

Gmail implementation references: https://developers.google.com/workspace/gmail/api/guides/sending and https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send .

## Gmail activation and delivery test

Configure the Gmail OAuth client and authorised mailbox using the send-only scope `https://www.googleapis.com/auth/gmail.send`. Configure the three GMAIL_* credentials as hosting secrets and redeploy. The Notifications tab includes an authorised test-email action, restricted to the TNT mailbox. The test reports provider acceptance; a human must verify Inbox/Spam receipt. While credentials are missing, no test message is sent.

Google Cloud setup must be performed by an account owner with access to the TNT mailbox. OAuth client secrets and refresh tokens must not be posted to chat or committed to GitHub. An OAuth app left in Testing can issue Gmail refresh tokens that expire after seven days; use a suitable production authorisation configuration for launch.
