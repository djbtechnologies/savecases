# SaveCases recipient briefing system

The site is one reusable briefing framework. Recipient-specific content lives in
`lib/recipients.ts`; scenes, animations, and layout live in
`components/PrivateBriefing.tsx` and `app/globals.css`.

## Create a recipient

1. Duplicate the `raffandraff` record in `lib/recipients.ts`.
2. Assign a lowercase, URL-safe `slug`.
3. Enter the recipient name, optional title, firm name, and office location.
4. Add one meaningful, non-invasive `openingObservation`.
5. Add `secondaryObservation` or `afterHoursObservation` only when the research is verified and respectfully framed.
6. Keep the evergreen video URL unless a later test proves a custom video is worth producing.
7. Set the CTA label and destination.
8. Add a route that retrieves the record with `getRecipient(slug)` and renders `PrivateBriefing`.
9. Preview at 1440px desktop and 390px mobile widths, including reduced motion.
10. Publish with `noindex` metadata. Use an unguessable token or protected route if stronger privacy is required.

No animation code or visual sequence needs to change for a new recipient.

## Required and optional fields

Required: `slug`, `recipientName`, `firmName`, `videoUrl`, `ctaLabel`, and `ctaUrl`.

Strongly recommended: `officeLocation`, `letterDate`, `briefingNumber`, and one
`openingObservation`.

Optional: title, short firm name, logo, practice areas, office hours, a second
observation, verified after-hours call research, custom poster, and captions.
Every optional field has a layout-safe fallback.

## Twenty-asset conversion plan

The original frames remain archived in `assets/raff-raff`. The live site
uses six compressed derivatives in `public/briefing-assets`:

- Frame 1: desk and closed case atmosphere behind the live letter scene.
- Frame 2: opened presentation box for the concise case-opening transition.
- Frame 8: unrolled map as the evidence-board environment.
- Frame 9: retained as a reference/detail plate, not a required reading surface.
- Frame 13: dossier art-direction reference for future editorial spreads.
- Frame 18: briefing-card environment behind the integrated video reveal.

Frames 3–7, 10–12, 14–17, 19, and 20 are storyboard keyframes or redundant
states. They are intentionally not separate pages. Their useful motion is
recreated with live transitions, scroll progression, typography, and responsive
flows. For future firms, produce neutral background plates without embedded
recipient names and place all personalization in HTML.

## Analytics contract

The client emits `savecases:analytics` custom events and pushes the same payload
to `window.dataLayer` when one exists. Events include open, key section reach,
video start and 25/50/75/90 percent milestones, CTA view, CTA selection, return
visit, and broad device category. No personal names are placed in event payloads.

## Media

`public/video-private-briefing.mp4` is a 720p, fast-start derivative of the
existing evergreen master. The player loads metadata only until requested. A
poster and English caption track live in `public/briefing-assets`.
