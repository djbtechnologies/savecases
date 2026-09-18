# SaveCases public website

The public homepage is implemented in the existing Next.js project. The personalized `/raffandraff/` briefing, its media, and existing in-progress work are preserved. Forms use the explicit email handoff described below.

## Preview and publish

- `npm run dev -- --port 3000` serves the working preview at http://127.0.0.1:3000.
- `npm run build` creates the production static website in `out/`.
- To inspect that exact build: `python3 -m http.server 3001 --bind 127.0.0.1 --directory out`.
- GitHub Pages serves the repository root from `main`, with HTTPS and the `savecases.com` custom domain. Run `node scripts/export-homepage.mjs` after building to synchronize the homepage, its RSC payloads, metadata, and required assets into that publishing root. Review and commit those files with the homepage source, then push `main`.
- The export helper preserves existing recipient pages and historical assets. Their unpublished local work is independent of the public homepage release. A full-site release can instead synchronize all of `out/` after reviewing those routes.
- Preserve the existing `CNAME` (`savecases.com`) and `.nojekyll` when updating the publishing directory.

## One place for public configuration

Edit `lib/site-config.ts` for the contact address, site URL, founder details, media, demo number, trial duration, form endpoint, and the human-attention answer. The homepage uses locally hosted Instrument Serif and Inter; the font licenses are in `public/fonts/`.

## Launch items for the owner

1. **Direct form delivery, if desired.** No existing form receiver was found. The current form is an explicit email handoff to the existing project address, `dario@savecases.com`. It validates the fields, creates a draft, and lets the visitor open their email app or copy the message. It never claims that an email has been sent. To accept requests directly on the site, configure a supported backend endpoint (details below) and confirm that the mailbox/receiver is monitored. The email route remains usable without a backend.
2. **Approved founder video.** Provide a short public-facing video, an optional poster, and accurate WebVTT captions. Set `media.founderVideo`, `media.founderPoster`, and `media.founderCaptions`. The honest empty state is already designed. The existing private-briefing video is preserved on its original page; it was not reused because its claims and captions need review against the current offer.
3. **Synthetic sample call.** Provide approved audio and an accurate transcript; set `media.sampleCallAudio` and `media.sampleCallTranscript`. The present written example and summary are explicitly illustrative and use fictional information. Review or replace that written example when adding an actual recording so the content is consistent.
4. **Live demo number, optional.** Set both `demo.phoneE164` (e.g. the actual verified number in international format) and `demo.phoneDisplay`. Until then the demo request flow goes to Dario. No number is invented.
5. **Operational decisions.** Confirm how calls needing a person or urgent attention are handled, the caller-facing AI disclosure, call routing, booking arrangements, delivery of intake details, and the trial start date with each firm before real calls. No specific integrations or live-transfer ability are promised. Update `operations.humanAttention` after confirming the process. No ongoing price, case guarantee, policy text, or compliance certification has been invented.

## Direct-submission contract

Configure `inquiry.endpoint` or set `NEXT_PUBLIC_INQUIRY_ENDPOINT` **before building**. This is a public URL, never a secret. Static hosting cannot receive or securely forward these submissions itself.

The endpoint must support a JSON `POST` and CORS from the production origin. Payload fields are `intent` (`demo` or `trial`), `name`, `firm`, `email`, `phone`, and `coverage`. The last two can be empty. Validate and limit inputs on the server, handle spam/rate limits there, keep credentials server-side, and durably accept or deliver the request before returning an HTTP 2xx response with exactly `{"accepted":true}` (extra fields are allowed).

The form only shows receipt after that positive response. HTTP errors, malformed JSON, missing acceptance, network failures, and a 15-second timeout show an unconfirmed state with an email fallback. The visitor’s details remain in place for retry. No personal form data is persisted to browser storage or analytics.

## Verification

`scripts/verify-homepage.mjs` checks nine viewport widths, anchor targets, mobile navigation and Escape behavior, keyboard FAQ controls, demo/trial selection, required fields and email validation, draft contents and invalidation, no false submission success, metadata, the preserved briefing route, and axe accessibility. It saves screenshots and its report to `review/homepage/`. It uses this workstation’s bundled Playwright/Chrome and an axe script at `/private/tmp/savecases-axe.min.js`; change those paths if running elsewhere.

`scrubber/` is a separate Vite app with its own TypeScript config and is excluded from the main Next.js type check. No application code in that project was changed.
