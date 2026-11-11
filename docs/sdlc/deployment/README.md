# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-d43179e8fd4b · draft · source: deployment:d43179e8fd4b

Version d43179e8fd4b of the To Do app (a basic habit tracker web app) is recorded as live. The release has a frontend endpoint and a separate backend endpoint. Only status, version and URLs were provided.

What was deployed:
- Project: To Do app (basic habit tracker web app)
- Version: d43179e8fd4b
- Status: live
- Frontend URL: https://pcb7ff60b1acf.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://100-22-65-241.sslip.io/apps/cb7ff60b1acf/

Not stated in the input (left blank, not inferred):
- Deployment date/time
- Who deployed or approved the release
- Environment name (e.g. production vs. staging)
- Pre- or post-deployment test, smoke-test or health-check results
- Database (PostgreSQL) provisioning or migration details
- Rollback plan or previous version
- Which requirements (US-001 to US-011) are included. No requirement-to-release mapping was given, so no requirement ids are linked.

The entry status is 'draft' because no approval or sign-off was provided.

**Related:** DEP-d43179e8fd4b-FE, DEP-d43179e8fd4b-BE

### DEP-d43179e8fd4b-FE · draft · source: deployment:d43179e8fd4b

This is the frontend endpoint for release d43179e8fd4b. The hostname indicates hosting on AWS Amplify.

- URL: https://pcb7ff60b1acf.d3j61xaup4zgrx.amplifyapp.com
- Hosting: the amplifyapp.com domain indicates AWS Amplify. This is inferred from the URL only; the input does not state any hosting configuration.
- Release version: d43179e8fd4b
- Release status: live
- Not stated: custom domain, TLS/certificate details, build settings, environment variables.

**Related:** DEP-d43179e8fd4b

### DEP-d43179e8fd4b-BE · draft · source: deployment:d43179e8fd4b

This is the backend endpoint for release d43179e8fd4b. It is served over HTTPS from an sslip.io hostname under an app-specific path.

- URL: https://100-22-65-241.sslip.io/apps/cb7ff60b1acf/
- The sslip.io hostname maps to IP 100.22.65.241. This is derived from the hostname format only; the input states no infrastructure details.
- App path segment: /apps/cb7ff60b1acf/
- Release version: d43179e8fd4b
- Release status: live
- Per the project description, data is stored in PostgreSQL. The input gives no details of the deployed database instance, migrations or backups.
- Not stated: API health-check result, scaling, logging/monitoring setup, secrets management.

**Related:** DEP-d43179e8fd4b
<!-- sdlc:auto:end narrative -->
