# Primary-source notes for four practical Vietnamese articles

Verified: 2026-10-15. These are technical evidence notes, not finished articles. Reader demand is an editorial hypothesis based on plausible debugging tasks; no keyword volume, ranking difficulty, traffic forecast, or measured search demand has been established.

## 1. Next.js 16 metadata, rendering, and Google indexability

- Use static `metadata` for fixed values and `generateMetadata` for route/data-dependent values; both exports belong in Server Components. `metadataBase` resolves relative URL fields; `alternates.canonical` emits a canonical link. Prerenderable metadata is in initial HTML; dynamic metadata may stream after the UI. Next.js documents DOM-capable Googlebot support and blocking metadata for HTML-limited bots. Do not claim every metadata tag is always in the initial head or disable streaming by default. [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata)
- Google can render JavaScript; SSR/prerendering still helps crawlers and users. Initial `noindex` may prevent rendering, so removing it in client JavaScript is unreliable. Inspect rendered HTML, meaningful response codes, visible content, and one consistent canonical. [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- Prefer an absolute canonical URL in valid HTML head, consistent with sitemap/internal links; avoid changing it client-side. Canonicalization signals express a preference; Google selects the canonical. Metadata and SSR do not guarantee indexing or ranking. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

Editorial angle: diagnose an individual published route using source HTML, rendered DOM, status/robots/canonical, and Search Console URL Inspection. Treat streaming behavior and actual deployed output separately.

## 2. Firestore permission-denied queries, rules, indexes, and costs

- Rules assess a query's potential results, not just currently stored documents. A query that could return unauthorized data fails entirely; rules do not remove forbidden rows. Match query constraints to the rule, e.g. an author-only rule with `where('author', '==', uid)`. Individual document gets are evaluated against actual document properties. Server client libraries bypass Security Rules and use application credentials/IAM; backend code must implement user authorization. [Firebase secure queries](https://firebase.google.com/docs/firestore/security/rules-query)
- Indexes and authorization solve separate problems. Basic indexes are automatic; unsupported compound query shapes can produce missing-index errors with a creation link. A vector-index error can supply a CLI command. Creating an index cannot fix a rejected rule. [Firebase index management](https://firebase.google.com/docs/firestore/query-data/indexing)
- Standard Firestore billing includes document operations, applicable index-entry reads, storage including indexes, and bandwidth. Rule-dependent `get`/`exists`/`getAfter` document reads can add charges. Do not state that every query scans the collection, every query has index-read charges, or all denied requests are free. Consult the current edition/location and Query Explain; do not quote fixed prices. [Firebase billing](https://firebase.google.com/docs/firestore/pricing)

Editorial angle: reproduce an owner-only list query, align its constraints, test another user's access, and distinguish missing-index errors from permission errors. Scope billing statements to Standard/Core documentation rather than mixing Enterprise pricing.

## 3. Uploads on serverless: temporary bytes versus durable objects

- Lambda `/tmp` is temporary and unique to an execution environment; it is separate from in-memory processing. Neither a process buffer nor temporary working files should be the authoritative durable upload store (architectural inference). Do not claim `/tmp` is RAM or that temporary files necessarily disappear immediately after each invocation. [AWS Lambda ephemeral storage](https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html)
- An S3 presigned URL grants a specific operation/key for a limited period under the signer's permissions. It is a bearer capability, can be reused until expiration, and an upload to an existing key replaces that object. Temporary credentials can expire before the nominal URL lifetime. Use short lifetimes, authorized server-side issuance, and collision-resistant object keys; the last two are implementation recommendations inferred from these constraints. [AWS S3 presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- Vercel Blob documents direct client uploads and multipart support; multipart creation consists of initializing, uploading parts, and completing. A direct upload avoids routing the entire payload through the application function. Do not equate a storage URL with application authorization or a successful upload with content validation. [Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)

Editorial angle: server authenticates and authorizes an upload request, client sends bytes to object storage, application records the object reference after completion. Keep storage credentials server-side. The Vercel page's search extract was accessible, but full-page fetch timed out; recheck exact SDK signatures before publishing executable Vercel-specific code.

## 4. NEXT_PUBLIC variables and deployment mismatch

- Direct `process.env.NEXT_PUBLIC_NAME` references are replaced during `next build`; the shipped bundle keeps that build's value. Promoting one artifact from staging to production does not update it. Dynamic property lookups and aliases of `process.env` are not inlined. Server runtime reads require runtime execution, such as dynamic rendering. [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser)
- `server-only` marks secret-bearing modules and makes accidental Client Component imports a build error. The absence of a `NEXT_PUBLIC_` prefix does not protect a value deliberately returned as HTML, props, or an API response (inference from server/client data boundaries). Review the data leaving the server as well as variable names. [Next.js server/client components](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)
- A single image can use different server values when those values are read dynamically at runtime. This does not make bundled browser variables dynamic. [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting#environment-variables)

Editorial angle: trace a wrong frontend API origin to the build environment, set public values before rebuilding, redeploy, then inspect the shipped bundle/network request. Never propose adding `NEXT_PUBLIC_` to an API secret as a fix. Runtime client configuration must contain only intentionally public data.

## Local version cross-check

Read the installed Next.js guides at `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` and `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`. They confirm build-time public-variable inlining, streaming metadata, and Promise-based `params` in the current `generateMetadata` example. Keep executable examples aligned with these installed docs, particularly `await params` in Next.js 16.
