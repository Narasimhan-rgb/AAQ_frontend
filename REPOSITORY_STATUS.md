# Repository status — 22 September 2026

## Role

React/Vite interface for the AAQ sorting platform: datasets, benchmark records, quantum analysis, reports, system status and uploaded JMH results.

## Reproduction

Copy `.env.example` to `.env.local`, run `npm ci`, then `npm run dev`. Start Java on 8080 and Python on 8000. `npm run build` creates the production bundle.

## Outstanding work

GitHub OAuth is optional and requires your own Supabase configuration. Email sign-in uses the Python API. Java API authorization is not implemented by the UI login. The Paper results page computes descriptive summaries from supplied CSV data; it does not generate controlled JMH runs or establish speedup.

Build or unit-test success is not evidence of a deployed service or a completed research evaluation. See the pull request for checks executed for this revision.

## Checks executed in this pass

Vite production build passed. Optional OAuth and real multi-service user flows still require configured services.
