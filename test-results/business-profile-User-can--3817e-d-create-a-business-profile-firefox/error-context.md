# Page snapshot

```yaml
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- navigation:
  - button "previous" [disabled]:
    - img "previous"
  - text: 1/1
  - button "next" [disabled]:
    - img "next"
- img
- link "Next.js 15.3.3 (stale) Turbopack":
  - /url: https://nextjs.org/docs/messages/version-staleness
  - img
  - text: Next.js 15.3.3 (stale) Turbopack
- img
- dialog "Build Error":
  - text: Build Error
  - button "Copy Stack Trace":
    - img
  - button "No related documentation found" [disabled]:
    - img
  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
    - img
  - paragraph: Ecmascript file had an error
  - img
  - text: ./src/app/api/business-profiles/route.ts (10:23)
  - button "Open in editor":
    - img
  - text: "Ecmascript file had an error 8 | 9 | // GET /api/business-profiles - List all business profiles for a user > 10 | export async function GET(request: NextRequest) { | ^^^ 11 | return GET(request); 12 | } 13 | the name `GET` is defined multiple times"
- contentinfo:
  - paragraph: This error occurred during the build process and can only be dismissed by fixing the error.
```