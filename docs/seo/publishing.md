# Publish reviewed SEO content to Firestore

The publisher targets only the records prepared in this change: 6 blog posts in `my-blog-3bdd6/blogs` and 11 project records in `my-portfolio-d376d/projects`.

## Preview the payload

From the blog repository, run:

```powershell
node scripts/publish-seo-content.mjs
node scripts/publish-seo-content.mjs --root ../my-portfolio
```

The default is a dry run. It lists document IDs without modifying Firebase.

## Authenticate and publish

```powershell
node scripts/publish-seo-content.mjs --serve --port 3191
node scripts/publish-seo-content.mjs --root ../my-portfolio --serve --port 3192
```

Open the printed loopback URLs. Sign in using the existing email/password administrator for the selected Firebase project, then run the sync. The browser uses the official Firebase SDK. Authentication stays in memory; the local HTTP server never receives the password or an authentication token.

Each project is written as a transaction. Original records must still exist, and managed content fields must match the saved baseline or already match the proposed result. Concurrent changes cause the transaction to stop. Existing publication/creation dates and engagement metrics are preserved. New posts start with zero metrics. The publisher reads each written document back and checks the fields it changed.

Do not change Firestore rules or create a new account to bypass missing access. If authentication or permission is unavailable, publishing is pending until the owner signs in with an authorized existing account. The two projects may use different admin credentials.

The script reads public Firebase client configuration from the selected repository's ignored `.env`; credentials are never committed. Stop the local process after publishing.
