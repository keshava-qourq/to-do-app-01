# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-773e55d5850a · draft · source: deployment:773e55d5850a

Version 773e55d5850a of the To Do app (a basic habit tracker web app) has deployment status 'live'. It is deployed as a separate frontend and backend.

- Deployment status: live
- Version: 773e55d5850a
- Frontend URL: https://pcb7ff60b1acf.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://100-22-65-241.sslip.io/apps/cb7ff60b1acf/
- Not stated in input (left undocumented): deployment date/time, who deployed or approved the release, environment name (e.g. production vs. staging), database/PostgreSQL deployment details, smoke-test or health-check results, rollback procedure.
- Requirement coverage: the input does not say which requirements (US-001 to US-011) are included in this release, so no requirement links are asserted.

**Related:** DEP-773e55d5850a-FE, DEP-773e55d5850a-BE

### DEP-773e55d5850a-FE · draft · source: deployment:773e55d5850a

This is the frontend endpoint for live version 773e55d5850a. End users access the web app here.

- URL: https://pcb7ff60b1acf.d3j61xaup4zgrx.amplifyapp.com
- Hosting: the hostname is on the amplifyapp.com domain. This is inferred from the URL only; no hosting configuration was provided.
- Version: 773e55d5850a
- Status: live

**Related:** DEP-773e55d5850a

### DEP-773e55d5850a-BE · draft · source: deployment:773e55d5850a

This is the backend endpoint for live version 773e55d5850a. It serves the API used by the frontend.

- URL: https://100-22-65-241.sslip.io/apps/cb7ff60b1acf/
- Served over HTTPS on an sslip.io hostname under the path /apps/cb7ff60b1acf/. This is inferred from the URL only; no server, runtime, or database configuration was provided.
- Version: 773e55d5850a
- Status: live
- Note: the app identifier 'cb7ff60b1acf' appears in both the frontend hostname and the backend path.

**Related:** DEP-773e55d5850a
<!-- sdlc:auto:end narrative -->
